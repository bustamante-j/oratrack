import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { DayPicker } from 'react-day-picker'
import { format, isSameDay, isSameMonth, parseISO } from 'date-fns'
import {
  BellRinging as PhBellRinging, CalendarDots as PhCalendarDots, Shapes as PhShapes,
  Buildings as PhBuildings, Books as PhBooks, BowlFood as PhBowlFood, SoccerBall as PhSoccerBall,
  PaintBrushBroad as PhPaintBrush, HandHeart as PhHandHeart, UsersThree as PhUsersThree,
} from '@phosphor-icons/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'react-day-picker/style.css'
import {
  ArrowRight, CalendarDays, Megaphone, Users, UserRoundCheck, BarChart3, Sparkles, BookOpen,
  HeartHandshake, ShieldCheck, Library, Utensils, Dumbbell, Palette, MapPin, Phone, Mail, Clock,
  CheckCircle2, Quote, School, Target, Eye, ChevronRight, BellRing, FileText, Send,
  Award, BookHeart, Leaf, Play, ArrowUpRight, Star, BadgeCheck, CalendarClock, CircleCheck,
  Search, Pin, Bookmark, Download, CalendarPlus, ClipboardCheck, Lightbulb, HandHeart,
  BookMarked, Trophy, Apple, Music2, UsersRound, Check, Clock3, Share2,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Badge, Button, Card, EmptyState, Modal } from '../../components/ui'
import { AnimatedNumber, Reveal } from '../../components/motion'
import campusHero from '../../assets/balili-campus-hero.webp'
import classroomPhoto from '../../assets/balili-classroom.webp'
import programReading from '../../assets/program-reading.webp'
import programSports from '../../assets/program-sports.webp'
import programNutrition from '../../assets/program-nutrition.webp'
import programArts from '../../assets/program-arts.webp'
import sectionSupport from '../../assets/section-support.webp'
import sectionFamily from '../../assets/section-family.webp'
import sectionNews from '../../assets/section-news.webp'
import sectionEvents from '../../assets/section-events.webp'
import sectionAbout from '../../assets/section-about.webp'
import aboutHistory from '../../assets/about-history.webp'
import newsFeature from '../../assets/news-feature.webp'
import programsHero from '../../assets/programs-hero.webp'

