'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Icon from './Icons.jsx'
import { Button, Reveal } from './ui.jsx'
import {
  rooms, buildings, plans, MAX_GUESTS, WHATSAPP_FROM,
  recommendedFor, describePrice, priceFor, buildingLabel, stayMessage,
} from '../data/rooms.js'
import { waLink } from '../data/site.js'
import { nightsBetween, stayQuery, stayQuote, todayISO } from '../lib/booking.js'

const BUDGET_MAX = 40000

const viewOptions = [
  { id: 'any', label: 'Any view' },
  { id: 'mountain', label: 'Mountain view (MV)' },
  { id: 'city', label: 'City view (CV)' },
]

function Spec({ icon, children }) {
  return (
    <li className="flex items-center gap-2.5 text-sm text-forest/70">
      <Icon name={icon} className="h-[1.125rem] w-[1.125rem] shrink-0 text-forest/60" />
      <span>{children}</span>
    </li>
  )
}

function StayCard({ room, guests, plan, checkIn, checkOut }) {
  const price = describePrice(room, guests, plan)
  const nights = nightsBetween(checkIn, checkOut)
  const quote = nights > 0 && !room.whatsappOnly ? stayQuote(room, guests ?? room.defaultGuests, plan, nights) : null
  const href = `/rooms/${room.id}${stayQuery({ guests, plan, checkIn, checkOut })}`
  return (
    <article className="group flex h-full flex-col overflow-hidden border border-forest/10 bg-cream shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-warm">
      <Link href={href} aria-label={`View ${room.name}`} className="relative block overflow-hidden bg-forest-dark">
        <img src={room.image} alt={room.alt} loading="lazy" className="aspect-[3/2] w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
        <span className="absolute left-5 top-5 bg-sun px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.13em] text-forest-dark">{room.badge}</span>
      </Link>

      <div className="flex flex-1 flex-col px-7 pb-8 pt-8 sm:px-9 sm:pb-9 sm:pt-9">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-sun-text">{buildingLabel(room)}</p>
        <h3 className="mt-3 font-display text-[1.75rem] font-semibold leading-[1.08] tracking-[-0.035em] text-forest">
          <Link href={href} className="transition hover:text-forest-dark">{room.name}</Link>
        </h3>
        <p className="mt-4 line-clamp-2 text-[0.95rem] leading-[1.7] text-forest/65">{room.blurb}</p>

        <ul className="mt-6 space-y-2.5">
          <Spec icon="users">{room.capacity}</Spec>
          <Spec icon="bed">{room.bed}</Spec>
          {room.viewText && <Spec icon="mountain">{room.viewText}</Spec>}
        </ul>

        <div className="mt-auto pt-10">
          <div className="flex items-end justify-between gap-5 border-t border-forest/10 pt-7">
            <div className="min-w-0">
              {price.label && <span className="block text-[0.65rem] font-bold uppercase tracking-[0.16em] text-forest/50">{price.label}</span>}
              <span className={`mt-1.5 block font-display leading-none tracking-[-0.03em] text-forest ${price.label ? 'text-[1.6rem]' : 'text-xl'}`}>{price.main}</span>
              <span className="mt-2 block text-[0.8125rem] text-forest/55">{quote ? `${nights} ${nights === 1 ? 'night' : 'nights'} · ${quote.kind === 'range' ? `from NPR ${quote.min.toLocaleString('en-US')}` : `NPR ${quote.total.toLocaleString('en-US')} total`}` : price.note}</span>
            </div>
            <Link href={href} className="inline-flex min-h-[48px] shrink-0 items-center justify-center bg-forest px-6 text-sm font-semibold text-cream transition hover:bg-forest-dark">{room.whatsappOnly ? 'View stay' : 'View & book'}</Link>
          </div>
          <a href={waLink(stayMessage(room, { guests, plan, checkIn, checkOut }))} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block text-[0.8125rem] font-semibold text-forest underline decoration-sun decoration-2 underline-offset-[5px]">
            {room.whatsappOnly ? 'Ask the team on WhatsApp' : 'Or ask on WhatsApp'}
          </a>
        </div>
      </div>
    </article>
  )
}

function FilterGroup({ title, children }) {
  return (
    <fieldset className="border-t border-forest/15 pt-6 first:border-t-0 first:pt-0">
      <legend className="mb-3 text-sm font-bold text-forest">{title}</legend>
      {children}
    </fieldset>
  )
}

function Radio({ name, checked, onChange, children, hint }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 py-1.5 text-sm text-forest/80">
      <input type="radio" name={name} checked={checked} onChange={onChange} className="mt-1 accent-forest" />
      <span>{children}{hint && <small className="block text-xs text-forest/55">{hint}</small>}</span>
    </label>
  )
}

