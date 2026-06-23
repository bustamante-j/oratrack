import { useMemo, useState } from 'react'
import {
  Bot, Edit3, GraduationCap, MessageCircle, Plus, RotateCcw, Save, Send, Settings2,
  Sparkles, Trash2, UserCog, UserRoundCheck,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { averageGrade, getRisk } from '../../utils/risk'
import { Badge, Button, Card, Field, Modal, PageHeader, Select, StatCard } from '../../components/ui'
import AgentWorkspace from '../../components/agent/AgentWorkspace'

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

export function AIAssistantPage() {
  return (
    <>
      <PageHeader eyebrow="AI operations workspace" title="ORA AI Agent" description="Analyze every demo record, draft teacher work, and prepare safe, reviewable changes across ORATRACK." />
      <div className="h-[calc(100vh-190px)] min-h-[680px]"><AgentWorkspace /></div>
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
