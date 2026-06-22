import { useMemo, useState } from 'react'
import { AlertTriangle, ArrowLeftRight, BookOpenCheck, CalendarCheck, Filter, Flag, ShieldCheck, Sparkles } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { attendanceTrend, gradeAnalytics, subjectPerformance } from '../../data/mockData'
import { averageGrade, getRisk } from '../../utils/risk'
import { AIInsightCard, Badge, Card, EmptyState, PageHeader, RiskBadge, Select, StatCard } from '../../components/ui'
import { AttendanceAreaChart, ChartCard, RiskPieChart, SimpleBarChart, TrendLineChart } from '../../components/charts'

export function AnalyticsPage() {
  const { students, transfers } = useApp()
  const [month, setMonth] = useState('June 2026')
  const [grade, setGrade] = useState('All')
  const [section, setSection] = useState('All')
  const sections = [...new Set(students.map((student) => student.section))]
  const filtered = useMemo(() => students.filter((student) => (grade === 'All' || student.gradeLevel === grade) && (section === 'All' || student.section === section)), [students, grade, section])
  const risks = filtered.map((student) => getRisk(student).level)
  const riskData = [
    { name: 'Low', value: risks.filter((risk) => risk === 'Low').length },
    { name: 'Moderate', value: risks.filter((risk) => risk === 'Moderate').length },
    { name: 'High', value: risks.filter((risk) => risk === 'High').length },
  ]
  const performanceTrend = [
    { month: 'Jan', average: 79 }, { month: 'Feb', average: 80 }, { month: 'Mar', average: 81 },
    { month: 'Apr', average: 80 }, { month: 'May', average: 82 }, { month: 'Jun', average: 84 },
  ]
  const transferData = [
    { month: 'Jan', in: 0, out: 1 }, { month: 'Feb', in: 1, out: 0 }, { month: 'Mar', in: 1, out: 1 },
    { month: 'Apr', in: 0, out: 0 }, { month: 'May', in: 1, out: 0 }, { month: 'Jun', in: transfers.filter((item) => item.type === 'Transfer In').length, out: transfers.filter((item) => item.type === 'Transfer Out').length },
  ]
  const selectionAverage = filtered.length ? Math.round(filtered.reduce((sum, student) => sum + averageGrade(student.grades), 0) / filtered.length * 10) / 10 : 0

  return (
    <>
      <PageHeader eyebrow="Patterns and trends" title="School Analytics" description="Explore attendance, performance, risk, subject, and transfer patterns with plain English interpretation." />
      <Card className="mb-6">
        <div className="flex items-center gap-2 pb-3 text-sm font-bold text-navy-950"><Filter size={17} className="text-skybrand-600" />Analysis filters</div>
        <div className="grid gap-3 sm:grid-cols-3"><Select value={month} onChange={(e) => setMonth(e.target.value)}><option>June 2026</option><option>May 2026</option><option>April 2026</option></Select><Select value={grade} onChange={(e) => setGrade(e.target.value)}><option>All</option>{Array.from({ length: 6 }, (_, index) => <option key={index}>Grade {index + 1}</option>)}</Select><Select value={section} onChange={(e) => setSection(e.target.value)}><option>All</option>{sections.map((item) => <option key={item}>{item}</option>)}</Select></div>
      </Card>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Selected learners" value={filtered.length} detail={`${grade}, ${section}`} icon={ShieldCheck} tone="sky" />
        <StatCard label="Average grade" value={selectionAverage} detail="Across all subjects" icon={BookOpenCheck} tone="purple" />
        <StatCard label="High risk" value={riskData[2].value} detail="Immediate follow-up" icon={AlertTriangle} tone="red" />
        <StatCard label="Transfer records" value={transfers.length} detail="Current school year" icon={ArrowLeftRight} tone="amber" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Attendance trend" description={`${month} context with six-month movement.`}><AttendanceAreaChart data={attendanceTrend} /></ChartCard>
        <ChartCard title="Performance trend" description="Overall average grade by reporting month."><TrendLineChart data={performanceTrend} /></ChartCard>
        <ChartCard title="Risk distribution" description="Current risk profile for the selected learner group."><RiskPieChart data={riskData} /></ChartCard>
        <ChartCard title="Subject performance" description="Average performance for the eight learning areas."><SimpleBarChart data={subjectPerformance} dataKey="average" /></ChartCard>
        <ChartCard title="Absences by grade level" description="Recorded absences across Grades 1 to 6."><SimpleBarChart data={gradeAnalytics} dataKey="absences" xKey="grade" color="#f59e0b" /></ChartCard>
        <ChartCard title="Transfers by month" description="Transfer-in and transfer-out records."><SimpleBarChart data={transferData} dataKey="in" secondKey="out" xKey="month" color="#10b981" /></ChartCard>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <AIInsightCard title="Attendance interpretation" text="Attendance is trending upward, but Grade 4 records the highest absence count and may benefit from targeted family follow-up." />
        <AIInsightCard title="Performance interpretation" text="Overall performance improved in June. Mathematics remains the lowest-performing core subject." />
        <AIInsightCard title="Risk interpretation" text={`${riskData[2].value} learners in the selected group have high-risk signals. Prioritize records with both low grades and frequent absences.`} />
      </div>
    </>
  )
}

