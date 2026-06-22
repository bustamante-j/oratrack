import { useMemo, useState } from 'react'
import {
  Bot, Edit3, GraduationCap, MessageCircle, Plus, RotateCcw, Save, Send, Settings2,
  Sparkles, Trash2, UserCog, UserRoundCheck,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { averageGrade, getRisk } from '../../utils/risk'
import { Badge, Button, Card, Field, Modal, PageHeader, Select, StatCard } from '../../components/ui'

const blankTeacher = { name: '', role: 'Adviser', assignment: 'Grade 1 • Mapagmahal', subject: 'All core subjects', email: '', status: 'Active' }

export function TeachersPage() {
  const { teachers, setTeachers } = useApp()
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('All')
  const [editing, setEditing] = useState(null)
  const filtered = useMemo(() => teachers.filter((teacher) => (!search || `${teacher.name} ${teacher.email}`.toLowerCase().includes(search.toLowerCase())) && (role === 'All' || teacher.role === role)), [teachers, search, role])

  const save = (event) => {
    event.preventDefault()
    setTeachers((current) => editing.id ? current.map((item) => item.id === editing.id ? editing : item) : [...current, { ...editing, id: `T-${String(current.length + 1).padStart(3, '0')}` }])
    setEditing(null)
  }
  const remove = (teacher) => {
    if (window.confirm(`Delete ${teacher.name} from the teacher roster?`)) setTeachers((current) => current.filter((item) => item.id !== teacher.id))
  }
  return (
    <>
      <PageHeader eyebrow="Admin only" title="Teacher Management" description="Maintain the adviser and subject teacher roster for Balili Elementary School." actions={<Button variant="sky" onClick={() => setEditing({ ...blankTeacher })}><Plus size={16} />Add teacher</Button>} />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total teachers" value={teachers.length} detail="Active school roster" icon={UserCog} tone="navy" />
        <StatCard label="Advisers" value={teachers.filter((teacher) => teacher.role === 'Adviser').length} detail="Grade and section advisers" icon={UserRoundCheck} tone="sky" />
        <StatCard label="Subject teachers" value={teachers.filter((teacher) => teacher.role === 'Subject Teacher').length} detail="Specialized learning areas" icon={GraduationCap} tone="purple" />
      </div>
      <Card className="mb-5"><div className="grid gap-3 sm:grid-cols-2"><input className="input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search teacher or email" aria-label="Search teachers" /><Select value={role} onChange={(e) => setRole(e.target.value)}><option>All</option><option>Adviser</option><option>Subject Teacher</option></Select></div></Card>
      <div className="table-wrap">
        <table className="data-table"><thead><tr><th>Teacher</th><th>Role</th><th>Assignment</th><th>Subject</th><th>Email</th><th>Status</th><th>Actions</th></tr></thead><tbody>{filtered.map((teacher) => <tr key={teacher.id}><td><p className="font-semibold text-navy-950">{teacher.name}</p><p className="text-xs text-slate-400">{teacher.id}</p></td><td><Badge tone={teacher.role === 'Adviser' ? 'sky' : 'purple'}>{teacher.role}</Badge></td><td>{teacher.assignment}</td><td>{teacher.subject}</td><td>{teacher.email}</td><td><Badge tone={teacher.status === 'Active' ? 'green' : 'slate'}>{teacher.status}</Badge></td><td><div className="flex gap-1"><button onClick={() => setEditing({ ...teacher })} className="rounded-lg p-2 text-skybrand-600 hover:bg-skybrand-50" aria-label={`Edit ${teacher.name}`}><Edit3 size={17} /></button><button onClick={() => remove(teacher)} className="rounded-lg p-2 text-rose-600 hover:bg-rose-50" aria-label={`Delete ${teacher.name}`}><Trash2 size={17} /></button></div></td></tr>)}</tbody></table>
      </div>
      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title={editing?.id ? 'Edit teacher' : 'Add teacher'}>
        {editing && <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name"><input className="input" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} required /></Field>
          <Field label="Role"><Select value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value })}><option>Adviser</option><option>Subject Teacher</option></Select></Field>
          <Field label="Assignment"><input className="input" value={editing.assignment} onChange={(e) => setEditing({ ...editing, assignment: e.target.value })} required /></Field>
          <Field label="Subject"><input className="input" value={editing.subject} onChange={(e) => setEditing({ ...editing, subject: e.target.value })} /></Field>
          <Field label="Email"><input className="input" type="email" value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} required /></Field>
          <Field label="Status"><Select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })}><option>Active</option><option>Inactive</option></Select></Field>
          <div className="flex justify-end gap-2 sm:col-span-2"><Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button><Button type="submit" variant="sky">Save teacher</Button></div>
        </form>}
      </Modal>
    </>
  )
}