export default function Rooms() {
  const [building, setBuilding] = useState('all')
  const [guests, setGuests] = useState(null) // null = any group size
  const [plan, setPlan] = useState('BB')
  const [view, setView] = useState('any')
  const [budget, setBudget] = useState(BUDGET_MAX)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const visible = useMemo(() => {
    const pool = guests == null ? rooms.filter((room) => room.catalog) : recommendedFor(guests)
    return pool.filter((room) => {
      if (building !== 'all' && room.building !== 'both' && room.building !== building) return false
      if (view !== 'any' && !room.views.includes(view)) return false
      if (budget < BUDGET_MAX) {
        const result = priceFor(room, guests, plan)
        const cost = result.kind === 'exact' ? result.total : result.kind === 'range' ? result.min : null
        if (cost != null && cost > budget) return false
      }
      return true
    })
  }, [building, guests, plan, view, budget])

  const clearFilters = () => { setBuilding('all'); setGuests(null); setPlan('BB'); setView('any'); setBudget(BUDGET_MAX); setCheckIn(''); setCheckOut('') }
  const activeCount = [building !== 'all', guests != null, plan !== 'BB', view !== 'any', budget < BUDGET_MAX, checkIn || checkOut].filter(Boolean).length
  const directBooking = guests != null && guests >= WHATSAPP_FROM

  return (
    <section id="rooms" className="bg-sand pb-28 pt-20 md:pb-40 md:pt-28">
      <div className="wrap max-w-[1360px]">
        <Reveal className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="label">Stay collection</p>
            <h2 className="max-w-2xl font-display text-5xl font-semibold leading-[0.96] tracking-[-0.05em] text-forest sm:text-6xl">Find the G’Host space that fits your stay.</h2>
          </div>
          <p className="max-w-sm leading-relaxed text-forest/70">Two buildings, one hilltop. Tell us how many of you are coming and we’ll show the stays that fit.</p>
        </Reveal>

        {/* The two buildings: also act as quick filters */}
        <div className="mt-14 grid gap-6 md:mt-16 md:grid-cols-2">
          {buildings.map((item) => {
            const active = building === item.id
            return (
              <button key={item.id} type="button" onClick={() => setBuilding(active ? 'all' : item.id)} aria-pressed={active}
                className={`group relative flex min-h-[15rem] items-end overflow-hidden border text-left transition ${active ? 'border-sun ring-2 ring-sun' : 'border-forest/15 hover:border-forest/40'}`}>
                <img src={item.image} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" style={{ objectPosition: item.position }} />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/90 via-forest-dark/45 to-forest-dark/10" />
                <div className="relative p-6 text-cream sm:p-8">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-sun">{item.tagline}</p>
                  <h3 className="mt-2 font-display text-3xl font-semibold leading-none tracking-[-0.035em] sm:text-4xl">{item.name}</h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-cream/85">{item.blurb}</p>
                  <span className="mt-4 inline-block text-xs font-bold uppercase tracking-[0.14em] underline decoration-sun decoration-2 underline-offset-4">{active ? 'Showing this building · tap to clear' : 'Show only this building'}</span>
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start lg:gap-12 xl:grid-cols-[320px_minmax(0,1fr)] xl:gap-16">
          <div className="lg:sticky lg:top-28">
            <button type="button" onClick={() => setFiltersOpen((open) => !open)} aria-expanded={filtersOpen}
              className="flex w-full items-center justify-between border border-forest/25 bg-cream px-5 py-4 text-sm font-bold text-forest lg:hidden">
              <span>Filters{activeCount > 0 ? ` · ${activeCount} active` : ''}</span><span aria-hidden="true">{filtersOpen ? '−' : '+'}</span>
            </button>
            <aside aria-label="Filter stays" className={`${filtersOpen ? 'block' : 'hidden'} mt-4 border border-forest/15 bg-cream p-6 sm:p-7 lg:mt-0 lg:block lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto`}>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-display text-3xl text-forest">Filter by</h2>
                <button type="button" onClick={clearFilters} className="text-xs font-semibold text-forest underline decoration-sun decoration-2 underline-offset-4">Clear filters</button>
              </div>
              <div className="space-y-6">
                <FilterGroup title="Guests">
                  <div className="flex items-center justify-between border border-forest/20 px-4 py-3">
                    <button type="button" aria-label="Remove guest" onClick={() => setGuests((value) => (value == null || value <= 1 ? null : value - 1))} className="grid h-8 w-8 place-items-center rounded-full bg-forest text-cream">−</button>
                    <span className="font-semibold text-forest">{guests == null ? 'Any group size' : `${guests} ${guests === 1 ? 'guest' : 'guests'}`}</span>
                    <button type="button" aria-label="Add guest" onClick={() => setGuests((value) => (value == null ? 2 : Math.min(MAX_GUESTS, value + 1)))} className="grid h-8 w-8 place-items-center rounded-full bg-forest text-cream">+</button>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-forest/60">
                    {guests == null ? 'Add your guests to see the stays that suit your group, with the total price.' : directBooking ? 'Groups of 8 or more are booked directly on WhatsApp, and the team confirms the price.' : 'Showing the stays that suit this group, best match first.'}
                  </p>
                </FilterGroup>

                <FilterGroup title="Building">
                  <Radio name="building" checked={building === 'all'} onChange={() => setBuilding('all')}>Both buildings</Radio>
                  {buildings.map((item) => <Radio key={item.id} name="building" checked={building === item.id} onChange={() => setBuilding(item.id)} hint={item.tagline}>{item.name}</Radio>)}
                </FilterGroup>

                <FilterGroup title="Meal plan">
                  {plans.map((item) => <Radio key={item.id} name="plan" checked={plan === item.id} onChange={() => setPlan(item.id)} hint={item.note}>{item.label} ({item.short})</Radio>)}
                </FilterGroup>

                <FilterGroup title="View">
                  {viewOptions.map((item) => <Radio key={item.id} name="view" checked={view === item.id} onChange={() => setView(item.id)}>{item.label}</Radio>)}
                </FilterGroup>

                <FilterGroup title="Budget per night">
                  <input aria-label="Maximum budget per night" type="range" min="4000" max={BUDGET_MAX} step="500" value={budget} onChange={(event) => setBudget(Number(event.target.value))} className="w-full accent-forest" />
                  <p className="mt-2 text-sm font-semibold text-forest/70">{budget >= BUDGET_MAX ? 'Any budget' : `Up to NPR ${budget.toLocaleString('en-US')}`}</p>
                </FilterGroup>

                <FilterGroup title="Dates (optional)">
                  <div className="grid gap-3">
                    <label className="block text-xs font-bold uppercase tracking-[0.12em] text-forest/55">Check in<input type="date" min={todayISO()} value={checkIn} onChange={(event) => setCheckIn(event.target.value)} className="mt-1.5 w-full border border-forest/20 bg-cream px-3 py-2.5 text-sm font-semibold normal-case tracking-normal text-forest outline-none focus:border-forest" /></label>
                    <label className="block text-xs font-bold uppercase tracking-[0.12em] text-forest/55">Check out<input type="date" value={checkOut} min={checkIn || todayISO()} onChange={(event) => setCheckOut(event.target.value)} className="mt-1.5 w-full border border-forest/20 bg-cream px-3 py-2.5 text-sm font-semibold normal-case tracking-normal text-forest outline-none focus:border-forest" /></label>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-forest/60">Dates are added to your WhatsApp booking message.</p>
                </FilterGroup>
              </div>
            </aside>
          </div>

          <div id="stay-results">
            <p className="text-sm font-semibold text-forest/65">Showing {visible.length} {visible.length === 1 ? 'stay' : 'stays'}{guests != null ? ` for ${guests} ${guests === 1 ? 'guest' : 'guests'}` : ''}</p>
            <div className="mt-8 grid gap-10 md:grid-cols-2 xl:gap-12">
              {visible.map((room) => <StayCard key={room.id} room={room} guests={guests} plan={plan} checkIn={checkIn} checkOut={checkOut} />)}
              {visible.length === 0 && (
                <div className="col-span-full border border-forest/15 bg-cream p-10 text-forest/70">
                  <p>No stays match those filters. Try widening them, or ask the team for a custom stay.</p>
                  <button type="button" onClick={clearFilters} className="mt-4 text-sm font-semibold text-forest underline decoration-sun decoration-2 underline-offset-4">Clear filters</button>
                </div>
              )}
            </div>
          </div>
        </div>

        <Reveal className="mt-28 grid gap-8 bg-forest p-10 text-cream md:mt-40 md:grid-cols-[1fr_auto] md:items-center md:p-14">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-sun">Need a tailored plan?</p>
            <h3 className="mt-4 max-w-2xl font-display text-4xl leading-[1.02] tracking-[-0.04em]">Tell us who’s coming. We’ll shape the stay around you.</h3>
          </div>
          <Button href={waLink("Hello G'Host Villa! I would like help planning a custom stay, group booking or full villa buyout.")} variant="light">Plan a custom stay</Button>
        </Reveal>
      </div>
    </section>
  )
}
