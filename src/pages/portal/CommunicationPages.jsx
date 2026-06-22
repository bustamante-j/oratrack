import { useState } from 'react'
import { CalendarDays, Edit3, Megaphone, Pin, Plus, Trash2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Badge, Button, Card, Field, Modal, PageHeader, Select } from '../../components/ui'

const blankAnnouncement = { title: '', category: 'School Update', date: '2026-06-22', audience: 'School community', content: '', pinned: false }
const blankEvent = { title: '', date: '2026-06-22', time: '8:00 AM', type: 'Academic', location: 'School Grounds', description: '' }
const formatDate = (date) => new Intl.DateTimeFormat('en-PH', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(`${date}T00:00:00`))

export function ManageAnnouncementsPage() {
  const { announcements, setAnnouncements } = useApp()
  const [editing, setEditing] = useState(null)

  const save = (event) => {
    event.preventDefault()
    setAnnouncements((current) => editing.id ? current.map((item) => item.id === editing.id ? editing : item) : [{ ...editing, id: `A-${Date.now()}` }, ...current])
    setEditing(null)
  }
  const remove = (item) => {
    if (window.confirm(`Delete the announcement "${item.title}"?`)) setAnnouncements((current) => current.filter((announcement) => announcement.id !== item.id))
  }

  return (
    <>
      <PageHeader eyebrow="Shared school updates" title="Announcements" description="Create updates that also appear on the public Balili Elementary School website." actions={<Button variant="sky" onClick={() => setEditing({ ...blankAnnouncement })}><Plus size={16} />New announcement</Button>} />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {announcements.map((item) => (
          <Card key={item.id} className="flex flex-col">
            <div className="flex items-start justify-between gap-3"><div className="flex gap-2"><Badge tone={item.category === 'Academic' ? 'purple' : item.category === 'Community' ? 'green' : 'sky'}>{item.category}</Badge>{item.pinned && <Badge tone="amber"><Pin size={12} className="mr-1" />Pinned</Badge>}</div><Megaphone size={19} className="text-slate-300" /></div>
            <h2 className="mt-5 font-display text-lg font-bold text-navy-950">{item.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">{item.content}</p>
            <div className="mt-5 border-t border-slate-100 pt-4"><p className="text-xs font-semibold text-slate-500">{formatDate(item.date)} • {item.audience}</p><div className="mt-3 flex gap-2"><Button size="sm" variant="secondary" onClick={() => setEditing({ ...item })}><Edit3 size={14} />Edit</Button><Button size="sm" variant="danger" onClick={() => remove(item)}><Trash2 size={14} />Delete</Button></div></div>
          </Card>
        ))}
      </div>
      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title={editing?.id ? 'Edit announcement' : 'New announcement'}>
        {editing && <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
          <Field label="Title"><input className="input" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} required /></Field>
          <Field label="Category"><Select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}><option>School Update</option><option>Academic</option><option>Student Activity</option><option>Community</option></Select></Field>
          <Field label="Publish date"><input className="input" type="date" value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} /></Field>
          <Field label="Audience"><input className="input" value={editing.audience} onChange={(e) => setEditing({ ...editing, audience: e.target.value })} /></Field>
          <Field label="Announcement text"><textarea className="input min-h-28 resize-y sm:col-span-2" value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} required /></Field>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 sm:col-span-2"><input type="checkbox" checked={editing.pinned} onChange={(e) => setEditing({ ...editing, pinned: e.target.checked })} className="h-4 w-4 rounded border-slate-300 text-skybrand-500" />Pin this announcement</label>
          <div className="flex justify-end gap-2 sm:col-span-2"><Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button><Button type="submit" variant="sky">Save announcement</Button></div>
        </form>}
      </Modal>
    </>
  )
}