const formatDate = (date) => new Intl.DateTimeFormat('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${date}T00:00:00`))

const quickLinks = [
  { to: '/announcements', label: 'School News', text: 'Read the latest updates', icon: PhBellRinging, color: 'from-skybrand-500 to-blue-600' },
  { to: '/events', label: 'Events Calendar', text: 'See what is coming up', icon: PhCalendarDots, color: 'from-violet-500 to-indigo-600' },
  { to: '/programs', label: 'Programs', text: 'Explore learner support', icon: PhShapes, color: 'from-emerald-500 to-teal-600' },
  { to: '/contact', label: 'School Office', text: 'Contact our team', icon: PhBuildings, color: 'from-amber-500 to-orange-600' },
]

const programs = [
  { icon: PhBooks, image: programReading, title: 'Reading and Literacy', short: 'Build confident, joyful readers', text: 'Guided reading, buddy sessions, and inviting classroom libraries help every child become a confident reader.', color: 'bg-skybrand-500', tint: 'from-skybrand-50 to-white', stat: '3x weekly', statLabel: 'guided reading', highlights: ['Reading buddy sessions', 'Classroom book corners', 'Family reading prompts'] },
  { icon: PhBowlFood, image: programNutrition, title: 'School Nutrition', short: 'Healthy bodies, ready minds', text: 'Nutrition education and feeding support help learners stay healthy, active, and ready to learn.', color: 'bg-emerald-500', tint: 'from-emerald-50 to-white', stat: '5 days', statLabel: 'wellness support', highlights: ['Healthy meal lessons', 'Growth monitoring', 'Family nutrition tips'] },
  { icon: PhSoccerBall, image: programSports, title: 'Sports and Wellness', short: 'Move, play, and grow together', text: 'Movement, team activities, and wellness lessons build healthy habits and joyful confidence.', color: 'bg-violet-500', tint: 'from-violet-50 to-white', stat: '6 clubs', statLabel: 'active pathways', highlights: ['Team sports', 'Movement breaks', 'Wellness challenges'] },
  { icon: PhPaintBrush, image: programArts, title: 'Arts and Culture', short: 'Create with pride and imagination', text: 'Music, visual arts, dance, and local traditions give learners more ways to express themselves.', color: 'bg-rose-500', tint: 'from-rose-50 to-white', stat: '4 areas', statLabel: 'creative expression', highlights: ['Music and movement', 'Visual arts', 'Local culture projects'] },
  { icon: PhHandHeart, image: sectionSupport, title: 'Learner Support', short: 'Timely care for every learner', text: 'Teachers coordinate remediation, family follow-ups, and practical classroom interventions.', color: 'bg-amber-500', tint: 'from-amber-50 to-white', stat: 'Weekly', statLabel: 'progress reviews', highlights: ['Focused remediation', 'Attendance follow-up', 'Individual action plans'] },
  { icon: PhUsersThree, image: sectionFamily, title: 'Family Partnerships', short: 'Families belong in school life', text: 'Regular meetings and volunteer programs make families active partners in school life.', color: 'bg-blue-600', tint: 'from-blue-50 to-white', stat: 'Monthly', statLabel: 'family touchpoints', highlights: ['Parent conferences', 'Volunteer days', 'Home learning guides'] },
]

function PublicHero({ eyebrow, title, description, image = campusHero, children }) {
  return (
    <section className="hero-noise relative min-h-[470px] overflow-hidden bg-navy-950 text-white sm:min-h-[540px]">
      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
      <div className="relative mx-auto flex min-h-[470px] max-w-7xl items-center px-4 py-20 sm:min-h-[540px] sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <Reveal>
            <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[.22em] text-skybrand-300"><span className="h-px w-10 bg-skybrand-400" />{eyebrow}</p>
            <h1 className="text-balance mt-5 font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">{title}</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">{description}</p>
            {children}
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function AnnouncementCard({ item, featured = false, onOpen }) {
  const categoryMeta = {
    Academic: { icon: BookOpen, tone: 'purple', gradient: 'from-violet-500 to-indigo-600' },
    Community: { icon: HeartHandshake, tone: 'green', gradient: 'from-emerald-500 to-teal-600' },
    'Student Activity': { icon: Sparkles, tone: 'amber', gradient: 'from-amber-400 to-orange-500' },
    'School Update': { icon: Megaphone, tone: 'sky', gradient: 'from-skybrand-500 to-blue-600' },
  }
  const meta = categoryMeta[item.category] || categoryMeta['School Update']
  const Icon = meta.icon
  return (
    <article className={`group relative flex h-full flex-col overflow-hidden rounded-[1.6rem] border bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(15,55,95,.13)] ${featured ? 'border-skybrand-200 shadow-soft' : 'border-slate-200'}`}>
      <div className={`relative h-32 overflow-hidden bg-gradient-to-br ${meta.gradient}`}>
        <div className="absolute inset-0 public-grid opacity-20" />
        <Icon size={78} strokeWidth={1.2} className="absolute -bottom-3 -right-2 rotate-[-8deg] text-white/20 transition duration-500 group-hover:rotate-0 group-hover:scale-110" />
        <div className="absolute left-5 top-5 grid h-11 w-11 place-items-center rounded-2xl bg-white/15 text-white backdrop-blur-md"><Icon size={21} /></div>
        {item.pinned && <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-navy-950"><Pin size={11} />Important</span>}
        <p className="absolute bottom-4 left-5 text-xs font-bold uppercase tracking-[.15em] text-white/90">{item.category}</p>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <Badge tone={meta.tone}>{item.audience}</Badge>
          <span className="text-xs font-semibold text-slate-400">{formatDate(item.date)}</span>
        </div>
        <h3 className="mt-5 font-display text-xl font-extrabold leading-snug text-navy-950 transition group-hover:text-skybrand-600">{item.title}</h3>
        <p className="mt-3 flex-1 text-sm leading-7 text-slate-500">{item.content}</p>
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400"><Clock3 size={13} />2 min read</span>
          {onOpen
            ? <button onClick={() => onOpen(item)} className="inline-flex items-center gap-2 text-xs font-bold text-skybrand-600 transition hover:text-navy-900">Read update <ArrowRight size={14} /></button>
            : <Link to="/announcements" className="inline-flex items-center gap-2 text-xs font-bold text-skybrand-600 transition hover:text-navy-900">Read update <ArrowRight size={14} /></Link>}
        </div>
      </div>
    </article>
  )
}

function EventCard({ item, index = 0 }) {
  const date = new Date(`${item.date}T00:00:00`)
  const colors = ['bg-skybrand-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500']
  return (
    <div className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition duration-300 hover:-translate-y-0.5 hover:border-skybrand-300 hover:shadow-soft">
      <div className={`flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl text-center text-white shadow-md ${colors[index % colors.length]}`}>
        <span className="text-[10px] font-bold uppercase tracking-wider">{date.toLocaleString('en-PH', { month: 'short' })}</span>
        <span className="font-display text-2xl font-extrabold">{date.getDate()}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-skybrand-600">{item.type}</p>
        <h3 className="mt-1 truncate font-display font-bold text-navy-950">{item.title}</h3>
        <p className="mt-1 text-xs text-slate-500">{item.time} • {item.location}</p>
      </div>
      <ChevronRight size={18} className="mt-5 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-skybrand-500" />
    </div>
  )
}

export function HomePage() {
  const { students, teachers, announcements, events } = useApp()

  return (
    <>
      <section className="hero-noise relative min-h-[720px] overflow-hidden bg-navy-950 text-white lg:min-h-[800px]">
        <motion.img initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 1.5, ease: 'easeOut' }} src={campusHero} alt="Learners arriving at Balili Elementary School" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/82 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/75 via-transparent to-navy-950/10" />
        <div className="absolute left-[44%] top-[20%] h-72 w-72 rounded-full bg-skybrand-400/20 blur-3xl" />
        <div className="relative mx-auto flex min-h-[720px] max-w-7xl items-center px-4 pb-36 pt-20 sm:px-6 lg:min-h-[800px] lg:px-8">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[.16em] text-skybrand-200 backdrop-blur-md"><Sparkles size={14} />Welcome to Balili Elementary School</span>
              <h1 className="text-balance mt-7 font-display text-5xl font-extrabold leading-[.98] tracking-[-.045em] sm:text-6xl lg:text-[5.4rem]">
                Growing minds.<br /><span className="bg-gradient-to-r from-skybrand-300 to-white bg-clip-text text-transparent">Building bright futures.</span>
              </h1>
              <p className="mt-7 max-w-xl text-base leading-8 text-slate-200 sm:text-lg">A caring mountain community where every learner is known, encouraged, and given the tools to thrive.</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link to="/about"><Button size="lg" variant="sky" className="group px-6 py-3.5">Discover our school <ArrowRight size={17} className="transition group-hover:translate-x-1" /></Button></Link>
                <Link to="/programs" className="inline-flex items-center gap-3 rounded-xl border border-white/25 bg-white/10 px-5 py-3.5 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20"><span className="grid h-7 w-7 place-items-center rounded-full bg-white text-navy-950"><Play size={12} fill="currentColor" /></span>Explore programs</Link>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-slate-200">
                <span className="flex items-center gap-2"><BadgeCheck size={18} className="text-skybrand-300" />Child-friendly campus</span>
                <span className="flex items-center gap-2"><BadgeCheck size={18} className="text-skybrand-300" />Community supported</span>
                <span className="flex items-center gap-2"><BadgeCheck size={18} className="text-skybrand-300" />Data-informed care</span>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid overflow-hidden rounded-t-[2rem] border border-white/15 bg-white shadow-[0_-15px_55px_rgba(7,27,51,.18)] sm:grid-cols-2 lg:grid-cols-4">
              {quickLinks.map(({ to, label, text, icon: Icon, color }, index) => (
                <Link key={to} to={to} className={`group flex items-center gap-4 p-5 transition hover:bg-slate-50 lg:p-6 ${index ? 'border-t border-slate-100 sm:border-l sm:border-t-0' : ''} ${index === 2 ? 'sm:border-l-0 lg:border-l' : ''}`}>
                  <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-lg ${color}`}><Icon size={22} weight="duotone" /></div>
                  <div className="min-w-0"><p className="font-display text-sm font-extrabold text-navy-950">{label}</p><p className="mt-1 truncate text-xs text-slate-500">{text}</p></div>
                  <ChevronRight size={17} className="ml-auto shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-skybrand-500" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 soft-grid opacity-50" />
        <div className="relative mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-8">
          <Reveal className="relative">
            <div className="absolute -left-6 -top-6 h-28 w-28 rounded-full bg-skybrand-200/60 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] shadow-[0_30px_80px_rgba(7,27,51,.18)]">
              <img src={classroomPhoto} alt="Balili pupils learning together in the classroom" className="aspect-[4/3] h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/45 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 glass-panel rounded-2xl p-4 text-white sm:max-w-xs">
                <p className="text-xs font-bold uppercase tracking-wider text-skybrand-200">Learning together</p>
                <p className="mt-1 text-sm font-semibold leading-6">Curiosity grows when every child has a voice at the table.</p>
              </div>
            </div>
            <div className="absolute -bottom-7 -right-4 hidden rounded-2xl bg-amber-400 p-5 text-navy-950 shadow-xl sm:block">
              <Award size={24} />
              <p className="mt-3 font-display text-2xl font-extrabold">6</p>
              <p className="text-xs font-bold">Grade levels</p>
            </div>
          </Reveal>
          <Reveal delay={.12}>
            <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[.22em] text-skybrand-600"><span className="h-px w-10 bg-skybrand-500" />A school that sees every learner</p>
            <h2 className="text-balance mt-5 font-display text-4xl font-extrabold leading-tight tracking-tight text-navy-950 sm:text-5xl">Rooted in community, moving forward with purpose.</h2>
            <p className="mt-6 text-base leading-8 text-slate-600">Balili Elementary School combines the warmth of a close-knit community with clear, timely information that helps teachers and families respond to every learner’s needs.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                [ShieldCheck, 'Safe and inclusive', 'A welcoming environment where children can learn with confidence.'],
                [BarChart3, 'Thoughtful support', 'Progress and attendance insights guide timely, caring action.'],
                [HeartHandshake, 'Family partnership', 'Families are valued partners in every child’s school journey.'],
                [Leaf, 'Local identity', 'Learning honors community, culture, and the Cordillera environment.'],
              ].map(([Icon, title, text]) => <div key={title} className="flex gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-skybrand-50 text-skybrand-600"><Icon size={19} /></div><div><h3 className="text-sm font-bold text-navy-950">{title}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{text}</p></div></div>)}
            </div>
            <Link to="/about" className="group mt-8 inline-flex items-center gap-2 text-sm font-bold text-skybrand-600">Learn more about Balili <ArrowRight size={16} className="transition group-hover:translate-x-1" /></Link>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-navy-950 py-14 text-white">
        <div className="absolute inset-0 public-grid opacity-10" />
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-skybrand-500/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            [students.length, '', 'Learners supported', Users],
            [teachers.length, '', 'Dedicated teachers', UserRoundCheck],
            [95.1, '%', 'Current attendance', BarChart3],
            [6, '', 'Grade levels', BookOpen],
          ].map(([value, suffix, label, Icon], index) => (
            <Reveal key={label} delay={index * .08} className="flex items-center gap-5 border-white/10 sm:border-l sm:pl-7 first:border-l-0 first:pl-0">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-skybrand-300"><Icon size={22} /></div>
              <div><p className="font-display text-3xl font-extrabold"><AnimatedNumber value={value} suffix={suffix} decimals={suffix ? 1 : 0} /></p><p className="mt-1 text-xs font-medium text-slate-300">{label}</p></div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-b from-white to-skybrand-50/50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[.22em] text-skybrand-600">Programs that help children flourish</p>
            <h2 className="text-balance mt-4 font-display text-4xl font-extrabold tracking-tight text-navy-950 sm:text-5xl">Learning goes beyond the lesson.</h2>
            <p className="mt-5 text-base leading-8 text-slate-600">Our programs nurture strong foundations, healthy habits, creativity, character, and belonging.</p>
          </Reveal>
          <Reveal delay={.1} className="mt-12">
            <Swiper modules={[Autoplay, Navigation, Pagination]} navigation pagination={{ clickable: true }} autoplay={{ delay: 4200, disableOnInteraction: false }} spaceBetween={20} breakpoints={{ 0: { slidesPerView: 1 }, 680: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }} className="!pb-14 !px-1">
              {programs.map(({ icon: Icon, title, text, color, tint, image }) => (
                <SwiperSlide key={title} className="h-auto">
                  <div className="group flex h-full min-h-[27rem] flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-soft">
                    <div className="relative h-44 shrink-0 overflow-hidden">
                      <img src={image} alt={`${title} at Balili Elementary School`} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/65 via-transparent to-transparent" />
                      <div className={`absolute bottom-4 left-5 grid h-12 w-12 place-items-center rounded-2xl text-white shadow-lg ring-4 ring-white/25 transition duration-300 group-hover:rotate-3 group-hover:scale-110 ${color}`}><Icon size={24} weight="duotone" /></div>
                    </div>
                    <div className={`flex flex-1 flex-col bg-gradient-to-br p-6 ${tint}`}>
                      <h3 className="font-display text-xl font-extrabold text-navy-950">{title}</h3>
                      <p className="mt-3 flex-1 text-sm leading-7 text-slate-500">{text}</p>
                      <Link to="/programs" className="mt-5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy-900">Discover program <ArrowRight size={15} /></Link>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </Reveal>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <Reveal><p className="text-xs font-bold uppercase tracking-[.22em] text-skybrand-600">From our school community</p><h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-navy-950">News and announcements</h2></Reveal>
            <Link to="/announcements" className="group flex items-center gap-2 text-sm font-bold text-skybrand-600">View all school news <ArrowRight size={16} className="transition group-hover:translate-x-1" /></Link>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">{announcements.slice(0, 3).map((item, index) => <Reveal key={item.id} delay={index * .08}><AnnouncementCard item={item} featured={index === 0} /></Reveal>)}</div>
        </div>
      </section>

      <section className="bg-slate-50 py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:px-8">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[.22em] text-skybrand-600">School calendar</p>
            <h2 className="text-balance mt-4 font-display text-4xl font-extrabold tracking-tight text-navy-950">Moments that bring our community together.</h2>
            <p className="mt-5 max-w-lg text-base leading-8 text-slate-600">From family conferences to reading days and campus programs, there is always something meaningful ahead.</p>
            <Link to="/events" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-navy-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-skybrand-600">Open full calendar <CalendarDays size={17} /></Link>
          </Reveal>
          <Reveal delay={.1} className="space-y-3">{events.slice(0, 4).map((item, index) => <EventCard key={item.id} item={item} index={index} />)}</Reveal>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2.3rem] bg-navy-950 px-7 py-14 text-white shadow-[0_35px_90px_rgba(7,27,51,.23)] sm:px-12 lg:px-16">
            <img src={classroomPhoto} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/95 to-navy-950/65" />
            <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="max-w-3xl">
                <Quote size={34} className="text-skybrand-400" />
                <blockquote className="text-balance mt-6 font-display text-2xl font-extrabold leading-relaxed sm:text-3xl">“Children do their best learning when they feel safe, known, and encouraged to keep growing.”</blockquote>
                <p className="mt-6 text-sm font-bold">Dr. Elena D. Reyes <span className="font-normal text-slate-400">• School Principal</span></p>
              </div>
              <Link to="/contact" className="inline-flex w-fit items-center gap-2 rounded-xl bg-skybrand-500 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-skybrand-400">Connect with our school <ArrowUpRight size={17} /></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export function AboutPage() {
  return (
    <>
      <PublicHero eyebrow="About our school" title="Rooted in community. Focused on every child." description="Balili Elementary School is a public learning community committed to joyful, inclusive, and meaningful basic education." image={sectionAbout} />
      <section className="py-24">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:px-8">
          <Reveal className="relative">
            <img src={aboutHistory} alt="Balili learners exploring school memories with a teacher" className="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-[0_30px_80px_rgba(7,27,51,.18)]" />
            <div className="absolute -bottom-7 -right-4 max-w-[240px] rounded-2xl bg-skybrand-500 p-5 text-white shadow-xl sm:right-[-2rem]"><Star fill="currentColor" size={20} /><p className="mt-3 font-display text-lg font-extrabold">Every learner matters.</p><p className="mt-1 text-xs leading-5 text-skybrand-50">A simple belief that guides every classroom decision.</p></div>
          </Reveal>
          <Reveal delay={.1}>
            <p className="text-xs font-bold uppercase tracking-[.22em] text-skybrand-600">Our story</p>
            <h2 className="text-balance mt-4 font-display text-4xl font-extrabold tracking-tight text-navy-950">A neighborhood school with a wide-open vision for children.</h2>
            <p className="mt-6 text-base leading-8 text-slate-600">For generations, Balili Elementary School has served families in La Trinidad with a steady belief in the power of public education. We pair strong foundational learning with creativity, wellness, character, and community participation.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">{['Respect in every interaction', 'Curiosity in every lesson', 'Responsibility in every choice', 'Care in every community'].map((item) => <p key={item} className="flex items-center gap-3 text-sm font-semibold text-navy-950"><CircleCheck size={18} className="text-emerald-500" />{item}</p>)}</div>
          </Reveal>
        </div>
      </section>
      <section className="bg-slate-50 py-24">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {[
            { icon: School, title: 'Our story', text: 'A trusted public school shaped by generations of families, teachers, and local partners.', color: 'bg-skybrand-500' },
            { icon: Target, title: 'Our mission', text: 'To provide inclusive learning that builds literacy, character, creativity, and confidence.', color: 'bg-violet-500' },
            { icon: Eye, title: 'Our vision', text: 'A caring community where every learner is prepared to contribute, lead, and keep learning.', color: 'bg-emerald-500' },
          ].map(({ icon: Icon, title, text, color }, index) => <Reveal key={title} delay={index * .08}><Card className="h-full p-8 hover:-translate-y-1 hover:shadow-soft"><div className={`inline-flex rounded-2xl p-3 text-white shadow-lg ${color}`}><Icon /></div><h2 className="mt-7 font-display text-2xl font-extrabold text-navy-950">{title}</h2><p className="mt-4 text-sm leading-7 text-slate-500">{text}</p></Card></Reveal>)}
        </div>
      </section>
    </>
  )
}

export function PublicAnnouncementsPage() {
  const { announcements } = useApp()
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [subscribed, setSubscribed] = useState(false)
  const categories = ['All', ...new Set(announcements.map((item) => item.category))]
  const featured = announcements.find((item) => item.pinned) || announcements[0]
  const filtered = announcements.filter((item) =>
    (category === 'All' || item.category === category)
    && (!query || `${item.title} ${item.content} ${item.audience}`.toLowerCase().includes(query.toLowerCase())),
  )
  const shareAnnouncement = async (item) => {
    const payload = { title: item.title, text: item.content, url: window.location.href }
    try {
      if (navigator.share) await navigator.share(payload)
      else {
        await navigator.clipboard?.writeText(`${item.title}\n${window.location.href}`)
        window.alert('Update link copied to your clipboard.')
      }
    } catch {
      // The visitor may cancel the native share sheet.
    }
  }

  return (
    <>
      <PublicHero eyebrow="School news" title="Stories, notices, and moments worth sharing" description="Stay close to classroom life, important school advisories, learner milestones, and community activities." image={sectionNews}>
        <div className="mt-8 flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold backdrop-blur-md"><Megaphone size={16} className="text-skybrand-300" />Updated by the school office</span>
          <span className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold backdrop-blur-md"><Bookmark size={16} className="text-amber-300" />Important posts stay pinned</span>
        </div>
      </PublicHero>

      {featured && (
        <section className="relative z-10 -mt-16 px-4 sm:px-6">
          <Reveal className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-white/30 bg-white shadow-[0_30px_80px_rgba(7,27,51,.18)]">
            <div className="grid lg:grid-cols-[1.05fr_.95fr]">
              <div className="relative min-h-80 overflow-hidden">
                <img src={newsFeature} alt="Balili learners enjoying Reading Buddy Day" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/75 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 flex gap-2"><Badge tone="sky">Featured story</Badge>{featured.pinned && <Badge tone="amber"><Pin size={11} className="mr-1" />Pinned</Badge>}</div>
              </div>
              <div className="flex flex-col justify-center p-7 sm:p-10">
                <p className="text-xs font-bold uppercase tracking-[.18em] text-skybrand-600">{featured.category} • {formatDate(featured.date)}</p>
                <h2 className="text-balance mt-4 font-display text-3xl font-extrabold leading-tight text-navy-950">{featured.title}</h2>
                <p className="mt-5 text-sm leading-7 text-slate-600">{featured.content}</p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Button variant="sky" onClick={() => setSelected(featured)}>Read full update <ArrowRight size={16} /></Button>
                  <button onClick={() => shareAnnouncement(featured)} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-navy-900"><Share2 size={16} />Share</button>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      )}

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div><p className="text-xs font-bold uppercase tracking-[.2em] text-skybrand-600">The school bulletin</p><h2 className="mt-3 font-display text-3xl font-extrabold text-navy-950">Browse all updates</h2><p className="mt-2 text-sm text-slate-500">Find notices by topic or search for something specific.</p></div>
            <label className="relative block w-full lg:max-w-sm"><Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input className="input py-3 pl-11" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search school news" aria-label="Search school news" /></label>
          </div>
          <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
            {categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition ${category === item ? 'bg-navy-900 text-white shadow-md' : 'border border-slate-200 bg-white text-slate-600 hover:border-skybrand-300 hover:text-skybrand-600'}`}>{item}</button>)}
          </div>
          {filtered.length ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{filtered.map((item, index) => <Reveal key={item.id} delay={index * .05}><AnnouncementCard item={item} featured={item.id === featured?.id} onOpen={setSelected} /></Reveal>)}</div> : <Card><EmptyState title="No school updates found" description="Try a different category or search phrase." /></Card>}
        </div>
      </section>

      <section className="bg-skybrand-50 py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
          <div><p className="text-xs font-bold uppercase tracking-[.18em] text-skybrand-600">Family update list</p><h2 className="mt-3 font-display text-2xl font-extrabold text-navy-950">Get the school bulletin in one simple digest.</h2><p className="mt-2 text-sm text-slate-600">A presentation-ready newsletter sign-up inspired by the parent update hubs used by leading schools.</p></div>
          {subscribed
            ? <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-5 py-4 text-sm font-semibold text-emerald-700"><CircleCheck size={20} />You are on the demo update list.</div>
            : <form onSubmit={(event) => { event.preventDefault(); setSubscribed(true) }} className="flex w-full max-w-lg flex-col gap-2 sm:flex-row"><input className="input min-w-0 flex-1 py-3" type="email" placeholder="Parent or guardian email" aria-label="Parent or guardian email" required /><Button type="submit" variant="sky" size="lg">Join updates <Send size={16} /></Button></form>}
        </div>
      </section>

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title="School update" size="lg">
        {selected && <article>
          <div className="flex flex-wrap items-center gap-2"><Badge tone={selected.category === 'Academic' ? 'purple' : selected.category === 'Community' ? 'green' : 'sky'}>{selected.category}</Badge>{selected.pinned && <Badge tone="amber"><Pin size={11} className="mr-1" />Important</Badge>}<span className="text-xs text-slate-400">{formatDate(selected.date)}</span></div>
          <h2 className="mt-5 font-display text-3xl font-extrabold leading-tight text-navy-950">{selected.title}</h2>
          <p className="mt-3 text-sm font-semibold text-skybrand-600">For {selected.audience}</p>
          <p className="mt-6 text-base leading-8 text-slate-600">{selected.content}</p>
          <div className="mt-7 rounded-2xl bg-slate-50 p-5"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">What families should do</p><p className="mt-2 text-sm leading-6 text-slate-700">{selected.category === 'Academic' ? 'Review the schedule with your child and watch for class-specific reminders from the adviser.' : selected.category === 'Community' ? 'Families who would like to participate may contact the school office or their class adviser.' : 'Save the date and check the learner’s school bag for any class-specific instructions.'}</p></div>
        </article>}
      </Modal>
    </>
  )
}

export function PublicEventsPage() {
  const { events } = useApp()
  const sortedEvents = useMemo(() => [...events].sort((a, b) => a.date.localeCompare(b.date)), [events])
  const initialDate = sortedEvents[0] ? parseISO(sortedEvents[0].date) : new Date(2026, 5, 23)
  const [month, setMonth] = useState(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1))
  const [selectedDate, setSelectedDate] = useState(initialDate)
  const eventDates = sortedEvents.map((event) => parseISO(event.date))
  const selectedEvents = sortedEvents.filter((event) => isSameDay(parseISO(event.date), selectedDate))
  const monthEvents = sortedEvents.filter((event) => isSameMonth(parseISO(event.date), month))

  const downloadCalendar = (event) => {
    const date = event.date.replaceAll('-', '')
    const content = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//ORATRACK//School Event//EN',
      'BEGIN:VEVENT', `UID:${event.id}@oratrack.edu.ph`, `DTSTART;VALUE=DATE:${date}`,
      `SUMMARY:${event.title}`, `LOCATION:${event.location}`, `DESCRIPTION:${event.description}`,
      'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n')
    const url = URL.createObjectURL(new Blob([content], { type: 'text/calendar' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `${event.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.ics`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <PublicHero eyebrow="Events calendar" title="School life, thoughtfully planned" description="Browse the real month calendar, choose a date, and save important Balili Elementary School activities to your device." image={sectionEvents}>
        <div className="mt-8 flex flex-wrap gap-3">
          {['Academic', 'Community', 'Family meetings', 'Student activities'].map((item) => <span key={item} className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-100 backdrop-blur-md">{item}</span>)}
        </div>
      </PublicHero>
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="grid overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_28px_80px_rgba(7,27,51,.12)] xl:grid-cols-[1.15fr_.85fr]">
            <div className="border-b border-slate-200 p-5 sm:p-8 xl:border-b-0 xl:border-r">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div><p className="text-xs font-bold uppercase tracking-[.18em] text-skybrand-600">Interactive calendar</p><h2 className="mt-2 font-display text-2xl font-extrabold text-navy-950">Choose a school day</h2></div>
                <Badge tone="sky">{monthEvents.length} events this month</Badge>
              </div>
              <DayPicker
                mode="single"
                month={month}
                onMonthChange={setMonth}
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                modifiers={{ hasEvent: eventDates }}
                modifiersClassNames={{ hasEvent: 'calendar-has-event' }}
                showOutsideDays
                fixedWeeks
                startMonth={new Date(2026, 5)}
                endMonth={new Date(2026, 11)}
                className="oratrack-calendar mx-auto"
              />
              <div className="mt-6 flex flex-wrap gap-4 border-t border-slate-100 pt-5 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-skybrand-500" />Has school event</span>
                <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-navy-900" />Selected date</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-navy-950 to-navy-800 p-6 text-white sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-skybrand-300">Selected day</p>
              <h2 className="mt-2 font-display text-2xl font-extrabold">{format(selectedDate, 'EEEE, MMMM d')}</h2>
              <div className="mt-7 space-y-4">
                {selectedEvents.length ? selectedEvents.map((event) => (
                  <article key={event.id} className="rounded-2xl border border-white/10 bg-white/[.08] p-5 backdrop-blur-md">
                    <div className="flex items-start justify-between gap-3"><Badge tone="sky" className="bg-skybrand-500/20 text-skybrand-200">{event.type}</Badge><CalendarClock size={18} className="text-skybrand-300" /></div>
                    <h3 className="mt-4 font-display text-xl font-extrabold">{event.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{event.description}</p>
                    <div className="mt-5 grid gap-2 text-xs text-slate-300 sm:grid-cols-2">
                      <p className="flex items-center gap-2"><Clock3 size={14} className="text-skybrand-300" />{event.time}</p>
                      <p className="flex items-center gap-2"><MapPin size={14} className="text-skybrand-300" />{event.location}</p>
                    </div>
                    <button onClick={() => downloadCalendar(event)} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-navy-950 transition hover:bg-skybrand-100"><CalendarPlus size={15} />Add to my calendar</button>
                  </article>
                )) : <div className="rounded-2xl border border-dashed border-white/20 p-8 text-center"><CalendarDays className="mx-auto text-skybrand-300" /><p className="mt-4 font-semibold">No event scheduled</p><p className="mt-1 text-sm text-slate-400">Choose a date marked with a blue dot.</p></div>}
              </div>
            </div>
          </Reveal>

          <div className="mt-16 grid gap-10 lg:grid-cols-[.72fr_1.28fr]">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-skybrand-600">Month at a glance</p>
              <h2 className="text-balance mt-4 font-display text-3xl font-extrabold text-navy-950">{format(month, 'MMMM yyyy')} agenda</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">A clean agenda for families who prefer a simple list. Select an event to move the calendar to that day.</p>
              <div className="mt-6 rounded-2xl bg-skybrand-50 p-5"><p className="text-xs font-bold uppercase tracking-wider text-skybrand-600">Planning note</p><p className="mt-2 text-sm leading-6 text-slate-700">Class advisers may send additional instructions for grade-specific activities.</p></div>
            </Reveal>
            <Reveal delay={.08} className="space-y-3">
              {monthEvents.length ? monthEvents.map((event, index) => <button key={event.id} onClick={() => setSelectedDate(parseISO(event.date))} className="block w-full text-left"><EventCard item={event} index={index} /></button>) : <Card><EmptyState title="No events this month" description="Use the calendar arrows to browse another month." /></Card>}
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}

export function ProgramsPage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = programs[activeIndex]
  const ActiveIcon = active.icon
  return (
    <>
      <PublicHero eyebrow="Programs and services" title="Every learner deserves more ways to thrive" description="Explore academic, wellness, creative, and family programs designed around the whole child." image={programsHero}>
        <div className="mt-8 flex flex-wrap gap-3"><Link to="/contact"><Button variant="sky" size="lg">Ask about a program <ArrowRight size={16} /></Button></Link><span className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold backdrop-blur-md"><Check size={16} className="text-emerald-300" />Open to Grades 1 to 6</span></div>
      </PublicHero>

      <section className="relative z-10 -mt-14 px-4 sm:px-6">
        <Reveal className="mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_30px_80px_rgba(7,27,51,.16)] lg:grid-cols-[340px_1fr]">
          <div className="border-b border-slate-200 bg-slate-50 p-4 lg:border-b-0 lg:border-r">
            <p className="px-3 py-3 text-xs font-bold uppercase tracking-[.18em] text-slate-400">Choose a pathway</p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {programs.map(({ icon: Icon, title, short, color }, index) => (
                <button key={title} onClick={() => setActiveIndex(index)} className={`group flex items-center gap-3 rounded-2xl p-3 text-left transition ${activeIndex === index ? 'bg-navy-900 text-white shadow-lg' : 'hover:bg-white hover:shadow-sm'}`}>
                  <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white ${color}`}><Icon size={21} weight="duotone" /></span>
                  <span className="min-w-0"><span className={`block text-sm font-bold ${activeIndex === index ? 'text-white' : 'text-navy-950'}`}>{title}</span><span className={`mt-0.5 block truncate text-xs ${activeIndex === index ? 'text-slate-300' : 'text-slate-500'}`}>{short}</span></span>
                  <ChevronRight size={16} className={`ml-auto shrink-0 transition group-hover:translate-x-1 ${activeIndex === index ? 'text-skybrand-300' : 'text-slate-300'}`} />
                </button>
              ))}
            </div>
          </div>
          <motion.div key={active.title} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .35 }} className="grid lg:grid-cols-[1fr_.85fr]">
            <div className="flex flex-col justify-center p-7 sm:p-10">
              <div className={`grid h-14 w-14 place-items-center rounded-2xl text-white shadow-lg ${active.color}`}><ActiveIcon size={27} weight="duotone" /></div>
              <p className="mt-7 text-xs font-bold uppercase tracking-[.18em] text-skybrand-600">{active.short}</p>
              <h2 className="mt-3 font-display text-3xl font-extrabold text-navy-950">{active.title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">{active.text}</p>
              <div className="mt-6 space-y-3">{active.highlights.map((item) => <p key={item} className="flex items-center gap-3 text-sm font-semibold text-slate-700"><span className={`grid h-6 w-6 place-items-center rounded-full text-white ${active.color}`}><Check size={13} /></span>{item}</p>)}</div>
              <Link to="/contact" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-skybrand-600">Talk to the school office <ArrowRight size={16} /></Link>
            </div>
            <div className="relative min-h-80 overflow-hidden">
              <img src={active.image} alt={`${active.title} at Balili Elementary School`} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/10 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/15 bg-navy-950/60 p-5 text-white backdrop-blur-md">
                <p className="font-display text-3xl font-extrabold">{active.stat}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-skybrand-200">{active.statLabel}</p>
              </div>
            </div>
          </motion.div>
        </Reveal>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-3xl text-center"><p className="text-xs font-bold uppercase tracking-[.2em] text-skybrand-600">How support becomes progress</p><h2 className="text-balance mt-4 font-display text-4xl font-extrabold text-navy-950">Simple steps, shared by school and family.</h2></Reveal>
          <div className="relative mt-14 grid gap-6 lg:grid-cols-3">
            <div className="absolute left-[16%] right-[16%] top-8 hidden h-px bg-gradient-to-r from-skybrand-200 via-skybrand-500 to-skybrand-200 lg:block" />
            {[
              { number: '01', icon: Lightbulb, title: 'Notice the need', text: 'Teachers use classroom observation and ORATRACK insights to see where support can help.' },
              { number: '02', icon: ClipboardCheck, title: 'Plan together', text: 'The school identifies a practical activity, family follow-up, or focused intervention.' },
              { number: '03', icon: BarChart3, title: 'Review progress', text: 'Small gains are tracked, celebrated, and used to guide the next helpful step.' },
            ].map(({ number, icon: Icon, title, text }, index) => <Reveal key={title} delay={index * .08} className="relative rounded-[1.75rem] border border-slate-200 bg-white p-7 text-center shadow-soft"><div className="relative mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-navy-900 text-white shadow-lg"><Icon size={24} /><span className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-skybrand-500 text-[10px] font-extrabold">{number}</span></div><h3 className="mt-6 font-display text-xl font-extrabold text-navy-950">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-500">{text}</p></Reveal>)}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-skybrand-600">Family resource hub</p><h2 className="mt-3 font-display text-3xl font-extrabold text-navy-950">The useful links families look for first.</h2></div><p className="max-w-lg text-sm leading-6 text-slate-500">A practical pattern borrowed from strong school websites: put common family tasks in one clear place.</p></Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { to: '/contact', icon: FileText, title: 'Enrollment guide', text: 'Ask about requirements and next steps' },
              { to: '/events', icon: CalendarDays, title: 'School calendar', text: 'Plan around important school dates' },
              { to: '/announcements', icon: Download, title: 'Forms and notices', text: 'Find current school reminders' },
              { to: '/contact', icon: Users, title: 'Contact an adviser', text: 'Reach the right school support' },
            ].map(({ to, icon: Icon, title, text }) => <Link key={title} to={to} className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-skybrand-300 hover:shadow-soft"><div className="flex items-start justify-between"><div className="grid h-11 w-11 place-items-center rounded-xl bg-skybrand-50 text-skybrand-600"><Icon size={20} /></div><ArrowUpRight size={17} className="text-slate-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-skybrand-500" /></div><h3 className="mt-5 font-display text-lg font-extrabold text-navy-950">{title}</h3><p className="mt-2 text-xs leading-5 text-slate-500">{text}</p></Link>)}
          </div>
        </div>
      </section>
    </>
  )
}

export function ContactPage() {
  return (
    <>
      <PublicHero eyebrow="Contact us" title="Our doors are open to the community" description="Reach the school office for enrollment questions, records, family concerns, and community partnerships." />
      <section className="relative py-24">
        <div className="absolute inset-0 soft-grid opacity-40" />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:px-8">
          <Reveal className="space-y-4">
            {[
              { icon: MapPin, label: 'Visit us', value: 'Purok 3, Balili, La Trinidad, Benguet 2601', color: 'bg-skybrand-500' },
              { icon: Phone, label: 'Call the office', value: '(074) 422-0186', color: 'bg-emerald-500' },
              { icon: Mail, label: 'Send an email', value: 'hello@balilies.edu.ph', color: 'bg-violet-500' },
              { icon: Clock, label: 'School hours', value: 'Monday to Friday, 7:30 AM to 5:00 PM', color: 'bg-amber-500' },
            ].map(({ icon: Icon, label, value, color }) => <Card key={label} className="group flex gap-4 p-5 hover:-translate-y-0.5 hover:shadow-soft"><div className={`h-fit rounded-xl p-3 text-white shadow-md ${color}`}><Icon size={20} /></div><div><p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 text-sm font-semibold leading-6 text-navy-950">{value}</p></div></Card>)}
          </Reveal>
          <Reveal delay={.1}><Card className="p-7 shadow-[0_25px_70px_rgba(7,27,51,.12)] sm:p-10">
            <div className="flex items-start justify-between gap-5"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-skybrand-600">Send an inquiry</p><h2 className="mt-3 font-display text-3xl font-extrabold text-navy-950">How can we help?</h2><p className="mt-2 text-sm text-slate-500">This prototype form is for presentation purposes.</p></div><div className="hidden rounded-2xl bg-skybrand-50 p-3 text-skybrand-600 sm:block"><Send size={22} /></div></div>
            <form onSubmit={(event) => event.preventDefault()} className="mt-8 grid gap-4 sm:grid-cols-2">
              <label><span className="label">Full name</span><input className="input" placeholder="Your name" /></label>
              <label><span className="label">Email address</span><input className="input" type="email" placeholder="name@example.com" /></label>
              <label className="sm:col-span-2"><span className="label">Topic</span><select className="input"><option>General inquiry</option><option>Enrollment</option><option>Student records</option><option>Community partnership</option></select></label>
              <label className="sm:col-span-2"><span className="label">Message</span><textarea className="input min-h-32 resize-y" placeholder="How can we help?" /></label>
              <div className="sm:col-span-2"><Button type="submit" variant="sky" size="lg">Prepare message <ArrowRight size={16} /></Button></div>
            </form>
          </Card></Reveal>
        </div>
      </section>
    </>
  )
}
