'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ArrowUpDown, Bath, BedDouble, ChevronDown, Coffee, Minus, Mountain, Plus, RotateCcw, SlidersHorizontal, Users, Wifi } from 'lucide-react'
import RangeSlider from './RangeSlider.jsx'
import { Button, Reveal } from './ui.jsx'
import {
  rooms, buildings, plans, MAX_GUESTS,
  recommendedFor, describePrice, costSpan, buildingLabel,
} from '../data/rooms.js'
import { waLink } from '../data/site.js'
import { nightsBetween, stayQuery, stayQuote, todayISO } from '../lib/booking.js'

function cardTag(room) {
  if (room.id === 'mountain-view-room') return 'Most popular'
  if (room.id === 'whole-villa' || room.id === 'group-section') return 'Best for groups'
  return room.badge
}

function StayCard({ room, guests, plan, checkIn, checkOut }) {
  const price = describePrice(room, guests, plan)
  const nights = nightsBetween(checkIn, checkOut)
  const quote = nights > 0 && !room.whatsappOnly ? stayQuote(room, guests ?? room.defaultGuests, plan, nights) : null
  const href = `/rooms/${room.id}${stayQuery({ guests, plan, checkIn, checkOut })}`
  const tag = cardTag(room)
  const roomAmenities = [
    { icon: Wifi, label: 'Wi-Fi' },
    { icon: Bath, label: 'Hot water' },
    { icon: Coffee, label: plan === 'MAP' ? 'Meals' : 'Breakfast' },
    ...(room.views?.length ? [{ icon: Mountain, label: room.views.includes('mountain') ? 'Mountain view' : 'City view' }] : []),
  ]

  return (
    <Link href={href} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-forest/12 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:border-forest/25 hover:shadow-warm">
      <div className="relative overflow-hidden bg-forest-dark">
        <img src={room.image} alt={room.alt} loading="lazy" className="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
        {tag && (
          <span className="absolute left-3.5 top-3.5 rounded-full bg-sun px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-forest-dark">
            {tag}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-sun-text">{buildingLabel(room)}</p>
        <h3 className="mt-1.5 font-display text-xl font-semibold leading-snug tracking-[-0.025em] text-forest">{room.name}</h3>
        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-forest/65">
          <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-forest/50" aria-hidden="true" />{room.capacity}</span>
          {room.bed && <span className="inline-flex items-center gap-1.5"><BedDouble className="h-3.5 w-3.5 text-forest/50" aria-hidden="true" />{room.bed}</span>}
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {roomAmenities.map(({ icon: Ico, label }) => (
            <span key={label} className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2.5 py-1 text-[0.7rem] font-medium text-forest/75">
              <Ico className="h-3 w-3 text-sun-text" aria-hidden="true" />
              {label}
            </span>
          ))}
        </div>
        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between gap-3 border-t border-forest/10 pt-4">
            <div className="min-w-0">
              <p className="font-display text-lg font-bold leading-none text-forest">
                {quote
                  ? (quote.kind === 'range' ? `NPR ${quote.min.toLocaleString('en-US')}+` : `NPR ${quote.total.toLocaleString('en-US')}`)
                  : price.main}
              </p>
              <p className="mt-1 truncate text-xs text-forest/55">
                {quote
                  ? `${nights} ${nights === 1 ? 'night' : 'nights'} · ${plan}`
                  : (room.whatsappOnly ? 'Custom quote' : `per night · ${plan}`)}
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-forest transition group-hover:bg-sun group-hover:text-forest-dark">
              View &amp; book<ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}


const PRICE_MAX = 25000
const PRICE_STEP = 500
const sorts = [
  { id: 'best', label: 'Best match' },
  { id: 'low', label: 'Price: low to high' },
  { id: 'high', label: 'Price: high to low' },
]
const viewOptions = [
  { id: 'any', label: 'Any view' },
  { id: 'mountain', label: 'Mountain view (MV)' },
  { id: 'city', label: 'City view (CV)' },
]

const priceText = (n) => (n >= PRICE_MAX ? `${PRICE_MAX.toLocaleString('en-US')}+` : n.toLocaleString('en-US'))

function Option({ name, checked, onChange, children, hint }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 py-1.5 text-sm text-forest/80">
      <input type="radio" name={name} checked={checked} onChange={onChange} className="mt-1 accent-forest" />
      <span>{children}{hint && <small className="block text-xs text-forest/55">{hint}</small>}</span>
    </label>
  )
}

function BookingBar({ building, setBuilding, checkIn, setCheckIn, checkOut, setCheckOut, guests, setGuests }) {
  const [isCompact, setIsCompact] = useState(false)
  const bookingBarRef = useRef(null)

  useEffect(() => {
    if (!bookingBarRef.current) return
    const dockY = window.scrollY + bookingBarRef.current.getBoundingClientRect().top
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
    <div ref={bookingBarRef} className={`relative z-30 border-b border-forest/10 bg-white/95 px-6 backdrop-blur-md transition-all duration-300 sm:px-10 md:sticky md:top-0 ${isCompact ? 'py-1.5 shadow-md shadow-forest/5' : 'py-2'}`}>
      <form onSubmit={submit} className={`relative mx-auto grid ${isCompact ? 'max-w-[1120px]' : 'max-w-[1440px]'} gap-px overflow-hidden rounded-2xl bg-forest/15 p-px shadow-lg shadow-forest/10 transition-all duration-300 md:grid-cols-[1.25fr_1fr_1fr_0.75fr_auto]`} aria-label="Search G’Host stays">
        <label className={`bg-white px-5 transition-all duration-300 ${isCompact ? 'py-2.5' : 'py-4'}`}>
          <span className={`block text-[0.65rem] font-bold uppercase tracking-[0.14em] text-forest/55 ${isCompact ? 'hidden' : ''}`}>Stay type</span>
          <select value={building} onChange={(e) => setBuilding(e.target.value)} className={`${isCompact ? '' : 'mt-1'} w-full bg-transparent font-semibold text-forest outline-none`}>
            <option value="all">Any G’Host space</option>
            {buildings.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </label>
        <label className={`bg-white px-5 transition-all duration-300 ${isCompact ? 'py-2.5' : 'py-4'}`}>
          <span className={`block text-[0.65rem] font-bold uppercase tracking-[0.14em] text-forest/55 ${isCompact ? 'hidden' : ''}`}>Check in</span>
          <input aria-label="Check in" type="date" min={todayISO()} value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className={`${isCompact ? '' : 'mt-1'} w-full bg-transparent font-semibold text-forest outline-none`} />
        </label>
        <label className={`bg-white px-5 transition-all duration-300 ${isCompact ? 'py-2.5' : 'py-4'}`}>
          <span className={`block text-[0.65rem] font-bold uppercase tracking-[0.14em] text-forest/55 ${isCompact ? 'hidden' : ''}`}>Check out</span>
          <input aria-label="Check out" type="date" min={checkIn || todayISO()} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className={`${isCompact ? '' : 'mt-1'} w-full bg-transparent font-semibold text-forest outline-none`} />
        </label>
        <div className={`bg-white px-5 transition-all duration-300 ${isCompact ? 'py-2.5' : 'py-4'}`}>
          <span className={`block text-[0.65rem] font-bold uppercase tracking-[0.14em] text-forest/55 ${isCompact ? 'hidden' : ''}`}>Guests</span>
          <div className={`${isCompact ? '' : 'mt-1'} flex items-center justify-between font-semibold text-forest`}>
            <button type="button" aria-label="Remove guest" onClick={() => setGuests((c) => (c == null || c <= 1 ? null : c - 1))} className="grid h-7 w-7 place-items-center rounded-full border border-forest/20 transition hover:bg-forest hover:text-cream">−</button>
            <span>{guests ?? 'Any'}</span>
            <button type="button" aria-label="Add guest" onClick={() => setGuests((c) => Math.min(MAX_GUESTS, (c ?? 0) + 1))} className="grid h-7 w-7 place-items-center rounded-full border border-forest/20 transition hover:bg-forest hover:text-cream">+</button>
          </div>
        </div>
        <div className="flex items-center bg-white p-2">
          <button type="submit" className={`w-full rounded-full bg-sun px-7 text-sm font-bold uppercase tracking-[0.12em] text-forest transition hover:bg-sun-dark ${isCompact ? 'min-h-10' : 'min-h-12'}`}>Find a stay</button>
        </div>
      </form>
    </div>
  )
}

export default function Rooms() {
  const [building, setBuilding] = useState('all')
  const [guests, setGuests] = useState(null) // null = any group size
  const [plan, setPlan] = useState('BB')
  const [view, setView] = useState('any')
  const [priceMin, setPriceMin] = useState(0)
  const [priceMax, setPriceMax] = useState(PRICE_MAX)
  const [sort, setSort] = useState('best')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false)

  // Pick up what the guest entered in the homepage booking bar (?guests=&in=&out=)
  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    const g = Number(q.get('guests'))
    if (g >= 1 && g <= MAX_GUESTS) setGuests(g)
    const i = q.get('in'), o = q.get('out')
    if (i && i >= todayISO()) { setCheckIn(i); if (o && o > i) setCheckOut(o) }
  }, [])

  const priceActive = priceMin > 0 || priceMax < PRICE_MAX

  const visible = useMemo(() => {
    const pool = guests == null ? rooms.filter((room) => room.catalog) : recommendedFor(guests)
    const list = pool.filter((room) => {
      if (building !== 'all' && room.building !== 'both' && room.building !== building) return false
      if (view !== 'any' && !room.views.includes(view)) return false
      if (priceActive) {
        const span = costSpan(room, guests, plan)
        if (span && (span.max < priceMin || (priceMax < PRICE_MAX && span.min > priceMax))) return false
      }
      return true
    })
    if (sort === 'best') return list
    const key = (room) => costSpan(room, guests, plan)?.min ?? Number.POSITIVE_INFINITY
    return [...list].sort((a, b) => (sort === 'low' ? key(a) - key(b) : (costSpan(b, guests, plan)?.max ?? -1) - (costSpan(a, guests, plan)?.max ?? -1)))
  }, [building, guests, plan, view, priceMin, priceMax, priceActive, sort])

  const clearFilters = () => { setBuilding('all'); setGuests(null); setPlan('BB'); setView('any'); setPriceMin(0); setPriceMax(PRICE_MAX); setSort('best'); setCheckIn(''); setCheckOut('') }
  const activeCount = [building !== 'all', guests != null, plan !== 'BB', view !== 'any', priceActive, checkIn || checkOut].filter(Boolean).length
  const hiddenAsk = priceActive && visible.some((room) => room.whatsappOnly)
  const guestLabel = guests == null ? 'Any size' : `${guests} ${guests === 1 ? 'guest' : 'guests'}`
  const dateInput = 'mt-1.5 w-full border border-forest/20 bg-white px-3 py-2 text-sm font-semibold normal-case tracking-normal text-forest outline-none focus:border-forest'

  return (
    <section id="rooms" className="bg-white pb-16 pt-[4.5rem] md:pb-20">
      <BookingBar
        building={building}
        setBuilding={setBuilding}
        checkIn={checkIn}
        setCheckIn={setCheckIn}
        checkOut={checkOut}
        setCheckOut={setCheckOut}
        guests={guests}
        setGuests={setGuests}
      />
      <div className="mx-auto w-full max-w-[1440px] px-5 pt-2 sm:px-8 lg:px-12">
        <Reveal>
          <p className="label !mb-0.5">Sarangkot, Pokhara</p>
          <h1 className="font-display text-3xl font-semibold leading-none tracking-[-0.04em] text-forest sm:text-4xl">Rooms &amp; Stays</h1>
        </Reveal>

        <div className="mt-3 grid gap-6 lg:grid-cols-[290px_minmax(0,1fr)] lg:items-start xl:grid-cols-[310px_minmax(0,1fr)] xl:gap-8">
          {/* Filters live on the left in the same boxed style as the mini menu */}
          <div className="lg:sticky lg:top-24">
            <button type="button" onClick={() => setFiltersOpen((open) => !open)} aria-expanded={filtersOpen}
              className="flex w-full items-center justify-between rounded-2xl border border-forest/20 bg-white px-5 py-3.5 text-sm font-bold text-forest shadow-soft lg:hidden">
              <span className="inline-flex items-center gap-2"><SlidersHorizontal className="h-4 w-4" aria-hidden="true" />Filters{activeCount > 0 ? ` · ${activeCount}` : ''}</span>
              {filtersOpen ? <Minus className="h-4 w-4" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
            </button>
            <aside aria-label="Filter stays" className={`${filtersOpen ? 'block' : 'hidden'} no-scrollbar mt-3 overflow-hidden rounded-2xl border border-forest/15 bg-forest/10 p-px shadow-soft lg:mt-0 lg:block lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto`}>
              <div className="space-y-px">
                <div className="flex items-center justify-between bg-white px-5 py-3.5">
                  <h2 className="font-display text-lg font-semibold text-forest">Filter by</h2>
                  {activeCount > 0 && (
                    <button type="button" onClick={clearFilters} className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-forest transition hover:bg-sun">
                      <RotateCcw className="h-3 w-3" aria-hidden="true" />Reset
                    </button>
                  )}
                </div>

                <div className="bg-white px-5 py-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <label className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-forest/55">Guests</label>
                    <span className="text-xs font-semibold text-forest">{guestLabel}</span>
                  </div>
                  <div className="mt-3">
                    <RangeSlider min={0} max={MAX_GUESTS} step={1} value={guests ?? 0} onChange={(n) => setGuests(n === 0 ? null : n)} labels={['Number of guests']} />
                  </div>
                  <div className="mt-1.5 flex justify-between text-[0.7rem] text-forest/50"><span>Any</span><span>{MAX_GUESTS}</span></div>
                </div>

                <div className="bg-white px-5 py-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <label className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-forest/55">Price / night</label>
                    <span className="text-xs font-semibold text-forest">NPR {priceText(priceMin)} – {priceText(priceMax)}</span>
                  </div>
                  <div className="mt-3">
                    <RangeSlider min={0} max={PRICE_MAX} step={PRICE_STEP} value={[priceMin, priceMax]} onChange={([a, b]) => { setPriceMin(a); setPriceMax(b) }} labels={['Minimum price per night', 'Maximum price per night']} />
                  </div>
                  <div className="mt-1.5 flex justify-between text-[0.7rem] text-forest/50"><span>NPR 0</span><span>{priceText(PRICE_MAX)}</span></div>
                </div>

                <div role="group" aria-labelledby="filter-building" className="bg-white px-5 py-4">
                  <p id="filter-building" className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-forest/55">Building</p>
                  <div className="mt-2 space-y-1">
                    {[{ id: 'all', name: 'Both buildings' }, ...buildings].map((item) => (
                      <Option key={item.id} name="building" checked={building === item.id} onChange={() => setBuilding(item.id)}>{item.name}</Option>
                    ))}
                  </div>
                </div>

                <div className="bg-white px-5 py-3">
                  <button
                    type="button"
                    onClick={() => setMoreFiltersOpen((v) => !v)}
                    aria-expanded={moreFiltersOpen}
                    className="flex w-full items-center justify-between py-1 text-xs font-bold uppercase tracking-[0.12em] text-forest/75 hover:text-forest"
                  >
                    <span>More filters</span>
                    <ChevronDown className={`h-4 w-4 transition ${moreFiltersOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </button>
                </div>

                <AnimatePresence initial={false}>
                  {moreFiltersOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.24, ease: [0.22, 0.61, 0.36, 1] }}
                      className="space-y-px overflow-hidden"
                    >
                      <div role="group" aria-labelledby="filter-view" className="bg-white px-5 py-4">
                        <p id="filter-view" className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-forest/55">View</p>
                        <div className="mt-2 space-y-1">
                          {viewOptions.map((item) => <Option key={item.id} name="view" checked={view === item.id} onChange={() => setView(item.id)}>{item.label}</Option>)}
                        </div>
                      </div>

                      <div role="group" aria-labelledby="filter-plan" className="bg-white px-5 py-4">
                        <p id="filter-plan" className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-forest/55">Meal plan</p>
                        <div className="mt-2 space-y-1">
                          {plans.map((item) => <Option key={item.id} name="plan" checked={plan === item.id} onChange={() => setPlan(item.id)} hint={item.note}>{item.label} ({item.short})</Option>)}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </aside>
          </div>

          <div id="stay-results">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold text-forest/65">{visible.length} {visible.length === 1 ? 'stay' : 'stays'}{guests != null ? ` for ${guests} ${guests === 1 ? 'guest' : 'guests'}` : ''}{hiddenAsk ? ' · includes WhatsApp rates' : ''}</p>
              <label className="inline-flex items-center gap-2 rounded-full border border-forest/15 bg-white px-3.5 py-2 text-xs font-semibold text-forest"><ArrowUpDown className="h-3.5 w-3.5 text-forest/55" aria-hidden="true" />
                <select aria-label="Sort stays" value={sort} onChange={(event) => setSort(event.target.value)} className="bg-transparent outline-none">
                  {sorts.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                </select>
              </label>
            </div>

            {/* Help me choose strip */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-forest/12 bg-white/70 px-5 py-3">
              <p className="text-sm font-medium text-forest">
                Group of 8+? <span className="text-forest/70">See whole-villa options or message us directly.</span>
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setGuests(8)}
                  className="rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-forest transition hover:bg-sun"
                >
                  Show 8+ guest stays
                </button>
                <a
                  href={waLink("Hello G'Host Villa! I need help choosing a room for my stay.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-forest px-3.5 py-1.5 text-xs font-semibold text-cream transition hover:bg-forest-dark"
                >
                  Ask us on WhatsApp
                </a>
              </div>
            </div>

            <div className="mt-4 grid gap-6 md:grid-cols-2">
              {visible.map((room, index) => (
                <motion.div
                  key={room.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.25), ease: [0.22, 0.61, 0.36, 1] }}
                  className="h-full"
                >
                  <StayCard room={room} guests={guests} plan={plan} checkIn={checkIn} checkOut={checkOut} />
                </motion.div>
              ))}
              {visible.length === 0 && (
                <div className="col-span-full rounded-2xl border border-forest/15 bg-white/50 p-10 text-center text-forest/75">
                  <p className="font-medium">No stays match your current filters.</p>
                  <button type="button" onClick={clearFilters} className="mt-4 inline-flex items-center gap-2 rounded-full bg-sun px-5 py-2.5 text-xs font-semibold text-forest-dark transition hover:bg-sun-dark">Reset filters</button>
                </div>
              )}
            </div>
          </div>
        </div>

        <Reveal className="mt-14 grid gap-6 rounded-2xl bg-forest p-7 text-cream md:grid-cols-[1fr_auto] md:items-center md:p-9">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-sun">Group or custom stay?</p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em] md:text-3xl">Tell us your group size and we’ll suggest the best fit.</h2>
          </div>
          <Button href={waLink("Hello G'Host Villa! I would like help planning a custom stay, group booking or full villa buyout.")} variant="light">Ask on WhatsApp</Button>
        </Reveal>
      </div>
    </section>
  )
}
