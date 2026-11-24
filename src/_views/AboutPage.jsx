'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight, Check, Clock, Compass, MapPin, MessageCircle, Phone, ShieldCheck, Wifi,
} from 'lucide-react'
import { Button, Reveal, StaggerGrid, StaggerItem } from '../components/ui.jsx'
import { directionsLink, site, telLink, waLink } from '../data/site.js'
import { backendWhatsAppLink, useBackendData } from '../lib/backend.jsx'

const estateFacts = [
  { label: 'Estate layout', value: 'Crystal Pyramid Dome + 7BHK Main Villa' },
  { label: 'Architecture', value: 'Japanese-inspired ridge design & timber rooms' },
  { label: 'Dining & bar', value: 'Pyramid-roof restaurant & bottle bar on site' },
  { label: 'Location', value: 'Sarangkot Road, 20 mins above Lakeside Pokhara' },
]

const estateZones = [
  {
    id: 'pyramid',
    tab: '01 · Crystal Pyramid Dome',
    tag: 'Pyramid Building · 2 Bedrooms',
    title: 'Crystal Pyramid Dome House',
    description:
      'A standalone glass-topped dome house with two private bedrooms: one facing the Annapurna peaks and one overlooking Pokhara city lights. Take a single room or book the entire dome.',
    image: '/images/pyramid.webp',
    alt: 'Crystal Pyramid Dome House at G’Host Villa',
    specs: [
      { label: 'Rooms', value: 'Mountain View (MV) & City View (CV)' },
      { label: 'Group size', value: '1–4 per room · up to 7 for whole dome' },
      { label: 'Starting rate', value: 'From NPR 5,800 / night (BB included)' },
    ],
    links: [
      { label: 'Mountain View Room', href: '/rooms/mountain-view-room' },
      { label: 'City View Room', href: '/rooms/city-view-room' },
      { label: 'Entire Dome House', href: '/rooms/pyramid-dome-house' },
    ],
  },
  {
    id: 'top-floor',
    tab: '02 · Villa Top 2BHK Floor',
    tag: 'Main Villa · Upper Floor',
    title: 'Entire 2BHK Top Floor',
    description:
      'Designed for families and close friends who want a full private apartment on the ridge: two interlocking bedrooms, four beds including living-area and sun beds, hall-cum-dining, kitchen, and balcony.',
    image: '/images/hero.webp',
    alt: 'Main Villa upper 2BHK floor overlooking Pokhara valley',
    specs: [
      { label: 'Layout', value: '2 interlocking bedrooms · hall · kitchen · balcony' },
      { label: 'Group size', value: '2–4 standard · up to 6 guests' },
      { label: 'Starting rate', value: 'NPR 8,500 – 12,500 / night' },
    ],
    links: [
      { label: 'Villa Top (2BHK)', href: '/rooms/villa-top-floor' },
      { label: 'See packages', href: '/packages' },
    ],
  },
  {
    id: 'ground-wing',
    tab: '03 · Suite & Group Wing',
    tag: 'Main Villa · Ground Level',
    title: 'Ground-Floor Suite & Private Group Section',
    description:
      'Flexible ground-level spaces stepping straight toward the garden. Choose the Suite for two to four, or take the 3-bedroom Private Group Section priced transparently per person.',
    image: '/images/room-deluxe.webp',
    alt: 'Warm timber bedroom in the ground wing of G’Host Villa',
    specs: [
      { label: 'Layout', value: 'Suite (2 rooms + mini single) · 3-bed Group Wing' },
      { label: 'Group size', value: '2–4 in Suite · 4–8 in Group · up to 24 whole villa' },
      { label: 'Starting rate', value: 'Suite from NPR 4,500 · Group NPR 1,550 pp' },
    ],
    links: [
      { label: 'Suite', href: '/rooms/suite' },
      { label: 'Private Group Section', href: '/rooms/group-section' },
      { label: 'Whole Villa (7BHK)', href: '/rooms/whole-villa' },
    ],
  },
  {
    id: 'restro-garden',
    tab: '04 · Restro, Bar & Garden',
    tag: 'Dining & Outdoor Grounds',
    title: 'Pyramid Restro, Bottle Bar & Garden Lawn',
    description:
      'The social heart of the hillside. Mornings begin with hot breakfast at the pyramid; afternoons spill onto the garden lawns with the elephant statue; evenings gather around the BBQ fireplace.',
    image: '/images/garden.webp',
    alt: 'Garden lawn and outdoor dining area at G’Host Villa',
    specs: [
      { label: 'Kitchen hours', value: 'Open daily · 7:00 AM – 10:00 PM' },
      { label: 'Menu highlights', value: 'Nepali, Newari, momo, wood-fired plates & BBQ' },
      { label: 'Meal upgrade', value: 'MAP dinner/lunch plan available on any stay' },
    ],
    links: [
      { label: 'Food & drinks menu', href: '/menu' },
      { label: 'Group packages', href: '/packages' },
    ],
  },
]