export function FlaggingPage() {
  const { students } = useApp()
  const [grade, setGrade] = useState('All')
  const [riskLevel, setRiskLevel] = useState('All')
  const flagged = useMemo(() => students.map((student) => ({ ...student, risk: getRisk(student) })).filter((student) => (grade === 'All' || student.gradeLevel === grade) && (riskLevel === 'All' || student.risk.level === riskLevel)).sort((a, b) => ({ High: 0, Moderate: 1, Low: 2 }[a.risk.level] - { High: 0, Moderate: 1, Low: 2 }[b.risk.level])), [students, grade, riskLevel])
  const counts = ['High', 'Moderate', 'Low'].map((level) => ({ level, count: students.filter((student) => getRisk(student).level === level).length }))

  return (
    <>
      <PageHeader eyebrow="Explainable early support" title="Student Flagging" description="See each learner’s risk level, the exact reason for the flag, and a practical next action." />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="High risk" value={counts[0].count} detail="Immediate follow-up" icon={AlertTriangle} tone="red" />
        <StatCard label="Moderate risk" value={counts[1].count} detail="Monitor and support" icon={Flag} tone="amber" />
        <StatCard label="Low risk" value={counts[2].count} detail="Healthy current range" icon={ShieldCheck} tone="green" />
      </div>
      <Card className="mb-5"><div className="grid gap-3 sm:grid-cols-2"><Select value={grade} onChange={(e) => setGrade(e.target.value)}><option>All</option>{Array.from({ length: 6 }, (_, index) => <option key={index}>Grade {index + 1}</option>)}</Select><Select value={riskLevel} onChange={(e) => setRiskLevel(e.target.value)}><option>All</option><option>High</option><option>Moderate</option><option>Low</option></Select></div></Card>
      <div className="space-y-4">
        {flagged.length ? flagged.map((student) => (
          <Card key={student.studentId} className={`border-l-4 ${student.risk.level === 'High' ? 'border-l-rose-500' : student.risk.level === 'Moderate' ? 'border-l-amber-500' : 'border-l-emerald-500'}`}>
            <div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr_1.1fr] lg:items-center">
              <div><div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100 font-display text-sm font-extrabold text-navy-950">{student.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div><div><p className="font-semibold text-navy-950">{student.name}</p><p className="text-xs text-slate-400">{student.studentId} • {student.gradeLevel} {student.section}</p></div></div><div className="mt-3 flex gap-2"><RiskBadge level={student.risk.level} /><Badge tone="slate">Average {averageGrade(student.grades)}</Badge></div></div>
              <div><p className="text-xs font-bold uppercase tracking-wide text-slate-400">Why this learner is flagged</p><div className="mt-2 space-y-2">{student.risk.reasons.map((reason) => <p key={reason} className="flex items-start gap-2 text-sm text-slate-700"><span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${student.risk.level === 'High' ? 'bg-rose-500' : student.risk.level === 'Moderate' ? 'bg-amber-500' : 'bg-emerald-500'}`} />{reason}</p>)}</div></div>
              <div className="rounded-2xl bg-skybrand-50 p-4"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-skybrand-600"><Sparkles size={14} />Suggested intervention</p><p className="mt-2 text-sm leading-6 text-slate-700">{student.risk.action}</p><div className="mt-3 flex flex-wrap gap-2">{student.risk.level === 'High' ? <><Badge tone="red">Contact guardian</Badge><Badge tone="amber">Provide remediation</Badge></> : student.risk.level === 'Moderate' ? <><Badge tone="amber">Monitor weekly</Badge><Badge tone="sky">Review subjects</Badge></> : <Badge tone="green">Continue support</Badge>}</div></div>
            </div>
          </Card>
        )) : <Card><EmptyState /></Card>}
      </div>
    </>
  )
}
