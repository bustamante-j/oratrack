import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, Sparkles, Check } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { credentials } from '../data/mockData'
import { Badge, Button } from '../components/ui'
import campusHero from '../assets/balili-campus-hero.webp'
import BrandLogo from '../components/BrandLogo'

export default function LoginPage() {
  const { login } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    window.setTimeout(() => {
      const result = login(email.trim(), password)
      setLoading(false)
      if (result.ok) navigate(location.state?.from || '/portal/dashboard', { replace: true })
      else setError(result.message)
    }, 450)
  }

  const fillCredentials = (item) => {
    setEmail(item.email)
    setPassword(item.password)
    setError('')
  }

  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[1.05fr_.95fr]">
      <section className="hero-noise relative hidden overflow-hidden bg-navy-950 p-12 text-white lg:flex lg:flex-col">
        <img src={campusHero} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/75 via-navy-950/85 to-navy-950" />
        <div className="absolute inset-0 public-grid opacity-10" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-skybrand-500/20 blur-3xl" />
        <BrandLogo inverse className="relative" />
        <div className="relative my-auto max-w-xl rounded-[2rem] border border-white/10 bg-navy-950/35 p-8 backdrop-blur-sm">
          <Badge tone="sky" className="bg-white/10 text-skybrand-200">Balili Elementary School</Badge>
          <h1 className="mt-7 font-display text-5xl font-extrabold leading-tight">One clear view of every learner’s journey.</h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">Track progress, notice support needs, and turn daily school records into thoughtful action.</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {['Student-centered insights', 'Explainable risk flags', 'Fast monthly reports', 'Shared school updates'].map((item) => <div key={item} className="flex items-center gap-3 text-sm font-semibold"><span className="grid h-7 w-7 place-items-center rounded-lg bg-skybrand-500/20 text-skybrand-300"><Check size={15} /></span>{item}</div>)}
          </div>
        </div>
        <div className="relative flex items-center gap-2 text-xs text-slate-400"><ShieldCheck size={16} />Demo data only. No live student information.</div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-xl">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-navy-900"><ArrowLeft size={17} />Back to school website</Link>
          <BrandLogo compact className="mb-7 lg:hidden" />
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-navy-950">Welcome back, educator</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">Sign in with one of the demo accounts to open the teacher portal.</p>
          <form onSubmit={submit} className="mt-7 space-y-4">
            <label className="block">
              <span className="label">Email address</span>
              <span className="relative block">
                <Mail size={18} className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input className="input !py-3 !pl-12 !pr-4" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="teacher@oratrack.edu.ph" autoComplete="email" required />
              </span>
            </label>
            <label className="block">
              <span className="label">Password</span>
              <span className="relative block">
                <LockKeyhole size={18} className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input className="input !py-3 !pl-12 !pr-14" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" autoComplete="current-password" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2.5 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </span>
            </label>
            {error && <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</div>}
            <Button type="submit" variant="sky" size="lg" className="w-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign in to ORATRACK'}</Button>
          </form>

          <div className="mt-8 rounded-2xl border border-skybrand-200 bg-skybrand-50/60 p-5">
            <div className="flex items-center gap-2"><Sparkles size={17} className="text-skybrand-600" /><h2 className="text-sm font-bold text-navy-950">Demo credentials</h2></div>
            <p className="mt-1 text-xs text-slate-500">Select an account to fill the login form.</p>
            <div className="mt-4 space-y-2">
              {credentials.map((item) => (
                <button type="button" key={item.role} onClick={() => fillCredentials(item)} className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-skybrand-300 hover:shadow-sm">
                  <div className="min-w-0"><p className="text-xs font-bold text-navy-950">{item.role}</p><p className="mt-0.5 truncate text-[11px] text-slate-500">{item.email}</p></div>
                  <code className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">{item.password}</code>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
