'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { PageHeader } from '../components/ui.jsx'
import KineticNumber from '../components/KineticNumber.jsx'
import { altTelLink, directionsLink, site, telLink, waLink } from '../data/site.js'
import { backendWhatsAppLink, useBackendData } from '../lib/backend.jsx'
import { useKitchenStatus } from '../lib/kitchen.js'

const ease = [0.22, 1, 0.36, 1]

const stats = [
  { value: 20, suffix: ' min', label: 'from Lakeside' },
  { value: 2, label: 'buildings on the ridge' },
  { value: 7, suffix: ' BHK', label: 'Main Villa' },
  { value: 24, label: 'guests, whole villa' },
]

/** Fades and lifts into place once, when it scrolls into view. */
function FadeUp({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease, delay }}
    >
      {children}
    </motion.div>
  )
}

const estateFacts = [
  { label: 'Estate layout', value: 'Crystal Pyramid Dome + 7BHK Main Villa' },
  { label: 'Architecture', value: 'Japanese-inspired ridge design & timber rooms' },
  { label: 'Dining & bar', value: 'Pyramid-roof restaurant & bottle bar on site' },
  { label: 'Location', value: 'Sarangkot Road, 20 mins above Lakeside Pokhara' },
]

const estateZones = [
  {
    id: 'pyramid',
    tab: 'Crystal Pyramid Dome',
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
    tab: 'Villa Top 2BHK Floor',
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
    tab: 'Suite & Group Wing',
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
    tab: 'Restro, Bar & Garden',
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

/** Tab labels used to carry a "01 ·" prefix; tabs are not a sequence, so strip it if CMS data still has one. */
const tabLabel = (zone) => String(zone.tab ?? zone.title).replace(/^\s*\d+\s*[·.:)\-–]\s*/, '')

export default function AboutPage() {
  const backend = useBackendData()
  const about = backend?.about
  const content = about?.content ?? {}
  const currentSite = backend?.site ?? site
  const facts = about?.estateFacts?.length ? about.estateFacts : estateFacts
  const zones = about?.estateZones?.length ? about.estateZones : estateZones
  const ledger = about?.hostingLedger?.length ? about.hostingLedger : hostingLedger
  const rules = about?.houseRules?.length ? about.houseRules : houseRules
  const facilities = about?.siteFacilities?.length ? about.siteFacilities : siteFacilities
  const whatsapp = (message) => backendWhatsAppLink(currentSite, message) ?? waLink(message)
  const tel = currentSite.phoneTel ? `tel:${currentSite.phoneTel}` : telLink
  const altTel = currentSite.altPhoneTel ? `tel:${currentSite.altPhoneTel}` : altTelLink
  const directions = currentSite.directionsLink ?? directionsLink
  const kitchen = useKitchenStatus()

  const [pickedId, setPickedId] = useState(null)
  const activeZone = zones.find((z) => z.id === pickedId) ?? zones[0]
  const tabRefs = useRef({})

  // Photo drifts slowly as you scroll past it
  const figRef = useRef(null)
  const { scrollYProgress: photoProgress } = useScroll({ target: figRef, offset: ['start end', 'end start'] })
  const photoY = useTransform(photoProgress, [0, 1], ['-7%', '7%'])

  // A thin line fills down the hosting list as you read it
  const listRef = useRef(null)
  const { scrollYProgress: listProgress } = useScroll({ target: listRef, offset: ['start 75%', 'end 55%'] })

  const selectZone = (id, focus = false) => {
    setPickedId(id)
    const el = tabRefs.current[id]
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    if (focus) el?.focus({ preventScroll: true })
  }

  const onTabKeyDown = (e) => {
    const i = zones.findIndex((z) => z.id === activeZone.id)
    let next = null
    if (e.key === 'ArrowRight') next = (i + 1) % zones.length
    else if (e.key === 'ArrowLeft') next = (i - 1 + zones.length) % zones.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = zones.length - 1
    if (next === null) return
    e.preventDefault()
    selectZone(zones[next].id, true)
  }

  const title = content.title || 'Built for the quiet side of Pokhara.'
  const link = 'inline-flex min-h-12 items-center text-base underline underline-offset-4 hover:text-sun-text'
  const solid = 'inline-flex min-h-12 items-center justify-center rounded-full bg-sun px-6 text-base font-semibold text-white transition hover:bg-sun-dark active:scale-[0.98]'
  const section = 'section-y'
const card = 'rounded-2xl border border-forest/15 bg-white shadow-soft'

  return (
    <div className="overflow-x-clip bg-white text-forest [&_h2]:font-semibold [&_h3]:font-semibold">
      {/* Masthead */}
      <PageHeader
        eyebrow={content.eyebrow || 'About · The Villa · Sarangkot'}
        title={title}
        text={content.subtitle || 'A family-run hilltop retreat above Pokhara, with Annapurna views, warm timber rooms and a team that looks after you from arrival to checkout.'}
      >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.2 }}
            className="mt-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-8"
          >
            <Link href="/rooms" className={solid}>Explore rooms</Link>
            <Link href="/packages" className={link}>View packages</Link>
          </motion.div>

          <figure ref={figRef} className="mt-12 md:mt-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease, delay: 0.3 }}
              className="overflow-hidden rounded-3xl bg-forest-dark"
            >
              <motion.img
                src={content.profileImage || '/images/day-aerial.webp'}
                alt={content.profileImageAlt || 'Aerial view of G’Host Villa buildings along the Sarangkot ridge'}
                decoding="async"
                style={{ y: photoY, scale: 1.15 }}
                className="aspect-[5/4] w-full object-cover object-[50%_58%] sm:aspect-[16/9] lg:aspect-[21/9]"
              />
            </motion.div>
            <figcaption className="t-small mt-3 text-muted">{content.profileBadge || 'Sarangkot · 20 mins from Lakeside'}</figcaption>
          </figure>

          <dl className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:mt-14 md:grid-cols-4">
            {stats.map((st, i) => (
              <FadeUp key={st.label} delay={i * 0.08} className={`${card} p-5`}>
                <dd className="font-display text-3xl font-semibold tabular-nums leading-none text-forest md:text-5xl">
                  <KineticNumber value={st.value} suffix={st.suffix} />
                </dd>
                <dt className="t-small mt-2 text-muted">{st.label}</dt>
              </FadeUp>
            ))}
          </dl>
      </PageHeader>

      {/* Story */}
      <section className="bg-forest/[0.04] section-y">
        <div className="wrap grid gap-4 md:grid-cols-2 md:gap-6">
          <FadeUp className={`${card} p-6 sm:p-8`}>
            <p className="label">The setting</p>
            <h2 className="font-display type-sub text-forest">{content.whyTitle || 'Why the Sarangkot ridge'}</h2>
            <p className="t-body mt-3 text-muted">
              {content.whyText || 'Twenty minutes uphill from Lakeside, the traffic fades into pine forest and crisp mountain air. We built on the Ranipauwa–Sarangkot ridge so guests wake up facing the Annapurna range and Phewa Valley instead of busy streets.'}
            </p>
          </FadeUp>
          <FadeUp delay={0.12} className={`${card} p-6 sm:p-8`}>
            <p className="label">The name</p>
            <h2 className="font-display type-sub text-forest">{content.meaningTitle || 'What “G’Host” means'}</h2>
            <p className="t-body mt-3 text-muted">
              {content.meaningText || 'Short for “your gracious host”—the idea that a hilltop stay should feel like visiting a well-kept family estate. From a quiet room for two to a 7BHK celebration, the same on-site team looks after your stay from arrival to checkout.'}
            </p>
          </FadeUp>
        </div>
      </section>

      {/* At a glance */}
      <section className={section}>
        <div className="wrap grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <FadeUp>
            <p className="label">The property</p>
            <h2 className="font-display type-section text-forest">{content.profileLabel || 'The property at a glance'}</h2>
          </FadeUp>
          <dl className={`${card} px-5 sm:px-7`}>
            {facts.map((fact, i) => (
              <motion.div
                key={fact.label}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, ease, delay: i * 0.07 }}
                className="grid gap-1 border-b border-forest/15 py-4 last:border-0 sm:grid-cols-[10rem_1fr] sm:gap-6"
              >
                <dt className="t-small text-muted">{fact.label}</dt>
                <dd className="text-base font-medium leading-snug">{fact.value}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </section>

      {/*Spaces */}
      <section className="bg-forest/[0.04] section-y">
        <div className="wrap">
          <FadeUp>
            <p className="label">{content.zonesEyebrow || 'Where you’ll stay'}</p>
            <h2 className="font-display type-section text-forest max-w-2xl">{content.zonesTitle || 'Four spaces, one hillside.'}</h2>
            {content.zonesSubtitle && <p className="t-body mt-3 max-w-2xl text-muted">{content.zonesSubtitle}</p>}
          </FadeUp>

          <div role="tablist" aria-label="Estate zones" onKeyDown={onTabKeyDown} className="no-scrollbar -mx-6 mt-6 flex gap-6 overflow-x-auto border-b border-forest/15 px-6 sm:mx-0 sm:px-0">
            {zones.map((zone) => {
              const selected = zone.id === activeZone.id
              return (
                <button
                  key={zone.id}
                  ref={(el) => { tabRefs.current[zone.id] = el }}
                  id={`zone-tab-${zone.id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="zone-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => selectZone(zone.id)}
                  className={`relative min-h-12 shrink-0 whitespace-nowrap text-base transition-colors ${selected ? 'font-medium text-forest' : 'text-muted hover:text-forest'}`}
                >
                  {tabLabel(zone)}
                  {selected && <motion.span layoutId="zone-underline" className="absolute inset-x-0 -bottom-px h-0.5 bg-forest" transition={{ duration: 0.35, ease }} />}
                </button>
              )
            })}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeZone.id}
              id="zone-panel"
              role="tabpanel"
              aria-labelledby={`zone-tab-${activeZone.id}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease }}
              className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-16"
            >
              <div className="overflow-hidden rounded-3xl bg-forest-dark">
                <motion.img
                  src={activeZone.image}
                  alt={activeZone.alt}
                  loading="lazy"
                  decoding="async"
                  initial={{ scale: 1.14 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.8, ease }}
                  className="aspect-[4/3] w-full object-cover lg:aspect-auto lg:h-full lg:min-h-[26rem]"
                />
              </div>
              <div>
                <p className="t-small text-muted">{activeZone.tag}</p>
                <h3 className="t-h3 mt-1 sm:text-2xl">{activeZone.title}</h3>
                <p className="t-body mt-3 text-muted">{activeZone.description}</p>
                <dl className={`${card} mt-6 px-5`}>
                  {activeZone.specs.map((spec, i) => (
                    <motion.div
                      key={spec.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, ease, delay: 0.15 + i * 0.08 }}
                      className="grid gap-1 border-b border-forest/15 py-3.5 last:border-0 sm:grid-cols-[8.5rem_1fr] sm:gap-4"
                    >
                      <dt className="t-small text-muted">{spec.label}</dt>
                      <dd className="text-base leading-snug">{spec.value}</dd>
                    </motion.div>
                  ))}
                </dl>
                <ul className="mt-4 flex flex-col sm:flex-row sm:flex-wrap sm:gap-x-6">
                  {activeZone.links.map((l) => (
                    <li key={l.href}><Link href={l.href} className={link}>{l.label}</Link></li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Hosting */}
      <section className={section}>
        <div className="wrap grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <FadeUp className="lg:sticky lg:top-28">
            <p className="label">{content.hostingEyebrow || 'Hosting'}</p>
            <h2 className="font-display type-section text-forest">{content.hostingTitle || 'Personal hosting, not a front desk.'}</h2>
            <p className="t-body mt-4 text-muted">
              {content.hostingSubtitle || 'Instead of fixed hotel packages or distant call centres, our Sarangkot kitchen and hosting crew tailor rooms, meals and outdoor setups directly around your group.'}
            </p>
            {kitchen && (
              <p className="t-small mt-4 inline-flex items-center gap-2.5 text-forest">
                <span className="relative flex h-2.5 w-2.5">
                  {kitchen.open && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60 motion-reduce:hidden" />}
                  <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${kitchen.open ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                </span>
                Kitchen: {kitchen.label}
              </p>
            )}
            <div>
              <a
                href={whatsapp("Hello G'Host Villa! I'd like to talk through a stay with the hosting team.")}
                target="_blank"
                rel="noopener noreferrer"
                className={`${solid} mt-5 w-full sm:w-auto`}
              >
                {content.hostingCtaLabel || 'Message us on WhatsApp'}
              </a>
            </div>
          </FadeUp>

          <ul ref={listRef} className="space-y-3">
            {ledger.map((item, i) => (
              <motion.li
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease, delay: 0.05 }}
                className={`${card} p-5 sm:p-6`}
              >
                <p className="text-[0.9375rem] font-semibold tabular-nums text-sun-text">{item.number || String(i + 1).padStart(2, '0')}</p>
                <h3 className="font-display type-item mt-1 text-forest">{item.title}</h3>
                <p className="t-body mt-2 text-muted">{item.text}</p>
                {item.tags?.length > 0 && (
                  <p className="mt-3 flex flex-wrap gap-2">
                    {item.tags.map((tag) => <span key={tag} className="rounded-full bg-forest/[0.06] px-3 py-1 text-[0.875rem] text-forest">{tag}</span>)}
                  </p>
                )}
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* Good to know */}
      <section className="bg-forest/[0.04] section-y">
        <div className="wrap">
          <FadeUp>
            <p className="label">{content.standardsEyebrow || 'Before you arrive'}</p>
            <h2 className="font-display type-section text-forest max-w-2xl">{content.standardsTitle || 'Good to know'}</h2>
            <p className="t-body mt-3 text-muted">{currentSite.hours}</p>
          </FadeUp>

          <div className="mt-8 grid gap-4 md:grid-cols-3 md:gap-6">
            <FadeUp className={`${card} p-6`}>
              <h3 className="font-display type-item text-forest">Check-in &amp; house rhythm</h3>
              <ul className="mt-4 space-y-3">{rules.map((r) => <li key={r} className="t-body text-muted">{r}</li>)}</ul>
            </FadeUp>
            <FadeUp delay={0.1} className={`${card} p-6`}>
              <h3 className="font-display type-item text-forest">On-site facilities</h3>
              <ul className="mt-4 space-y-3">{facilities.map((f) => <li key={f} className="t-body text-muted">{f}</li>)}</ul>
            </FadeUp>
            <FadeUp delay={0.2} className={`${card} p-6`}>
              <h3 className="font-display type-item text-forest">Direct desk &amp; address</h3>
              <p className="t-body mt-4 text-muted">{currentSite.address}</p>
              <div className="mt-2 flex flex-col">
                <a href={tel} className={link}>{currentSite.phoneDisplay}</a>
                {currentSite.altPhoneDisplay && <a href={altTel} className={link}>{currentSite.altPhoneDisplay}</a>}
                <a href={`mailto:${currentSite.email}`} className={`${link} break-all`}>{currentSite.email}</a>
                <a href={directions} target="_blank" rel="noopener noreferrer" className={link}>Get directions</a>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>
    </div>
  )
}
