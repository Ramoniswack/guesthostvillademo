'use client'

import Link from 'next/link'
import Icon from './Icons.jsx'
import { gallery } from '../data/gallery.js'
import { directionsLink, navLinks, site, telLink, waLink } from '../data/site.js'

const socials = [
  { icon: 'insta', label: 'Instagram', href: site.social.instagram },
  { icon: 'fb', label: 'Facebook', href: site.social.facebook },
  { icon: 'globe', label: 'eSewa Hotels', href: site.social.esewa },
]

export default function Footer() {
  return (
    <footer className="on-dark overflow-hidden bg-[#07120f] text-cream">
      <section className="relative isolate min-h-[28rem] overflow-hidden border-b border-white/10 sm:min-h-[32rem]">
        <img src="/images/night-aerial.webp" alt="G'Host Villa glowing above Pokhara after dusk" className="absolute inset-0 -z-20 h-full w-full object-cover object-center" loading="lazy" />
        <div className="absolute inset-0 -z-10 bg-[#07120f]/70" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#07120f]/85 via-[#07120f]/35 to-[#07120f]/70" />
        <div className="mx-auto flex min-h-[28rem] max-w-[1440px] items-end px-6 py-12 sm:min-h-[32rem] sm:px-10 sm:py-16 lg:px-14">
          <div className="max-w-2xl">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-sun">Sarangkot, Pokhara</p>
            <h2 className="mt-4 font-display text-5xl font-semibold leading-[0.95] tracking-[-0.055em] text-white sm:text-7xl">
              Your next escape starts up here.
            </h2>
            <p className="mt-5 max-w-lg text-lg text-white/80">A private villa stay, a table with a view, and a slower pace for a little while.</p>
            <a href={waLink('Hello G\'Host Villa! I\'d like to book a stay.')} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex min-h-12 items-center bg-sun px-6 text-[0.7rem] font-bold uppercase tracking-[0.15em] text-forest-dark transition-colors hover:bg-sun-dark">
              Book a stay
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-sage-light">From the hilltop</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">Follow G&apos;Host Villa</h2>
          </div>
          <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-sun hover:text-white">
            @the_g_host_villa_pokhara <Icon name="arrow" className="h-4 w-4" />
          </a>
        </div>
        <div className="mt-8 grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
          {gallery.slice(0, 6).map((photo) => (
            <a key={photo.src} href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="group aspect-square overflow-hidden bg-forest-dark">
              <img src={photo.src} alt={photo.alt} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-110 group-hover:opacity-80" />
            </a>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-12 sm:px-10 md:grid-cols-[1.3fr_0.7fr_0.9fr] lg:px-14 lg:py-16">
          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-sage-light">Come stay awhile</p>
            <p className="mt-4 max-w-md font-display text-3xl font-semibold leading-[1.05] tracking-[-0.04em] text-white">A villa, restro and bar above the city lights.</p>
            <a href={directionsLink} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sun hover:text-white">
              Get directions <Icon name="arrow" className="h-4 w-4" />
            </a>
          </div>
          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-sage-light">Explore</p>
            <ul className="mt-4 space-y-2.5">
              {[{ to: '/', label: 'Home' }, ...navLinks].map((link) => (
                <li key={link.to}><Link href={link.to} className="text-base text-white/80 transition-colors hover:text-sun">{link.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-sage-light">Get in touch</p>
            <ul className="mt-4 space-y-3 text-base text-white/80">
              <li><a href={telLink} className="transition-colors hover:text-sun">{site.phoneDisplay}</a></li>
              <li><a href={waLink()} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-sun">WhatsApp us</a></li>
              <li><a href={`mailto:${site.email}`} className="transition-colors hover:text-sun">{site.email}</a></li>
            </ul>
            <div className="mt-6 flex gap-3">
              {socials.map((social) => (
                <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} className="grid h-9 w-9 place-items-center border border-white/25 text-white transition-colors hover:border-sun hover:bg-sun hover:text-forest-dark">
                  <Icon name={social.icon} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-white/10 px-4 pt-8 text-center sm:px-8">
        <p className="whitespace-nowrap font-display text-[15vw] font-semibold leading-[0.72] tracking-[-0.075em] text-white sm:text-[12vw]">G&apos;HOST VILLA</p>
        <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-2 py-7 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-sage-light sm:flex-row sm:items-center sm:justify-between">
          <span>Restro &amp; Bar · Sarangkot, Pokhara</span>
          <span>© {new Date().getFullYear()} G&apos;Host Villa</span>
        </div>
      </div>
    </footer>
  )
}