const hostingLedger = [
  {
    number: '01',
    title: 'Kitchen & table timing',
    text: 'Breakfast is prepared fresh each morning, and the pyramid restro and bottle bar run daily from 7:00 AM to 10:00 PM for Nepali, Newari, pizza and grill plates.',
    tags: ['Daily 7 AM – 10 PM', 'Freshly cooked'],
  },
  {
    number: '02',
    title: 'Private spaces that scale',
    text: 'Modular buildings and separate entrances let a couple enjoy complete quiet in the dome, or let 24 guests take over the entire 7BHK estate together.',
    tags: ['2 to 24 guests', 'Modular layouts'],
  },
  {
    number: '03',
    title: 'Celebrations without rigid rules',
    text: 'Sprawling lawns, an outdoor BBQ fireplace and evening bonfire setups can be arranged around birthdays, family reunions and small retreats.',
    tags: ['Outdoor BBQ & fire', 'Custom setups'],
  },
  {
    number: '04',
    title: 'Direct WhatsApp coordination',
    text: 'Speak directly with our on-site Sarangkot team—no automated desks or third-party handoffs—for transport, extra beds, meal plans or arrival timing.',
    tags: ['On-site team', 'No prepayment'],
  },
]

const houseRules = [
  'Check-in from 2:00 PM · Check-out by 10:00 AM',
  'Free cancellation within 48 hours (24h+ before arrival)',
  'Quiet hillside hours at night so every guest rests well',
  'Extra beds & floor mattresses available for larger groups',
]

const siteFacilities = [
  'Free on-site parking for cars & scooters',
  'High-speed Wi-Fi across both buildings',
  'Attached bathrooms with hot water in stays',
  'Garden lawns, sun deck & bottle bar access',
]

