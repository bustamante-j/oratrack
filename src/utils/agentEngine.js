import { averageGrade, getRisk, subjectNames } from './risk.js'

const normalize = (value) => String(value || '').trim().toLowerCase()
const titleCase = (value) => value.replace(/\b\w/g, (letter) => letter.toUpperCase())
const actionId = () => `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

function findStudent(students, text) {
  const normalized = normalize(text)
  return students.find((student) =>
    normalized.includes(student.name.toLowerCase())
    || normalized.includes(student.studentId.toLowerCase())
    || student.name.toLowerCase().split(' ').filter((part) => part.length > 3).some((part) => normalized.includes(part)),
  )
}

function schoolSummary(data) {
  const riskCounts = data.students.reduce((result, student) => {
    const level = getRisk(student).level
    result[level] = (result[level] || 0) + 1
    return result
  }, { Low: 0, Moderate: 0, High: 0 })
  const support = data.students.filter((student) => averageGrade(student.grades) < 80).length
  return { riskCounts, support }
}

function subjectAverages(students) {
  return subjectNames.map((subject) => ({
    subject,
    average: Math.round(students.reduce((sum, student) => sum + Number(student.grades?.[subject] || 0), 0) / students.length * 10) / 10,
  })).sort((a, b) => a.average - b.average)
}

function buildAction(type, targetId, payload, summary, destructive = false) {
  return { id: actionId(), type, target_id: targetId || '', payload, summary, requires_confirmation: true, destructive, status: 'pending' }
}

export function runLocalAgent(message, data) {
  const text = normalize(message)
  const student = findStudent(data.students, text)
  const { riskCounts, support } = schoolSummary(data)
  const actions = []

  const gradeMatch = message.match(/(?:change|set|update)\s+(.+?)['’]?(?:s)?\s+(English|Mathematics|Math|Science|Filipino|AP|MAPEH|ESP|EPP\/TLE)\s+(?:grade\s+)?(?:to\s+)?(\d{2,3})/i)
  if (gradeMatch) {
    const matchedStudent = findStudent(data.students, gradeMatch[1]) || student
    const rawSubject = gradeMatch[2]
    const subject = rawSubject.toLowerCase() === 'math' ? 'Mathematics' : subjectNames.find((item) => item.toLowerCase() === rawSubject.toLowerCase()) || rawSubject
    const grade = Math.max(60, Math.min(100, Number(gradeMatch[3])))
    if (!matchedStudent) return { message: 'I could not identify the learner. Include the student’s full name or ID.', actions, mode: 'local' }
    actions.push(buildAction('update_grade', matchedStudent.studentId, { subject, grade }, `Change ${matchedStudent.name}'s ${subject} grade to ${grade}.`))
    return { message: `I prepared a grade update for ${matchedStudent.name}. Review the action below before applying it.`, actions, mode: 'local' }
  }

  const attendanceStatus = ['present', 'absent', 'late', 'excused'].find((status) => text.includes(status))
  if (student && attendanceStatus && /(mark|set|record|attendance)/.test(text)) {
    const dateMatch = message.match(/\d{4}-\d{2}-\d{2}/)
    const date = dateMatch?.[0] || new Date().toISOString().slice(0, 10)
    const status = titleCase(attendanceStatus)
    actions.push(buildAction('mark_attendance', student.studentId, { date, status }, `Mark ${student.name} as ${status} on ${date}.`))
    return { message: `I prepared the ${status.toLowerCase()} attendance entry for ${student.name}.`, actions, mode: 'local' }
  }

  const noteMatch = message.match(/(?:add|write|record)\s+(?:a\s+)?behavior note (?:for|to)\s+(.+?)(?::| saying| that)\s*(.+)/i)
  if (noteMatch) {
    const matchedStudent = findStudent(data.students, noteMatch[1]) || student
    if (!matchedStudent) return { message: 'I could not identify the learner for that behavior note.', actions, mode: 'local' }
    actions.push(buildAction('add_behavior_note', matchedStudent.studentId, { note: noteMatch[2].trim() }, `Add a behavior note to ${matchedStudent.name}.`))
    return { message: `I drafted the behavior-note update for ${matchedStudent.name}.`, actions, mode: 'local' }
  }

  if (/(create|add|post).*(announcement|notice)/.test(text)) {
    const title = message.match(/(?:titled|called|title[:\s]+)["']?([^"']+?)["']?(?:,| for| on|$)/i)?.[1]?.trim()
    if (!title) return { message: 'What title should I use for the announcement? You can also include its date, audience, and message.', actions, mode: 'local' }
    const date = message.match(/\d{4}-\d{2}-\d{2}/)?.[0] || new Date().toISOString().slice(0, 10)
    actions.push(buildAction('create_announcement', '', {
      title,
      category: text.includes('academic') ? 'Academic' : text.includes('community') ? 'Community' : 'School Update',
      date,
      audience: 'School community',
      content: `Please be guided by the school announcement: ${title}. Additional details will be shared by class advisers.`,
      pinned: false,
    }, `Create the announcement “${title}”.`))
    return { message: 'I prepared a complete announcement draft. You can apply it now, then edit it from the Announcements module if needed.', actions, mode: 'local' }
  }

  if (/(create|add|schedule).*(event|calendar)/.test(text)) {
    const title = message.match(/(?:titled|called|title[:\s]+)["']?([^"']+?)["']?(?:,| on| at|$)/i)?.[1]?.trim()
    const date = message.match(/\d{4}-\d{2}-\d{2}/)?.[0]
    if (!title || !date) return { message: 'Include an event title and date in YYYY-MM-DD format. Example: “Create an event titled Reading Day on 2026-08-18.”', actions, mode: 'local' }
    actions.push(buildAction('create_event', '', {
      title, date, time: '8:00 AM', type: 'Student Activity', location: 'School Grounds',
      description: `${title} for the Balili Elementary School community.`,
    }, `Add “${title}” to the school calendar on ${date}.`))
    return { message: 'I prepared the event with sensible demo defaults. Review and apply it below.', actions, mode: 'local' }
  }

  if (student && /(guardian|parent).*(message|note|text)|draft.*(guardian|parent)/.test(text)) {
    const risk = getRisk(student)
    return {
      message: `Draft for ${student.name}'s guardian:\n\nGood day. We would like to share a brief update about ${student.name}. The current records show an average grade of ${averageGrade(student.grades)} and ${student.attendanceSummary.absent} absences. ${risk.level !== 'Low' ? `We would appreciate a short conversation so we can agree on helpful next steps. Suggested focus: ${risk.action}` : 'The learner is currently progressing within a healthy range. Thank you for your continued support at home.'}\n\nPlease contact the class adviser if you have questions.`,
      actions, mode: 'local',
    }
  }

  if (student) {
    const risk = getRisk(student)
    const lowest = Object.entries(student.grades).sort((a, b) => a[1] - b[1])[0]
    return {
      message: `${student.name} is in ${student.gradeLevel} ${student.section}. The current average is ${averageGrade(student.grades)}, with ${student.attendanceSummary.absent} absences and a ${risk.level.toLowerCase()} risk flag. The lowest subject is ${lowest[0]} at ${lowest[1]}. ${risk.reasons.join(' ')} Suggested next step: ${risk.action}`,
      actions, mode: 'local',
    }
  }

  if (/high.?risk|at.?risk|flagged/.test(text)) {
    const high = data.students.filter((item) => getRisk(item).level === 'High')
    return { message: `${high.length} learners are currently high risk: ${high.slice(0, 8).map((item) => `${item.name} (${getRisk(item).reasons[0]})`).join('; ')}. Open Student Flagging for the full intervention view.`, actions, mode: 'local' }
  }
  if (/lowest.*subject|subject.*lowest|weakest subject/.test(text)) {
    const [lowest] = subjectAverages(data.students)
    return { message: `${lowest.subject} has the lowest current school average at ${lowest.average}. A focused small-group review and competency check would be the best next step.`, actions, mode: 'local' }
  }
  if (/attendance/.test(text)) {
    const byGrade = Array.from({ length: 6 }, (_, index) => {
      const grade = `Grade ${index + 1}`
      const learners = data.students.filter((item) => item.gradeLevel === grade)
      return { grade, absences: learners.reduce((sum, item) => sum + item.attendanceSummary.absent, 0) }
    }).sort((a, b) => b.absences - a.absences)
    return { message: `${byGrade[0].grade} needs the most attendance attention with ${byGrade[0].absences} recorded absences across its learners. Start with individual students who have seven or more absences.`, actions, mode: 'local' }
  }
  if (/event|calendar|upcoming/.test(text)) {
    const upcoming = [...data.events].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5)
    return { message: `Upcoming school events: ${upcoming.map((item) => `${item.title} on ${item.date} at ${item.time}`).join('; ')}.`, actions, mode: 'local' }
  }
  if (/summary|overview|school performance|how is the school/.test(text)) {
    const [lowest] = subjectAverages(data.students)
    return { message: `ORATRACK currently tracks ${data.students.length} learners and ${data.teachers.length} teachers. ${riskCounts.High} learners are high risk, ${riskCounts.Moderate} are moderate risk, and ${support} have averages below 80. ${lowest.subject} is the lowest-performing subject at ${lowest.average}.`, actions, mode: 'local' }
  }

  return {
    message: `I can analyze every demo record and prepare changes for review. Try asking for a school summary, a learner profile, high-risk students, an attendance pattern, a guardian message, a grade update, an announcement, or a calendar event.`,
    actions,
    mode: 'local',
  }
}
