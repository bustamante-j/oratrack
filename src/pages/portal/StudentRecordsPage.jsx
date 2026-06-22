import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Edit3, Eye, Plus, Search, Trash2, UserRound, CalendarCheck, BookOpenCheck, ClipboardList } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { averageGrade, getRisk, subjectNames } from '../../utils/risk'
import { Badge, Button, Card, EmptyState, Field, Modal, PageHeader, RiskBadge, Select } from '../../components/ui'

const blankStudent = {
  studentId: '', name: '', gradeLevel: 'Grade 1', section: 'Mapagmahal', adviser: '',
  gender: 'Female', age: 6, attendanceSummary: { present: 40, absent: 0, late: 0, excused: 0 },
  grades: Object.fromEntries(subjectNames.map((subject) => [subject, 85])),
  behaviorNotes: 'No current classroom concerns.', status: 'Active', transferStatus: 'None',
}

function StudentForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial)
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const setAttendance = (key, value) => setForm((current) => ({ ...current, attendanceSummary: { ...current.attendanceSummary, [key]: Number(value) } }))
  const setGrade = (subject, value) => setForm((current) => ({ ...current, grades: { ...current.grades, [subject]: Number(value) } }))
  return (
    <form onSubmit={(event) => { event.preventDefault(); onSubmit({ ...form, studentId: form.studentId || `BES-2026-${Date.now().toString().slice(-4)}` }) }} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Student ID"><input className="input" value={form.studentId} onChange={(e) => set('studentId', e.target.value)} placeholder="Auto-generated if blank" disabled={Boolean(initial.studentId)} /></Field>
        <Field label="Full name"><input className="input" value={form.name} onChange={(e) => set('name', e.target.value)} required /></Field>
        <Field label="Grade level"><Select value={form.gradeLevel} onChange={(e) => set('gradeLevel', e.target.value)}>{Array.from({ length: 6 }, (_, index) => <option key={index}>Grade {index + 1}</option>)}</Select></Field>
        <Field label="Section"><input className="input" value={form.section} onChange={(e) => set('section', e.target.value)} required /></Field>
        <Field label="Adviser"><input className="input" value={form.adviser} onChange={(e) => set('adviser', e.target.value)} required /></Field>
        <Field label="Gender"><Select value={form.gender} onChange={(e) => set('gender', e.target.value)}><option>Female</option><option>Male</option></Select></Field>
        <Field label="Age"><input className="input" type="number" min="5" max="15" value={form.age} onChange={(e) => set('age', Number(e.target.value))} /></Field>
        <Field label="Status"><Select value={form.status} onChange={(e) => set('status', e.target.value)}><option>Active</option><option>Inactive</option></Select></Field>
      </div>
      <div>
        <p className="mb-3 text-sm font-bold text-navy-950">Attendance summary</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{['present', 'absent', 'late', 'excused'].map((key) => <Field key={key} label={key}><input className="input" type="number" min="0" value={form.attendanceSummary[key]} onChange={(e) => setAttendance(key, e.target.value)} /></Field>)}</div>
      </div>
      <div>
        <p className="mb-3 text-sm font-bold text-navy-950">Subject grades</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{subjectNames.map((subject) => <Field key={subject} label={subject}><input className="input" type="number" min="60" max="100" value={form.grades[subject]} onChange={(e) => setGrade(subject, e.target.value)} /></Field>)}</div>
      </div>
      <Field label="Behavior notes"><textarea className="input min-h-24 resize-y" value={form.behaviorNotes} onChange={(e) => set('behaviorNotes', e.target.value)} /></Field>
      <div className="flex justify-end gap-2"><Button variant="secondary" onClick={onCancel}>Cancel</Button><Button type="submit" variant="sky">Save student</Button></div>
    </form>
  )
}