export default function AboutPage() {
  const backend = useBackendData()
  const about = backend?.about
  const content = about?.content ?? {}
  const currentSite = backend?.site ?? site
  const currentEstateFacts = about?.estateFacts?.length ? about.estateFacts : estateFacts
  const currentEstateZones = about?.estateZones?.length ? about.estateZones : estateZones
  const currentHostingLedger = about?.hostingLedger?.length ? about.hostingLedger : hostingLedger
  const currentHouseRules = about?.houseRules?.length ? about.houseRules : houseRules
  const currentFacilities = about?.siteFacilities?.length ? about.siteFacilities : siteFacilities
  const currentWhatsApp = (message) => backendWhatsAppLink(currentSite, message) ?? waLink(message)
  const currentTelLink = currentSite.phoneTel ? `tel:${currentSite.phoneTel}` : telLink
  const currentDirectionsLink = currentSite.directionsLink ?? directionsLink
  const [activeZoneId, setActiveZoneId] = useState(estateZones[0].id)
  const activeZone = currentEstateZones.find((z) => z.id === activeZoneId) ?? currentEstateZones[0]

  useEffect(() => {
    if (!currentEstateZones.some((zone) => zone.id === activeZoneId) && currentEstateZones.length) {
      setActiveZoneId(currentEstateZones[0].id)
    }
  }, [activeZoneId, currentEstateZones])

  return (
    <>
      {/* 1 · Editorial Masthead & Estate Profile Card */}
      <section className="bg-white pb-16 pt-28 md:pb-20 md:pt-36">
        <div className="wrap">
          <Reveal>
            <p className="label">{content.eyebrow || 'About G’Host Villa · Sarangkot Ridge, Pokhara'}</p>
            <h1 className="mt-3 max-w-4xl font-display text-4xl font-semibold leading-[0.94] tracking-[-0.045em] text-forest sm:text-6xl lg:text-[4.5rem]">
              {content.title || 'Built for the quiet side of Pokhara.'}
            </h1>
          </Reveal>

          <Reveal delay={0.08} className="mt-8 grid gap-6 border-t border-forest/15 pt-8 md:grid-cols-2 md:gap-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-sun-text">{content.whyTitle || 'Why the Sarangkot ridge'}</p>
              <p className="mt-2.5 text-base leading-relaxed text-forest/80">
                {content.whyText || 'Twenty minutes uphill from Lakeside, the traffic fades into pine forest and crisp mountain air. We built on the Ranipauwa–Sarangkot ridge so guests wake up facing the Annapurna range and Phewa Valley instead of busy streets.'}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-sun-text">{content.meaningTitle || 'What “G’Host” means'}</p>
              <p className="mt-2.5 text-base leading-relaxed text-forest/80">
                {content.meaningText || 'Short for “your gracious host”—the idea that a hilltop stay should feel like visiting a well-kept family estate. From a quiet room for two to a 7BHK celebration, the same on-site team looks after your stay from arrival to checkout.'}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.14} className="mt-12 overflow-hidden rounded-2xl border border-forest/15 bg-forest-dark text-white shadow-warm">
            <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
              <div className="relative min-h-[18rem] overflow-hidden sm:min-h-[24rem]">
                <img
                  src={content.profileImage || '/images/day-aerial.webp'}
                  alt={content.profileImageAlt || 'Aerial view of G’Host Villa buildings along the Sarangkot ridge'}
                  className="h-full w-full object-cover object-[50%_58%]"
                />
                <span className="absolute left-4 top-4 rounded-full bg-sun px-3.5 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.13em] text-forest-dark">
                  {content.profileBadge || 'Sarangkot · 20 mins from Lakeside'}
                </span>
              </div>

              <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-sun">{content.profileLabel || 'Property profile'}</p>
                  <dl className="mt-5 divide-y divide-white/15 border-y border-white/15">
                    {currentEstateFacts.map((fact) => (
                      <div key={fact.label} className="py-3.5">
                        <dt className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-white/60">
                          {fact.label}
                        </dt>
                        <dd className="mt-1 text-sm font-semibold text-white">{fact.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Button href="/rooms">Explore rooms</Button>
                  <Button href="/packages" variant="light" arrow={false}>
                    View packages
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2 · Interactive "Inside the Estate" Zone Explorer */}
      <section className="bg-forest-dark py-16 text-white md:py-24">
        <div className="wrap">
          <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="label !text-sun">{content.zonesEyebrow || 'Inside the estate'}</p>
              <h2 className="mt-2 font-display text-4xl font-semibold leading-[0.96] tracking-[-0.04em] text-white sm:text-5xl">
                {content.zonesTitle || 'Four spaces, one hillside.'}
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-white/70">
              {content.zonesSubtitle || 'Select a wing or gathering area to see its layout, guest fit, and rooms.'}
            </p>
          </Reveal>

          <div role="tablist" aria-label="Estate zones" className="mb-6 flex flex-wrap gap-2.5">
            {currentEstateZones.map((zone) => {
              const selected = zone.id === activeZoneId
              return (
                <button
                  key={zone.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveZoneId(zone.id)}
                  className={`rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] transition ${
                    selected
                      ? 'bg-sun text-forest-dark shadow-soft'
                      : 'border border-white/20 bg-white/5 text-white/80 hover:border-white/40 hover:text-white'
                  }`}
                >
                  {zone.tab}
                </button>
              )
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeZone.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
              className="overflow-hidden rounded-2xl border border-white/15 bg-forest shadow-warm"
            >
              <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
                <div className="relative aspect-[16/11] overflow-hidden lg:aspect-auto">
                  <img
                    src={activeZone.image}
                    alt={activeZone.alt}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-sun px-3.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-forest-dark">
                    {activeZone.tag}
                  </span>
                </div>

                <div className="flex flex-col p-6 sm:p-8 lg:p-10">
                  <h3 className="font-display text-3xl font-semibold leading-tight tracking-[-0.03em] text-white">
                    {activeZone.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/75 sm:text-base">
                    {activeZone.description}
                  </p>

                  <dl className="mt-6 divide-y divide-white/10 border-y border-white/10">
                    {activeZone.specs.map((spec) => (
                      <div key={spec.label} className="flex flex-wrap items-baseline justify-between gap-2 py-3 text-sm">
                        <dt className="text-xs font-bold uppercase tracking-[0.12em] text-white/50">
                          {spec.label}
                        </dt>
                        <dd className="font-semibold text-white">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-auto pt-6">
                    <p className="mb-2.5 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-sun">
                      Direct links
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {activeZone.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-sun hover:text-forest-dark hover:border-sun"
                        >
                          <span>{link.label}</span>
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* 3 · "How We Host" — Sticky Split + Numbered Editorial Ledger */}
      <section className="border-t border-forest/15 bg-white py-16 md:py-24">
        <div className="wrap grid items-start gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
          <Reveal className="lg:sticky lg:top-28">
            <p className="label">{content.hostingEyebrow || 'How we host'}</p>
            <h2 className="mt-2 font-display text-4xl font-semibold leading-[0.96] tracking-[-0.04em] text-forest sm:text-5xl">
              {content.hostingTitle || 'Personal hosting, not a front desk.'}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-forest/75">
              {content.hostingSubtitle || 'Instead of fixed hotel packages or distant call centres, our Sarangkot kitchen and hosting crew tailor rooms, meals and outdoor setups directly around your group.'}
            </p>
            <div className="mt-7">
              <Button
                href={currentWhatsApp("Hello G'Host Villa! I'd like to talk through a stay with the hosting team.")}
                arrow={false}
              >
                <span className="inline-flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{content.hostingCtaLabel || 'Message the team on WhatsApp'}</span>
                </span>
              </Button>
            </div>
          </Reveal>

          <StaggerGrid className="space-y-4">
            {currentHostingLedger.map((item) => (
              <StaggerItem key={item.number}>
                <article className="flex flex-col gap-4 rounded-2xl border border-forest/15 bg-white p-6 shadow-soft sm:flex-row sm:items-start sm:gap-5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sun font-display text-base font-bold text-forest-dark">
                    {item.number}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="font-display text-2xl font-semibold leading-tight text-forest">
                        {item.title}
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-forest/15 bg-white px-2.5 py-1 text-[0.68rem] font-semibold text-forest/75"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="mt-2.5 text-sm leading-relaxed text-forest/75">{item.text}</p>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* 4 · Property Standards & Direct Contact Desk */}
      <section className="bg-forest-dark py-16 text-white md:py-20">
        <div className="wrap">
          <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="label !text-sun">{content.standardsEyebrow || 'Good to know'}</p>
              <h2 className="mt-2 font-display text-4xl font-semibold leading-[0.96] tracking-[-0.04em] text-white sm:text-5xl">
                {content.standardsTitle || 'Property standards & direct desk.'}
              </h2>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/65">
              {currentSite.hours}
            </p>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-3">
            <Reveal className="flex flex-col rounded-2xl border border-white/15 bg-forest p-7">
              <div className="flex items-center gap-2.5">
                <Clock className="h-5 w-5 text-sun" aria-hidden="true" />
                <h3 className="font-display text-xl font-semibold text-white">Check-in &amp; house rhythm</h3>
              </div>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-white/85">
                {currentHouseRules.map((rule) => (
                  <li key={rule} className="flex items-start gap-2.5">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sun" aria-hidden="true" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.06} className="flex flex-col rounded-2xl border border-white/15 bg-forest p-7">
              <div className="flex items-center gap-2.5">
                <Wifi className="h-5 w-5 text-sun" aria-hidden="true" />
                <h3 className="font-display text-xl font-semibold text-white">On-site facilities</h3>
              </div>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-white/85">
                {currentFacilities.map((facility) => (
                  <li key={facility} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-sun" aria-hidden="true" />
                    <span>{facility}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.12} className="flex flex-col rounded-2xl border border-white/15 bg-forest p-7">
              <div className="flex items-center gap-2.5">
                <Compass className="h-5 w-5 text-sun" aria-hidden="true" />
                <h3 className="font-display text-xl font-semibold text-white">Direct desk &amp; address</h3>
              </div>
              <div className="mt-5 space-y-3 text-sm text-white/85">
                <p className="leading-relaxed">{currentSite.address}</p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-sun" aria-hidden="true" />
                  <a href={currentTelLink} className="font-semibold hover:text-sun">
                    {currentSite.phoneDisplay}
                  </a>
                  <span className="text-white/40">·</span>
                  <span>{currentSite.altPhoneDisplay}</span>
                </p>
                <p>
                  <a href={`mailto:${currentSite.email}`} className="underline decoration-sun/60 underline-offset-4 hover:text-sun">
                    {currentSite.email}
                  </a>
                </p>
              </div>
              <div className="mt-auto pt-6">
                <Button href={currentDirectionsLink} variant="primary" arrow={false} className="w-full">
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>Get Directions</span>
                  </span>
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
