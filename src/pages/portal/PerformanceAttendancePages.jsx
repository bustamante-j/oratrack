import { useMemo, useState } from 'react'
import { BookOpenCheck, CalendarCheck, CheckCircle2, Clock3, Edit3, Save, UserX, Users } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { averageGrade, getRisk, performanceLabel, subjectNames } from '../../utils/risk'
import { Badge, Button, Card, EmptyState, Field, Modal, PageHeader, RiskBadge, Select, StatCard } from '../../components/ui'

function PerformanceBadge({ value }) {
  const label = performanceLabel(value)
  const tone = label === 'Excellent' ? 'green' : label === 'Satisfactory' ? 'sky' : label === 'Needs Support' ? 'amber' : 'red'
  return <Badge tone={tone}>{label}</Badge>
}

export function PerformancePage() {
  const { user, students, setStudents } = useApp()
  const [grade, setGrade] = useState(user.role === 'Subject Teacher' ? 'Grade 4' : 'All')
  const [section, setSection] = useState('All')
  const [subject, setSubject] = useState(user.role === 'Subject Teacher' ? 'Science' : 'All')
  const [risk, setRisk] = useState('All')
  const [editing, setEditing] = useState(null)
  const sections = [...new Set(students.map((student) => student.section))]

  const filtered = useMemo(() => students.filter((student) => {
    const currentRisk = getRisk(student).level
    const subjectAccess = user.role !== 'Subject Teacher' || ['Grade 4', 'Grade 5', 'Grade 6'].includes(student.gradeLevel)
    return subjectAccess && (grade === 'All' || student.gradeLevel === grade) && (section === 'All' || student.section === section) && (risk === 'All' || currentRisk === risk)
  }), [students, grade, section, risk, user.role])

  const saveGrades = () => {
    setStudents((current) => current.map((student) => student.studentId === editing.studentId ? { ...student, grades: editing.grades, riskLevel: getRisk(editing).level } : student))
    setEditing(null)
  }

  const allGrades = filtered.flatMap((student) => Object.values(student.grades))
  const classAverage = allGrades.length ? Math.round(allGrades.reduce((sum, value) => sum + value, 0) / allGrades.length * 10) / 10 : 0
  const excellent = filtered.filter((student) => averageGrade(student.grades) >= 90).length
  const support = filtered.filter((student) => averageGrade(student.grades) < 80).length

  return (
    <>
      <PageHeader eyebrow="Learning outcomes" title="Academic Performance" description={user.role === 'Subject Teacher' ? 'Review and update Science grades for your assigned Grade 4 to Grade 6 classes.' : 'Review learner grades, subject averages, and academic support signals.'} />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Class average" value={classAverage} detail="Across selected records" icon={BookOpenCheck} tone="sky" />
        <StatCard label="Excellent learners" value={excellent} detail="Average of 90 or higher" icon={CheckCircle2} tone="green" />
        <StatCard label="Need support" value={support} detail="Average below 80" icon={Users} tone="amber" />
        <StatCard label="Records shown" value={filtered.length} detail="Current filter result" icon={BookOpenCheck} tone="purple" />
      </div>
      <Card className="mb-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Select value={grade} onChange={(e) => setGrade(e.target.value)} aria-label="Filter grade"><option>All</option>{Array.from({ length: 6 }, (_, index) => <option key={index}>Grade {index + 1}</option>)}</Select>
          <Select value={section} onChange={(e) => setSection(e.target.value)} aria-label="Filter section"><option>All</option>{sections.map((item) => <option key={item}>{item}</option>)}</Select>
          <Select value={subject} onChange={(e) => setSubject(e.target.value)} disabled={user.role === 'Subject Teacher'} aria-label="Filter subject"><option>All</option>{subjectNames.map((item) => <option key={item}>{item}</option>)}</Select>
          <Select value={risk} onChange={(e) => setRisk(e.target.value)} aria-label="Filter risk"><option>All</option><option>Low</option><option>Moderate</option><option>High</option></Select>
        </div>
      </Card>
      <div className="table-wrap">
        {filtered.length ? (
          <table className="data-table">
            <thead><tr><th>Student</th><th>Grade and section</th>{subject === 'All' ? subjectNames.map((item) => <th key={item}>{item}</th>) : <th>{subject}</th>}<th>Average</th><th>Level</th><th>Risk</th><th>Action</th></tr></thead>
            <tbody>{filtered.map((student) => {
              const average = averageGrade(student.grades)
              return <tr key={student.studentId}><td><p className="whitespace-nowrap font-semibold text-navy-950">{student.name}</p><p className="text-xs text-slate-400">{student.studentId}</p></td><td className="whitespace-nowrap">{student.gradeLevel}<p className="text-xs text-slate-400">{student.section}</p></td>{subject === 'All' ? subjectNames.map((item) => <td key={item} className={`font-semibold ${student.grades[item] < 75 ? 'text-rose-600' : ''}`}>{student.grades[item]}</td>) : <td className={`font-semibold ${student.grades[subject] < 75 ? 'text-rose-600' : ''}`}>{student.grades[subject]}</td>}<td className="font-bold text-navy-950">{average}</td><td><PerformanceBadge value={average} /></td><td><RiskBadge level={getRisk(student).level} /></td><td><button onClick={() => setEditing(structuredClone(student))} className="rounded-lg p-2 text-skybrand-600 hover:bg-skybrand-50" aria-label={`Edit grades for ${student.name}`}><Edit3 size={17} /></button></td></tr>
            })}</tbody>
          </table>
        ) : <EmptyState />}
      </div>
      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title={`Edit grades${editing ? ` • ${editing.name}` : ''}`}>
        {editing && <div><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{subjectNames.map((item) => <Field key={item} label={item}><input className="input" type="number" min="60" max="100" value={editing.grades[item]} onChange={(e) => setEditing((current) => ({ ...current, grades: { ...current.grades, [item]: Number(e.target.value) } }))} disabled={user.role === 'Subject Teacher' && item !== 'Science'} /></Field>)}</div><div className="mt-5 flex justify-end gap-2"><Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button><Button variant="sky" onClick={saveGrades}><Save size={16} />Save grades</Button></div></div>}
      </Modal>
    </>
  )
}

