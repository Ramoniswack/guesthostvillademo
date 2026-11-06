'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Icon from './Icons.jsx'

/** Gentle fade-up on scroll. Reduced-motion users get the fade only (via MotionConfig in App). */
export function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/** Small circular arrow used on every button. */
export function ArrowCircle({ className = '' }) {
  return (
    <span
      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-current ${className}`}
    >
      <Icon name="arrow" className="h-3.5 w-3.5" strokeWidth={2.2} />
    </span>
  )
}

const variants = {
  // orange with dark-green text (contrast ≈ 6:1)
  primary: 'bg-sun text-forest-dark hover:bg-sun-dark',
  outline: 'border-2 border-forest text-forest hover:bg-forest hover:text-cream',
  solid: 'bg-forest text-cream hover:bg-forest-dark',
  light: 'border-2 border-cream/80 text-cream hover:bg-cream hover:text-forest',
  // frosted glass over photos (hero)
  glass: 'glass hover:bg-white/25',
  glassSun: 'glass !border-sun/70 !bg-sun/40 hover:!bg-sun/55',
}

/** Pill button. Internal paths ("/rooms") render a router <Link>, other hrefs an <a>, no href a <button>. */
export function Button({ variant = 'primary', href, children, arrow = true, icon, className = '', ...rest }) {
  const cls = `inline-flex min-h-[52px] items-center justify-center gap-3 rounded-none px-7 py-3 text-[1.0625rem] font-semibold transition-all duration-300 ${variants[variant]} ${className}`
  const inner = (
    <>
      {icon && <Icon name={icon} className="h-5 w-5" />}
      <span>{children}</span>
      {arrow && <ArrowCircle />}
    </>
  )
  if (!href) return <button type="button" className={cls} {...rest}>{inner}</button>
  if (href.startsWith('/')) return <Link href={href} className={cls} {...rest}>{inner}</Link>
  const external = /^https?:/.test(href)
  return (
    <a href={href} className={cls} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
      {inner}
    </a>
  )
}

/** Dark photo banner that opens every inner page. `data-hero` tells the navbar when it has been scrolled past. */
export function PageHero({ eyebrow, title, text, image, position = '50% 50%', center = false, compact = false }) {
  return (
    <section data-hero className={`relative isolate flex overflow-hidden bg-forest-dark ${compact ? 'min-h-[42svh] items-center' : 'min-h-[58svh] items-end'}`}>
      <img src={image} alt="" fetchPriority="high" className="absolute inset-0 -z-20 h-full w-full object-cover" style={{ objectPosition: position }} />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-dark/95 via-forest-dark/55 to-forest-dark/30" />
      <div className={`wrap ${compact ? 'py-28 md:py-32' : 'pb-20 pt-44 md:pb-28'}`}>
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
          className={`max-w-3xl ${center ? 'mx-auto text-center' : ''}`}
        >
          <p className="mb-3 text-[1.0625rem] font-semibold text-sun" style={{ letterSpacing: '-0.01em' }}>{eyebrow}</p>
          <h1 className={`font-display font-semibold leading-[1.04] text-white ${compact ? 'text-[2.6rem] sm:text-5xl lg:text-6xl' : 'text-[2.75rem] sm:text-6xl lg:text-7xl'}`} style={{ letterSpacing: '-0.035em' }}>
            {title}
          </h1>
          {text && <p className={`mt-6 max-w-xl text-xl leading-[1.4] text-white/85 ${center ? 'mx-auto' : ''}`}>{text}</p>}
        </motion.div>
      </div>
    </section>
  )
}

/** Builds a closed, hand-drawn-looking ridge line that always spans the full width. */
export function ridgePath({ w = 1440, h = 90, base = 50, waves = [], steps = 72 }) {
  let d = `M0 ${h}`
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * w
    const y = base + waves.reduce((sum, [amp, len, ph]) => sum + amp * Math.sin(x / len + ph), 0)
    d += ` L${x.toFixed(1)} ${y.toFixed(1)}`
  }
  return `${d} L${w} ${h}Z`
}

const BACK = ridgePath({ base: 46, waves: [[14, 120, 0.4], [8, 47, 2.1], [4, 23, 1]] })
const FRONT = ridgePath({ base: 58, waves: [[12, 150, 2.4], [7, 61, 0.7], [3, 29, 3]] })

/** Rolling-hills divider. `prev` = colour of the section above, `next` = section below. */
const C = { cream: '#FBF7EF', sand: '#F3ECDD', forest: '#2F4A3A', transparent: 'transparent' }
export function Divider({ prev = 'cream', next = 'sand' }) {
  return (
    <div aria-hidden="true" style={{ background: C[prev], color: C[next], lineHeight: 0, marginBottom: -1, position: 'relative' }}>
      <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="block h-10 w-full md:h-16" fill="currentColor">
        <path opacity="0.5" d={BACK} />
        <path d={FRONT} />
      </svg>
    </div>
  )
}
