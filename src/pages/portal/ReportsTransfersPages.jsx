import { useMemo, useState } from 'react'
import { ArrowDownToLine, ArrowLeftRight, ArrowUpFromLine, FileText, Plus, Printer, School, UserRoundCheck } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { averageGrade, getRisk } from '../../utils/risk'
import { Badge, Button, Card, Field, Modal, PageHeader, RiskBadge, Select, StatCard } from '../../components/ui'

const reportTabs = ['Attendance', 'Performance', 'Flagged Students', 'Transfers', 'Teacher Summary']

function ReportHeader({ title }) {
  return (
    <div className="mb-6 border-b-2 border-navy-900 pb-5 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Republic of the Philippines • Department of Education</p>
      <h2 className="mt-2 font-display text-xl font-extrabold text-navy-950">Balili Elementary School</h2>
      <p className="mt-1 text-sm font-semibold text-slate-600">{title} • June 2026</p>
    </div>
  )
}

export function ReportsPage() {
  const { students, teachers, transfers } = useApp()
  const [active, setActive] = useState('Attendance')
  const flagged = students.map((student) => ({ ...student, risk: getRisk(student) })).filter((student) => student.risk.level !== 'Low')
  const averageAttendance = (student) => {
    const total = Object.values(student.attendanceSummary).reduce((a, b) => a + b, 0)
    return Math.round(((student.attendanceSummary.present + student.attendanceSummary.late) / total) * 1000) / 10
  }

  return (
    <div className="print-area">
      <PageHeader eyebrow="Formal school outputs" title="Monthly Reports" description="Prepare attendance, performance, intervention, transfer, and teacher summaries." actions={<><Button variant="secondary" onClick={() => window.alert('Demo report prepared for download.')}><ArrowDownToLine size={16} />Export</Button><Button variant="sky" onClick={() => window.print()}><Printer size={16} />Print report</Button></>} />
      <Card className="mb-5 print-hidden">
        <div className="flex gap-2 overflow-x-auto pb-1">{reportTabs.map((tab) => <button key={tab} onClick={() => setActive(tab)} className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold transition ${active === tab ? 'bg-navy-900 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>{tab}</button>)}</div>
      </Card>
      <Card className="print:rounded-none print:border-0 print:p-0 print:shadow-none">
        <ReportHeader title={`${active} Report`} />
        {active === 'Attendance' && (
          <table className="data-table"><thead><tr><th>Student</th><th>Grade</th><th>Present</th><th>Absent</th><th>Late</th><th>Excused</th><th>Rate</th></tr></thead><tbody>{students.map((student) => <tr key={student.studentId}><td><p className="font-semibold text-navy-950">{student.name}</p><p className="text-xs text-slate-400">{student.studentId}</p></td><td>{student.gradeLevel} • {student.section}</td><td>{student.attendanceSummary.present}</td><td>{student.attendanceSummary.absent}</td><td>{student.attendanceSummary.late}</td><td>{student.attendanceSummary.excused}</td><td className="font-bold">{averageAttendance(student)}%</td></tr>)}</tbody></table>
        )}
        {active === 'Performance' && (
          <table className="data-table"><thead><tr><th>Student</th><th>Grade</th><th>English</th><th>Mathematics</th><th>Science</th><th>Filipino</th><th>Average</th></tr></thead><tbody>{students.map((student) => <tr key={student.studentId}><td className="font-semibold text-navy-950">{student.name}</td><td>{student.gradeLevel}</td><td>{student.grades.English}</td><td>{student.grades.Mathematics}</td><td>{student.grades.Science}</td><td>{student.grades.Filipino}</td><td className="font-bold">{averageGrade(student.grades)}</td></tr>)}</tbody></table>
        )}
        {active === 'Flagged Students' && (
          <table className="data-table"><thead><tr><th>Student</th><th>Grade</th><th>Risk</th><th>Reason</th><th>Suggested action</th></tr></thead><tbody>{flagged.map((student) => <tr key={student.studentId}><td className="font-semibold text-navy-950">{student.name}</td><td>{student.gradeLevel}</td><td><RiskBadge level={student.risk.level} /></td><td>{student.risk.reasons.join('; ')}</td><td>{student.risk.action}</td></tr>)}</tbody></table>
        )}
        {active === 'Transfers' && (
          <table className="data-table"><thead><tr><th>Student</th><th>Grade</th><th>Type</th><th>Previous school</th><th>Receiving school</th><th>Date</th><th>Status</th></tr></thead><tbody>{transfers.map((item) => <tr key={item.id}><td className="font-semibold text-navy-950">{item.studentName}</td><td>{item.gradeLevel}</td><td><Badge tone={item.type === 'Transfer In' ? 'green' : 'amber'}>{item.type}</Badge></td><td>{item.previousSchool}</td><td>{item.receivingSchool}</td><td>{item.date}</td><td>{item.status}</td></tr>)}</tbody></table>
        )}
        {active === 'Teacher Summary' && (
          <table className="data-table"><thead><tr><th>Teacher</th><th>Role</th><th>Assignment</th><th>Subject</th><th>Status</th></tr></thead><tbody>{teachers.map((teacher) => <tr key={teacher.id}><td><p className="font-semibold text-navy-950">{teacher.name}</p><p className="text-xs text-slate-400">{teacher.id}</p></td><td>{teacher.role}</td><td>{teacher.assignment}</td><td>{teacher.subject}</td><td><Badge tone="green">{teacher.status}</Badge></td></tr>)}</tbody></table>
        )}
        <div className="mt-10 hidden grid-cols-2 gap-20 pt-10 text-center text-xs print:grid"><div className="border-t border-slate-500 pt-2">Prepared by</div><div className="border-t border-slate-500 pt-2">Approved by School Principal</div></div>
      </Card>
    </div>
  )
}

const blankTransfer = {
  studentName: '', gradeLevel: 'Grade 1', type: 'Transfer In', previousSchool: '',
  receivingSchool: 'Balili Elementary School', date: '2026-06-22', reason: '', status: 'Pending',
}

export function TransfersPage() {
  const { transfers, setTransfers } = useApp()
  const [type, setType] = useState('All')
  const [status, setStatus] = useState('All')
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState(blankTransfer)
  const filtered = useMemo(() => transfers.filter((item) => (type === 'All' || item.type === type) && (status === 'All' || item.status === status)), [transfers, type, status])
  const counts = {
    in: transfers.filter((item) => item.type === 'Transfer In').length,
    out: transfers.filter((item) => item.type === 'Transfer Out').length,
    pending: transfers.filter((item) => item.status !== 'Completed').length,
  }

  const addTransfer = (event) => {
    event.preventDefault()
    setTransfers((current) => [{ ...form, id: `TR-${String(current.length + 1).padStart(3, '0')}` }, ...current])
    setForm(blankTransfer)
    setAdding(false)
  }

  return (
    <>
      <PageHeader eyebrow="Learner movement" title="Transfer Records" description="Track transfer-in and transfer-out documents and their current processing status." actions={<Button variant="sky" onClick={() => setAdding(true)}><Plus size={16} />Add transfer record</Button>} />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total records" value={transfers.length} detail="Current school year" icon={ArrowLeftRight} tone="navy" />
        <StatCard label="Transfer in" value={counts.in} detail="Learners received" icon={ArrowDownToLine} tone="green" />
        <StatCard label="Transfer out" value={counts.out} detail="Learners released" icon={ArrowUpFromLine} tone="amber" />
        <StatCard label="Open processing" value={counts.pending} detail="Pending or processing" icon={FileText} tone="red" />
      </div>
      <Card className="mb-5"><div className="grid gap-3 sm:grid-cols-2"><Select value={type} onChange={(e) => setType(e.target.value)}><option>All</option><option>Transfer In</option><option>Transfer Out</option></Select><Select value={status} onChange={(e) => setStatus(e.target.value)}><option>All</option><option>Completed</option><option>Processing</option><option>Pending</option></Select></div></Card>
      <div className="table-wrap">
        <table className="data-table"><thead><tr><th>Student</th><th>Type</th><th>Previous school</th><th>Receiving school</th><th>Date</th><th>Reason</th><th>Status</th></tr></thead><tbody>{filtered.map((item) => <tr key={item.id}><td><p className="font-semibold text-navy-950">{item.studentName}</p><p className="text-xs text-slate-400">{item.gradeLevel}</p></td><td><Badge tone={item.type === 'Transfer In' ? 'green' : 'amber'}>{item.type}</Badge></td><td>{item.previousSchool}</td><td>{item.receivingSchool}</td><td>{item.date}</td><td>{item.reason}</td><td><Badge tone={item.status === 'Completed' ? 'green' : item.status === 'Processing' ? 'sky' : 'amber'}>{item.status}</Badge></td></tr>)}</tbody></table>
      </div>
      <Modal open={adding} onClose={() => setAdding(false)} title="Add transfer record">
        <form onSubmit={addTransfer} className="grid gap-4 sm:grid-cols-2">
          <Field label="Student name"><input className="input" value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })} required /></Field>
          <Field label="Grade level"><Select value={form.gradeLevel} onChange={(e) => setForm({ ...form, gradeLevel: e.target.value })}>{Array.from({ length: 6 }, (_, index) => <option key={index}>Grade {index + 1}</option>)}</Select></Field>
          <Field label="Transfer type"><Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value, previousSchool: e.target.value === 'Transfer Out' ? 'Balili Elementary School' : form.previousSchool, receivingSchool: e.target.value === 'Transfer In' ? 'Balili Elementary School' : form.receivingSchool })}><option>Transfer In</option><option>Transfer Out</option></Select></Field>
          <Field label="Date"><input className="input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></Field>
          <Field label="Previous school"><input className="input" value={form.previousSchool} onChange={(e) => setForm({ ...form, previousSchool: e.target.value })} required /></Field>
          <Field label="Receiving school"><input className="input" value={form.receivingSchool} onChange={(e) => setForm({ ...form, receivingSchool: e.target.value })} required /></Field>
          <Field label="Reason"><input className="input" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} required /></Field>
          <Field label="Status"><Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option>Pending</option><option>Processing</option><option>Completed</option></Select></Field>
          <div className="flex justify-end gap-2 sm:col-span-2"><Button variant="secondary" onClick={() => setAdding(false)}>Cancel</Button><Button type="submit" variant="sky">Save record</Button></div>
        </form>
      </Modal>
    </>
  )
}
