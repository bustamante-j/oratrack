import { useEffect, useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, BookOpenCheck, CalendarCheck, FileText, ArrowLeftRight, ChartNoAxesCombined,
  Flag, Megaphone, CalendarDays, UserCog, Bot, Settings, Search, Menu, X,
  ChevronDown, LogOut, Home, Bell, PanelLeftClose, PanelLeftOpen,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Badge } from '../components/ui'
import BrandLogo from '../components/BrandLogo'

const navItems = [
  { to: '/portal/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Admin', 'Adviser', 'Subject Teacher'] },
  { to: '/portal/students', label: 'Student Records', icon: Users, roles: ['Admin', 'Adviser'] },
  { to: '/portal/performance', label: 'Academic Performance', icon: BookOpenCheck, roles: ['Admin', 'Adviser', 'Subject Teacher'] },
  { to: '/portal/attendance', label: 'Attendance', icon: CalendarCheck, roles: ['Admin', 'Adviser', 'Subject Teacher'] },
  { to: '/portal/reports', label: 'Monthly Reports', icon: FileText, roles: ['Admin', 'Adviser', 'Subject Teacher'] },
  { to: '/portal/transfers', label: 'Transfer Records', icon: ArrowLeftRight, roles: ['Admin'] },
  { to: '/portal/analytics', label: 'Analytics', icon: ChartNoAxesCombined, roles: ['Admin', 'Adviser', 'Subject Teacher'] },
  { to: '/portal/flagging', label: 'Student Flagging', icon: Flag, roles: ['Admin', 'Adviser'] },
  { to: '/portal/announcements', label: 'Announcements', icon: Megaphone, roles: ['Admin', 'Adviser'] },
  { to: '/portal/events', label: 'Event Calendar', icon: CalendarDays, roles: ['Admin', 'Adviser'] },
  { to: '/portal/teachers', label: 'Teacher Management', icon: UserCog, roles: ['Admin'] },
  { to: '/portal/ai-assistant', label: 'AI Assistant', icon: Bot, roles: ['Admin', 'Adviser', 'Subject Teacher'] },
  { to: '/portal/settings', label: 'Settings & Profile', icon: Settings, roles: ['Admin', 'Adviser', 'Subject Teacher'] },
]

function Sidebar({ mobile, open, setOpen, collapsed, setCollapsed }) {
  const { user } = useApp()
  const allowed = navItems.filter((item) => item.roles.includes(user.role))
  return (
    <aside className={`${mobile ? `fixed inset-y-0 left-0 z-[70] transition-transform lg:hidden ${open ? 'translate-x-0' : '-translate-x-full'}` : `fixed inset-y-0 left-0 z-50 hidden transition-all lg:flex ${collapsed ? 'w-20' : 'w-64'}`} flex-col overflow-hidden bg-gradient-to-b from-[#061a31] via-navy-950 to-[#092c50] text-white shadow-2xl`}>
      <div className="pointer-events-none absolute -left-24 top-1/3 h-52 w-52 rounded-full bg-skybrand-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-16 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />
      <div className={`flex h-20 items-center ${collapsed && !mobile ? 'justify-center px-3' : 'justify-between px-5'} border-b border-white/10`}>
        <div className="flex items-center gap-3">
          <BrandLogo compact inverse={true} className={collapsed && !mobile ? '[&>span:last-child]:hidden' : ''} />
        </div>
        {mobile && <button onClick={() => setOpen(false)} className="rounded-xl p-2 text-slate-300"><X size={20} /></button>}
      </div>
      <nav className="no-scrollbar relative flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {allowed.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to} to={to} onClick={() => mobile && setOpen(false)} title={collapsed && !mobile ? label : undefined}
            className={({ isActive }) => `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-gradient-to-r from-skybrand-500 to-blue-500 text-white shadow-lg shadow-skybrand-500/20' : 'text-slate-300 hover:translate-x-0.5 hover:bg-white/10 hover:text-white'} ${collapsed && !mobile ? 'justify-center' : ''}`}
          >
            <Icon size={19} className="shrink-0" />{(!collapsed || mobile) && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
      {!mobile && (
        <button onClick={() => setCollapsed(!collapsed)} className="m-3 flex items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-xs text-slate-300 hover:bg-white/10">
          {collapsed ? <PanelLeftOpen size={18} /> : <><PanelLeftClose size={18} /><span>Collapse menu</span></>}
        </button>
      )}
    </aside>
  )
}

export default function PortalLayout() {
  const { user, logout, settings } = useApp()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const current = useMemo(() => navItems.find((item) => location.pathname.startsWith(item.to)), [location.pathname])
  const date = new Intl.DateTimeFormat('en-PH', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date())

  useEffect(() => setProfileOpen(false), [location.pathname])

  const submitSearch = (event) => {
    event.preventDefault()
    if (query.trim()) navigate(`/portal/students?search=${encodeURIComponent(query.trim())}`)
  }

  return (
    <div className="portal-shell min-h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Sidebar mobile open={mobileOpen} setOpen={setMobileOpen} />
      {mobileOpen && <div className="fixed inset-0 z-[60] bg-navy-950/40 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />}
      <div className={`transition-all ${collapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-white/80 bg-white/80 px-4 shadow-[0_8px_30px_rgba(15,55,95,.04)] backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="rounded-xl p-2 text-navy-900 hover:bg-slate-100 lg:hidden" aria-label="Open navigation"><Menu size={22} /></button>
            <div className="hidden sm:block">
              <p className="text-xs text-slate-500">{date}</p>
              <p className="font-display text-sm font-bold text-navy-950">{current?.label || 'Teacher Portal'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <form onSubmit={submitSearch} className="relative hidden md:block">
              <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} className="w-56 rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-skybrand-400" placeholder="Search students" aria-label="Search students" />
            </form>
            <button className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100" aria-label="Notifications"><Bell size={19} /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" /></button>
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 pr-2 transition hover:bg-slate-50">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-navy-900 text-xs font-bold text-white">{(settings.displayName || user.name).split(' ').map((part) => part[0]).slice(0, 2).join('')}</div>
                <div className="hidden text-left xl:block"><p className="max-w-36 truncate text-xs font-bold text-navy-950">{settings.displayName || user.name}</p><p className="text-[10px] text-slate-500">{user.role}</p></div>
                <ChevronDown size={14} className="hidden text-slate-400 sm:block" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                  <div className="border-b border-slate-100 px-3 py-2"><Badge tone="sky">{user.role}</Badge><p className="mt-2 truncate text-xs text-slate-500">{user.email}</p></div>
                  <button onClick={() => navigate('/portal/settings')} className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"><Settings size={16} />Profile settings</button>
                  <button onClick={() => navigate('/')} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"><Home size={16} />Public website</button>
                  <button onClick={() => { logout(); navigate('/login') }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"><LogOut size={16} />Log out</button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className={`mx-auto max-w-[1600px] p-4 sm:p-6 ${settings.density === 'compact' ? 'lg:p-6' : 'lg:p-8'}`}><Outlet /></main>
      </div>
    </div>
  )
}
