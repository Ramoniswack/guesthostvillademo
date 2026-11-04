'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Icon from './Icons.jsx'
import { Button } from './ui.jsx'
import { lockScroll } from '../lib/smoothScroll.js'
import { directionsLink, navLinks, site, telLink, waLink } from '../data/site.js'

function usePastHero() {
  const [past, setPast] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const check = () => {
      const hero = document.querySelector('[data-hero]')
      setPast(window.scrollY > (hero ? hero.offsetHeight - 84 : 36))
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

function NavLink({ to, className, children, ...rest }) {
  const pathname = usePathname()
  const isActive = pathname === to || (to !== '/' && pathname.startsWith(`${to}/`))
  return (
    <Link href={to} className={className({ isActive })} aria-current={isActive ? 'page' : undefined} {...rest}>
      {children}
    </Link>
  )
}

function Brand({ light = false, solid = false }) {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label={`${site.name}, home`}>
      <span className={`grid h-8 w-8 place-items-center border transition-colors ${light ? 'border-white/55' : solid ? 'border-forest/25' : 'border-white/45'}`}>
        <img src="/images/logo-icon.webp" alt="" width="36" height="26" className="h-5 w-auto" />
      </span>
      <span className={`font-display text-[1.25rem] font-semibold tracking-[-0.04em] ${light ? 'text-white' : solid ? 'text-forest' : 'text-white'}`}>
        G&apos;Host Villa
      </span>
    </Link>
  )
}

export default function Navbar() {
  const solid = usePastHero()
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const text = solid ? 'text-forest' : 'text-white'

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    lockScroll(open)
    const onKey = (event) => event.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      lockScroll(false)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${solid ? 'border-b border-forest/10 bg-cream/95 shadow-[0_10px_30px_rgba(29,45,35,0.08)] backdrop-blur-xl' : 'bg-gradient-to-b from-black/35 to-transparent'}`}>
        <div className="mx-auto flex h-[4.5rem] max-w-[1440px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-12">
          <Brand solid={solid} />

          <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `text-[0.68rem] font-bold uppercase tracking-[0.16em] transition-opacity ${text} ${isActive ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={waLink('Hello G\'Host Villa! I\'d like to book a stay.')}
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden min-h-10 items-center px-5 text-[0.68rem] font-bold uppercase tracking-[0.15em] transition-colors sm:inline-flex ${solid ? 'bg-forest text-cream hover:bg-forest-dark' : 'bg-white text-forest hover:bg-cream'}`}
            >
              Book a stay
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className={`grid h-10 w-10 place-items-center border transition-colors lg:hidden ${solid ? 'border-forest/25 text-forest' : 'border-white/45 text-white'}`}
            >
              <Icon name="menu" className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div role="dialog" aria-modal="true" aria-label="Menu" data-lenis-prevent className="on-dark fixed inset-0 z-50 flex flex-col overflow-y-auto bg-[#07120f] text-white">
          <div className="flex h-[4.5rem] shrink-0 items-center justify-between px-5 sm:px-8">
            <Brand light />
            <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="grid h-10 w-10 place-items-center border border-white/30">
              <Icon name="close" className="h-5 w-5" />
            </button>
          </div>
          <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center px-6 py-10">
            {[{ to: '/', label: 'Home' }, ...navLinks].map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `flex min-h-[4.7rem] items-center justify-between border-b border-white/15 font-display text-[2rem] font-semibold tracking-[-0.04em] ${isActive ? 'text-sun' : 'text-white'}`}
              >
                {link.label}
                <Icon name="arrow" className="h-5 w-5" />
              </NavLink>
            ))}
          </nav>
          <div className="grid gap-3 px-6 pb-9">
            <a href={waLink('Hello G\'Host Villa! I\'d like to book a stay.')} target="_blank" rel="noopener noreferrer" className="flex min-h-14 items-center justify-center bg-sun px-5 text-sm font-bold uppercase tracking-[0.14em] text-forest-dark">
              Book a stay
            </a>
            <Button href={telLink} variant="light" arrow={false} icon="phone">Call {site.phoneDisplay}</Button>
            <Button href={directionsLink} variant="light" arrow={false} icon="nav">Get directions</Button>
          </div>
        </div>
      )}
    </>
  )
}

export function MobileBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-px bg-forest/20 md:hidden" aria-label="Quick contact">
      <a href={telLink} className="flex min-h-14 items-center justify-center gap-2 bg-cream text-xs font-bold uppercase tracking-[0.12em] text-forest">
        <Icon name="phone" className="h-4 w-4" /> Call
      </a>
      <a href={waLink()} target="_blank" rel="noopener noreferrer" className="flex min-h-14 items-center justify-center gap-2 bg-forest text-xs font-bold uppercase tracking-[0.12em] text-cream">
        <Icon name="chat" className="h-4 w-4" /> Book a stay
      </a>
    </div>
  )
}
