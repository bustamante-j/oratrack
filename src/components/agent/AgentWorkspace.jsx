import { useEffect, useRef, useState } from 'react'
import {
  Robot, PaperPlaneTilt, Sparkle, Lightning, CheckCircle, XCircle, ClockCounterClockwise,
  Trash, ShieldCheck, Brain, Student, CalendarDots, MegaphoneSimple, ChartLineUp,
  PencilSimpleLine, CaretRight, Database, MagicWand,
} from '@phosphor-icons/react'
import { useApp } from '../../context/AppContext'
import { Badge, Button } from '../ui'

const prompts = [
  { icon: ChartLineUp, text: 'Give me a short school performance summary' },
  { icon: Student, text: 'Show me the high-risk students and explain why' },
  { icon: MegaphoneSimple, text: 'Create an announcement titled Family Reading Day on 2026-08-18' },
  { icon: CalendarDots, text: 'Create an event titled Science Discovery Day on 2026-08-22' },
]

const actionMeta = {
  create_announcement: { label: 'Announcement', icon: MegaphoneSimple, tone: 'sky' },
  create_event: { label: 'Calendar event', icon: CalendarDots, tone: 'purple' },
  update_grade: { label: 'Grade update', icon: PencilSimpleLine, tone: 'amber' },
  mark_attendance: { label: 'Attendance entry', icon: CheckCircle, tone: 'green' },
  add_behavior_note: { label: 'Behavior note', icon: Student, tone: 'amber' },
  update_student_status: { label: 'Student status', icon: Student, tone: 'red' },
}

