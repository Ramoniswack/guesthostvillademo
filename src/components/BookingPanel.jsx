'use client'

import { useMemo, useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import Icon from './Icons.jsx'
import DateRangePicker from './DateRangePicker.jsx'
import { plans, describePrice, formatNpr, stayMessage } from '../data/rooms.js'
import { waLink } from '../data/site.js'
import { blockedSetFor, fmtDate, nightsBetween, stayQuote } from '../lib/booking.js'

const nightsText = (n) => `${n} ${n === 1 ? 'night' : 'nights'}`
const range = (min, max) => `${formatNpr(min)} – ${max.toLocaleString('en-US')}`

function Stepper({ value, min, max, onChange, label }) {
  const btn = 'grid h-10 w-10 place-items-center rounded-full border border-forest/25 text-lg text-forest transition hover:border-forest hover:bg-forest hover:text-cream disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-forest'
  return (
    <div className="flex items-center gap-4">
      <button type="button" aria-label={`Remove ${label}`} disabled={value <= min} onClick={() => onChange(value - 1)} className={btn}><Minus className="h-4 w-4" aria-hidden="true" /></button>
      <span className="w-6 text-center text-lg font-semibold text-forest" aria-live="polite">{value}</span>
      <button type="button" aria-label={`Add ${label}`} disabled={value >= max} onClick={() => onChange(value + 1)} className={btn}><Plus className="h-4 w-4" aria-hidden="true" /></button>
    </div>
  )
}

export default function BookingPanel({ room, guests, setGuests, plan, setPlan, checkIn, checkOut, setDates, panelRef, embedded = false }) {
  const [calendarOpen, setCalendarOpen] = useState(!(checkIn && checkOut))
  const blocked = useMemo(() => blockedSetFor(room), [room])
  const nights = nightsBetween(checkIn, checkOut)
  const hasDates = nights > 0
  const price = describePrice(room, guests, plan)
  const quote = hasDates ? stayQuote(room, guests, plan, nights) : null
  const ask = room.whatsappOnly

  const onDates = (ci, co) => {
    setDates(ci, co)
    setCalendarOpen(!(ci && co))
  }

  const dateButton = (label, value, active) => (
    <button type="button" onClick={() => setCalendarOpen(true)} aria-expanded={calendarOpen}
      className={`flex-1 px-4 py-3.5 text-left transition hover:bg-forest/5 ${active && calendarOpen ? 'bg-sun/15' : ''}`}>
      <span className="block text-[0.65rem] font-bold uppercase tracking-[0.14em] text-forest/55">{label}</span>
      <span className={`mt-1 block text-[0.95rem] font-semibold ${value ? 'text-forest' : 'text-forest/40'}`}>{value ? fmtDate(value) : 'Add date'}</span>
    </button>
  )

  return (
    <aside ref={panelRef} id="book" aria-label="Check rate and book" className={`scroll-mt-28 bg-cream ${embedded ? '' : 'border border-forest/15 shadow-[0_18px_45px_rgba(35,70,53,0.08)]'}`}>
      <div className={`p-5 pb-4 ${embedded ? 'hidden' : ''}`}>
        {price.label && <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-forest/55">{price.label}</p>}
        <p className="mt-1.5 font-display text-[2rem] leading-none tracking-[-0.03em] text-forest">{price.main}</p>
        <p className="mt-2.5 text-sm text-forest/60">{price.note}{price.perPerson ? ` · ${price.perPerson}` : ''}</p>
      </div>

      <div className={`space-y-5 p-5 ${embedded ? '' : 'border-t border-forest/10'}`}>
        {/* Dates */}
        <div>
          <div className="flex divide-x divide-forest/15 border border-forest/20">
            {dateButton('Check-in', checkIn, !checkIn || (checkIn && !checkOut))}
            {dateButton('Check-out', checkOut, checkIn && !checkOut)}
          </div>
          {calendarOpen ? (
            <div className="mt-5">
              <DateRangePicker checkIn={checkIn} checkOut={checkOut} onChange={onDates} blocked={blocked} />
            </div>
          ) : hasDates && (
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="font-semibold text-forest">{nightsText(nights)} · check-in from 2 PM, out by 10 AM</span>
              <button type="button" onClick={() => setCalendarOpen(true)} className="font-semibold text-forest underline decoration-sun decoration-2 underline-offset-4">Change</button>
            </div>
          )}
        </div>

        {/* Guests */}
        <div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-forest">Guests</p>
              <p className="mt-0.5 text-xs text-forest/55">Fits {room.minGuests === room.maxGuests ? room.maxGuests : `${room.minGuests} to ${room.maxGuests}`}</p>
            </div>
            <Stepper value={guests} min={room.minGuests} max={room.maxGuests} onChange={setGuests} label="guest" />
          </div>
        </div>

        {/* Meal plan */}
        <fieldset>
          <legend className="mb-3 text-sm font-bold text-forest">Meal plan</legend>
          <div className="grid grid-cols-2 gap-3">
            {plans.map((item) => {
              const on = plan === item.id
              return (
                <button key={item.id} type="button" onClick={() => setPlan(item.id)} aria-pressed={on}
                  className={`border px-4 py-3.5 text-left transition ${on ? 'border-forest bg-forest text-cream' : 'border-forest/20 text-forest hover:border-forest'}`}>
                  <span className="block text-sm font-semibold">{item.label}</span>
                  <span className={`mt-0.5 block text-xs ${on ? 'text-cream/75' : 'text-forest/55'}`}>{item.note}</span>
                </button>
              )
            })}
          </div>
        </fieldset>

        {/* Price breakdown */}
        {!ask && (
          <div className="bg-sand/70 p-4">
            {quote ? (
              <dl className="space-y-2.5 text-sm text-forest/75">
                <div className="flex justify-between gap-4"><dt>{quote.stayLabel}</dt><dd className="shrink-0 font-semibold text-forest">{quote.kind === 'range' ? range(quote.stayMin, quote.stayMax) : formatNpr(quote.stay)}</dd></div>
                {quote.mealLabel && <div className="flex justify-between gap-4"><dt>Meal plan · {quote.mealLabel}</dt><dd className="shrink-0 font-semibold text-forest">{formatNpr(quote.meal)}</dd></div>}
                <div className="flex items-baseline justify-between gap-4 border-t border-forest/15 pt-3 text-forest">
                  <dt className="font-bold">Estimated total</dt>
                  <dd className="font-display text-xl font-semibold">{quote.kind === 'range' ? range(quote.min, quote.max) : formatNpr(quote.total)}</dd>
                </div>
              </dl>
            ) : (
              <p className="flex items-start gap-3 text-sm text-forest/65"><Icon name="calendar" className="mt-0.5 h-5 w-5 shrink-0 text-forest" />Choose your dates to see the total for your stay.</p>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-forest/10 p-5">
        {ask || hasDates ? (
          <a href={waLink(stayMessage(room, { guests, plan, checkIn, checkOut }))} target="_blank" rel="noopener noreferrer"
            className="inline-flex min-h-[54px] w-full items-center justify-center gap-3 bg-sun px-6 text-base font-semibold text-forest-dark transition hover:bg-sun-dark">
            <Icon name="chat" className="h-5 w-5" />{ask ? 'Ask on WhatsApp' : 'Request these dates on WhatsApp'}
          </a>
        ) : (
          <>
            <button type="button" onClick={() => setCalendarOpen(true)} className="inline-flex min-h-[54px] w-full items-center justify-center gap-3 bg-sun px-6 text-base font-semibold text-forest-dark transition hover:bg-sun-dark">
              <Icon name="calendar" className="h-5 w-5" />Choose your dates
            </button>
            <a href={waLink(stayMessage(room, { guests, plan }))} target="_blank" rel="noopener noreferrer" className="mt-4 block text-center text-sm font-semibold text-forest underline decoration-sun decoration-2 underline-offset-4">Or ask on WhatsApp without dates</a>
          </>
        )}
        <ul className="mt-5 space-y-2 text-xs leading-relaxed text-forest/60">
          <li className="flex gap-2.5"><Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sun-text" />No payment now. The team confirms availability on WhatsApp.</li>
          <li className="flex gap-2.5"><Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sun-text" />Free cancellation within 48 hours of booking, if at least 24 hours before check-in.</li>
        </ul>
      </div>
    </aside>
  )
}
