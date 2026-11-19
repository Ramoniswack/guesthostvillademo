'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowUpDown, Minus, Plus, SlidersHorizontal } from 'lucide-react'
import RangeSlider from './RangeSlider.jsx'
import { Button, Reveal } from './ui.jsx'
import {
  rooms, buildings, plans, MAX_GUESTS,
  recommendedFor, describePrice, costSpan, groupHint,
} from '../data/rooms.js'
import { waLink } from '../data/site.js'
import { nightsBetween, stayQuery, stayQuote, todayISO } from '../lib/booking.js'

function StayCard({ room, guests, plan, checkIn, checkOut }) {
  const price = describePrice(room, guests, plan)
  const nights = nightsBetween(checkIn, checkOut)
  const quote = nights > 0 && !room.whatsappOnly ? stayQuote(room, guests ?? room.defaultGuests, plan, nights) : null
  const href = `/rooms/${room.id}${stayQuery({ guests, plan, checkIn, checkOut })}`
  return (
    <Link href={href} className="group flex h-full flex-col overflow-hidden border border-forest/10 bg-cream shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-warm">
      <div className="relative overflow-hidden bg-forest-dark">
        <img src={room.image} alt={room.alt} loading="lazy" className="aspect-[3/2] w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
        <span className="absolute left-3 top-3 bg-sun px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.13em] text-forest-dark">{room.badge}</span>
      </div>
      <div className="flex flex-1 flex-col px-5 pb-5 pt-5">
        <h3 className="font-display text-[1.4rem] font-semibold leading-[1.1] tracking-[-0.03em] text-forest">{room.name}</h3>
        <p className="mt-1.5 text-sm text-forest/60">{room.capacity}</p>
        <div className="mt-auto flex items-end justify-between gap-4 pt-5">
          <div className="min-w-0">
            <span className="block font-display text-xl leading-none tracking-[-0.02em] text-forest">{price.label ? `${price.label} ` : ''}{price.main}</span>
            <span className="mt-2 block text-[0.8125rem] text-forest/55">{!quote && price.perPerson ? `${price.perPerson} · ` : ''}{quote ? `${nights} ${nights === 1 ? 'night' : 'nights'} · ${quote.kind === 'range' ? `from NPR ${quote.min.toLocaleString('en-US')}` : `NPR ${quote.total.toLocaleString('en-US')} total`}` : price.note}</span>
          </div>
          <span className="shrink-0 text-sm font-bold text-forest underline decoration-sun decoration-2 underline-offset-[5px]">View &amp; book</span>
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
    <div ref={bookingBarRef} className={`relative z-30 border-b border-forest/10 bg-sand/95 px-6 backdrop-blur-md transition-all duration-300 sm:px-10 md:sticky md:top-[4.5rem] ${isCompact ? 'py-0' : 'py-3'}`}>
      <form onSubmit={submit} className={`relative mx-auto grid ${isCompact ? 'max-w-[1120px]' : 'max-w-[1360px]'} gap-px bg-forest/15 p-px shadow-lg shadow-forest/10 transition-all duration-300 md:grid-cols-[1.25fr_1fr_1fr_0.75fr_auto]`} aria-label="Search G’Host stays">
        <label className={`bg-cream px-5 transition-all duration-300 ${isCompact ? 'py-2.5' : 'py-4'}`}>
          <span className={`block text-[0.65rem] font-bold uppercase tracking-[0.14em] text-forest/55 ${isCompact ? 'hidden' : ''}`}>Stay type</span>
          <select value={building} onChange={(e) => setBuilding(e.target.value)} className={`${isCompact ? '' : 'mt-1'} w-full bg-transparent font-semibold text-forest outline-none`}>
            <option value="all">Any G’Host space</option>
            {buildings.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </label>
        <label className={`bg-cream px-5 transition-all duration-300 ${isCompact ? 'py-2.5' : 'py-4'}`}>
          <span className={`block text-[0.65rem] font-bold uppercase tracking-[0.14em] text-forest/55 ${isCompact ? 'hidden' : ''}`}>Check in</span>
          <input aria-label="Check in" type="date" min={todayISO()} value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className={`${isCompact ? '' : 'mt-1'} w-full bg-transparent font-semibold text-forest outline-none`} />
        </label>
        <label className={`bg-cream px-5 transition-all duration-300 ${isCompact ? 'py-2.5' : 'py-4'}`}>
          <span className={`block text-[0.65rem] font-bold uppercase tracking-[0.14em] text-forest/55 ${isCompact ? 'hidden' : ''}`}>Check out</span>
          <input aria-label="Check out" type="date" min={checkIn || todayISO()} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className={`${isCompact ? '' : 'mt-1'} w-full bg-transparent font-semibold text-forest outline-none`} />
        </label>
        <div className={`bg-cream px-5 transition-all duration-300 ${isCompact ? 'py-2.5' : 'py-4'}`}>
          <span className={`block text-[0.65rem] font-bold uppercase tracking-[0.14em] text-forest/55 ${isCompact ? 'hidden' : ''}`}>Guests</span>
          <div className={`${isCompact ? '' : 'mt-1'} flex items-center justify-between font-semibold text-forest`}>
            <button type="button" aria-label="Remove guest" onClick={() => setGuests((c) => (c == null || c <= 1 ? null : c - 1))} className="grid h-6 w-6 place-items-center border border-forest/20">−</button>
            <span>{guests ?? 'Any'}</span>
            <button type="button" aria-label="Add guest" onClick={() => setGuests((c) => Math.min(MAX_GUESTS, (c ?? 0) + 1))} className="grid h-6 w-6 place-items-center border border-forest/20">+</button>
          </div>
        </div>
        <button type="submit" className={`bg-sun px-7 text-sm font-bold uppercase tracking-[0.12em] text-forest transition hover:bg-sun-dark ${isCompact ? 'min-h-12' : 'min-h-16'}`}>Find a stay</button>
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
  const dateInput = 'mt-1.5 w-full border border-forest/20 bg-cream px-3 py-2 text-sm font-semibold normal-case tracking-normal text-forest outline-none focus:border-forest'

  return (
    <section id="rooms" className="bg-sand pb-16 pt-20 md:pb-24 md:pt-24">
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
      <div className="wrap max-w-[1360px] pt-10 md:pt-12">
        <Reveal className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="label">Stay collection</p>
            <h1 className="max-w-2xl font-display text-4xl font-semibold leading-[1] tracking-[-0.045em] text-forest sm:text-5xl">Find the G’Host space that fits your stay.</h1>
          </div>
          <p className="max-w-sm leading-relaxed text-forest/70">Two buildings, one hilltop. Tell us how many of you are coming and we’ll show the stays that fit.</p>
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start lg:gap-8 xl:grid-cols-[320px_minmax(0,1fr)] xl:gap-10">
          {/* Filters live on the left in the open 36f93ac sidebar style */}
          <div className="lg:sticky lg:top-28">
            <button type="button" onClick={() => setFiltersOpen((open) => !open)} aria-expanded={filtersOpen}
              className="flex w-full items-center justify-between border border-forest/25 bg-cream px-5 py-4 text-sm font-bold text-forest lg:hidden">
              <span className="inline-flex items-center gap-2"><SlidersHorizontal className="h-4 w-4" aria-hidden="true" />Filters{activeCount > 0 ? ` · ${activeCount} active` : ''}</span>
              {filtersOpen ? <Minus className="h-4 w-4" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
            </button>
            <aside aria-label="Filter stays" className={`${filtersOpen ? 'block' : 'hidden'} mt-4 border border-forest/15 bg-sand p-6 lg:mt-0 lg:block lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto`}>
              <div className="mb-4 flex justify-end">
                <button type="button" onClick={clearFilters} className="text-xs font-semibold text-forest underline decoration-sun decoration-2 underline-offset-4">Clear filters</button>
              </div>
              <h2 className="font-display text-3xl text-forest">Filter by</h2>

              <div className="mt-6 border-t border-forest/15 pt-6">
                <div className="flex items-baseline justify-between gap-2">
                  <label className="text-sm font-bold text-forest">People</label>
                  <span className="text-sm font-semibold text-forest/75">{guestLabel}</span>
                </div>
                <div className="mt-4">
                  <RangeSlider min={0} max={MAX_GUESTS} step={1} value={guests ?? 0} onChange={(n) => setGuests(n === 0 ? null : n)} labels={['Number of guests']} />
                </div>
                <div className="mt-2 flex justify-between text-xs text-forest/55"><span>Any</span><span>{MAX_GUESTS}</span></div>
                <p className="mt-2 text-xs leading-relaxed text-forest/60">{groupHint(guests)}</p>
              </div>

              <div className="mt-7 border-t border-forest/15 pt-6">
                <div className="flex items-baseline justify-between gap-2">
                  <label className="text-sm font-bold text-forest">Price per night</label>
                  <span className="text-sm font-semibold text-forest/75">NPR {priceText(priceMin)} – {priceText(priceMax)}</span>
                </div>
                <div className="mt-4">
                  <RangeSlider min={0} max={PRICE_MAX} step={PRICE_STEP} value={[priceMin, priceMax]} onChange={([a, b]) => { setPriceMin(a); setPriceMax(b) }} labels={['Minimum price per night', 'Maximum price per night']} />
                </div>
                <div className="mt-2 flex justify-between text-xs text-forest/55"><span>NPR 0</span><span>{priceText(PRICE_MAX)}</span></div>
              </div>

              <fieldset className="mt-7 border-t border-forest/15 pt-6">
                <legend className="text-sm font-bold text-forest">Building</legend>
                <div className="mt-3 space-y-2">
                  {[{ id: 'all', name: 'Both buildings' }, ...buildings].map((item) => (
                    <Option key={item.id} name="building" checked={building === item.id} onChange={() => setBuilding(item.id)}>{item.name}</Option>
                  ))}
                </div>
              </fieldset>

              <fieldset className="mt-7 border-t border-forest/15 pt-6">
                <legend className="text-sm font-bold text-forest">View</legend>
                <div className="mt-3 space-y-2">
                  {viewOptions.map((item) => <Option key={item.id} name="view" checked={view === item.id} onChange={() => setView(item.id)}>{item.label}</Option>)}
                </div>
              </fieldset>

              <fieldset className="mt-7 border-t border-forest/15 pt-6">
                <legend className="text-sm font-bold text-forest">Meal plan</legend>
                <div className="mt-3 space-y-2">
                  {plans.map((item) => <Option key={item.id} name="plan" checked={plan === item.id} onChange={() => setPlan(item.id)} hint={item.note}>{item.label} ({item.short})</Option>)}
                </div>
              </fieldset>

              <fieldset className="mt-7 border-t border-forest/15 pt-6">
                <legend className="text-sm font-bold text-forest">Dates (optional)</legend>
                <div className="mt-3 grid gap-3">
                  <label className="block text-xs font-bold uppercase tracking-[0.12em] text-forest/55">Check in<input type="date" min={todayISO()} value={checkIn} onChange={(event) => setCheckIn(event.target.value)} className={dateInput} /></label>
                  <label className="block text-xs font-bold uppercase tracking-[0.12em] text-forest/55">Check out<input type="date" min={checkIn || todayISO()} value={checkOut} onChange={(event) => setCheckOut(event.target.value)} className={dateInput} /></label>
                </div>
              </fieldset>
            </aside>
          </div>

          <div id="stay-results">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold text-forest/65">Showing {visible.length} {visible.length === 1 ? 'stay' : 'stays'}{guests != null ? ` for ${guests} ${guests === 1 ? 'guest' : 'guests'}` : ''}{hiddenAsk ? ' · includes stays priced on WhatsApp' : ''}</p>
              <label className="flex items-center gap-2 text-sm text-forest/65"><ArrowUpDown className="h-4 w-4" aria-hidden="true" />Sort
                <select value={sort} onChange={(event) => setSort(event.target.value)} className="border border-forest/25 bg-cream px-3 py-2 text-sm font-semibold text-forest outline-none focus:border-forest">
                  {sorts.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                </select>
              </label>
            </div>
            <div className="mt-5 grid gap-6 md:grid-cols-2 xl:gap-8">
              {visible.map((room) => <StayCard key={room.id} room={room} guests={guests} plan={plan} checkIn={checkIn} checkOut={checkOut} />)}
              {visible.length === 0 && (
                <div className="col-span-full border border-forest/15 bg-cream p-10 text-forest/70">
                  <p>No stays match those filters. Try widening the price range or group size, or ask the team for a custom stay.</p>
                  <button type="button" onClick={clearFilters} className="mt-4 text-sm font-semibold text-forest underline decoration-sun decoration-2 underline-offset-4">Clear filters</button>
                </div>
              )}
            </div>
          </div>
        </div>

        <Reveal className="mt-16 grid gap-6 bg-forest p-8 text-cream md:mt-20 md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-sun">Need a tailored plan?</p>
            <h3 className="mt-3 max-w-2xl font-display text-3xl leading-[1.05] tracking-[-0.04em]">Tell us who’s coming. We’ll shape the stay around you.</h3>
          </div>
          <Button href={waLink("Hello G'Host Villa! I would like help planning a custom stay, group booking or full villa buyout.")} variant="light">Plan a custom stay</Button>
        </Reveal>
      </div>
    </section>
  )
}
