'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, ChevronDown, Heart, Minus, Plus, Star } from 'lucide-react'
import DateRangePicker from './DateRangePicker.jsx'
import { plans, describePrice, formatNpr, stayMessage, MAP_ADD, rooms } from '../data/rooms.js'
import { waLink } from '../data/site.js'
import { blockedSetFor, fmtDate, nightsBetween, recordBookingInBackend, stayQuote } from '../lib/booking.js'
import { backendWhatsAppLink, useBackendData } from '../lib/backend.jsx'

const nightsText = (n) => `${n} ${n === 1 ? 'night' : 'nights'}`
const range = (min, max) => `${formatNpr(min)} – ${max.toLocaleString('en-US')}`

function Stepper({ value, min, max, onChange, label }) {
  const btn =
    'grid h-8 w-8 place-items-center rounded-full border border-forest/20 text-forest transition hover:border-forest hover:bg-forest hover:text-cream disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-forest'
  return (
    <div className="flex items-center gap-2.5">
      <button type="button" aria-label={`Remove ${label}`} disabled={value <= min} onClick={() => onChange(value - 1)} className={btn}>
        <Minus className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      <span className="w-5 text-center text-sm font-bold text-forest" aria-live="polite">{value}</span>
      <button type="button" aria-label={`Add ${label}`} disabled={value >= max} onClick={() => onChange(value + 1)} className={btn}>
        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  )
}

