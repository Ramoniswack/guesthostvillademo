'use client'

import { useState } from 'react'
import {
  Bath, BedDouble, CalendarDays, Check, Clock, Coffee, MessageCircle, Plus, Send, ShieldCheck, Sparkles, Star, Users, Wifi,
} from 'lucide-react'
import { PageHero, Button, Reveal } from '../components/ui.jsx'
import CtaBanner from '../components/CtaBanner.jsx'
import { reviews } from '../data/reviews.js'
import { waLink } from '../data/site.js'

const includedEverywhere = [
  { icon: BedDouble, label: 'Private room or floor' },
  { icon: Coffee, label: 'Daily breakfast' },
  { icon: Bath, label: 'Hot water' },
  { icon: Wifi, label: 'Free high-speed Wi-Fi' },
]

const packages = [
  {
    id: 'couple',
    label: 'For two',
    tabPrice: 'From NPR 6,800',
    title: 'A quiet couple escape',
    intro: 'A warm private room, breakfast for two and a hilltop view that makes the weekend feel longer.',
    price: 'From NPR 6,800',
    note: 'per night · 1–2 adults',
    image: '/images/room-couple.webp',
    included: ['Private Mountain or City View room', 'Breakfast for two', 'Valley and mountain views', 'Hot water, Wi-Fi and parking'],
    extra: ['Lunch or dinner at the restro', 'Room decoration on request'],
  },
  {
    id: 'family',
    label: 'For groups',
    tabPrice: 'From NPR 1,550 pp',
    title: 'A weekend with your people',
    intro: 'Bring family or friends for a private villa section with room to gather, eat and slow down.',
    price: 'From NPR 1,550',
    note: 'per person · 4–12 guests',
    image: '/images/garden.webp',
    included: ['Private villa section (3–4 bedrooms)', 'Welcome drink and daily breakfast', 'Garden and viewing terraces', 'Hot water, Wi-Fi and parking'],
    extra: ['BBQ platter & bonfire setup', 'MAP meal plan (+NPR 550 pp)'],
  },
  {
    id: 'buyout',
    label: 'Private buyout',
    tabPrice: 'From NPR 1,550 pp',
    title: 'The whole villa, yours',
    intro: 'Take over the full G’Host estate for a celebration, retreat or reunion with space for everyone.',
    price: 'From NPR 1,550',
    note: 'per person · 12–24 guests',
    image: '/images/pyramid.webp',
    included: ['7-BHK full estate buyout', 'Private host and kitchen team', 'Garden, dining and pyramid bar access', 'Event & celebration setup support'],
    extra: ['Custom multi-course group menu', 'Decorations & sound setup'],
  },
]

const comparisonRows = [
  ['Couple escape', '1–2 guests', 'From NPR 6,800 per night', 'NPR 1,500 per night', 'On request'],
  ['Group weekend', '4–12 guests', 'From NPR 1,550 per person', 'NPR 1,550 per person', 'NPR 950 per person'],
  ['Full villa buyout', '12–24 guests', 'From NPR 1,550 per person', 'On request', 'On request'],
]

