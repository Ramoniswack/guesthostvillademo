'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Icon from './Icons.jsx'
import { Button } from './ui.jsx'
import { lockScroll } from '../lib/smoothScroll.js'
import { site, telLink, waLink, directionsLink, navLinks } from '../data/site.js'

/**
 * Floating navbar. A glass pill holds the logo and links.
 * Over the hero it is see-through glass; once the hero has scrolled away the pill turns solid.
 * Every page opens with a [data-hero] banner, which is what we measure.
 */
function usePastHero() {
  const [past, setPast] = useState(false)
  const pathname = usePathname()
  useEffect(() => {
    const check = () => {
      const hero = document.querySelector('[data-hero]')
      const limit = hero ? hero.offsetHeight - 110 : 40
      setPast(window.scrollY > limit)
    }
    check()
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return () => {
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [pathname])
  return past
}

/** Link that knows whether it points at the current page. */
function NavLink({ to, end, className, children, ...rest }) {
  const pathname = usePathname()
  const isActive = end ? pathname === to : pathname === to || pathname.startsWith(to + '/')
  return (
    <Link href={to} className={className({ isActive })} aria-current={isActive ? 'page' : undefined} {...rest}>
      {children}
    </Link>
  )
}

export default function Navbar() {
  const solid = usePastHero()
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => setOpen(false), [pathname])

  // lock page scroll + close on Escape while the mobile menu is open
  useEffect(() => {
    lockScroll(open)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      lockScroll(false)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const Logo = ({ light }) => (
    <Link href="/" className="flex items-center gap-2.5" aria-label={`${site.name}, home`}>
      <img src="/images/logo-icon.webp" alt="" width="52" height="37" className="h-8 w-auto" />
      <span className={`font-display text-[1.35rem] font-semibold transition-colors duration-300 ${light ? 'text-white' : solid ? 'text-forest' : 'text-white'}`} style={{ letterSpacing: '-0.03em' }}>
        {site.name}
      </span>
    </Link>
  )

  const pill = solid
    ? 'border border-sage/30 bg-cream text-ink shadow-[0_10px_30px_-12px_rgba(47,74,58,.4)]'
    : 'glass'

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-6 sm:pt-4">
        <div className={`mx-auto flex h-[3.75rem] max-w-[1240px] items-center justify-between gap-4 rounded-full py-2 pl-5 pr-2.5 transition-all duration-500 ${pill}`}>
          <Logo />

          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `rounded-full px-5 py-2 text-[1.0625rem] font-medium transition-colors duration-300 ${
                    solid
                      ? isActive ? 'bg-sand text-forest' : 'text-ink hover:bg-sand/70'
                      : isActive ? 'bg-white/25 text-white' : 'text-white/90 hover:bg-white/15'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button href={telLink} arrow={false} icon="phone" className="hidden !min-h-[44px] !px-5 !py-2 sm:inline-flex">
              Book / Call Now
            </Button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors lg:hidden ${solid ? 'bg-sand text-forest' : 'bg-white/20 text-white'}`}
            >
              <Icon name="menu" className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen mobile menu (dark glass) */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          data-lenis-prevent
          className="on-dark fixed inset-0 z-50 flex flex-col overflow-y-auto bg-forest-dark/90 text-white backdrop-blur-2xl lg:hidden"
        >
          <div className="flex h-[4.5rem] shrink-0 items-center justify-between px-6">
            <Logo light />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white"
            >
              <Icon name="close" className="h-6 w-6" />
            </button>
          </div>
          <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center px-6 py-6">
            {[{ to: '/', label: 'Home' }, ...navLinks].map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `flex min-h-[72px] items-center justify-between border-b border-white/15 font-display text-[2.25rem] font-semibold ${isActive ? 'text-sun' : 'text-white'}`
                }
                style={{ letterSpacing: '-0.03em' }}
              >
                {l.label}
                <Icon name="chevronR" className="h-6 w-6 text-white/60" />
              </NavLink>
            ))}
          </nav>
          <div className="grid gap-3 px-6 pb-10">
            <Button href={telLink} arrow={false} icon="phone">Call {site.phoneDisplay}</Button>
            <Button href={waLink()} variant="glass" arrow={false} icon="chat">WhatsApp us</Button>
            <Button href={directionsLink} variant="glass" arrow={false} icon="nav">Get Directions</Button>
          </div>
        </div>
      )}
    </>
  )
}

/** Fixed bottom bar on phones: Call / WhatsApp / Directions. */
export function MobileBar() {
  const base =
    'flex min-h-[56px] flex-col items-center justify-center gap-0.5 rounded-2xl text-[0.8rem] font-semibold leading-none'
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 gap-2 border-t border-sage/30 bg-cream/90 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden"
      aria-label="Quick contact"
    >
      <a href={telLink} className={`${base} bg-sun text-forest-dark`}>
        <Icon name="phone" className="h-5 w-5" /> Call
      </a>
      <a href={waLink()} target="_blank" rel="noopener noreferrer" className={`${base} bg-forest text-cream`}>
        <Icon name="chat" className="h-5 w-5" /> WhatsApp
      </a>
      <a href={directionsLink} target="_blank" rel="noopener noreferrer" className={`${base} border-2 border-forest text-forest`}>
        <Icon name="nav" className="h-5 w-5" /> Directions
      </a>
    </div>
  )
}
