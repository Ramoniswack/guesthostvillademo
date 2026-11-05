'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Icon from './Icons.jsx'
import { Button, Reveal } from './ui.jsx'
import { rooms } from '../data/rooms.js'
import { telLink, waLink } from '../data/site.js'

const npr = (value) => `NPR ${value.toLocaleString('en-US')}`

const bookingModes = [
  { id: 'all', label: 'All spaces', description: 'Compare every way to stay at G’Host.' },
  { id: 'couple', label: 'For two', description: 'A private suite for slow, scenic stays.', roomIds: ['couple-deluxe'] },
  { id: 'private', label: 'Private room', description: 'Your own hillside room with garden calm.', roomIds: ['hilltop-double'] },
  { id: 'group', label: 'Group villa', description: 'A private wing for families and friend groups.', roomIds: ['four-bhk-wing'] },
  { id: 'buyout', label: 'Entire villa buyout', description: 'The full estate, entirely yours.', roomIds: ['seven-bhk-full-villa'] },
]

function SpaceCard({ room, index }) {
  const bookingMessage = room.category === 'group'
    ? `Hello G'Host Villa! I would like to enquire about the ${room.name} for ${room.capacity}.`
    : `Hello G'Host Villa! I would like to book the ${room.name} for ${room.capacity}.`

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="group overflow-hidden border border-forest/15 bg-cream transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-forest/10"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-forest-dark">
        <img src={room.image} alt={room.alt} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/90 via-forest-dark/10 to-transparent" />
        <span className="absolute left-4 top-4 bg-sun px-3 py-2 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-forest-dark">{room.badge}</span>
        <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3 text-cream">
          <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-cream/70">From</p><p className="mt-1 font-display text-3xl leading-none">{npr(room.price)}</p></div>
          <p className="text-right text-xs font-semibold uppercase tracking-[0.1em] text-cream/80">{room.rateType}</p>
        </div>
      </div>

      <div className="p-6 sm:p-7">
        <div className="flex flex-wrap gap-2 text-xs font-semibold text-forest/75">
          <span className="inline-flex items-center gap-1.5 bg-sand px-2.5 py-1.5"><Icon name="users" className="h-3.5 w-3.5 text-sun-text" />{room.capacity}</span>
          <span className="inline-flex items-center gap-1.5 bg-sand px-2.5 py-1.5"><Icon name="home" className="h-3.5 w-3.5 text-sun-text" />{room.bhk}</span>
        </div>
        <p className="mt-5 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-sun-text">{room.view}</p>
        <h2 className="mt-2 font-display text-3xl font-semibold leading-[0.95] tracking-[-0.04em] text-forest">{room.name}</h2>
        <p className="mt-4 line-clamp-3 leading-relaxed text-forest/70">{room.blurb}</p>
        <details className="mt-5 border-y border-forest/10 py-3 text-sm text-forest/75">
          <summary className="cursor-pointer font-semibold text-forest">What’s included</summary>
          <ul className="mt-3 space-y-2 leading-relaxed">{room.features.slice(0, 4).map((feature) => <li key={feature} className="flex gap-2"><span className="text-sun-text">•</span>{feature}</li>)}</ul>
        </details>
        <p className="mt-4 text-xs leading-relaxed text-forest/60">{room.priceDetails}</p>
        <div className="mt-6 grid grid-cols-[1fr_auto] gap-3">
          <Button href={waLink(bookingMessage)} icon="chat" arrow={false} className="!min-h-11 !rounded-none !px-4 !py-2 !text-sm">Check availability</Button>
          <Button href={telLink} variant="outline" icon="phone" arrow={false} className="!min-h-11 !rounded-none !px-4 !py-2 !text-sm">Call</Button>
        </div>
      </div>
    </motion.article>
  )
}

export default function Rooms({ preview = false }) {
  const [activeMode, setActiveMode] = useState('all')
  const mode = bookingModes.find((item) => item.id === activeMode) ?? bookingModes[0]
  const visibleRooms = preview
    ? rooms.slice(0, 2)
    : mode.roomIds ? rooms.filter((room) => mode.roomIds.includes(room.id)) : rooms

  return (
    <section id="rooms" className={preview ? 'section bg-cream' : 'bg-cream py-20 md:py-28'}>
      <div className="wrap">
        {!preview && <Reveal className="grid gap-7 border-b border-forest/15 pb-10 md:grid-cols-[1fr_auto] md:items-end"><div><p className="label">The G’Host collection</p><h2 className="max-w-2xl font-display text-5xl font-semibold leading-[0.94] tracking-[-0.05em] text-forest sm:text-6xl">Book the room, wing or whole villa that fits your plans.</h2></div><p className="max-w-sm leading-relaxed text-forest/70">Every stay is private in its own way—from a balcony for two to an estate exclusively for your group.</p></Reveal>}

        {!preview && <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-5" aria-label="Choose a booking type">{bookingModes.map((item) => <button key={item.id} type="button" onClick={() => setActiveMode(item.id)} aria-pressed={activeMode === item.id} className={`min-h-28 border p-4 text-left transition ${activeMode === item.id ? 'border-forest bg-forest text-cream shadow-lg shadow-forest/15' : 'border-forest/15 bg-sand text-forest hover:border-forest/45'}`}><span className="block text-xs font-bold uppercase tracking-[0.14em]">{item.label}</span><span className={`mt-3 block text-sm leading-snug ${activeMode === item.id ? 'text-cream/70' : 'text-forest/60'}`}>{item.description}</span></button>)}</div>}

        {!preview && <div className="mt-12 flex flex-wrap items-center justify-between gap-4"><div><p className="label !mb-1">{mode.label}</p><p className="text-forest/65">{mode.description}</p></div><p className="text-sm font-semibold text-forest/60">{visibleRooms.length} {visibleRooms.length === 1 ? 'space' : 'spaces'} available to enquire about</p></div>}

        <div className={`grid gap-7 ${preview ? 'mt-10 md:grid-cols-2' : 'mt-9 md:grid-cols-2 xl:grid-cols-3'}`}>
          {visibleRooms.map((room, index) => <SpaceCard key={room.id} room={room} index={index} />)}
        </div>

        {!preview && <Reveal className="mt-14 grid gap-7 bg-sand p-7 md:grid-cols-[1fr_auto] md:items-center md:p-10"><div><p className="label">Need something custom?</p><h3 className="mt-2 font-display text-4xl leading-none tracking-[-0.04em] text-forest">Tell us who’s coming. We’ll shape the stay around you.</h3><p className="mt-4 max-w-2xl leading-relaxed text-forest/70">Birthday weekends, family reunions, company off-sites and long stays can include the right mix of rooms, food, garden space and private moments.</p></div><Button href={waLink('Hello G\'Host Villa! I would like help planning a custom stay, group booking or full villa buyout.')}>Plan a custom stay</Button></Reveal>}
      </div>
    </section>
  )
}
