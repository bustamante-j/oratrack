import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  Menu, X, MapPin, Phone, Mail, Facebook, ArrowUpRight,
  Clock3, ChevronRight, Instagram, Youtube, Heart,
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import BrandLogo from '../components/BrandLogo'

const links = [
  ['/', 'Home'], ['/about', 'About'], ['/announcements', 'News'],
  ['/events', 'Events'], ['/programs', 'Programs'], ['/contact', 'Contact'],
]

export default function PublicLayout() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  useEffect(() => {
    setOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  return (
    <div className="min-h-screen overflow-hidden bg-white text-slate-800">
      <div className="relative z-[60] bg-navy-950 text-white">
        <div className="mx-auto flex min-h-10 max-w-7xl items-center justify-between gap-4 px-4 py-2 text-[11px] sm:px-6 lg:px-8">
          <p className="flex min-w-0 items-center gap-2 text-slate-300">
            <MapPin size={13} className="shrink-0 text-skybrand-400" />
            <span className="truncate">Purok 3, Balili, La Trinidad, Benguet</span>
          </p>
          <div className="hidden items-center gap-5 sm:flex">
            <span className="flex items-center gap-2 text-slate-300"><Clock3 size={13} className="text-skybrand-400" />Mon to Fri, 7:30 AM to 5:00 PM</span>
            <a href="tel:+63744220186" className="flex items-center gap-2 font-semibold text-white hover:text-skybrand-300"><Phone size={13} /> (074) 422-0186</a>
          </div>
        </div>
      </div>

      <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${scrolled ? 'border-slate-200/80 bg-white/95 shadow-[0_10px_35px_rgba(7,27,51,.08)] backdrop-blur-xl' : 'border-slate-200/60 bg-white'}`}>
        <div className={`mx-auto flex max-w-7xl items-center justify-between px-4 transition-all sm:px-6 lg:px-8 ${scrolled ? 'h-[72px]' : 'h-[88px]'}`}>
          <Link to="/" className="group flex items-center gap-3" aria-label="ORATRACK home">
            <BrandLogo className="transition duration-300 group-hover:-translate-y-0.5" />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {links.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `relative rounded-xl px-4 py-2.5 text-sm font-semibold transition ${isActive ? 'text-skybrand-600' : 'text-slate-600 hover:bg-slate-50 hover:text-navy-900'}`}
              >
                {({ isActive }) => <>{label}{isActive && <motion.span layoutId="public-nav" className="absolute inset-x-4 -bottom-1 h-0.5 rounded-full bg-skybrand-500" />}</>}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link to="/contact" className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-500 transition hover:text-navy-900">School office</Link>
            <Link to="/login" className="group inline-flex items-center gap-2 rounded-xl bg-navy-900 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-navy-900/15 transition hover:-translate-y-0.5 hover:bg-skybrand-600 hover:shadow-skybrand-500/25">
              Teacher Portal <ArrowUpRight size={16} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
          <button className="rounded-xl border border-slate-200 p-2.5 text-navy-900 lg:hidden" onClick={() => setOpen(!open)} aria-label="Open menu">{open ? <X /> : <Menu />}</button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-slate-100 bg-white px-4 lg:hidden"
            >
              <div className="space-y-1 py-4">
                {links.map(([to, label]) => <NavLink key={to} to={to} className={({ isActive }) => `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold ${isActive ? 'bg-skybrand-50 text-skybrand-600' : 'text-slate-700 hover:bg-slate-50'}`}>{label}<ChevronRight size={16} /></NavLink>)}
                <Link to="/login" className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-navy-900 px-4 py-3 text-sm font-bold text-white">Teacher Portal <ArrowUpRight size={16} /></Link>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main><Outlet /></main>

      <footer className="relative overflow-hidden bg-navy-950 text-white">
        <div className="absolute inset-0 public-grid opacity-10" />
        <div className="absolute -right-48 -top-48 h-96 w-96 rounded-full bg-skybrand-500/15 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-8">
          <div className="mb-14 grid gap-8 rounded-[2rem] border border-white/10 bg-white/[.06] p-7 backdrop-blur-md md:grid-cols-[1fr_auto] md:items-center lg:p-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-skybrand-300">Stay connected</p>
              <h2 className="mt-3 text-balance font-display text-2xl font-extrabold sm:text-3xl">School news, learner milestones, and community stories.</h2>
            </div>
            <Link to="/announcements" className="inline-flex w-fit items-center gap-2 rounded-xl bg-skybrand-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-skybrand-400">Read school updates <ArrowUpRight size={16} /></Link>
          </div>

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.35fr_.8fr_1fr_.8fr]">
            <div>
              <BrandLogo inverse />
              <p className="mt-5 max-w-sm text-sm leading-7 text-slate-300">A clearer, warmer digital home for Balili Elementary School, built around learner growth and community connection.</p>
              <div className="mt-5 flex gap-2">{[Facebook, Instagram, Youtube].map((Icon, index) => <a key={index} href="#" aria-label="School social page" className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:-translate-y-0.5 hover:border-skybrand-400 hover:bg-skybrand-500 hover:text-white"><Icon size={17} /></a>)}</div>
            </div>
            <div>
              <h3 className="font-display text-sm font-bold">Explore</h3>
              <div className="mt-5 space-y-3">{links.slice(1).map(([to, label]) => <Link key={to} to={to} className="group flex items-center gap-2 text-sm text-slate-300 hover:text-white"><ChevronRight size={14} className="text-skybrand-400 transition group-hover:translate-x-1" />{label}</Link>)}</div>
            </div>
            <div>
              <h3 className="font-display text-sm font-bold">Contact the school</h3>
              <div className="mt-5 space-y-4 text-sm text-slate-300">
                <p className="flex gap-3"><MapPin size={18} className="shrink-0 text-skybrand-400" />Purok 3, Balili, La Trinidad, Benguet 2601</p>
                <a href="tel:+63744220186" className="flex gap-3 hover:text-white"><Phone size={18} className="text-skybrand-400" />(074) 422-0186</a>
                <a href="mailto:hello@balilies.edu.ph" className="flex gap-3 hover:text-white"><Mail size={18} className="text-skybrand-400" />hello@balilies.edu.ph</a>
              </div>
            </div>
            <div>
              <h3 className="font-display text-sm font-bold">School hours</h3>
              <p className="mt-5 text-sm leading-7 text-slate-300">Monday to Friday<br /><span className="font-semibold text-white">7:30 AM to 5:00 PM</span></p>
              <p className="mt-5 flex items-center gap-2 text-xs text-slate-400"><Heart size={14} className="text-rose-400" />Made for the Balili community</p>
            </div>
          </div>
          <div className="mt-14 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-400 sm:flex-row">
            <p>© 2026 Balili Elementary School. ORATRACK prototype.</p>
            <p>Demo content for presentation purposes.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