function AgentActionCard({ action }) {
  const { executeAgentAction, dismissAgentAction } = useApp()
  const [notice, setNotice] = useState('')
  const meta = actionMeta[action.type] || { label: 'Data action', icon: Lightning, tone: 'sky' }
  const Icon = meta.icon
  const applied = action.status === 'applied'
  const dismissed = action.status === 'dismissed'

  const apply = () => {
    const result = executeAgentAction(action)
    setNotice(result.message)
  }

  return (
    <div className={`rounded-2xl border p-4 ${applied ? 'border-emerald-200 bg-emerald-50/70' : dismissed ? 'border-slate-200 bg-slate-50 opacity-70' : 'border-skybrand-200 bg-white shadow-sm'}`}>
      <div className="flex items-start gap-3">
        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${applied ? 'bg-emerald-500 text-white' : 'bg-navy-900 text-white'}`}>
          {applied ? <CheckCircle size={20} weight="duotone" /> : <Icon size={20} weight="duotone" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <Badge tone={applied ? 'green' : dismissed ? 'slate' : meta.tone}>{applied ? 'Applied' : dismissed ? 'Dismissed' : meta.label}</Badge>
            {!applied && !dismissed && <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Review first</span>}
          </div>
          <p className="mt-2 text-sm font-semibold leading-6 text-navy-950">{action.summary}</p>
          {Object.keys(action.payload || {}).length > 0 && (
            <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
              {Object.entries(action.payload).slice(0, 5).map(([key, value]) => <p key={key} className="mb-1 last:mb-0"><span className="font-semibold capitalize">{key.replaceAll('_', ' ')}:</span> {String(value)}</p>)}
            </div>
          )}
          {notice && <p className="mt-2 text-xs font-semibold text-emerald-700">{notice}</p>}
          {!applied && !dismissed && (
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="sky" onClick={apply}><CheckCircle size={15} weight="bold" />Apply change</Button>
              <Button size="sm" variant="ghost" onClick={() => dismissAgentAction(action.id)}><XCircle size={15} />Dismiss</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AgentWorkspace({ compact = false }) {
  const {
    agentMessages, agentActions, agentAudit, agentBusy, askAgent, clearAgentConversation,
  } = useApp()
  const [input, setInput] = useState('')
  const [tab, setTab] = useState('chat')
  const messagesEnd = useRef(null)
  const pendingActions = agentActions.filter((action) => action.status === 'pending')
  const latestMode = [...agentMessages].reverse().find((message) => message.role === 'assistant')?.mode || 'local'

  useEffect(() => {
    if (tab === 'chat') messagesEnd.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [agentMessages, tab])

  const submit = async (event) => {
    event?.preventDefault()
    const value = input.trim()
    if (!value || agentBusy) return
    setInput('')
    await askAgent(value)
  }

  return (
    <div className={`flex h-full min-h-0 flex-col overflow-hidden bg-white ${compact ? '' : 'rounded-3xl border border-slate-200 shadow-soft'}`}>
      <div className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-navy-950 via-navy-900 to-skybrand-600 px-5 py-5 text-white">
        <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-white text-navy-950 shadow-lg">
              <Robot size={27} weight="duotone" />
              <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-navy-900 bg-emerald-400" />
            </div>
            <div><p className="font-display text-lg font-extrabold">ORA Agent</p><p className="text-xs text-skybrand-100">{latestMode === 'openai' ? 'OpenAI connected' : 'Local demo intelligence'} • Full demo-data access</p></div>
          </div>
          <button onClick={clearAgentConversation} className={`rounded-xl border border-white/15 bg-white/10 p-2 text-slate-200 transition hover:bg-white/20 hover:text-white ${compact ? 'mr-10' : ''}`} title="Clear conversation"><Trash size={18} /></button>
        </div>
        <div className="relative mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.08] px-3 py-2 text-[11px] text-slate-200">
          <ShieldCheck size={16} weight="duotone" className="text-emerald-300" />
          Data changes appear as reviewable actions before they are applied.
        </div>
      </div>

      <div className="grid grid-cols-3 border-b border-slate-100 bg-white px-3 pt-2">
        {[
          ['chat', 'Chat', Brain],
          ['actions', `Actions${pendingActions.length ? ` (${pendingActions.length})` : ''}`, Lightning],
          ['activity', 'Activity', ClockCounterClockwise],
        ].map(([value, label, Icon]) => <button key={value} onClick={() => setTab(value)} className={`relative flex items-center justify-center gap-1.5 px-2 py-3 text-xs font-bold transition ${tab === value ? 'text-skybrand-600' : 'text-slate-400 hover:text-slate-700'}`}><Icon size={16} weight={tab === value ? 'duotone' : 'regular'} />{label}{tab === value && <span className="absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-skybrand-500" />}</button>)}
      </div>

      {tab === 'chat' && (
        <>
          <div className="no-scrollbar flex-1 overflow-y-auto bg-slate-50/70 p-4">
            {agentMessages.length <= 1 && (
              <div className="mb-5">
                <p className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-slate-400"><Sparkle size={14} weight="fill" className="text-skybrand-500" />Try asking</p>
                <div className="grid gap-2">
                  {prompts.map(({ icon: Icon, text }) => <button key={text} onClick={() => askAgent(text)} className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-left text-xs font-semibold leading-5 text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-skybrand-300 hover:text-navy-950"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-skybrand-50 text-skybrand-600"><Icon size={18} weight="duotone" /></span><span className="flex-1">{text}</span><CaretRight size={14} className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-skybrand-500" /></button>)}
                </div>
              </div>
            )}
            <div className="space-y-4">
              {agentMessages.map((message) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${message.role === 'user' ? 'rounded-br-md bg-navy-900 text-white' : 'rounded-bl-md border border-slate-200 bg-white text-slate-700'}`}>
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    {message.role === 'assistant' && <p className="mt-2 flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-slate-400"><Database size={11} />{message.mode === 'openai' ? message.model || 'OpenAI' : 'Local agent'}</p>}
                  </div>
                </div>
              ))}
              {agentBusy && <div className="flex justify-start"><div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-500 shadow-sm"><MagicWand size={16} weight="duotone" className="animate-pulse text-skybrand-500" />Analyzing ORATRACK data...</div></div>}
              <div ref={messagesEnd} />
            </div>
          </div>
          <form onSubmit={submit} className="border-t border-slate-100 bg-white p-4">
            <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 transition focus-within:border-skybrand-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-skybrand-100">
              <textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); submit() } }} rows={1} className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400" placeholder="Ask ORA or request a change..." aria-label="Message ORA agent" />
              <button type="submit" disabled={!input.trim() || agentBusy} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-skybrand-500 text-white shadow-md transition hover:bg-skybrand-600 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Send message"><PaperPlaneTilt size={18} weight="fill" /></button>
            </div>
            <p className="mt-2 text-center text-[10px] text-slate-400">Enter to send • Shift + Enter for a new line</p>
          </form>
        </>
      )}

      {tab === 'actions' && (
        <div className="no-scrollbar flex-1 space-y-3 overflow-y-auto bg-slate-50/70 p-4">
          {agentActions.length ? agentActions.map((action) => <AgentActionCard key={action.id} action={action} />) : <div className="flex h-full flex-col items-center justify-center p-8 text-center"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-skybrand-50 text-skybrand-600"><Lightning size={25} weight="duotone" /></div><p className="mt-4 font-bold text-navy-950">No proposed actions</p><p className="mt-1 max-w-xs text-sm leading-6 text-slate-500">Ask ORA to update a grade, mark attendance, add a note, or create school content.</p></div>}
        </div>
      )}

      {tab === 'activity' && (
        <div className="no-scrollbar flex-1 overflow-y-auto bg-slate-50/70 p-4">
          {agentAudit.length ? <div className="space-y-3">{agentAudit.map((item) => <div key={item.id} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4"><div className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg ${item.type === 'action' ? 'bg-emerald-50 text-emerald-600' : 'bg-skybrand-50 text-skybrand-600'}`}>{item.type === 'action' ? <CheckCircle size={17} weight="duotone" /> : <Brain size={17} weight="duotone" />}</div><div className="min-w-0"><p className="truncate text-xs font-bold capitalize text-navy-950">{item.label}</p><p className="mt-1 text-xs text-slate-500">{item.detail}</p><p className="mt-2 text-[10px] text-slate-400">{new Date(item.createdAt).toLocaleString('en-PH')}</p></div></div>)}</div> : <div className="flex h-full flex-col items-center justify-center text-center"><ClockCounterClockwise size={30} className="text-slate-300" /><p className="mt-3 text-sm font-semibold text-slate-500">Agent activity will appear here.</p></div>}
        </div>
      )}
    </div>
  )
}
