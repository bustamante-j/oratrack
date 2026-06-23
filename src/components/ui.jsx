import { X, ArrowRight, Sparkles } from 'lucide-react'

export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function Button({ children, variant = 'primary', size = 'md', className = '', type = 'button', ...props }) {
  const variants = {
    primary: 'bg-navy-900 text-white hover:bg-navy-800 shadow-sm',
    sky: 'bg-skybrand-500 text-white hover:bg-skybrand-600 shadow-sm',
    secondary: 'border border-slate-200 bg-white text-slate-700 hover:border-skybrand-300 hover:bg-skybrand-50',
    ghost: 'text-slate-600 hover:bg-slate-100',
    danger: 'bg-rose-50 text-rose-700 hover:bg-rose-100',
  }
  const sizes = { sm: 'px-3 py-2 text-xs', md: 'px-4 py-2.5 text-sm', lg: 'px-5 py-3 text-sm' }
  return (
    <button
      type={type}
      className={cn('inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition focus:outline-none focus:ring-4 focus:ring-skybrand-100 disabled:cursor-not-allowed disabled:opacity-50', variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  )
}

export function Card({ children, className = '', padding = true, ...props }) {
  return <section className={cn('card min-w-0', padding && 'p-5', className)} {...props}>{children}</section>
}

export function Badge({ children, tone = 'slate', className = '' }) {
  const tones = {
    slate: 'bg-slate-100 text-slate-700',
    sky: 'bg-skybrand-100 text-skybrand-600',
    navy: 'bg-navy-900 text-white',
    green: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-700',
    red: 'bg-rose-100 text-rose-700',
    purple: 'bg-violet-100 text-violet-700',
  }
  return <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold', tones[tone], className)}>{children}</span>
}

export function RiskBadge({ level }) {
  const tone = level === 'High' ? 'red' : level === 'Moderate' ? 'amber' : 'green'
  return <Badge tone={tone}>{level} Risk</Badge>
}

export function StatCard({ icon: Icon, label, value, detail, tone = 'sky' }) {
  const tones = {
    sky: 'bg-skybrand-50 text-skybrand-600',
    green: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-rose-50 text-rose-600',
    purple: 'bg-violet-50 text-violet-600',
    navy: 'bg-navy-900 text-white',
  }
  return (
    <Card className="group relative overflow-hidden hover:-translate-y-0.5 hover:border-skybrand-200 hover:shadow-[0_22px_55px_rgba(15,55,95,.12)]">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-skybrand-100/40 blur-2xl transition group-hover:scale-125" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-2 font-display text-2xl font-extrabold text-navy-950">{value}</p>
          {detail && <p className="mt-1 text-xs text-slate-500">{detail}</p>}
        </div>
        <div className={cn('relative rounded-2xl p-3 shadow-sm transition duration-300 group-hover:-rotate-3 group-hover:scale-110', tones[tone])}><Icon size={20} /></div>
      </div>
    </Card>
  )
}

export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow && <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-skybrand-600"><span className="h-px w-6 bg-skybrand-400" />{eyebrow}</p>}
        <h1 className="text-balance font-display text-2xl font-extrabold tracking-tight text-navy-950 sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2 print-hidden">{actions}</div>}
    </div>
  )
}

export function SectionHeading({ title, description, action }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <h2 className="font-display text-lg font-bold text-navy-950">{title}</h2>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function Modal({ open, onClose, title, children, footer, size = 'lg' }) {
  if (!open) return null
  const sizes = { md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-navy-950/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className={cn('max-h-[92vh] w-full overflow-hidden rounded-3xl bg-white shadow-2xl', sizes[size])}>
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="font-display text-lg font-bold text-navy-950">{title}</h2>
          <button onClick={onClose} className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label="Close modal"><X size={20} /></button>
        </div>
        <div className="max-h-[calc(92vh-130px)] overflow-y-auto p-5">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50 px-5 py-4">{footer}</div>}
      </div>
    </div>
  )
}

export function EmptyState({ title = 'No results found', description = 'Try changing your search or filters.' }) {
  return (
    <div className="flex min-h-52 flex-col items-center justify-center p-8 text-center">
      <div className="mb-3 rounded-2xl bg-slate-100 p-3 text-slate-400"><Sparkles size={22} /></div>
      <p className="font-semibold text-slate-700">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
    </div>
  )
}

export function AIInsightCard({ title, text, action }) {
  return (
    <div className="rounded-2xl border border-skybrand-200 bg-gradient-to-br from-skybrand-50 to-white p-4">
      <div className="flex gap-3">
        <div className="h-fit rounded-xl bg-navy-900 p-2 text-white"><Sparkles size={16} /></div>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-skybrand-600">{title}</p>
          <p className="mt-1 text-sm leading-6 text-slate-700">{text}</p>
          {action && <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-navy-800">{action}<ArrowRight size={13} /></p>}
        </div>
      </div>
    </div>
  )
}

export function Field({ label, children }) {
  return <label className="block"><span className="label">{label}</span>{children}</label>
}

export function Select({ children, className = '', ...props }) {
  return <select className={cn('input', className)} {...props}>{children}</select>
}
