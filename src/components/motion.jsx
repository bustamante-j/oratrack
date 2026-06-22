import { motion, useReducedMotion } from 'framer-motion'
import CountUp from 'react-countup'

export function Reveal({ children, className = '', delay = 0, y = 24, as = 'div' }) {
  const reduceMotion = useReducedMotion()
  const Component = motion[as] || motion.div
  return (
    <Component
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  )
}

export function AnimatedNumber({ value, suffix = '', decimals = 0 }) {
  return <CountUp end={Number(value)} duration={2.2} decimals={decimals} suffix={suffix} enableScrollSpy scrollSpyOnce />
}
