import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  CartesianGrid, XAxis, YAxis, Tooltip, Legend,
} from 'recharts'
import { Card, SectionHeading } from './ui'

const COLORS = ['#2ca7ed', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6', '#0b2447']

const tooltipStyle = {
  borderRadius: 14,
  border: '1px solid #e2e8f0',
  boxShadow: '0 12px 30px rgba(15, 55, 95, .12)',
  fontSize: 12,
}

export function ChartCard({ title, description, children, className = '' }) {
  return (
    <Card className={className}>
      <SectionHeading title={title} description={description} />
      <div className="h-64 w-full">{children}</div>
    </Card>
  )
}

export function AttendanceAreaChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ left: -20, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="attendanceFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2ca7ed" stopOpacity={0.32} />
            <stop offset="95%" stopColor="#2ca7ed" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8eef5" />
        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
        <YAxis domain={[85, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
        <Tooltip contentStyle={tooltipStyle} />
        <Area type="monotone" dataKey="rate" stroke="#1687ca" strokeWidth={3} fill="url(#attendanceFill)" name="Attendance %" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function SimpleBarChart({ data, dataKey, xKey = 'subject', color = '#2ca7ed', secondKey }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ left: -22, right: 8, top: 8 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8eef5" />
        <XAxis dataKey={xKey} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey={dataKey} fill={color} radius={[7, 7, 0, 0]} />
        {secondKey && <Bar dataKey={secondKey} fill="#0b2447" radius={[7, 7, 0, 0]} />}
      </BarChart>
    </ResponsiveContainer>
  )
}

export function TrendLineChart({ data, dataKey = 'average', xKey = 'month', secondKey }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ left: -22, right: 12, top: 8 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8eef5" />
        <XAxis dataKey={xKey} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
        <Line type="monotone" dataKey={dataKey} stroke="#2ca7ed" strokeWidth={3} dot={{ r: 3 }} />
        {secondKey && <Line type="monotone" dataKey={secondKey} stroke="#0b2447" strokeWidth={2} strokeDasharray="5 5" dot={false} />}
      </LineChart>
    </ResponsiveContainer>
  )
}

export function RiskPieChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={88} paddingAngle={4}>
          {data.map((entry, index) => <Cell key={entry.name} fill={COLORS[index + 1]} />)}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend iconType="circle" iconSize={9} wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}
