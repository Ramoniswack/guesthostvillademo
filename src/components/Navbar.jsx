'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Icon from './Icons.jsx'
import { Button } from './ui.jsx'
import { lockScroll } from '../lib/smoothScroll.js'
import { directionsLink, navLinks, site, telLink, waLink } from '../data/site.js'
import { backendWhatsAppLink, useBackendData } from '../lib/backend.jsx'

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

function Brand({ light = false, solid = false, siteData = site }) {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label={`${siteData.name}, home`}>
      <span className="grid h-8 w-8 place-items-center">
        <img src={siteData.logoImage || '/images/logo-icon.webp'} alt="" width="36" height="26" className="h-5 w-auto" />
      </span>
      <span className={`font-display text-[1.25rem] font-semibold tracking-[-0.04em] ${light ? 'text-white' : solid ? 'text-forest' : 'text-white'}`}>
        {siteData.name || "G'Host Villa"}
      </span>
    </Link>
  )
}

export default function Navbar() {
  const backend = useBackendData()
  const currentSite = backend?.site ?? site
  const currentNavLinks = backend?.navLinks ?? navLinks
  const currentTelLink = currentSite.phoneTel ? `tel:${currentSite.phoneTel}` : telLink
  const currentDirectionsLink = currentSite.directionsLink ?? directionsLink
  const ctaText = currentSite.navbarCtaWhatsappText || "Hello G'Host Villa! I'd like to book a stay."
  const ctaLabel = currentSite.navbarCtaLabel || 'Book a stay'
  const bookingLink = backendWhatsAppLink(currentSite, ctaText) ?? waLink(ctaText)
  const [open, setOpen] = useState(false)
  const [hideOnRoomsScroll, setHideOnRoomsScroll] = useState(false)
  const pathname = usePathname()
  const solid = usePastHero() || ['/rooms', '/about', '/packages', '/menu', '/faq'].some((p) => pathname.startsWith(p))
  const text = solid ? 'text-forest' : 'text-white'

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (pathname !== '/rooms') {
      setHideOnRoomsScroll(false)
      return undefined
    }
    const onScroll = () => setHideOnRoomsScroll(window.scrollY > 36)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

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
      <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${hideOnRoomsScroll ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'} ${solid ? 'border-b border-forest/10 bg-white/95 shadow-[0_10px_30px_rgba(29,45,35,0.08)] backdrop-blur-xl' : 'bg-gradient-to-b from-black/35 to-transparent'}`}>
        <div className="mx-auto flex h-[4.5rem] max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
          <Brand solid={solid} siteData={currentSite} />

          <div className="flex items-center gap-7">
            <nav aria-label="Main" className="hidden items-center gap-6 lg:flex">
              {currentNavLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => `text-[0.68rem] font-bold uppercase tracking-[0.16em] transition-opacity ${text} ${isActive ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-2.5">
              <a
                href={bookingLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`hidden min-h-10 items-center rounded-full px-6 text-[0.68rem] font-bold uppercase tracking-[0.15em] transition-colors sm:inline-flex ${solid ? 'bg-forest text-cream hover:bg-forest-dark' : 'bg-white text-forest hover:bg-white'}`}
              >
                {ctaLabel}
              </a>
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                aria-expanded={open}
                className={`grid h-10 w-10 place-items-center rounded-full border transition-colors lg:hidden ${solid ? 'border-forest/25 text-forest' : 'border-white/45 text-white'}`}
              >
                <Icon name="menu" className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {open && (
        <div role="dialog" aria-modal="true" aria-label="Menu" data-lenis-prevent className="fixed inset-0 z-50 flex flex-col lg:hidden">
          <div
            aria-hidden="true"
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-forest-dark/35 backdrop-blur-xs"
          />
          <div className="relative z-10 mx-3 mt-3 overflow-hidden rounded-3xl border border-forest/15 bg-white text-forest shadow-[0_24px_60px_rgba(20,41,29,0.22)]">
            <div className="flex h-16 items-center justify-between border-b border-forest/10 px-5">
              <Brand solid siteData={currentSite} />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid h-9 w-9 place-items-center rounded-full border border-forest/20 text-forest transition hover:bg-forest hover:text-white"
              >
                <Icon name="close" className="h-4 w-4" />
              </button>
            </div>
            <nav aria-label="Mobile" className="divide-y divide-forest/10 px-5 py-2">
              {[{ to: '/', label: 'Home' }, ...currentNavLinks].map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex min-h-[3.25rem] items-center justify-between font-display text-xl font-semibold tracking-[-0.03em] transition-colors ${
                      isActive ? 'text-sun-text' : 'text-forest hover:text-sun-text'
                    }`
                  }
                >
                  {link.label}
                  <Icon name="arrow" className="h-4 w-4" />
                </NavLink>
              ))}
            </nav>
            <div className="grid gap-2.5 border-t border-forest/10 bg-forest/[0.02] p-5">
              <a
                href={bookingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 items-center justify-center rounded-full bg-sun px-5 text-xs font-bold uppercase tracking-[0.14em] text-forest-dark transition hover:bg-sun-dark"
              >
                {ctaLabel}
              </a>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={currentTelLink}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-forest/20 bg-white px-3 text-xs font-semibold text-forest transition hover:border-forest"
                >
                  <Icon name="phone" className="h-3.5 w-3.5" />
                  <span>Call us</span>
                </a>
                <a
                  href={currentDirectionsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-forest/20 bg-white px-3 text-xs font-semibold text-forest transition hover:border-forest"
                >
                  <Icon name="nav" className="h-3.5 w-3.5" />
                  <span>Directions</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export function MobileBar() {
  const backend = useBackendData()
  const currentSite = backend?.site ?? site
  const currentTelLink = currentSite.phoneTel ? `tel:${currentSite.phoneTel}` : telLink
  const bookingLink = backendWhatsAppLink(currentSite) ?? waLink()
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-px bg-forest/20 pb-[env(safe-area-inset-bottom)] md:hidden" aria-label="Quick contact">
      <a href={currentTelLink} className="flex min-h-14 items-center justify-center gap-2 bg-white text-xs font-bold uppercase tracking-[0.12em] text-forest">
        <Icon name="phone" className="h-4 w-4" /> Call
      </a>
      <a href={bookingLink} target="_blank" rel="noopener noreferrer" className="flex min-h-14 items-center justify-center gap-2 bg-forest text-xs font-bold uppercase tracking-[0.12em] text-cream">
        <Icon name="chat" className="h-4 w-4" /> Book a stay
      </a>
    </div>
  )
}