export function ManageEventsPage() {
  const { events, setEvents } = useApp()
  const [editing, setEditing] = useState(null)

  const save = (event) => {
    event.preventDefault()
    setEvents((current) => editing.id ? current.map((item) => item.id === editing.id ? editing : item) : [...current, { ...editing, id: `E-${Date.now()}` }].sort((a, b) => a.date.localeCompare(b.date)))
    setEditing(null)
  }
  const remove = (item) => {
    if (window.confirm(`Delete the event "${item.title}"?`)) setEvents((current) => current.filter((event) => event.id !== item.id))
  }
  const monthGroups = events.reduce((groups, event) => {
    const key = new Date(`${event.date}T00:00:00`).toLocaleString('en-PH', { month: 'long', year: 'numeric' })
    groups[key] = [...(groups[key] || []), event]
    return groups
  }, {})

  return (
    <>
      <PageHeader eyebrow="School calendar" title="Event Calendar" description="Plan academic, family, student, and community activities that also appear on the public website." actions={<Button variant="sky" onClick={() => setEditing({ ...blankEvent })}><Plus size={16} />Add event</Button>} />
      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        <Card className="h-fit">
          <div className="rounded-2xl bg-navy-950 p-5 text-white"><p className="text-xs font-bold uppercase tracking-widest text-skybrand-300">June 2026</p><p className="mt-2 font-display text-3xl font-extrabold">22</p><p className="mt-1 text-sm text-slate-300">Monday</p></div>
          <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => <span key={`${day}-${index}`} className="py-2 font-bold text-slate-400">{day}</span>)}
            {Array.from({ length: 35 }, (_, index) => {
              const day = index - 1
              return <span key={index} className={`grid aspect-square place-items-center rounded-lg ${day === 22 ? 'bg-skybrand-500 font-bold text-white' : day > 0 && day <= 30 ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-200'}`}>{day > 0 && day <= 30 ? day : ''}</span>
            })}
          </div>
        </Card>
        <div className="space-y-8">
          {Object.entries(monthGroups).map(([month, items]) => <section key={month}><h2 className="mb-4 font-display text-xl font-extrabold text-navy-950">{month}</h2><div className="space-y-3">{items.map((item) => {
            const eventDate = new Date(`${item.date}T00:00:00`)
            return <Card key={item.id} className="flex flex-col gap-4 sm:flex-row sm:items-center"><div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-skybrand-50 text-center"><div><p className="text-[10px] font-bold uppercase text-skybrand-600">{eventDate.toLocaleString('en-PH', { month: 'short' })}</p><p className="font-display text-xl font-extrabold text-navy-950">{eventDate.getDate()}</p></div></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-display font-bold text-navy-950">{item.title}</h3><Badge tone="slate">{item.type}</Badge></div><p className="mt-1 text-sm text-slate-500">{item.time} • {item.location}</p><p className="mt-2 text-xs leading-5 text-slate-400">{item.description}</p></div><div className="flex gap-1"><button onClick={() => setEditing({ ...item })} className="rounded-lg p-2 text-skybrand-600 hover:bg-skybrand-50" aria-label={`Edit ${item.title}`}><Edit3 size={17} /></button><button onClick={() => remove(item)} className="rounded-lg p-2 text-rose-600 hover:bg-rose-50" aria-label={`Delete ${item.title}`}><Trash2 size={17} /></button></div></Card>
          })}</div></section>)}
        </div>
      </div>
      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title={editing?.id ? 'Edit event' : 'Add event'}>
        {editing && <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
          <Field label="Event title"><input className="input" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} required /></Field>
          <Field label="Event type"><Select value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value })}><option>Academic</option><option>Meeting</option><option>Student Activity</option><option>Community</option></Select></Field>
          <Field label="Date"><input className="input" type="date" value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} /></Field>
          <Field label="Time"><input className="input" value={editing.time} onChange={(e) => setEditing({ ...editing, time: e.target.value })} /></Field>
          <Field label="Location"><input className="input" value={editing.location} onChange={(e) => setEditing({ ...editing, location: e.target.value })} /></Field>
          <Field label="Description"><textarea className="input min-h-24 resize-y" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></Field>
          <div className="flex justify-end gap-2 sm:col-span-2"><Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button><Button type="submit" variant="sky">Save event</Button></div>
        </form>}
      </Modal>
    </>
  )
}
