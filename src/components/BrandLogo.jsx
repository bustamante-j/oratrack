import logoMark from '../assets/oratrack-logo.png'

export default function BrandLogo({ compact = false, inverse = false, className = '', markClassName = '' }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <span className={`grid shrink-0 place-items-center overflow-hidden rounded-2xl bg-white shadow-lg shadow-navy-950/15 ${compact ? 'h-10 w-10 p-1' : 'h-12 w-12 p-1.5'} ${markClassName}`}>
        <img src={logoMark} alt="" className="h-full w-full object-contain" />
      </span>
      <span className={`font-display font-extrabold tracking-tight ${compact ? 'text-xl' : 'text-xl sm:text-2xl'} ${inverse ? 'text-white' : 'text-navy-950'}`}>ORATRACK</span>
    </span>
  )
}
