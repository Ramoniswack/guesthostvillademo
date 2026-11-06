'use client'

import { useState } from 'react'
import Link from 'next/link'
import Icon from '../components/Icons.jsx'
import { Button, Reveal } from '../components/ui.jsx'
import CtaBanner from '../components/CtaBanner.jsx'
import { rooms } from '../data/rooms.js'
import { reviews } from '../data/reviews.js'
import { waLink } from '../data/site.js'

const galleryFor = (room) => [room.image, '/images/pyramid.webp', '/images/day-aerial.webp', '/images/garden.webp', '/images/night-aerial.webp']

function formatNpr(value) {
  return `NPR ${value.toLocaleString('en-US')}`
}

export default function RoomDetailPage({ room }) {
  const [guests, setGuests] = useState(2)
  const [selectedDate, setSelectedDate] = useState('')
  const gallery = galleryFor(room)
  const relatedRooms = rooms.filter((item) => item.id !== room.id).slice(0, 3)
  const quote = reviews[0]

  return (
    <main className="bg-cream pb-10 pt-24 md:pt-28">
      <div className="wrap">
        <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-forest/50"><Link href="/rooms" className="hover:text-forest">Rooms</Link><span>/</span><span className="text-forest/75">{room.name}</span></nav>

        <Reveal className="mb-8 flex flex-col justify-between gap-6 border-b border-forest/15 pb-7 lg:flex-row lg:items-end"><div><p className="label">{room.badge}</p><h1 className="mt-3 max-w-4xl font-display text-5xl font-semibold leading-[0.94] tracking-[-0.05em] text-forest sm:text-6xl">{room.name}</h1><p className="mt-4 flex items-center gap-2 text-sm text-forest/65"><Icon name="mountain" className="h-4 w-4 text-sun-text" />{room.view}</p></div><div className="flex items-end justify-between gap-5 lg:flex-col lg:items-end"><div className="text-right"><p className="text-xs font-bold uppercase tracking-[0.14em] text-forest/50">From</p><p className="mt-1 font-display text-3xl leading-none text-forest">{formatNpr(room.price)}</p><p className="mt-1 text-xs text-forest/60">{room.rateType}</p></div><Button href={waLink(`Hello G'Host Villa! I would like to reserve the ${room.name}.`)}>Reserve this room</Button></div></Reveal>

        <section aria-label="Room gallery" className="grid gap-3 md:grid-cols-[1.35fr_0.65fr] md:grid-rows-2"><img src={gallery[0]} alt={room.alt} className="h-[22rem] w-full object-cover md:row-span-2 md:h-[34rem]" /><div className="grid grid-cols-2 gap-3 md:contents"><img src={gallery[1]} alt="The G’Host Villa pyramid restaurant" className="h-44 w-full object-cover md:h-full" /><img src={gallery[2]} alt="G’Host Villa above Pokhara" className="h-44 w-full object-cover md:h-full" /><img src={gallery[3]} alt="G’Host Villa garden" className="h-44 w-full object-cover md:h-full" /><div className="relative h-44 overflow-hidden bg-forest-dark md:h-full"><img src={gallery[4]} alt="G’Host Villa at night" className="h-full w-full object-cover opacity-75" /><span className="absolute inset-0 grid place-items-center font-semibold text-cream">View all photos</span></div></div></section>

        <section className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start"><div><div className="grid grid-cols-2 gap-px border-y border-forest/15 bg-forest/15 sm:grid-cols-4"><div className="bg-sand p-4"><p className="text-xs font-bold uppercase tracking-[0.12em] text-forest/50">Space</p><p className="mt-2 text-sm font-semibold text-forest">{room.measurement}</p></div><div className="bg-sand p-4"><p className="text-xs font-bold uppercase tracking-[0.12em] text-forest/50">Sleeps</p><p className="mt-2 text-sm font-semibold text-forest">{room.capacity}</p></div><div className="bg-sand p-4"><p className="text-xs font-bold uppercase tracking-[0.12em] text-forest/50">Bed</p><p className="mt-2 text-sm font-semibold text-forest">{room.bed}</p></div><div className="bg-sand p-4"><p className="text-xs font-bold uppercase tracking-[0.12em] text-forest/50">Included</p><p className="mt-2 text-sm font-semibold text-forest">Breakfast</p></div></div><div className="mt-10"><p className="label">About this space</p><h2 className="mt-3 font-display text-4xl leading-none tracking-[-0.04em] text-forest">A hilltop room made for slowing down.</h2><p className="mt-5 max-w-3xl leading-relaxed text-forest/70">{room.blurb} Every stay includes the warm essentials of G’Host Villa, with easy access to the pyramid restro, garden and views across Pokhara.</p><ul className="mt-7 grid gap-3 sm:grid-cols-2">{room.features.slice(0, 8).map((feature) => <li key={feature} className="flex gap-2 text-sm text-forest/75"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-sun-text" />{feature}</li>)}</ul></div></div><aside className="border border-forest/15 bg-sand p-5 lg:sticky lg:top-28"><p className="label">Plan your stay</p><h2 className="mt-3 font-display text-3xl leading-none text-forest">Check availability</h2><label className="mt-6 block text-xs font-bold uppercase tracking-[0.12em] text-forest/55">Check in<input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} className="mt-2 w-full border border-forest/15 bg-cream px-3 py-3 text-sm text-forest" /></label><div className="mt-4"><span className="block text-xs font-bold uppercase tracking-[0.12em] text-forest/55">Guests</span><div className="mt-2 flex items-center justify-between border border-forest/15 bg-cream px-3 py-2 text-forest"><button type="button" aria-label="Remove guest" onClick={() => setGuests((value) => Math.max(1, value - 1))} className="grid h-8 w-8 place-items-center border border-forest/20">−</button><span className="font-semibold">{guests}</span><button type="button" aria-label="Add guest" onClick={() => setGuests((value) => Math.min(24, value + 1))} className="grid h-8 w-8 place-items-center border border-forest/20">+</button></div></div><div className="mt-6 border-t border-forest/15 pt-5"><p className="text-xs text-forest/55">Starting from</p><p className="mt-1 font-display text-3xl text-forest">{formatNpr(room.price)}</p><Button className="mt-5 w-full" href={waLink(`Hello G'Host Villa! I would like to check availability for ${room.name}.`)}>Check availability</Button></div></aside></section>

        <section className="mt-20 border-t border-forest/15 pt-12"><Reveal><p className="label">Guest reviews</p><div className="mt-5 grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start"><div><p className="font-display text-6xl leading-none text-forest">4.5<span className="text-2xl text-sun-text">★</span></p><p className="mt-2 text-sm text-forest/60">Based on 379+ Google reviews</p></div><blockquote className="max-w-3xl font-display text-3xl leading-tight tracking-[-0.035em] text-forest">“{quote.text}”<footer className="mt-5 text-sm font-semibold text-forest/60">{quote.name} · {quote.source}</footer></blockquote></div></Reveal></section>

        <section className="mt-20 border-t border-forest/15 pt-12"><div className="flex items-end justify-between gap-5"><div><p className="label">More ways to stay</p><h2 className="mt-3 font-display text-4xl leading-none text-forest">You may also like</h2></div><Link href="/rooms" className="text-sm font-bold uppercase tracking-[0.12em] text-forest underline decoration-sun underline-offset-4">View all rooms</Link></div><div className="mt-8 grid gap-6 md:grid-cols-3">{relatedRooms.map((item) => <Link key={item.id} href={`/rooms/${item.id}`} className="group block"><img src={item.image} alt={item.alt} className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-[1.02]" /><p className="mt-4 font-display text-2xl leading-none text-forest">{item.name}</p><p className="mt-2 text-sm text-forest/60">From {formatNpr(item.price)} · {item.rateType}</p></Link>)}</div></section>
      </div>
      <div className="mt-20"><CtaBanner /></div>
    </main>
  )
}
