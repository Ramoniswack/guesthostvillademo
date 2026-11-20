'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarDays, Minus, Plus, Search, Users } from 'lucide-react'
import { MAX_GUESTS } from '../data/rooms.js'
import { addDays, fmtDate, stayQuery, todayISO } from '../lib/booking.js'

/** Check-in / check-out / guests strip that overlaps the bottom edge of the hero. Sends the choices to the rooms list. */
export default function HeroBookingBar() {
  const router = useRouter()
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)
  const today = todayISO()

  const submit = (event) => {
    event.preventDefault()
    router.push(`/rooms${stayQuery({ guests, checkIn, checkOut: checkIn && checkOut > checkIn ? checkOut : '' })}`)
  }
  const label = 'block text-[0.62rem] font-bold uppercase tracking-[0.14em] text-forest/55'
  const input = 'mt-1 w-full bg-transparent text-[0.95rem] font-semibold text-forest outline-none'
  const step = 'grid h-8 w-8 place-items-center rounded-full border border-forest/25 text-forest transition hover:bg-forest hover:text-cream disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-forest'

  return (
    <form onSubmit={submit} aria-label="Check availability"
      className="mx-auto grid w-full max-w-4xl gap-px overflow-hidden rounded-2xl border border-white/25 bg-forest/15 text-left shadow-[0_24px_60px_-20px_rgba(15,30,22,0.55)] md:grid-cols-[1fr_1fr_1fr_auto]">
      <label className="flex items-center gap-3 bg-white px-5 py-4">
        <CalendarDays className="h-5 w-5 shrink-0 text-sun-text" aria-hidden="true" />
        <span className="min-w-0 flex-1"><span className={label}>Check-in</span>
          <input type="date" min={today} value={checkIn} onChange={(e) => { setCheckIn(e.target.value); if (checkOut && e.target.value >= checkOut) setCheckOut('') }} className={input} /></span>
      </label>
      <label className="flex items-center gap-3 bg-white px-5 py-4">
        <CalendarDays className="h-5 w-5 shrink-0 text-sun-text" aria-hidden="true" />
        <span className="min-w-0 flex-1"><span className={label}>Check-out</span>
          <input type="date" min={checkIn ? addDays(checkIn, 1) : today} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className={input} /></span>
      </label>
      <div className="flex items-center gap-3 bg-white px-5 py-4">
        <Users className="h-5 w-5 shrink-0 text-sun-text" aria-hidden="true" />
        <div className="min-w-0 flex-1"><span className={label}>Guests</span><span className="mt-1 block text-[0.95rem] font-semibold text-forest" aria-live="polite">{guests} {guests === 1 ? 'guest' : 'guests'}</span></div>
        <div className="flex items-center gap-2">
          <button type="button" aria-label="Remove guest" disabled={guests <= 1} onClick={() => setGuests(guests - 1)} className={step}><Minus className="h-4 w-4" aria-hidden="true" /></button>
          <button type="button" aria-label="Add guest" disabled={guests >= MAX_GUESTS} onClick={() => setGuests(guests + 1)} className={step}><Plus className="h-4 w-4" aria-hidden="true" /></button>
        </div>
      </div>
      <button type="submit" className="inline-flex min-h-[4.5rem] items-center justify-center gap-3 bg-sun px-8 text-base font-semibold text-forest-dark transition hover:bg-sun-dark">
        <Search className="h-5 w-5" aria-hidden="true" />Check availability
      </button>
    </form>
  )
}
