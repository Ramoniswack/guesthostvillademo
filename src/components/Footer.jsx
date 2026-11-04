'use client'

import Link from 'next/link'
import Icon from './Icons.jsx'
import { Divider, ridgePath } from './ui.jsx'
import { site, telLink, waLink, navLinks } from '../data/site.js'

// jagged mountain silhouettes (step is wide, so the line reads as peaks)
const RIDGE_BACK = ridgePath({ h: 120, base: 60, steps: 40, waves: [[28, 90, 0.5], [14, 41, 1.3]] })
const RIDGE_FRONT = ridgePath({ h: 120, base: 82, steps: 48, waves: [[20, 70, 2], [10, 33, 0.2]] })

const socials = [
  { icon: 'insta', label: 'Instagram', href: site.social.instagram },
  { icon: 'fb', label: 'Facebook', href: site.social.facebook },
  { icon: 'chat', label: 'WhatsApp', href: waLink() },
  { icon: 'globe', label: 'TripAdvisor', href: site.social.tripadvisor },
  { icon: 'bed', label: 'Booking.com', href: site.social.booking },
]

export default function Footer() {
  const row = 'flex items-start gap-3 text-lg hover:underline'
  return (
    <footer className="on-dark bg-forest text-cream">
      <Divider prev="cream" next="forest" />
      <div className="wrap grid gap-16 pb-16 pt-12 lg:grid-cols-[1.4fr_0.7fr_0.8fr]">
        <div>
          <h2 className="font-display text-4xl font-semibold md:text-5xl">Come say hello</h2>
          <ul className="mt-6 space-y-3">
            <li><a href={`mailto:${site.email}`} className={row}><Icon name="mail" className="mt-1 h-5 w-5 shrink-0 text-sun" />{site.email}</a></li>
            <li><a href={telLink} className={row}><Icon name="phone" className="mt-1 h-5 w-5 shrink-0 text-sun" />{site.phoneDisplay}</a></li>
            <li><a href={waLink()} target="_blank" rel="noopener noreferrer" className={row}><Icon name="chat" className="mt-1 h-5 w-5 shrink-0 text-sun" />WhatsApp {site.whatsappDisplay}</a></li>
            <li className="flex items-start gap-3 text-lg"><Icon name="pin" className="mt-1 h-5 w-5 shrink-0 text-sun" />{site.address}</li>
            <li className="flex items-start gap-3 text-lg"><Icon name="clock" className="mt-1 h-5 w-5 shrink-0 text-sun" />{site.hours}</li>
          </ul>
        </div>

        <nav aria-label="Footer">
          <h3 className="text-base font-semibold text-sage-light">Quick links</h3>
          <ul className="mt-4 space-y-1">
            {[{ to: '/', label: 'Home' }, ...navLinks].map((l) => (
              <li key={l.to}>
                <Link href={l.to} className="inline-flex min-h-[44px] items-center text-lg hover:underline">{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="text-base font-semibold text-sage-light">Follow &amp; book</h3>
          <ul className="mt-4 space-y-1">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center gap-3 text-lg hover:underline">
                  <Icon name={s.icon} className="h-5 w-5 text-sun" /> {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* mountain silhouette + giant wordmark */}
      <div className="relative overflow-hidden pt-6">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block h-14 w-full text-forest-dark md:h-20" fill="currentColor" aria-hidden="true">
          <path opacity="0.55" d={RIDGE_BACK} />
          <path d={RIDGE_FRONT} />
        </svg>
        <div className="bg-forest-dark pb-6">
          <div className="wrap flex items-center justify-center gap-[2vw] pt-2">
            <span className="flex shrink-0 items-center rounded-[2vw] bg-cream p-[1.6vw] md:p-[1.2vw]">
              <img src="/images/logo-icon.webp" alt="" className="h-[7vw] w-auto md:h-[6vw]" />
            </span>
            <p className="font-display text-[11.5vw] font-semibold leading-none text-cream md:text-[9.5vw]" aria-label="G'Host Villa">
              G'HOST VILLA
            </p>
          </div>
          <p className="wrap mt-4 text-center text-base text-sage-light">
            Hotel &amp; Restaurant · Sarangkot, Pokhara
          </p>
          <p className="wrap mt-2 pb-16 text-center text-sm text-cream/70 md:pb-0">
            © {new Date().getFullYear()} {site.fullName}
          </p>
        </div>
      </div>
    </footer>
  )
}
