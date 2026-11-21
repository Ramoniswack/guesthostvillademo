'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Bath, BedDouble, CalendarDays, Check, Clock, Coffee, MessageCircle, Plus, Send, ShieldCheck, Star, Wifi,
} from 'lucide-react'
import { Button, Reveal, StaggerGrid, StaggerItem } from '../components/ui.jsx'
import { reviews } from '../data/reviews.js'
import { waLink } from '../data/site.js'

const includedEverywhere = [
  { icon: BedDouble, label: 'Private room or floor' },
  { icon: Coffee, label: 'Daily breakfast' },
  { icon: Bath, label: 'Hot water' },
  { icon: Wifi, label: 'Free Wi-Fi & parking' },
]

const packages = [
  {
    id: 'couple',
    label: 'For two',
    badge: 'Couple stay',
    popular: false,
    title: 'A quiet couple escape',
    intro: 'A warm private room, breakfast for two and wide hilltop views above Pokhara.',
    price: 'From NPR 6,800',
    note: 'per night · 1–2 adults',
    image: '/images/room-couple.webp',
    included: ['Private Mountain or City View room', 'Breakfast for two', 'Valley & Himalayan views', 'Hot water, Wi-Fi & parking'],
    extra: ['Lunch or dinner at the restro', 'Room decoration on request'],
  },
  {
    id: 'family',
    label: 'For groups',
    badge: 'Most popular',
    popular: true,
    title: 'A weekend with your people',
    intro: 'Bring family or friends for a private villa wing with room to gather, eat and slow down.',
    price: 'From NPR 1,550',
    note: 'per person · 4–12 guests',
    image: '/images/garden.webp',
    included: ['Private wing (3–4 bedrooms)', 'Welcome drink & daily breakfast', 'Garden & viewing terraces', 'Hot water, Wi-Fi & parking'],
    extra: ['BBQ platter & bonfire setup', 'MAP meal plan (+NPR 550 pp)'],
  },
  {
    id: 'buyout',
    label: 'Private buyout',
    badge: '7-BHK estate',
    popular: false,
    title: 'The whole villa, yours',
    intro: 'Take over the entire G’Host estate for a celebration, retreat or reunion with space for everyone.',
    price: 'From NPR 1,550',
    note: 'per person · 12–24 guests',
    image: '/images/pyramid.webp',
    included: ['7-BHK full estate buyout', 'Private host & kitchen team', 'Garden, dining & pyramid bar', 'Event & celebration setup'],
    extra: ['Custom multi-course group menu', 'Decorations & sound setup'],
  },
]

const extras = [
  { title: 'Breakfast at the pyramid', text: 'Start slowly with fresh breakfast and mountain air under the pyramid roof.', image: '/images/pyramid.webp' },
  { title: 'Garden BBQ & bonfire', text: 'Gather on the lawns for grilled platters, warm fire and valley lights.', image: '/images/garden.webp' },
  { title: 'Hilltop celebration setup', text: 'Flowers, custom dinner tables and flexible spaces for birthdays or retreats.', image: '/images/day-aerial.webp' },
]

const packageFaqs = [
  {
    q: 'Do you require a deposit to confirm a package?',
    a: 'Small room stays are confirmed directly on WhatsApp with no advance payment. Group bookings and full-villa buyouts may require a small booking deposit once dates and menu are finalized.',
  },
  {
    q: 'Can we add extra beds or floor mattresses for larger groups?',
    a: 'Yes. Extra beds and floor mattresses are available for larger groups and families at NPR 1,500 per extra guest per night (or included in per-person group packages).',
  },
  {
    q: 'What about food for children?',
    a: 'We prepare mild, kid-friendly meals on request at the pyramid restro. Children sharing existing beds are priced on request or at reduced child rates for group packages.',
  },
  {
    q: 'Can you arrange birthday or anniversary decorations?',
    a: 'Yes—let us know your occasion in the enquiry form or on WhatsApp and our team can set up flowers, candles, cake or garden seating.',
  },
]