const predefinedQuestions = [
  'Which grade level needs the most attendance support?',
  'How many students need academic support?',
  'What should I do for a frequently absent student?',
  'Which subject has the lowest average?',
  'Give me a short school performance summary.',
]

export function AIAssistantPage() {
  const { students } = useApp()
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I can summarize ORATRACK demo data, explain risk flags, and suggest practical next steps. Choose a question below or type your own.' },
  ])
  const [input, setInput] = useState('')

  const answerQuestion = (question) => {
    const supportCount = students.filter((student) => averageGrade(student.grades) < 80).length
    const highRisk = students.filter((student) => getRisk(student).level === 'High').length
    const normalized = question.toLowerCase()
    if (normalized.includes('attendance') && normalized.includes('grade')) return 'Grade 4 needs the most attendance support in the current demo data. It has 25 recorded absences. Start with learners who have 7 or more absences, then contact guardians and review recurring absence dates.'
    if (normalized.includes('academic') || normalized.includes('low grade')) return `${supportCount} students have an average grade below 80 and may need academic support. Begin with short remediation activities in Mathematics and review progress each week.`
    if (normalized.includes('frequently absent') || normalized.includes('absent student')) return 'Check the attendance pattern, speak privately with the learner, and contact the guardian. Record the reason, offer missed-work support, and monitor attendance weekly.'
    if (normalized.includes('subject') || normalized.includes('lowest average')) return 'Mathematics has the lowest current subject average at 79. Consider focused practice, small-group review, and checking which competencies are causing the most difficulty.'
    if (normalized.includes('summary') || normalized.includes('performance')) return `School attendance is improving and the overall subject picture is stable. ${supportCount} learners need academic support, while ${highRisk} have high-risk signals that call for prompt follow-up.`
    return `Based on the demo records, focus first on attendance, Mathematics performance, and the ${highRisk} high-risk learners. A good next step is to review the related student profiles and record a clear follow-up action.`
  }

  const send = (question = input) => {
    const clean = question.trim()
    if (!clean) return
    setMessages((current) => [...current, { role: 'user', text: clean }, { role: 'assistant', text: answerQuestion(clean) }])
    setInput('')
  }

  return (
    <>
      <PageHeader eyebrow="Simulated rule-based support" title="AI Assistant" description="Ask practical questions about the current demo data. No external AI service is called." />
      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-2"><Sparkles className="text-skybrand-600" size={19} /><h2 className="font-display font-bold text-navy-950">Try a question</h2></div>
            <div className="mt-4 space-y-2">{predefinedQuestions.map((question) => <button key={question} onClick={() => send(question)} className="w-full rounded-xl border border-slate-200 p-3 text-left text-xs font-semibold leading-5 text-slate-600 transition hover:border-skybrand-300 hover:bg-skybrand-50">{question}</button>)}</div>
          </Card>
          <Card className="bg-navy-950 text-white">
            <Bot className="text-skybrand-300" />
            <h2 className="mt-4 font-display text-lg font-bold">How it works</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">This assistant uses simple, explainable rules over the local demo dataset. It does not send information to an outside service.</p>
          </Card>
        </div>
        <Card padding={false} className="flex min-h-[620px] flex-col overflow-hidden">
          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4"><div className="grid h-10 w-10 place-items-center rounded-xl bg-navy-900 text-white"><Bot size={20} /></div><div><p className="font-display text-sm font-bold text-navy-950">ORATRACK Assistant</p><p className="text-xs text-emerald-600">Ready with current demo data</p></div></div>
          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/60 p-5">
            {messages.map((message, index) => <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === 'user' ? 'rounded-br-md bg-navy-900 text-white' : 'rounded-bl-md border border-slate-200 bg-white text-slate-700 shadow-sm'}`}>{message.text}</div></div>)}
          </div>
          <form onSubmit={(event) => { event.preventDefault(); send() }} className="flex gap-2 border-t border-slate-100 bg-white p-4">
            <input className="input flex-1" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about attendance, grades, or support..." aria-label="Ask the AI assistant" />
            <Button type="submit" variant="sky" aria-label="Send question"><Send size={17} /><span className="hidden sm:inline">Send</span></Button>
          </form>
        </Card>
      </div>
    </>
  )
}

export function SettingsPage() {
  const { user, settings, setSettings, resetDemo } = useApp()
  const [name, setName] = useState(settings.displayName || user.name)
  const [saved, setSaved] = useState(false)
  const save = (event) => {
    event.preventDefault()
    setSettings((current) => ({ ...current, displayName: name }))
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1800)
  }
  const reset = () => {
    if (window.confirm('Reset all ORATRACK demo data to its original state? Your local edits will be removed.')) resetDemo()
  }
  return (
    <>
      <PageHeader eyebrow="Account preferences" title="Settings & Profile" description="Update your local display preferences or restore the original presentation data." />
      <div className="grid gap-6 xl:grid-cols-[1fr_.8fr]">
        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-skybrand-50 text-skybrand-600"><UserCog size={20} /></div><div><h2 className="font-display text-lg font-bold text-navy-950">Profile details</h2><p className="text-sm text-slate-500">Changes are stored only in this browser.</p></div></div>
            <form onSubmit={save} className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Display name"><input className="input" value={name} onChange={(e) => setName(e.target.value)} required /></Field>
              <Field label="Role"><input className="input bg-slate-50" value={user.role} disabled /></Field>
              <Field label="Email address"><input className="input bg-slate-50" value={user.email} disabled /></Field>
              <Field label="School"><input className="input bg-slate-50" value="Balili Elementary School" disabled /></Field>
              <div className="sm:col-span-2"><Button type="submit" variant="sky"><Save size={16} />{saved ? 'Saved' : 'Save profile'}</Button></div>
            </form>
          </Card>
          <Card>
            <div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-violet-50 text-violet-600"><Settings2 size={20} /></div><div><h2 className="font-display text-lg font-bold text-navy-950">Display density</h2><p className="text-sm text-slate-500">Choose how much space appears around portal content.</p></div></div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[['comfortable', 'Comfortable', 'More breathing room for presentations'], ['compact', 'Compact', 'Fit more content on each screen']].map(([value, title, text]) => <button key={value} onClick={() => setSettings((current) => ({ ...current, density: value }))} className={`rounded-2xl border p-4 text-left transition ${settings.density === value ? 'border-skybrand-400 bg-skybrand-50 ring-2 ring-skybrand-100' : 'border-slate-200 hover:bg-slate-50'}`}><p className="text-sm font-bold text-navy-950">{title}</p><p className="mt-1 text-xs text-slate-500">{text}</p></button>)}
            </div>
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-navy-950 to-navy-700 text-white">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10 font-display text-lg font-extrabold">{(settings.displayName || user.name).split(' ').map((part) => part[0]).slice(0, 2).join('')}</div>
            <h2 className="mt-5 font-display text-xl font-extrabold">{settings.displayName || user.name}</h2>
            <p className="mt-1 text-sm text-slate-300">{user.email}</p>
            <Badge tone="sky" className="mt-4">{user.role}</Badge>
          </Card>
          <Card className="border-rose-200">
            <div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-rose-50 text-rose-600"><RotateCcw size={20} /></div><div><h2 className="font-display text-lg font-bold text-navy-950">Reset demo data</h2><p className="text-sm text-slate-500">Restore original students, grades, attendance, teachers, announcements, events, and transfers.</p></div></div>
            <Button variant="danger" className="mt-5" onClick={reset}><RotateCcw size={16} />Reset to original data</Button>
          </Card>
        </div>
      </div>
    </>
  )
}