export default function BookingPanel({
  room,
  guests,
  setGuests,
  plan,
  setPlan,
  checkIn,
  checkOut,
  setDates,
  panelRef,
  calendarOpen: controlledOpen,
  setCalendarOpen: setControlledOpen,
  onEnquire,
}) {
  const backend = useBackendData()
  const currentPlans = backend?.stays?.plans?.length ? backend.stays.plans : plans
  const allRooms = backend?.stays?.rooms?.length ? backend.stays.rooms : rooms
  const mapAdd = backend?.stays?.MAP_ADD ?? MAP_ADD
  const maxNights = backend?.stays?.MAX_NIGHTS
  const currentSite = backend?.site
  const cfg = backend?.stays?.roomDetailSettings ?? {}
  const vars = { review_count: currentSite?.reviewCountLabel || '379+', rating: currentSite?.reviewRating ?? 4.5 }
  const fill = (text, v) => String(text).replace(/\{(\w+)\}/g, (m, k) => (v[k] ?? m))
  const currentWhatsApp = (message) => backendWhatsAppLink(currentSite, message) ?? waLink(message)
  const [localOpen, setLocalOpen] = useState(false)
  const [groupOpen, setGroupOpen] = useState(false)

  const calendarOpen = controlledOpen !== undefined ? controlledOpen : localOpen
  const setCalendarOpen = setControlledOpen || setLocalOpen

  const blocked = useMemo(
    () => blockedSetFor(room, backend?.stays?.blockedNights, allRooms),
    [room, backend?.stays?.blockedNights, allRooms],
  )
  const nights = nightsBetween(checkIn, checkOut)
  const hasDates = nights > 0
  const price = describePrice(room, guests, plan, mapAdd)
  const quote = hasDates ? stayQuote(room, guests, plan, nights, mapAdd) : null
  const ask = room.whatsappOnly

  const onDates = (ci, co) => {
    setDates(ci, co)
    if (ci && co) setCalendarOpen(false)
  }

  const dateSummary = hasDates
    ? `${fmtDate(checkIn, { day: 'numeric', month: 'short' })} – ${fmtDate(checkOut, { day: 'numeric', month: 'short' })}`
    : checkIn
      ? `${fmtDate(checkIn, { day: 'numeric', month: 'short' })} – Check-out`
      : 'Select date'

  return (
    <div ref={panelRef} id="book" className="scroll-mt-28">
      {/* Top price */}
      <div className="border-b border-forest/10 pb-4">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="font-display text-3xl font-bold leading-none tracking-tight text-forest">{price.main}</span>
          <span className="text-sm text-forest/65">{ask ? 'on WhatsApp' : 'per night'}</span>
        </div>
        {price.label && (
          <p className="mt-1.5 text-xs text-forest/55">
            {price.label} · {price.note}
          </p>
        )}
      </div>

      {/* Collapsible Group pricing / Meal plan */}
      <div className="border-b border-forest/10">
        <button
          type="button"
          onClick={() => setGroupOpen((v) => !v)}
          aria-expanded={groupOpen}
          className="flex w-full items-center justify-center gap-2 py-3 text-sm font-semibold text-forest transition hover:text-forest/75"
        >
          <span>Group pricing</span>
          <ChevronDown className={`h-4 w-4 text-forest/60 transition ${groupOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>
        <AnimatePresence initial={false}>
          {groupOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.24, ease: [0.22, 0.61, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="space-y-3 pb-4">
                <div className="grid grid-cols-2 gap-2">
                  {currentPlans.map((item) => {
                    const on = plan === item.id
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setPlan(item.id)}
                        aria-pressed={on}
                        className={`rounded-lg border px-3 py-2 text-left transition ${
                          on ? 'border-forest bg-forest text-cream' : 'border-forest/20 text-forest hover:border-forest'
                        }`}
                      >
                        <span className="block text-xs font-semibold">{item.label}</span>
                        <span className={`mt-0.5 block text-[0.7rem] ${on ? 'text-cream/75' : 'text-forest/55'}`}>{item.note}</span>
                      </button>
                    )
                  })}
                </div>
                <p className="text-xs leading-relaxed text-forest/60">
                  Fits {room.minGuests === room.maxGuests ? room.maxGuests : `${room.minGuests}–${room.maxGuests}`} guests.{' '}
                  {price.perPerson ? `(${price.perPerson})` : price.note}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Grouped rounded input box: Guests + Select date */}
      <div className="mt-4 divide-y divide-forest/15 rounded-xl border border-forest/20 bg-white">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="text-sm font-bold text-forest">Guests</p>
            <p className="mt-0.5 truncate text-xs text-forest/55">
              {room.minGuests === room.maxGuests ? `${room.maxGuests} pax` : `${room.minGuests}–${room.maxGuests} pax`}
              {price.perPerson ? ` · ${price.perPerson}` : ''}
            </p>
          </div>
          <Stepper value={guests} min={room.minGuests} max={room.maxGuests} onChange={setGuests} label="guest" />
        </div>

        <button
          type="button"
          onClick={() => setCalendarOpen((v) => !v)}
          aria-expanded={calendarOpen}
          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-forest/[0.03]"
        >
          <span className="flex min-w-0 items-center gap-2.5">
            <CalendarDays className="h-4 w-4 shrink-0 text-forest/65" aria-hidden="true" />
            <span className={`truncate text-sm font-semibold ${hasDates ? 'text-forest' : 'text-forest/80'}`}>
              {dateSummary}
            </span>
          </span>
          <ChevronDown className={`h-4 w-4 shrink-0 text-forest/60 transition ${calendarOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>
      </div>

      {/* Inline calendar dropdown */}
      <AnimatePresence initial={false}>
        {calendarOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-3 rounded-xl border border-forest/15 bg-white p-3 shadow-soft">
              <DateRangePicker checkIn={checkIn} checkOut={checkOut} onChange={onDates} blocked={blocked} maxNights={maxNights} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Total row */}
      {!ask && (
        <div className="mt-4 flex items-baseline justify-between gap-4">
          <span className="text-sm font-medium text-forest/65">Total</span>
          <div className="text-right">
            <p className="font-display text-xl font-bold leading-none text-forest">
              {quote ? (quote.kind === 'range' ? range(quote.min, quote.max) : formatNpr(quote.total)) : price.main}
            </p>
            <p className="mt-1 text-xs text-forest/55">
              {quote ? `${guests} × ${nightsText(nights)} · ${plan}` : `${guests} ${guests === 1 ? 'guest' : 'guests'} · per night`}
            </p>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-4 space-y-2.5">
        {ask || hasDates ? (
          <a
            href={currentWhatsApp(stayMessage(room, { guests, plan, checkIn, checkOut }))}
            onClick={() => recordBookingInBackend({ room, guests, plan, checkIn, checkOut })}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[46px] w-full items-center justify-center rounded-full bg-sun px-4 text-sm font-semibold text-white transition hover:bg-sun-dark"
          >
            {ask ? 'Ask on WhatsApp' : 'Request on WhatsApp'}
          </a>
        ) : (
          <button
            type="button"
            onClick={() => setCalendarOpen(true)}
            className="inline-flex min-h-[46px] w-full items-center justify-center rounded-full bg-sun px-4 text-sm font-semibold text-white transition hover:bg-sun-dark"
          >
            Check availability
          </button>
        )}

        {onEnquire && (
          <button
            type="button"
            onClick={onEnquire}
            className="inline-flex min-h-[46px] w-full items-center justify-center rounded-full border border-forest/20 bg-white px-4 text-sm font-semibold text-forest transition hover:border-forest hover:bg-white/50"
          >
            Enquire Now
          </button>
        )}
      </div>

      {/* Trust & social proof footer */}
      <div className="mt-5 divide-y divide-forest/10 border-t border-forest/10 pt-3.5 text-xs leading-relaxed text-forest/75">
        <p className="flex items-start gap-2.5 pb-3">
          <Star className="mt-0.5 h-4 w-4 shrink-0 fill-leaf text-leaf" aria-hidden="true" />
          <span>
            <strong className="font-semibold text-forest">{fill(cfg.bookingTrust?.one?.strong || '{review_count} reviews on Google', vars)}</strong> — {fill(cfg.bookingTrust?.one?.text || 'travellers rate us {rating} out of 5', vars)}
          </span>
        </p>
        <p className="flex items-start gap-2.5 pt-3">
          <Heart className="mt-0.5 h-4 w-4 shrink-0 text-leaf" aria-hidden="true" />
          <span>
            <strong className="font-semibold text-forest">{cfg.bookingTrust?.two?.strong || 'Confirmed directly by the villa team'}</strong> — {cfg.bookingTrust?.two?.text || 'No payment now. Free cancellation within 48 hours of booking.'}
          </span>
        </p>
      </div>
    </div>
  )
}