export default function PackagesPage() {
  const [openFaq, setOpenFaq] = useState(0)
  const [enquiry, setEnquiry] = useState({
    occasion: 'Group weekend',
    guests: '8',
    dates: '',
    name: '',
    notes: '',
  })

  const customizePackage = (pkgTitle) => {
    const occasionMap = {
      'A quiet couple escape': 'Couple escape',
      'A weekend with your people': 'Group weekend',
      'The whole villa, yours': 'Full villa buyout',
    }
    setEnquiry((prev) => ({
      ...prev,
      occasion: occasionMap[pkgTitle] ?? prev.occasion,
      guests: pkgTitle === 'A quiet couple escape' ? '2' : pkgTitle === 'The whole villa, yours' ? '16' : '8',
    }))
    document.getElementById('package-planner')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const sendGroupEnquiry = (event) => {
    event.preventDefault()
    const lines = [
      `Hello G'Host Villa! I'd like to plan a ${enquiry.occasion} package.`,
      enquiry.guests ? `Guests: ${enquiry.guests}` : null,
      enquiry.dates ? `Dates: ${enquiry.dates}` : null,
      enquiry.name ? `Name: ${enquiry.name}` : null,
      enquiry.notes.trim() ? `Notes: ${enquiry.notes.trim()}` : null,
    ].filter(Boolean)
    window.open(waLink(lines.join('\n')), '_blank', 'noopener,noreferrer')
  }

  const field =
    'mt-1.5 w-full rounded-xl border border-forest/20 bg-white px-3.5 py-2.5 text-sm text-forest outline-none placeholder:text-forest/40 focus:border-forest'

  return (
    <>
      {/* 1 · Editorial Header & Included-Everywhere Pill Bar */}
      <section className="bg-white pb-10 pt-28 md:pb-12 md:pt-36">
        <div className="wrap">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <Reveal className="max-w-2xl">
              <p className="label">Packages · Private Stays · Group Buyouts</p>
              <h1 className="mt-2 font-display text-4xl font-semibold leading-[0.94] tracking-[-0.045em] text-forest sm:text-6xl">
                Make the stay yours.
              </h1>
              <p className="mt-4 text-base leading-relaxed text-forest/75 md:text-lg">
                Choose a clear starting package for two, a weekend with friends, or an exclusive 7-BHK buyout above Pokhara.
              </p>
            </Reveal>

            <Reveal delay={0.08} className="grid grid-cols-2 gap-2 sm:gap-2.5 lg:w-[24rem] lg:shrink-0">
              {includedEverywhere.map(({ icon: Ico, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-forest/15 bg-white px-2.5 py-2 text-[0.72rem] font-semibold text-forest shadow-sm sm:gap-2 sm:px-3.5 sm:text-xs"
                >
                  <Ico className="h-3.5 w-3.5 shrink-0 text-leaf" aria-hidden="true" />
                  <span className="truncate">{label}</span>
                </span>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* 2 · 3-Column Side-by-Side Package Tier Cards + Booking Terms */}
      <section className="bg-white pb-16 md:pb-24">
        <div className="wrap">
          <StaggerGrid className="grid gap-6 lg:grid-cols-3">
            {packages.map((pkg) => (
              <StaggerItem key={pkg.id} className="h-full">
                <article
                  className={`flex h-full flex-col overflow-hidden rounded-2xl border-2 bg-white transition hover:-translate-y-1 ${
                    pkg.popular ? 'border-sun shadow-warm' : 'border-forest/15 shadow-soft hover:border-forest/35'
                  }`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-forest-dark">
                    <img src={pkg.image} alt={pkg.title} loading="lazy" className="h-full w-full object-cover" />
                    <span
                      className={`absolute left-4 top-4 rounded-full px-3.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.12em] ${
                        pkg.popular ? 'bg-sun text-forest-dark' : 'bg-white text-forest'
                      }`}
                    >
                      {pkg.badge}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-sun-text">{pkg.label}</p>
                    <h2 className="mt-1.5 font-display text-2xl font-semibold leading-tight tracking-[-0.025em] text-forest">
                      {pkg.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-forest/70">{pkg.intro}</p>

                    <div className="mt-5 border-y border-forest/10 py-4">
                      <p className="font-display text-3xl font-bold leading-none text-forest">{pkg.price}</p>
                      <p className="mt-1.5 text-xs font-medium text-forest/60">{pkg.note}</p>
                    </div>

                    <div className="mt-5 space-y-4">
                      <div>
                        <p className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-leaf">What’s included</p>
                        <ul className="mt-2 space-y-1.5">
                          {pkg.included.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-xs font-medium leading-snug text-forest/80">
                              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-leaf" aria-hidden="true" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-sun-text">Optional add-ons</p>
                        <ul className="mt-2 space-y-1.5">
                          {pkg.extra.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-xs leading-snug text-forest/70">
                              <Plus className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sun-text" aria-hidden="true" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-auto space-y-2 pt-6">
                      <Button
                        href={waLink(`Hello G'Host Villa! I am interested in the ${pkg.title} package.`)}
                        arrow={false}
                        className="w-full"
                      >
                        <span className="inline-flex items-center gap-2">
                          <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                          <span>Plan on WhatsApp</span>
                        </span>
                      </Button>
                      <button
                        type="button"
                        onClick={() => customizePackage(pkg.title)}
                        className="inline-flex min-h-[42px] w-full items-center justify-center rounded-full border border-forest/20 bg-white px-4 text-xs font-semibold text-forest transition hover:border-forest hover:text-forest-dark"
                      >
                        Customize below ↓
                      </button>
                    </div>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerGrid>

          {/* Compact Booking Terms */}
          <div className="mt-8 grid gap-4 rounded-2xl border border-forest/15 bg-white p-5 shadow-soft md:grid-cols-3 md:p-6">
            <div className="flex items-start gap-3">
              <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-sun-text" aria-hidden="true" />
              <div>
                <p className="text-sm font-bold text-forest">Minimum stay</p>
                <p className="mt-0.5 text-xs text-forest/70">1 night for rooms &amp; groups; flexible for full buyouts.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-sun-text" aria-hidden="true" />
              <div>
                <p className="text-sm font-bold text-forest">Check-in &amp; check-out</p>
                <p className="mt-0.5 text-xs text-forest/70">Check-in from 2:00 PM · Check-out by 10:00 AM.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-leaf" aria-hidden="true" />
              <div>
                <p className="text-sm font-bold text-forest">Cancellation</p>
                <p className="mt-0.5 text-xs text-forest/70">Free cancellation within 48 hours of booking (24h+ before check-in).</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 · Add-On Experiences */}
      <section className="bg-forest-dark py-16 text-white md:py-24">
        <div className="wrap">
          <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="label !text-sun">Add a little more</p>
              <h2 className="mt-2 font-display text-4xl font-semibold leading-[0.96] tracking-[-0.04em] text-white sm:text-5xl">
                Add a little more to the stay.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-white/75">
              Pair any stay with pyramid dining, garden BBQ evenings, or celebration setups.
            </p>
          </Reveal>

          <StaggerGrid className="grid gap-6 md:grid-cols-3">
            {extras.map((item) => (
              <StaggerItem key={item.title}>
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/15 bg-forest">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-2xl font-semibold leading-tight text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/75">{item.text}</p>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* 4 · 2-Column Interactive Package Planner + Guest Reviews & FAQ */}
      <section id="package-planner" className="scroll-mt-24 bg-white py-16 md:py-24">
        <div className="wrap grid items-start gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14">
          <Reveal className="rounded-2xl border border-forest/15 bg-white p-6 shadow-soft sm:p-8">
            <p className="label">Custom package planner</p>
            <h2 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-[-0.03em] text-forest">
              Tell us your dates &amp; group size.
            </h2>
            <p className="mt-2 text-sm text-forest/70">
              Send your details directly to our Sarangkot team on WhatsApp—no payment needed now.
            </p>

            <form onSubmit={sendGroupEnquiry} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-bold uppercase tracking-[0.12em] text-forest/60">
                  Package / Occasion
                  <select
                    value={enquiry.occasion}
                    onChange={(e) => setEnquiry({ ...enquiry, occasion: e.target.value })}
                    className={`${field} normal-case tracking-normal`}
                  >
                    <option>Couple escape</option>
                    <option>Group weekend</option>
                    <option>Full villa buyout</option>
                    <option>Birthday / celebration</option>
                  </select>
                </label>
                <label className="block text-xs font-bold uppercase tracking-[0.12em] text-forest/60">
                  Guests
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={enquiry.guests}
                    onChange={(e) => setEnquiry({ ...enquiry, guests: e.target.value })}
                    className={`${field} normal-case tracking-normal`}
                  />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-bold uppercase tracking-[0.12em] text-forest/60">
                  Preferred dates
                  <input
                    value={enquiry.dates}
                    onChange={(e) => setEnquiry({ ...enquiry, dates: e.target.value })}
                    placeholder="e.g. 12–14 Nov"
                    className={`${field} normal-case tracking-normal`}
                  />
                </label>
                <label className="block text-xs font-bold uppercase tracking-[0.12em] text-forest/60">
                  Your name
                  <input
                    value={enquiry.name}
                    onChange={(e) => setEnquiry({ ...enquiry, name: e.target.value })}
                    placeholder="Full name"
                    className={`${field} normal-case tracking-normal`}
                  />
                </label>
              </div>
              <label className="block text-xs font-bold uppercase tracking-[0.12em] text-forest/60">
                Add-ons or special requests
                <textarea
                  rows={3}
                  value={enquiry.notes}
                  onChange={(e) => setEnquiry({ ...enquiry, notes: e.target.value })}
                  placeholder="BBQ, bonfire, birthday decoration, MAP meal plan…"
                  className={`${field} normal-case tracking-normal`}
                />
              </label>
              <button
                type="submit"
                className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-sun px-6 text-sm font-semibold text-forest-dark transition hover:bg-sun-dark"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                Send enquiry on WhatsApp
              </button>
            </form>
          </Reveal>

          <Reveal delay={0.08} className="space-y-8">
            <div className="space-y-4">
              <p className="label">Guest reviews</p>
              {reviews.slice(0, 2).map((r) => (
                <blockquote key={r.name} className="rounded-2xl border border-forest/15 bg-white p-5 shadow-soft">
                  <div className="flex items-center gap-1 text-sun">
                    {Array.from({ length: r.rating }, (_, i) => (
                      <Star key={i} className="h-4 w-4 fill-sun" aria-hidden="true" />
                    ))}
                  </div>
                  <p className="mt-2.5 text-sm leading-relaxed text-forest/80">“{r.text}”</p>
                  <footer className="mt-2.5 text-xs font-semibold text-forest">
                    {r.name} <span className="font-normal text-forest/55">· {r.country} · {r.source}</span>
                  </footer>
                </blockquote>
              ))}
            </div>

            <div>
              <p className="label">Package FAQ</p>
              <ul className="mt-3 divide-y divide-forest/15 border-y border-forest/15">
                {packageFaqs.map((item, idx) => {
                  const isOpen = openFaq === idx
                  return (
                    <li key={item.q}>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                        className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-semibold text-forest"
                      >
                        <span>{item.q}</span>
                        <span className="text-lg text-forest/60">{isOpen ? '−' : '+'}</span>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <p className="pb-4 text-sm leading-relaxed text-forest/75">{item.a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  )
                })}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
