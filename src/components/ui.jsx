'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import Icon from './Icons.jsx'
import { useListWheel } from '../lib/useListWheel.js'

/** Custom dropdown select matching the site's rounded forest/sun/white UI. */
export function CustomSelect({
  value,
  onChange,
  options,
  ariaLabel,
  prefixIcon,
  triggerClassName = '',
  menuAlign = 'left',
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const listRef = useRef(null)
  const selected = options.find((opt) => opt.value === value) || options[0]

  useListWheel(listRef, open)

  useEffect(() => {
    if (!open) return undefined
    const onPointerDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between gap-2 text-left outline-none transition ${triggerClassName}`}
      >
        <span className="flex min-w-0 items-center gap-2">
          {prefixIcon}
          <span className="truncate">{selected?.label}</span>
        </span>
        <Icon
          name="chevron"
          className={`h-4 w-4 shrink-0 text-forest/60 transition-transform duration-200 ${open ? 'rotate-180 text-forest' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            ref={listRef}
            role="listbox"
            data-lenis-prevent
            aria-label={ariaLabel}
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className={`absolute top-full z-50 mt-2 max-h-72 min-w-[13rem] overflow-y-auto overscroll-contain rounded-2xl border border-forest/15 bg-white p-1.5 shadow-[0_18px_45px_rgba(31,61,43,0.16)] ${
              menuAlign === 'right' ? 'right-0' : 'left-0 w-full'
            }`}
          >
            {options.map((opt) => {
              const isSelected = opt.value === value
              return (
                <li key={opt.value} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(opt.value)
                      setOpen(false)
                    }}
                    className={`flex w-full items-center justify-between gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-xs font-semibold transition sm:text-sm ${
                      isSelected
                        ? 'bg-sun/25 text-forest-dark'
                        : 'text-forest/80 hover:bg-forest/5 hover:text-forest'
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && (
                      <Icon name="check" className="h-4 w-4 shrink-0 text-forest" strokeWidth={2.4} />
                    )}
                  </button>
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

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

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const staggerChild = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 0.61, 0.36, 1] } },
}

export function StaggerGrid({ children, className = '' }) {
  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '' }) {
  return (
    <motion.div className={className} variants={staggerChild}>
      {children}
    </motion.div>
  )
}

/** Small arrow icon used on buttons. */
export function ArrowCircle({ className = '' }) {
  return (
    <Icon name="arrow" className={`h-4 w-4 shrink-0 ${className}`} strokeWidth={2.2} />
  )
}

const variants = {
  // orange with dark-green text (contrast ≈ 6:1)
  primary: 'bg-sun text-white hover:bg-sun-dark',
  outline: 'border-2 border-forest text-forest hover:bg-forest hover:text-cream',
  solid: 'bg-forest text-cream hover:bg-forest-dark',
  light: 'border-2 border-cream/80 text-cream hover:bg-white hover:text-forest',
  // frosted glass over photos (hero)
  glass: 'glass hover:bg-white/25',
  glassSun: 'glass !border-sun/70 !bg-sun/40 hover:!bg-sun/55',
}

/** Pill button. Internal paths ("/rooms") render a router <Link>, other hrefs an <a>, no href a <button>. */
export function Button({ variant = 'primary', href, children, arrow = true, icon, className = '', ...rest }) {
  const cls = `inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-full px-6 py-2.5 text-[0.95rem] font-semibold tracking-[-0.01em] transition-all duration-300 ${variants[variant]} ${className}`
  const inner = (
    <motion.span
      className="inline-flex items-center justify-center gap-3"
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      {icon && <Icon name={icon} className="h-5 w-5" />}
      <span>{children}</span>
      {arrow && <ArrowCircle />}
    </motion.span>
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

/** Plain page header used by every inner page: eyebrow, title, intro. Children render below it inside the same wrap. */
export function PageHeader({ eyebrow, title, text, children }) {
  return (
    <section className="page-top">
      <div className="wrap">
        <Reveal className="max-w-2xl">
          <p className="label">{eyebrow}</p>
          <h1 className="mt-2 font-display font-semibold text-forest type-page">{title}</h1>
          {text && <p className="mt-4 text-base leading-relaxed text-forest/75 md:text-lg">{text}</p>}
        </Reveal>
        {children}
      </div>
    </section>
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
const C = { cream: '#FFFFFF', sand: '#FFFFFF', forest: '#1F3D2B', transparent: 'transparent' }
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