function ProfileView({ student }) {
  const risk = getRisk(student)
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-navy-950 to-navy-700 p-6 text-white">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div className="flex items-center gap-4"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-xl font-bold">{student.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div><div><h3 className="font-display text-xl font-extrabold">{student.name}</h3><p className="mt-1 text-sm text-slate-300">{student.studentId} • {student.gradeLevel} {student.section}</p></div></div>
          <RiskBadge level={risk.level} />
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div><p className="text-[10px] uppercase tracking-wide text-slate-400">Age</p><p className="mt-1 text-sm font-semibold">{student.age}</p></div>
          <div><p className="text-[10px] uppercase tracking-wide text-slate-400">Gender</p><p className="mt-1 text-sm font-semibold">{student.gender}</p></div>
          <div><p className="text-[10px] uppercase tracking-wide text-slate-400">Status</p><p className="mt-1 text-sm font-semibold">{student.status}</p></div>
          <div><p className="text-[10px] uppercase tracking-wide text-slate-400">Adviser</p><p className="mt-1 truncate text-sm font-semibold">{student.adviser}</p></div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="shadow-none"><BookOpenCheck className="text-skybrand-600" /><p className="mt-4 text-xs font-semibold uppercase text-slate-400">Overall average</p><p className="mt-1 font-display text-2xl font-extrabold text-navy-950">{averageGrade(student.grades)}</p></Card>
        <Card className="shadow-none"><CalendarCheck className="text-emerald-600" /><p className="mt-4 text-xs font-semibold uppercase text-slate-400">Days present</p><p className="mt-1 font-display text-2xl font-extrabold text-navy-950">{student.attendanceSummary.present}</p></Card>
        <Card className="shadow-none"><ClipboardList className="text-amber-600" /><p className="mt-4 text-xs font-semibold uppercase text-slate-400">Absences</p><p className="mt-1 font-display text-2xl font-extrabold text-navy-950">{student.attendanceSummary.absent}</p></Card>
      </div>
      <div>
        <h3 className="mb-3 text-sm font-bold text-navy-950">Academic performance</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{Object.entries(student.grades).map(([subject, grade]) => <div key={subject} className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] font-bold uppercase text-slate-400">{subject}</p><p className="mt-1 font-display text-lg font-extrabold text-navy-950">{grade}</p></div>)}</div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-amber-50 p-4"><p className="text-xs font-bold uppercase text-amber-700">Behavior note</p><p className="mt-2 text-sm leading-6 text-slate-700">{student.behaviorNotes}</p></div>
        <div className="rounded-2xl bg-skybrand-50 p-4"><p className="text-xs font-bold uppercase text-skybrand-600">Suggested action</p><p className="mt-2 text-sm leading-6 text-slate-700">{risk.action}</p>{risk.reasons.map((reason) => <p key={reason} className="mt-2 text-xs font-semibold text-slate-500">• {reason}</p>)}</div>
      </div>
    </div>
  )
}

export default function StudentRecordsPage() {
  const { students, setStudents, saveStudent } = useApp()
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [grade, setGrade] = useState('All')
  const [section, setSection] = useState('All')
  const [risk, setRisk] = useState('All')
  const [status, setStatus] = useState('All')
  const [editing, setEditing] = useState(null)
  const [viewing, setViewing] = useState(null)
  const sections = [...new Set(students.map((student) => student.section))].sort()

  const filtered = useMemo(() => students.filter((student) => {
    const studentRisk = getRisk(student).level
    return (!search || `${student.name} ${student.studentId}`.toLowerCase().includes(search.toLowerCase()))
      && (grade === 'All' || student.gradeLevel === grade)
      && (section === 'All' || student.section === section)
      && (risk === 'All' || studentRisk === risk)
      && (status === 'All' || student.status === status)
  }), [students, search, grade, section, risk, status])

  const deleteStudent = (student) => {
    if (window.confirm(`Delete ${student.name} from the demo records?`)) setStudents((current) => current.filter((item) => item.studentId !== student.studentId))
  }

  return (
    <>
      <PageHeader eyebrow="Learner information" title="Student Records" description="Search, review, and maintain learner profiles across Grades 1 to 6." actions={<Button variant="sky" onClick={() => setEditing({ ...blankStudent })}><Plus size={17} />Add student</Button>} />
      <Card className="mb-5">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <label className="relative block"><Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input className="input pl-10" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or ID" aria-label="Search student records" /></label>
          <Select value={grade} onChange={(e) => setGrade(e.target.value)} aria-label="Filter grade"><option>All</option>{Array.from({ length: 6 }, (_, index) => <option key={index}>Grade {index + 1}</option>)}</Select>
          <Select value={section} onChange={(e) => setSection(e.target.value)} aria-label="Filter section"><option>All</option>{sections.map((item) => <option key={item}>{item}</option>)}</Select>
          <Select value={risk} onChange={(e) => setRisk(e.target.value)} aria-label="Filter risk"><option>All</option><option>Low</option><option>Moderate</option><option>High</option></Select>
          <Select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter status"><option>All</option><option>Active</option><option>Inactive</option></Select>
        </div>
        <p className="mt-3 text-xs text-slate-400">Showing {filtered.length} of {students.length} students</p>
      </Card>

      <div className="table-wrap">
        {filtered.length ? (
          <table className="data-table">
            <thead><tr><th>Student</th><th>Grade and section</th><th>Adviser</th><th>Average</th><th>Attendance</th><th>Risk</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>{filtered.map((student) => {
              const studentRisk = getRisk(student)
              return (
                <tr key={student.studentId}>
                  <td><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-skybrand-50 text-skybrand-600"><UserRound size={17} /></div><div><p className="whitespace-nowrap font-semibold text-navy-950">{student.name}</p><p className="text-xs text-slate-400">{student.studentId}</p></div></div></td>
                  <td><p className="whitespace-nowrap font-medium">{student.gradeLevel}</p><p className="text-xs text-slate-400">{student.section}</p></td>
                  <td className="whitespace-nowrap">{student.adviser}</td>
                  <td className="font-bold text-navy-950">{averageGrade(student.grades)}</td>
                  <td><p>{student.attendanceSummary.present} present</p><p className="text-xs text-slate-400">{student.attendanceSummary.absent} absent</p></td>
                  <td><RiskBadge level={studentRisk.level} /></td>
                  <td><Badge tone={student.status === 'Active' ? 'green' : 'slate'}>{student.status}</Badge></td>
                  <td><div className="flex gap-1"><button onClick={() => setViewing(student)} className="rounded-lg p-2 text-skybrand-600 hover:bg-skybrand-50" aria-label={`View ${student.name}`}><Eye size={17} /></button><button onClick={() => setEditing(structuredClone(student))} className="rounded-lg p-2 text-amber-600 hover:bg-amber-50" aria-label={`Edit ${student.name}`}><Edit3 size={17} /></button><button onClick={() => deleteStudent(student)} className="rounded-lg p-2 text-rose-600 hover:bg-rose-50" aria-label={`Delete ${student.name}`}><Trash2 size={17} /></button></div></td>
                </tr>
              )
            })}</tbody>
          </table>
        ) : <EmptyState />
        }
      </div>

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title={editing?.studentId ? 'Edit student record' : 'Add student record'} size="xl">
        {editing && <StudentForm initial={editing} onCancel={() => setEditing(null)} onSubmit={(student) => { saveStudent(student); setEditing(null) }} />}
      </Modal>
      <Modal open={Boolean(viewing)} onClose={() => setViewing(null)} title="Student profile" size="xl">{viewing && <ProfileView student={viewing} />}</Modal>
    </>
  )
}