const extras = [
  { title: 'Breakfast at the pyramid', text: 'Start slowly with fresh breakfast and mountain air.', image: '/images/pyramid.webp' },
  { title: 'A table in the garden', text: 'Make room for shared meals, BBQ and long conversations.', image: '/images/garden.webp' },
  { title: 'A hilltop reset', text: 'Step away from the city without going far from Pokhara.', image: '/images/day-aerial.webp' },
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
  const [activeId, setActiveId] = useState('couple')
  const [openFaq, setOpenFaq] = useState(0)
  const [enquiry, setEnquiry] = useState({ name: '', dates: '', guests: '8', occasion: 'Group weekend' })

  const jumpToPackage = (id) => {
    setActiveId(id)
    document.getElementById(`pkg-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const sendGroupEnquiry = (event) => {
    event.preventDefault()
    const lines = [
      `Hello G'Host Villa! I'd like to enquire about a ${enquiry.occasion} package.`,
      enquiry.guests ? `Guests: ${enquiry.guests}` : null,
      enquiry.dates ? `Dates: ${enquiry.dates}` : null,
      enquiry.name ? `Name: ${enquiry.name}` : null,
    ].filter(Boolean)
    window.open(waLink(lines.join('\n')), '_blank', 'noopener,noreferrer')
  }

  const field = 'mt-1.5 w-full rounded-xl border border-forest/20 bg-white px-3.5 py-2.5 text-sm text-forest outline-none placeholder:text-forest/40 focus:border-forest'

  return (
    <>
      {/* 1 · Hero */}
      <PageHero
        eyebrow="Packages · private stays · villa experiences"
        title="Make the stay yours."
        text="Choose a package that fits the way you are travelling—from a quiet couple escape to a full G’Host Villa buyout above Pokhara."
        image="/images/pyramid.webp"
        position="50% 52%"
        center
        compact
      />

      {/* 2 · Included in every package strip */}
      <section className="border-b border-forest/10 bg-white py-6">
        <div className="wrap flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-sun-text">Included in every package</p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold text-forest">
            {includedEverywhere.map(({ icon: Ico, label }) => (
              <li key={label} className="inline-flex items-center gap-2">
                <Ico className="h-4 w-4 text-leaf" aria-hidden="true" />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3 · Package tabs + all three package cards */}
      <section className="bg-white py-16 md:py-24">
        <div className="wrap">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="label">Package deals</p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-[0.96] tracking-[-0.04em] text-forest sm:text-5xl">
              Pick the kind of escape you’re after.
            </h2>
          </Reveal>

          {/* Tabs with prices */}
          <div role="tablist" aria-label="Stay packages" className="mx-auto mt-8 grid max-w-4xl gap-3 sm:grid-cols-3">
            {packages.map((item) => {
              const on = activeId === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => jumpToPackage(item.id)}
                  className={`flex flex-col items-center justify-center rounded-2xl border px-4 py-3.5 text-center transition ${
                    on
                      ? 'border-forest bg-forest text-cream shadow-soft'
                      : 'border-forest/15 bg-white/60 text-forest hover:border-forest/40'
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-[0.12em]">{item.label}</span>
                  <span className={`mt-1 text-xs font-medium ${on ? 'text-sun' : 'text-forest/65'}`}>{item.tabPrice}</span>
                </button>
              )
            })}
          </div>

          {/* All 3 packages visible without needing a click */}
          <div className="mt-10 space-y-6">
            {packages.map((pkg) => {
              const selected = activeId === pkg.id
              return (
                <Reveal
                  key={pkg.id}
                  className={`overflow-hidden rounded-2xl border-2 bg-white transition ${
                    selected ? 'border-sun shadow-warm' : 'border-forest/12 shadow-soft'
                  }`}
                >
                  <article id={`pkg-${pkg.id}`} className="grid lg:grid-cols-[0.85fr_1.15fr]">
                    <div className="relative overflow-hidden bg-forest-dark">
                      <img src={pkg.image} alt={pkg.title} loading="lazy" className="h-64 w-full object-cover lg:h-full" />
                    </div>
                    <div className="flex flex-col p-6 sm:p-8 lg:p-10">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-sun-text">{pkg.label}</p>
                      <h3 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-[-0.03em] text-forest sm:text-4xl">
                        {pkg.title}
                      </h3>
                      <p className="mt-3 max-w-xl text-sm leading-relaxed text-forest/75">{pkg.intro}</p>

                      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-4 border-y border-forest/10 py-4">
                        <div>
                          <p className="font-display text-3xl font-bold leading-none text-forest">{pkg.price}</p>
                          <p className="mt-1 text-xs text-forest/60">{pkg.note}</p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-forest">Customizable</span>
                      </div>

                      <div className="mt-5 grid gap-5 sm:grid-cols-2">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.12em] text-leaf">What’s included</p>
                          <ul className="mt-2.5 space-y-2">
                            {pkg.included.map((f) => (
                              <li key={f} className="flex items-start gap-2 text-sm text-forest/80">
                                <Check className="mt-0.5 h-4 w-4 shrink-0 text-leaf" aria-hidden="true" />
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.12em] text-sun-text">Optional extras</p>
                          <ul className="mt-2.5 space-y-2">
                            {pkg.extra.map((f) => (
                              <li key={f} className="flex items-start gap-2 text-sm text-forest/70">
                                <Plus className="mt-0.5 h-4 w-4 shrink-0 text-sun-text" aria-hidden="true" />
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-7">
                        <Button href={waLink(`Hello G'Host Villa! I am interested in the ${pkg.title} package.`)}>
                          Plan this stay
                        </Button>
                      </div>
                    </div>
                  </article>
                </Reveal>
              )
            })}
          </div>

          {/* Booking terms block */}
          <div className="mt-8 grid gap-4 rounded-2xl border border-forest/15 bg-white p-6 md:grid-cols-3">
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

          {/* 4 · Clean Comparison Table */}
          <Reveal className="mt-14 overflow-hidden rounded-2xl border border-forest/15 bg-white p-6 sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="label">Package comparison</p>
                <h2 className="mt-2 font-display text-3xl font-semibold leading-none tracking-[-0.03em] text-forest sm:text-4xl">
                  Compare at a glance.
                </h2>
              </div>
              <p className="max-w-sm text-xs leading-relaxed text-forest/65">
                Consistent starting rates across couple stays, group weekends and private buyouts.
              </p>
            </div>
            <div className="mt-6 overflow-x-auto rounded-xl border border-forest/10">
              <table className="min-w-[640px] w-full border-collapse text-left text-sm">
                <thead className="bg-forest text-cream">
                  <tr>
                    <th className="px-4 py-3.5 font-semibold">Package</th>
                    <th className="px-4 py-3.5 font-semibold">Group size</th>
                    <th className="px-4 py-3.5 font-semibold">Starting rate</th>
                    <th className="px-4 py-3.5 font-semibold">Extra adult</th>
                    <th className="px-4 py-3.5 font-semibold">Child</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, idx) => (
                    <tr key={row[0]} className={idx % 2 === 0 ? 'bg-white/40' : 'bg-white'}>
                      {row.map((cell, ci) => (
                        <td key={`${row[0]}-${ci}`} className={`border-t border-forest/10 px-4 py-3.5 ${ci === 0 ? 'font-semibold text-forest' : 'text-forest/75'}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 5 · Extras ("Add a little more to the stay") */}
      <section className="bg-forest-dark py-16 text-cream md:py-24">
        <div className="wrap">
          <Reveal className="mx-auto mb-10 max-w-3xl text-center">
            <p className="label !text-sun">Optional extras</p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-[0.96] tracking-[-0.04em] text-cream sm:text-5xl">
              Add a little more to the stay.
            </h2>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {extras.map((item) => (
              <article key={item.title} className="group overflow-hidden rounded-2xl bg-white text-forest">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={item.image} alt={item.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl font-semibold leading-tight tracking-[-0.025em]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-forest/70">{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 6 · Group Enquiry Form + Real Guest Reviews */}
      <section className="bg-white py-16 md:py-24">
        <div className="wrap grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-14">
          {/* Group-booking enquiry form */}
          <Reveal className="rounded-2xl border border-forest/15 bg-white p-6 shadow-soft sm:p-8">
            <p className="label">Group &amp; buyout enquiry</p>
            <h2 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-[-0.03em] text-forest">
              Ask about dates or a custom plan.
            </h2>
            <form onSubmit={sendGroupEnquiry} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-bold uppercase tracking-[0.12em] text-forest/60">
                  Occasion
                  <select value={enquiry.occasion} onChange={(e) => setEnquiry({ ...enquiry, occasion: e.target.value })} className={`${field} normal-case tracking-normal`}>
                    <option>Couple escape</option>
                    <option>Group weekend</option>
                    <option>Full villa buyout</option>
                    <option>Birthday / celebration</option>
                  </select>
                </label>
                <label className="block text-xs font-bold uppercase tracking-[0.12em] text-forest/60">
                  Guests
                  <input type="number" min="1" max="30" value={enquiry.guests} onChange={(e) => setEnquiry({ ...enquiry, guests: e.target.value })} className={`${field} normal-case tracking-normal`} />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-bold uppercase tracking-[0.12em] text-forest/60">
                  Preferred dates
                  <input value={enquiry.dates} onChange={(e) => setEnquiry({ ...enquiry, dates: e.target.value })} placeholder="e.g. 12–14 Nov" className={`${field} normal-case tracking-normal`} />
                </label>
                <label className="block text-xs font-bold uppercase tracking-[0.12em] text-forest/60">
                  Your name
                  <input value={enquiry.name} onChange={(e) => setEnquiry({ ...enquiry, name: e.target.value })} placeholder="Full name" className={`${field} normal-case tracking-normal`} />
                </label>
              </div>
              <button type="submit" className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-sun px-6 text-sm font-semibold text-forest-dark transition hover:bg-sun-dark">
                <Send className="h-4 w-4" aria-hidden="true" />
                Send enquiry on WhatsApp
              </button>
            </form>
          </Reveal>

          {/* Real guest reviews */}
          <Reveal delay={0.1} className="space-y-4">
            <p className="label">Guest reviews</p>
            <h2 className="font-display text-3xl font-semibold leading-tight tracking-[-0.03em] text-forest">
              What groups &amp; couples say.
            </h2>
            {reviews.slice(0, 2).map((r) => (
              <blockquote key={r.name} className="rounded-2xl border border-forest/12 bg-white p-6 shadow-soft">
                <div className="flex items-center gap-1 text-sun">
                  {Array.from({ length: r.rating }, (_, i) => (
                    <Star key={i} className="h-4 w-4 fill-sun" aria-hidden="true" />
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-forest/80">“{r.text}”</p>
                <footer className="mt-3 text-xs font-semibold text-forest">
                  {r.name} <span className="font-normal text-forest/55">· {r.country} · {r.source}</span>
                </footer>
              </blockquote>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 7 · Package FAQ */}
      <section className="bg-white py-16 md:py-24">
        <div className="wrap max-w-3xl">
          <Reveal className="text-center">
            <p className="label">Package FAQ</p>
            <h2 className="mt-2 font-display text-3xl font-semibold leading-none tracking-[-0.03em] text-forest sm:text-4xl">
              Common questions.
            </h2>
          </Reveal>
          <ul className="mt-8 divide-y divide-forest/15 border-y border-forest/15">
            {packageFaqs.map((item, idx) => {
              const isOpen = openFaq === idx
              return (
                <li key={item.q}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="flex w-full items-center justify-between gap-4 py-4 text-left font-semibold text-forest"
                  >
                    <span>{item.q}</span>
                    <span className="text-xl text-forest/60">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && <p className="pb-4 text-sm leading-relaxed text-forest/75">{item.a}</p>}
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* 8 · One closing call to action */}
      <CtaBanner />
    </>
  )
}
