import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Robot, X, Sparkle } from '@phosphor-icons/react'
import AgentWorkspace from './AgentWorkspace'

export default function FloatingAgent() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`group fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-navy-950 to-skybrand-600 p-2 pr-4 text-white shadow-[0_18px_55px_rgba(7,27,51,.32)] transition hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(44,167,237,.32)] ${open ? 'pointer-events-none scale-90 opacity-0' : ''}`}
        aria-label="Open ORA AI agent"
      >
        <span className="relative grid h-12 w-12 place-items-center rounded-xl bg-white text-navy-950"><Robot size={27} weight="duotone" /><Sparkle size={13} weight="fill" className="absolute -right-1 -top-1 text-amber-400" /></span>
        <span className="hidden text-left sm:block"><span className="block text-xs font-extrabold">Ask ORA</span><span className="block text-[10px] text-skybrand-100">AI school agent</span></span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-[80] bg-navy-950/35 backdrop-blur-sm" aria-label="Close ORA agent" />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 32 }}
              className="fixed inset-y-0 left-0 right-0 z-[90] bg-white shadow-[-25px_0_70px_rgba(7,27,51,.22)] sm:left-auto sm:w-[440px]"
            >
              <button onClick={() => setOpen(false)} className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-white transition hover:bg-white/20" aria-label="Close ORA agent"><X size={19} weight="bold" /></button>
              <AgentWorkspace compact />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