export function AttendancePage() {
  const { attendance, setAttendance, students, transfers } = useApp()
  const [date, setDate] = useState('2026-06-22')
  const [grade, setGrade] = useState('All')
  const [section, setSection] = useState('All')
  const sections = [...new Set(students.map((student) => student.section))]

  const records = useMemo(() => students.filter((student) => (grade === 'All' || student.gradeLevel === grade) && (section === 'All' || student.section === section)).map((student) => {
    const record = attendance.find((item) => item.studentId === student.studentId && item.date === date)
    return { student, status: record?.status || 'Present' }
  }), [students, attendance, grade, section, date])

  const updateStatus = (student, status) => {
    setAttendance((current) => {
      const keyMatch = (item) => item.studentId === student.studentId && item.date === date
      const next = { studentId: student.studentId, name: student.name, gradeLevel: student.gradeLevel, section: student.section, date, status }
      return current.some(keyMatch) ? current.map((item) => keyMatch(item) ? next : item) : [next, ...current]
    })
  }

  const counts = records.reduce((result, item) => ({ ...result, [item.status]: (result[item.status] || 0) + 1 }), {})
  const summaryCards = [
    { label: 'Present', value: counts.Present || 0, icon: CheckCircle2, tone: 'green' },
    { label: 'Absent', value: counts.Absent || 0, icon: UserX, tone: 'red' },
    { label: 'Late', value: counts.Late || 0, icon: Clock3, tone: 'amber' },
    { label: 'Excused', value: counts.Excused || 0, icon: CalendarCheck, tone: 'purple' },
  ]

  return (
    <>
      <PageHeader eyebrow="Daily learner presence" title="Attendance Monitoring" description="Mark daily attendance, review monthly summaries, and account for active transfer records." actions={<Button variant="sky" onClick={() => window.alert('Attendance is saved automatically in this demo.')}><Save size={16} />Save attendance</Button>} />
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">{summaryCards.map((item) => <StatCard key={item.label} {...item} detail={`${date} records`} />)}</div>
      <Card className="mb-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Attendance date"><input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
          <Field label="Grade level"><Select value={grade} onChange={(e) => setGrade(e.target.value)}><option>All</option>{Array.from({ length: 6 }, (_, index) => <option key={index}>Grade {index + 1}</option>)}</Select></Field>
          <Field label="Section"><Select value={section} onChange={(e) => setSection(e.target.value)}><option>All</option>{sections.map((item) => <option key={item}>{item}</option>)}</Select></Field>
        </div>
      </Card>
      <div className="grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Student</th><th>Grade and section</th><th>Transfer status</th><th>Attendance status</th></tr></thead>
            <tbody>{records.map(({ student, status }) => <tr key={student.studentId}><td><p className="font-semibold text-navy-950">{student.name}</p><p className="text-xs text-slate-400">{student.studentId}</p></td><td>{student.gradeLevel}<p className="text-xs text-slate-400">{student.section}</p></td><td><Badge tone={student.transferStatus === 'None' ? 'slate' : 'purple'}>{student.transferStatus}</Badge></td><td><Select className={`min-w-32 py-2 font-semibold ${status === 'Absent' ? 'text-rose-600' : status === 'Present' ? 'text-emerald-700' : 'text-amber-700'}`} value={status} onChange={(e) => updateStatus(student, e.target.value)}><option>Present</option><option>Absent</option><option>Late</option><option>Excused</option></Select></td></tr>)}</tbody>
          </table>
        </div>
        <div className="space-y-6">
          <Card>
            <h2 className="font-display text-lg font-bold text-navy-950">Monthly summary</h2>
            <p className="mt-1 text-sm text-slate-500">June 2026 school-wide records</p>
            <div className="mt-5 space-y-4">
              {[['Attendance rate', '95.1%', 'bg-emerald-500', '95%'], ['On-time arrival', '92.4%', 'bg-skybrand-500', '92%'], ['Excused absence rate', '2.1%', 'bg-violet-500', '21%']].map(([label, value, color, width]) => <div key={label}><div className="mb-2 flex justify-between text-xs"><span className="font-semibold text-slate-600">{label}</span><span className="font-bold text-navy-950">{value}</span></div><div className="h-2 rounded-full bg-slate-100"><div className={`h-2 rounded-full ${color}`} style={{ width }} /></div></div>)}
            </div>
          </Card>
          <Card>
            <h2 className="font-display text-lg font-bold text-navy-950">Transfer effect</h2>
            <p className="mt-1 text-sm text-slate-500">Transfer status can change expected attendance totals.</p>
            <div className="mt-4 space-y-3">{transfers.slice(0, 3).map((item) => <div key={item.id} className="rounded-xl bg-slate-50 p-3"><div className="flex items-center justify-between gap-2"><p className="text-sm font-semibold text-navy-950">{item.studentName}</p><Badge tone={item.type === 'Transfer In' ? 'green' : 'amber'}>{item.type}</Badge></div><p className="mt-1 text-xs text-slate-400">{item.date} • {item.status}</p></div>)}</div>
          </Card>
        </div>
      </div>
    </>
  )
}
