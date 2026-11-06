'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Icon from './Icons.jsx'
import { Button, Reveal } from './ui.jsx'
import { rooms } from '../data/rooms.js'
import { waLink } from '../data/site.js'

const npr = (value) => `NPR ${value.toLocaleString('en-US')}`

const bookingModes = [
  { id: 'all', label: 'All spaces', roomIds: null },
  { id: 'couple', label: 'For two', roomIds: ['couple-deluxe'] },
  { id: 'private', label: 'Private room', roomIds: ['hilltop-double'] },
  { id: 'group', label: 'Group villa', roomIds: ['four-bhk-wing'] },
  { id: 'buyout', label: 'Entire villa buyout', roomIds: ['seven-bhk-full-villa'] },
]

function BookingBar() {
  const [guests, setGuests] = useState(2)
  const [isCompact, setIsCompact] = useState(false)
  const bookingBarRef = useRef(null)

  useEffect(() => {
    if (!bookingBarRef.current) return
    const dockY = window.scrollY + bookingBarRef.current.getBoundingClientRect().top - 72
    const updateCompactState = () => setIsCompact(window.scrollY >= dockY)
    updateCompactState()
    window.addEventListener('scroll', updateCompactState, { passive: true })
    return () => window.removeEventListener('scroll', updateCompactState)
  }, [])

  const submit = (event) => {
    event.preventDefault()
    document.getElementById('stay-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div ref={bookingBarRef} className={`relative z-30 border-b border-forest/10 bg-sand/95 backdrop-blur-md transition-all duration-300 md:sticky md:top-[4.5rem] ${isCompact ? 'py-0' : 'py-3'}`}>
      <form onSubmit={submit} className={`relative mx-auto grid ${isCompact ? 'max-w-[1120px]' : 'max-w-[1540px]'} gap-px bg-forest/15 p-px shadow-lg shadow-forest/10 transition-all duration-300 md:grid-cols-[1.25fr_1fr_1fr_0.7fr_auto]`} aria-label="Search G’Host stays">
        <label className={`bg-cream px-5 transition-all duration-300 ${isCompact ? 'py-2.5' : 'py-4'}`}><span className={`block text-[0.65rem] font-bold uppercase tracking-[0.14em] text-forest/55 ${isCompact ? 'hidden' : ''}`}>Stay type</span><select defaultValue="all" className={`${isCompact ? '' : 'mt-1'} w-full bg-transparent font-semibold text-forest outline-none`}><option value="all">Any G’Host space</option><option value="couple">Couple suite</option><option value="group">Group villa</option><option value="buyout">Entire villa</option></select></label>
        <label className={`bg-cream px-5 transition-all duration-300 ${isCompact ? 'py-2.5' : 'py-4'}`}><span className={`block text-[0.65rem] font-bold uppercase tracking-[0.14em] text-forest/55 ${isCompact ? 'hidden' : ''}`}>Check in</span><input aria-label="Check in" type="date" className={`${isCompact ? '' : 'mt-1'} w-full bg-transparent font-semibold text-forest outline-none`} /></label>
        <label className={`bg-cream px-5 transition-all duration-300 ${isCompact ? 'py-2.5' : 'py-4'}`}><span className={`block text-[0.65rem] font-bold uppercase tracking-[0.14em] text-forest/55 ${isCompact ? 'hidden' : ''}`}>Check out</span><input aria-label="Check out" type="date" className={`${isCompact ? '' : 'mt-1'} w-full bg-transparent font-semibold text-forest outline-none`} /></label>
        <div className={`bg-cream px-5 transition-all duration-300 ${isCompact ? 'py-2.5' : 'py-4'}`}><span className={`block text-[0.65rem] font-bold uppercase tracking-[0.14em] text-forest/55 ${isCompact ? 'hidden' : ''}`}>Guests</span><div className={`${isCompact ? '' : 'mt-1'} flex items-center justify-between font-semibold text-forest`}><button type="button" aria-label="Remove guest" onClick={() => setGuests((count) => Math.max(1, count - 1))} className="grid h-6 w-6 place-items-center border border-forest/20">−</button>{guests}<button type="button" aria-label="Add guest" onClick={() => setGuests((count) => Math.min(24, count + 1))} className="grid h-6 w-6 place-items-center border border-forest/20">+</button></div></div>
        <button type="submit" className={`bg-sun px-7 text-sm font-bold uppercase tracking-[0.12em] text-forest transition hover:bg-sun-dark ${isCompact ? 'min-h-12' : 'min-h-16'}`}>Find a stay</button>
      </form>
    </div>
  )
}

function SpaceCard({ room }) {
  const type = room.id === 'couple-deluxe' ? 'Private suite' : room.id === 'hilltop-double' ? 'Vintage room' : room.id === 'four-bhk-wing' ? 'Villa wing' : 'Private buyout'
  const view = room.view.includes('Annapurna') || room.view.includes('Panorama') ? 'Mountain view' : room.view.includes('Forest') ? 'Hillside view' : 'Valley view'

  return (
    <Link href={`/rooms/${room.id}`} className="group flex h-full flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-forest-dark">
        <img src={room.image} alt={room.alt} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/90 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 max-w-[80%] bg-sun px-3 py-2 text-[0.62rem] font-bold uppercase tracking-[0.13em] text-forest-dark">{room.badge}</span>
        <div className="absolute bottom-4 left-5 text-cream"><span className="block text-xs font-bold uppercase tracking-[0.14em] text-cream/75">From</span><span className="mt-1 block font-display text-3xl leading-none">{npr(room.price)}</span><span className="mt-1 block text-xs font-semibold text-cream/80">{room.rateType}</span></div>
      </div>
      <div className="mt-3 grid grid-cols-3 divide-x divide-forest/15 border-y border-forest/15 text-xs font-bold uppercase tracking-[0.08em] text-forest"><span className="min-w-0 px-2.5 py-3"><span className="block text-forest/45">Type</span><span className="mt-1 block truncate normal-case tracking-normal">{type}</span></span><span className="min-w-0 px-2.5 py-3"><span className="block text-forest/45">Guests</span><span className="mt-1 block truncate normal-case tracking-normal">{room.capacity}</span></span><span className="min-w-0 px-2.5 py-3"><span className="block text-forest/45">View</span><span className="mt-1 block truncate normal-case tracking-normal">{view}</span></span></div>
      <div className="flex flex-1 flex-col pt-5"><h2 className="min-h-[3.8rem] font-display text-3xl font-semibold leading-none tracking-[-0.04em] text-forest">{room.name}</h2><p className="mt-3 line-clamp-2 min-h-[3rem] text-sm leading-relaxed text-forest/65">{room.blurb}</p><div className="mt-auto flex items-center justify-between border-t border-forest/15 pt-5 text-xs font-bold uppercase tracking-[0.12em] text-forest"><span>View room</span><span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-full border border-forest/25 text-base transition group-hover:bg-sun group-hover:text-forest">↗</span></div></div>
    </Link>
  )
}

export default function Rooms({ preview = false }) {
  const [activeMode, setActiveMode] = useState('all')
  const [priceLimit, setPriceLimit] = useState(8000)
  const [capacity, setCapacity] = useState('any')
  const [view, setView] = useState('any')
  const [breakfastOnly, setBreakfastOnly] = useState(false)
  const mode = bookingModes.find((item) => item.id === activeMode) ?? bookingModes[0]
  const visibleRooms = rooms.filter((room) => {
    const fitsMode = !mode.roomIds || mode.roomIds.includes(room.id)
    const fitsPrice = room.price <= priceLimit
    const capacityStart = Number(room.capacity.match(/\d+/)?.[0] ?? 0)
    const fitsCapacity = capacity === 'any' || (capacity === 'two' ? capacityStart <= 2 : capacityStart >= 4)
    const fitsView = view === 'any' || room.view.toLowerCase().includes(view)
    const fitsBreakfast = !breakfastOnly || room.amenities.includes('breakfast')
    return fitsMode && fitsPrice && fitsCapacity && fitsView && fitsBreakfast
  })
  const previewRooms = rooms.slice(0, 2)

  if (preview) return <section id="rooms" className="section bg-cream"><div className="wrap grid gap-7 md:grid-cols-2">{previewRooms.map((room) => <SpaceCard key={room.id} room={room} />)}</div></section>

  return (
    <section id="rooms" className="bg-sand pb-24 pt-8 md:pt-10">
      <BookingBar />
      <div className="wrap max-w-[1540px] pt-16 md:pt-20">
        <Reveal className="mb-12 grid gap-6 md:grid-cols-[1fr_auto] md:items-end"><div><p className="label">Stay collection</p><h2 className="max-w-2xl font-display text-5xl font-semibold leading-[0.94] tracking-[-0.05em] text-forest sm:text-6xl">Find the G’Host space that fits your stay.</h2></div><p className="max-w-sm leading-relaxed text-forest/70">For two people, a family weekend, or a full estate celebration—filter by the way you want to stay.</p></Reveal>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
          <div id="stay-results"><div className="mb-8 flex flex-wrap items-center justify-between gap-4"><p className="text-sm font-semibold text-forest/65">Showing {visibleRooms.length} {visibleRooms.length === 1 ? 'space' : 'spaces'}</p><button type="button" onClick={() => { setActiveMode('all'); setPriceLimit(8000); setCapacity('any'); setView('any'); setBreakfastOnly(false) }} className="text-sm font-semibold text-forest underline decoration-sun decoration-2 underline-offset-4">Clear filters</button></div><div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">{visibleRooms.map((room) => <SpaceCard key={room.id} room={room} />)}{visibleRooms.length === 0 && <p className="col-span-full border border-forest/15 p-8 text-forest/70">No spaces match those filters. Try widening your choices or ask us for a custom stay.</p>}</div></div>
          <aside aria-label="Filter rooms" className="border border-forest/15 bg-sand p-6 lg:sticky lg:top-28"><h2 className="font-display text-3xl text-forest">Filter by</h2><div className="mt-6 border-t border-forest/15 pt-6"><label className="text-sm font-bold text-forest">Price per stay</label><input aria-label="Maximum price per stay" type="range" min="1550" max="8000" step="250" value={priceLimit} onChange={(event) => setPriceLimit(Number(event.target.value))} className="mt-4 w-full accent-forest" /><div className="mt-2 flex justify-between text-sm font-semibold text-forest/70"><span>{npr(1550)}</span><span>Up to {npr(priceLimit)}</span></div></div><fieldset className="mt-7 border-t border-forest/15 pt-6"><legend className="text-sm font-bold text-forest">Space type</legend><div className="mt-3 space-y-3">{bookingModes.map((item) => <label key={item.id} className="flex cursor-pointer items-center gap-3 text-sm text-forest/75"><input type="radio" name="space-type" checked={activeMode === item.id} onChange={() => setActiveMode(item.id)} className="accent-forest" />{item.label}</label>)}</div></fieldset><fieldset className="mt-7 border-t border-forest/15 pt-6"><legend className="text-sm font-bold text-forest">Capacity</legend><div className="mt-3 space-y-3">{[['any', 'Any size'], ['two', '1–2 guests'], ['group', '4+ guests']].map(([id, label]) => <label key={id} className="flex cursor-pointer items-center gap-3 text-sm text-forest/75"><input type="radio" name="capacity" checked={capacity === id} onChange={() => setCapacity(id)} className="accent-forest" />{label}</label>)}</div></fieldset><fieldset className="mt-7 border-t border-forest/15 pt-6"><legend className="text-sm font-bold text-forest">View</legend><div className="mt-3 space-y-3">{[['any', 'Any view'], ['annapurna', 'Mountain / Annapurna'], ['garden', 'Garden / hillside'], ['valley', 'Valley panorama']].map(([id, label]) => <label key={id} className="flex cursor-pointer items-center gap-3 text-sm text-forest/75"><input type="radio" name="view" checked={view === id} onChange={() => setView(id)} className="accent-forest" />{label}</label>)}</div></fieldset><label className="mt-7 flex cursor-pointer items-center gap-3 border-t border-forest/15 pt-6 text-sm font-semibold text-forest"><input type="checkbox" checked={breakfastOnly} onChange={(event) => setBreakfastOnly(event.target.checked)} className="h-4 w-4 accent-forest" />Breakfast included</label></aside>
        </div>
        <Reveal className="mt-16 grid gap-7 bg-forest p-8 text-cream md:grid-cols-[1fr_auto] md:items-center md:p-10"><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-sun">Need a tailored plan?</p><h3 className="mt-3 font-display text-4xl leading-none tracking-[-0.04em]">Tell us who’s coming. We’ll shape the stay around you.</h3></div><Button href={waLink('Hello G\'Host Villa! I would like help planning a custom stay, group booking or full villa buyout.')} variant="light">Plan a custom stay</Button></Reveal>
      </div>
    </section>
  )
}
