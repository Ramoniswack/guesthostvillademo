'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Icon from './Icons.jsx'
import { Button, Reveal } from './ui.jsx'
import { rooms } from '../data/rooms.js'
import { telLink, waLink, site } from '../data/site.js'

const AMENITY = {
  breakfast: ['utensils', 'Breakfast included'],
  wifi: ['wifi', 'Wi-Fi'],
  bathroom: ['bath', 'Attached bath'],
  hotwater: ['flame', '24/7 Hot water'],
  ac: ['snow', 'AC & Heating'],
  coffee: ['coffee', 'Tea / coffee maker'],
  balcony: ['door', 'Private balcony'],
  toiletries: ['drop', 'Toiletries'],
  slippers: ['feet', 'Slippers'],
}

const npr = (n) => `NPR ${n.toLocaleString('en-US')}`

function RoomCard({ r }) {
  const [showFeatures, setShowFeatures] = useState(false)

  const bookingMsg = r.category === 'group'
    ? `Hello G'Host Villa! I'd like to ask about booking the ${r.name} (${r.bhk}, for ${r.capacity}). Rates starting from ${npr(r.price)}.`
    : `Hello G'Host Villa! I'd like to book the ${r.name} (${r.bhk}, ${npr(r.price)} ${r.rateType}).`

  return (
    <article className="group overflow-hidden rounded-[32px] border border-sage/20 bg-sand shadow-sm transition-all duration-300 hover:shadow-warm lg:grid lg:grid-cols-[1.1fr_1fr]">
      {/* Image container with badges */}
      <div className="relative min-h-[280px] overflow-hidden sm:min-h-[360px] lg:min-h-full">
        <img
          src={r.image}
          alt={r.alt}
          width="1200"
          height="799"
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/80 via-transparent to-black/20" />

        {/* Top Badges: BHK and Badge */}
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-forest px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-cream shadow-md">
            <Icon name="home" className="h-3.5 w-3.5 text-sun" />
            {r.bhk}
          </span>
          {r.badge && (
            <span className="inline-flex items-center gap-1 rounded-full bg-sun px-3 py-1.5 text-xs font-bold text-forest-dark shadow-md">
              <Icon name="star" className="h-3.5 w-3.5" />
              {r.badge}
            </span>
          )}
        </div>

        {/* Bottom Specs on Image */}
        <div className="absolute inset-x-4 bottom-4 flex flex-wrap items-center justify-between gap-2 text-white">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-lg bg-forest-dark/85 px-2.5 py-1 text-xs font-medium backdrop-blur-md">
              <Icon name="maximize" className="h-3.5 w-3.5 text-sun" />
              {r.measurement}
            </span>
            <span className="inline-flex items-center gap-1 rounded-lg bg-forest-dark/85 px-2.5 py-1 text-xs font-medium backdrop-blur-md">
              <Icon name="users" className="h-3.5 w-3.5 text-sun" />
              {r.capacity}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-lg bg-forest-dark/85 px-2.5 py-1 text-xs font-medium backdrop-blur-md">
            <Icon name="mountain" className="h-3.5 w-3.5 text-sun" />
            {r.view}
          </span>
        </div>
      </div>

      {/* Content Side */}
      <div className="flex flex-col p-6 sm:p-8 md:p-10">
        <div>
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-bold uppercase tracking-widest text-sun-text">{r.bhk}</p>
            <span className="text-xs text-muted">Bed: {r.bed}</span>
          </div>

          <h3 className="mt-1 font-display text-2xl font-semibold text-forest md:text-3xl">
            {r.name}
          </h3>

          <p className="mt-3 text-base leading-relaxed text-ink/80">{r.blurb}</p>
        </div>

        {/* Quick Amenities Grid */}
        <div className="mt-6 border-t border-sage/20 pt-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Key Amenities</p>
          <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2.5 text-sm text-forest sm:grid-cols-3">
            {r.amenities.slice(0, 6).map((k) => (
              <li key={k} className="flex items-center gap-2">
                <Icon name={AMENITY[k][0]} className="h-4 w-4 shrink-0 text-sage-dark" />
                <span className="truncate">{AMENITY[k][1]}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Collapsible Every Feature section */}
        <div className="mt-5 border-t border-sage/20 pt-4">
          <button
            type="button"
            onClick={() => setShowFeatures(!showFeatures)}
            className="flex w-full items-center justify-between text-left text-sm font-semibold text-forest hover:text-sun-text"
          >
            <span>{showFeatures ? 'Hide full room features' : `View all features (${r.features.length})`}</span>
            <Icon
              name="chevron"
              className={`h-4 w-4 transition-transform duration-300 ${showFeatures ? 'rotate-180 text-sun-text' : 'text-forest'}`}
            />
          </button>

          <AnimatePresence>
            {showFeatures && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <ul className="mt-3 space-y-2 rounded-2xl bg-cream/70 p-4 text-xs text-ink/85 sm:text-sm">
                  {r.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-leaf" strokeWidth={2.5} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-auto border-t border-sage/30 pt-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl font-semibold text-forest md:text-4xl" style={{ letterSpacing: '-0.03em' }}>
                  {npr(r.price)}
                </span>
                <span className="text-sm font-medium text-muted">
                  {r.rateType}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted">
                {r.priceDetails}
              </p>
            </div>
            <span className="rounded-full bg-cream px-3 py-1 text-xs font-semibold text-leaf">
              Breakfast included
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              href={waLink(bookingMsg)}
              icon="chat"
              arrow={false}
              className="flex-1 !min-h-[46px] !px-5 !py-2.5 !text-base"
            >
              Inquire on WhatsApp
            </Button>
            <Button
              href={telLink}
              variant="outline"
              icon="phone"
              arrow={false}
              className="!min-h-[46px] !px-4 !py-2.5 !text-base"
            >
              Call
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}

/** All rooms. On the home page `preview` shows top configurations with a link to the full Rooms page. */
export default function Rooms({ preview = false }) {
  const [filter, setFilter] = useState('all')

  const displayedRooms = preview
    ? rooms
    : filter === 'all'
    ? rooms
    : rooms.filter((r) => r.category === filter)

  return (
    <section id="rooms" className={preview ? 'section' : 'pb-24 pt-8 md:pb-40 md:pt-12'}>
      <div className="wrap">
        {/* Filter buttons on full rooms page */}
        {!preview && (
          <div className="flex flex-wrap justify-center gap-2.5">
            {[
              { id: 'all', label: 'All Stays & Packages' },
              { id: 'individual', label: '1 BHK Rooms (Couples & Solo)' },
              { id: 'group', label: '4 & 7 BHK Group Villas' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                  filter === tab.id
                    ? 'bg-forest text-cream shadow-sm'
                    : 'bg-sand text-forest hover:bg-sand/80'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        <div className="mt-12 space-y-10 md:mt-16 md:space-y-12">
          {displayedRooms.map((r) => (
            <Reveal key={r.id}>
              <RoomCard r={r} />
            </Reveal>
          ))}
        </div>

        {/* Highlights banner */}
        <Reveal className="mt-14 rounded-3xl bg-sand/80 p-6 sm:p-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream text-forest">
                <Icon name="home" className="h-5 w-5" />
              </span>
              <div>
                <h4 className="font-semibold text-forest">BHK &amp; Villa Sizes</h4>
                <p className="mt-1 text-sm text-muted">
                  From cozy 260 sq.ft 1 BHK rooms up to 2,800 sq.ft 7 BHK full villa estate for 20–24 guests.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream text-forest">
                <Icon name="users" className="h-5 w-5" />
              </span>
              <div>
                <h4 className="font-semibold text-forest">Group Rates from NPR 1,550</h4>
                <p className="mt-1 text-sm text-muted">
                  Enjoy shared group packages starting at NPR 1,550 per person (min. 4 guests) with welcome drinks &amp; breakfast.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream text-forest">
                <Icon name="pin" className="h-5 w-5" />
              </span>
              <div>
                <h4 className="font-semibold text-forest">20 Mins from Lakeside</h4>
                <p className="mt-1 text-sm text-muted">
                  Located along Sarangkot Road &amp; Ranipauwa with mountain air, Japanese-style architecture &amp; pyramid restro.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <p className="mt-8 text-center text-sm text-muted">
          Need a custom arrangement, family gathering, or long stay? Contact us directly via WhatsApp at{' '}
          <a href={waLink()} className="font-semibold text-forest underline hover:text-sun-text">
            {site.phoneDisplay}
          </a>{' '}
          or call{' '}
          <a href={telLink} className="font-semibold text-forest underline hover:text-sun-text">
            {site.phoneDisplay}
          </a>.
        </p>

        {preview && (
          <div className="mt-10 text-center">
            <Button href="/rooms" variant="outline">
              Explore All BHK Options &amp; Packages
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
