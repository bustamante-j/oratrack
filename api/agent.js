import OpenAI from 'openai'

const model = process.env.OPENAI_MODEL || 'gpt-5.4-mini'

const tools = [
  {
    type: 'function',
    name: 'get_school_summary',
    description: 'Get school-wide counts, attendance, risk, and performance summary.',
    parameters: { type: 'object', properties: {}, required: [], additionalProperties: false },
  },
  {
    type: 'function',
    name: 'search_students',
    description: 'Search learner records by name, grade level, section, or risk level.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Name or ID fragment. Use an empty string when not needed.' },
        grade_level: { type: 'string', description: 'Exact grade such as Grade 4, or empty string.' },
        section: { type: 'string', description: 'Exact section, or empty string.' },
        risk_level: { type: 'string', enum: ['', 'Low', 'Moderate', 'High'] },
        limit: { type: 'number', minimum: 1, maximum: 20 },
      },
      required: ['query', 'grade_level', 'section', 'risk_level', 'limit'],
      additionalProperties: false,
    },
  },
  {
    type: 'function',
    name: 'get_student_profile',
    description: 'Get one learner profile including grades, attendance, risk, and behavior notes.',
    parameters: {
      type: 'object',
      properties: { student_id_or_name: { type: 'string' } },
      required: ['student_id_or_name'],
      additionalProperties: false,
    },
  },
  {
    type: 'function',
    name: 'list_school_calendar',
    description: 'List school events and announcements, optionally filtered.',
    parameters: {
      type: 'object',
      properties: {
        kind: { type: 'string', enum: ['events', 'announcements', 'both'] },
        filter: { type: 'string', description: 'Month, category, or search phrase. Empty means all.' },
      },
      required: ['kind', 'filter'],
      additionalProperties: false,
    },
  },
  {
    type: 'function',
    name: 'propose_action',
    description: 'Propose a website data change. The teacher will review and explicitly apply it in the browser.',
    parameters: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['create_announcement', 'create_event', 'update_grade', 'mark_attendance', 'add_behavior_note', 'update_student_status'],
        },
        target_id: { type: 'string', description: 'Student ID/name for student actions, otherwise empty.' },
        payload_json: { type: 'string', description: 'A valid JSON object with fields needed by the action.' },
        summary: { type: 'string', description: 'Short plain English description of the proposed change.' },
        requires_confirmation: { type: 'boolean' },
      },
      required: ['type', 'target_id', 'payload_json', 'summary', 'requires_confirmation'],
      additionalProperties: false,
    },
  },
]

function averageGrade(grades = {}) {
  const values = Object.values(grades).map(Number).filter(Number.isFinite)
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0
}

function riskOf(student) {
  const average = averageGrade(student.grades)
  const absent = Number(student.attendanceSummary?.absent || 0)
  const note = String(student.behaviorNotes || '').toLowerCase()
  if (average < 75 || absent >= 7 || /serious|bullying|aggressive|repeated conflict/.test(note)) return 'High'
  if (average <= 79 || absent >= 4 || /distracted|quiet|late work|needs reminders|talkative|participation/.test(note)) return 'Moderate'
  return 'Low'
}

