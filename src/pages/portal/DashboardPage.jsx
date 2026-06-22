import { Link } from 'react-router-dom'
import {
  Users, UserRoundCheck, CalendarCheck, Flag, FileClock, ArrowLeftRight, ArrowUpRight, Sparkles,
  Megaphone, CalendarDays, BookOpenCheck, TrendingUp,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { attendanceTrend, gradeAnalytics, subjectPerformance } from '../../data/mockData'
import { averageGrade, getRisk } from '../../utils/risk'
import { AIInsightCard, Badge, Card, PageHeader, RiskBadge, SectionHeading, StatCard } from '../../components/ui'
import { AttendanceAreaChart, ChartCard, RiskPieChart, SimpleBarChart } from '../../components/charts'

const formatDate = (date) => new Intl.DateTimeFormat('en-PH', { month: 'short', day: 'numeric' }).format(new Date(`${date}T00:00:00`))

export default function DashboardPage() {
  const { user, students, teachers, announcements, events, transfers } = useApp()
  const riskStudents = students.map((student) => ({ ...student, risk: getRisk(student) }))
  const highRisk = riskStudents.filter((student) => student.risk.level === 'High')
  const moderateRisk = riskStudents.filter((student) => student.risk.level === 'Moderate')
  const lowRisk = riskStudents.filter((student) => student.risk.level === 'Low')
  const overallAttendance = attendanceTrend.at(-1).rate
  const greetingName = user.name.startsWith('Dr.')
    ? `Dr. ${user.name.split(' ').at(-1)}`
    : user.name.split(' ')[0]

  const stats = [
    { label: 'Total students', value: students.length, icon: Users, detail: 'Grades 1 to 6', tone: 'sky' },
    { label: 'Total teachers', value: teachers.length, icon: UserRoundCheck, detail: '27 advisers, 3 subject teachers', tone: 'purple' },
    { label: 'Attendance rate', value: `${overallAttendance}%`, icon: CalendarCheck, detail: '+0.9% from last month', tone: 'green' },
    { label: 'At risk students', value: highRisk.length, icon: Flag, detail: `${moderateRisk.length} need monitoring`, tone: 'red' },
    { label: 'Pending reports', value: 6, icon: FileClock, detail: 'Due June 30', tone: 'amber' },
    { label: 'Transfer records', value: transfers.length, icon: ArrowLeftRight, detail: `${transfers.filter((item) => item.status !== 'Completed').length} still open`, tone: 'navy' },
  ]

  const riskData = [
    { name: 'Low', value: lowRisk.length },
    { name: 'Moderate', value: moderateRisk.length },
    { name: 'High', value: highRisk.length },
  ]

  const supportCount = students.filter((student) => averageGrade(student.grades) < 80).length
  const maxAbsenceGrade = gradeAnalytics.reduce((max, item) => item.absences > max.absences ? item : max)

  return (
    <>
      <PageHeader
        eyebrow="School overview"
        title={`Good day, ${greetingName}`}
        description={user.role === 'Subject Teacher' ? 'Here is the latest view of your assigned subject performance and school attendance.' : 'Here is the latest view of student progress, attendance, and school activity.'}
        actions={<Link to="/portal/reports" className="inline-flex items-center gap-2 rounded-xl bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-800">View reports <ArrowUpRight size={16} /></Link>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
        <ChartCard title="Attendance trend" description="Monthly school attendance rate for the current year.">
          <AttendanceAreaChart data={attendanceTrend} />
        </ChartCard>
        <Card>
          <SectionHeading title="AI school insights" description="Rule-based signals from current demo data." action={<Sparkles size={19} className="text-skybrand-500" />} />
          <div className="space-y-3">
            <AIInsightCard title="Attendance watch" text={`${maxAbsenceGrade.grade} has the highest number of absences this month.`} action="Review attendance by grade" />
            <AIInsightCard title="Academic support" text={`${supportCount} students need academic support based on average grades below 80.`} action="Open flagged students" />
            <AIInsightCard title="Positive trend" text="Attendance improved compared with last month." action="Keep current follow-up routines" />
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <ChartCard title="Performance by subject" description="Current average grade across all learners.">
          <SimpleBarChart data={subjectPerformance} dataKey="average" />
        </ChartCard>
        <ChartCard title="Absences by grade" description="Recorded absences for the current reporting period.">
          <SimpleBarChart data={gradeAnalytics} dataKey="absences" xKey="grade" color="#f59e0b" />
        </ChartCard>
        <ChartCard title="Student risk distribution" description="Explainable risk grouping based on grades, attendance, and notes.">
          <RiskPieChart data={riskData} />
        </ChartCard>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
        {user.role !== 'Subject Teacher' ? (
          <Card padding={false}>
            <div className="p-5"><SectionHeading title="Flagged students" description="Learners who may need timely follow-up." action={<Link to="/portal/flagging" className="text-xs font-bold text-skybrand-600">View all</Link>} /></div>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead><tr><th>Student</th><th>Grade</th><th>Average</th><th>Risk</th><th>Primary reason</th></tr></thead>
                <tbody>
                  {[...highRisk, ...moderateRisk].slice(0, 5).map((student) => (
                    <tr key={student.studentId}>
                      <td><p className="font-semibold text-navy-950">{student.name}</p><p className="text-xs text-slate-400">{student.studentId}</p></td>
                      <td>{student.gradeLevel}</td><td className="font-semibold">{averageGrade(student.grades)}</td>
                      <td><RiskBadge level={student.risk.level} /></td><td className="max-w-56 text-xs">{student.risk.reasons[0]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <Card>
            <SectionHeading title="Assigned subject snapshot" description="Your current subject teaching overview." />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-skybrand-50 p-5"><BookOpenCheck className="text-skybrand-600" /><p className="mt-5 text-xs font-bold uppercase text-slate-500">Primary subject</p><p className="mt-1 font-display text-xl font-extrabold text-navy-950">Science</p><p className="mt-2 text-sm text-slate-500">Grades 4 to 6</p></div>
              <div className="rounded-2xl bg-emerald-50 p-5"><TrendingUp className="text-emerald-600" /><p className="mt-5 text-xs font-bold uppercase text-slate-500">Subject average</p><p className="mt-1 font-display text-xl font-extrabold text-navy-950">82%</p><p className="mt-2 text-sm text-slate-500">2 points above May</p></div>
            </div>
            <Link to="/portal/performance" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-skybrand-600">Review subject performance <ArrowUpRight size={16} /></Link>
          </Card>
        )}

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
          <Card>
            <SectionHeading title="Recent announcements" action={user.role !== 'Subject Teacher' ? <Link to="/portal/announcements" className="text-xs font-bold text-skybrand-600">Manage</Link> : null} />
            <div className="space-y-4">{announcements.slice(0, 3).map((item) => <div key={item.id} className="flex gap-3"><div className="rounded-xl bg-skybrand-50 p-2 text-skybrand-600"><Megaphone size={16} /></div><div><p className="text-sm font-semibold text-navy-950">{item.title}</p><p className="mt-1 text-xs text-slate-400">{formatDate(item.date)} • {item.category}</p></div></div>)}</div>
          </Card>
          <Card>
            <SectionHeading title="Upcoming events" action={user.role !== 'Subject Teacher' ? <Link to="/portal/events" className="text-xs font-bold text-skybrand-600">Calendar</Link> : null} />
            <div className="space-y-4">{events.slice(0, 3).map((item) => <div key={item.id} className="flex gap-3"><div className="rounded-xl bg-violet-50 p-2 text-violet-600"><CalendarDays size={16} /></div><div><p className="text-sm font-semibold text-navy-950">{item.title}</p><p className="mt-1 text-xs text-slate-400">{formatDate(item.date)} • {item.time}</p></div></div>)}</div>
          </Card>
        </div>
      </div>
    </>
  )
}