function executeReadTool(name, args, data) {
  const students = data.students || []
  if (name === 'get_school_summary') {
    const risk = students.reduce((result, student) => {
      const level = riskOf(student)
      result[level] = (result[level] || 0) + 1
      return result
    }, {})
    const subjects = {}
    students.forEach((student) => Object.entries(student.grades || {}).forEach(([subject, grade]) => {
      subjects[subject] ||= []
      subjects[subject].push(Number(grade))
    }))
    const subjectAverages = Object.fromEntries(Object.entries(subjects).map(([subject, values]) => [
      subject,
      Math.round(values.reduce((sum, value) => sum + value, 0) / values.length * 10) / 10,
    ]))
    return {
      students: students.length,
      teachers: data.teachers?.length || 0,
      risk,
      subjectAverages,
      events: data.events?.length || 0,
      announcements: data.announcements?.length || 0,
    }
  }
  if (name === 'search_students') {
    const query = args.query.toLowerCase()
    return students.filter((student) =>
      (!query || `${student.name} ${student.studentId}`.toLowerCase().includes(query))
      && (!args.grade_level || student.gradeLevel === args.grade_level)
      && (!args.section || student.section === args.section)
      && (!args.risk_level || riskOf(student) === args.risk_level),
    ).slice(0, args.limit).map((student) => ({
      studentId: student.studentId,
      name: student.name,
      gradeLevel: student.gradeLevel,
      section: student.section,
      average: Math.round(averageGrade(student.grades) * 10) / 10,
      absences: student.attendanceSummary?.absent || 0,
      riskLevel: riskOf(student),
    }))
  }
  if (name === 'get_student_profile') {
    const query = args.student_id_or_name.toLowerCase()
    const student = students.find((item) => item.studentId.toLowerCase() === query || item.name.toLowerCase().includes(query))
    return student ? { ...student, average: Math.round(averageGrade(student.grades) * 10) / 10, riskLevel: riskOf(student) } : { error: 'Student not found' }
  }
  if (name === 'list_school_calendar') {
    const filter = args.filter.toLowerCase()
    const matches = (item) => !filter || JSON.stringify(item).toLowerCase().includes(filter)
    return {
      events: args.kind !== 'announcements' ? (data.events || []).filter(matches).slice(0, 20) : [],
      announcements: args.kind !== 'events' ? (data.announcements || []).filter(matches).slice(0, 20) : [],
    }
  }
  return { error: `Unsupported tool ${name}` }
}

const instructions = `You are ORA, the AI operations agent inside ORATRACK for Balili Elementary School.
You work only with supplied demo data. Use tools before making claims about records.
Be concise, warm, and specific. Explain evidence using names and numbers.
You may propose changes through propose_action. Never claim a change happened until the user applies it.
For update_grade payload_json use {"subject":"Mathematics","grade":85}.
For mark_attendance use {"date":"YYYY-MM-DD","status":"Present|Absent|Late|Excused"}.
For add_behavior_note use {"note":"..."}.
For update_student_status use {"status":"Active|Inactive"}.
For create_announcement use {"title":"...","category":"School Update|Academic|Student Activity|Community","date":"YYYY-MM-DD","audience":"...","content":"...","pinned":false}.
For create_event use {"title":"...","date":"YYYY-MM-DD","time":"...","type":"Academic|Meeting|Student Activity|Community|Wellness","location":"...","description":"..."}.
When details needed for an action are missing, ask one short follow-up question instead of inventing them.
Do not make medical, psychological, or legal diagnoses.`

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' })
  if (!process.env.OPENAI_API_KEY) return response.status(503).json({ error: 'OPENAI_API_KEY is not configured', mode: 'local' })

  try {
    const { message, data, history = [], user } = request.body || {}
    if (!message || !data) return response.status(400).json({ error: 'Message and data are required' })
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const actions = []
    let result = await client.responses.create({
      model,
      instructions: `${instructions}\nCurrent user: ${user?.name || 'Teacher'} (${user?.role || 'Teacher'}).`,
      input: [
        ...history.slice(-8).map((item) => ({ role: item.role === 'assistant' ? 'assistant' : 'user', content: item.text })),
        { role: 'user', content: message },
      ],
      tools,
      reasoning: { effort: 'low' },
      text: { verbosity: 'low' },
    })

    for (let turn = 0; turn < 5; turn += 1) {
      const calls = result.output.filter((item) => item.type === 'function_call')
      if (!calls.length) break
      const outputs = calls.map((call) => {
        const args = JSON.parse(call.arguments || '{}')
        if (call.name === 'propose_action') {
          let payload = {}
          try { payload = JSON.parse(args.payload_json) } catch { payload = {} }
          actions.push({ id: `action-${Date.now()}-${actions.length}`, ...args, payload, status: 'pending' })
          return { type: 'function_call_output', call_id: call.call_id, output: JSON.stringify({ accepted_for_teacher_review: true }) }
        }
        return { type: 'function_call_output', call_id: call.call_id, output: JSON.stringify(executeReadTool(call.name, args, data)) }
      })
      result = await client.responses.create({
        model,
        previous_response_id: result.id,
        input: outputs,
        tools,
        reasoning: { effort: 'low' },
        text: { verbosity: 'low' },
      })
    }

    return response.status(200).json({
      message: result.output_text || 'I reviewed the records. What would you like me to do next?',
      actions,
      mode: 'openai',
      model,
    })
  } catch (error) {
    console.error('ORATRACK agent error', error)
    return response.status(500).json({ error: 'The AI service could not complete this request.', mode: 'local' })
  }
}
