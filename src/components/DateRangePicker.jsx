'use client'

import { useMemo, useState } from 'react'
import Icon from './Icons.jsx'
import { addDays, nightsBetween, parseISO, rangeBlocked, toISO, todayISO } from '../lib/booking.js'
import { MAX_NIGHTS } from '../data/availability.js'

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const QUICK = [1, 2, 3, 7]

function monthCells(year, month) {
  const first = new Date(year, month, 1)
  const days = new Date(year, month + 1, 0).getDate()
  const cells = Array.from({ length: first.getDay() }, () => null)
  for (let d = 1; d <= days; d += 1) cells.push(toISO(new Date(year, month, d)))
  return cells
}

/**
 * Inline range calendar. Click a check-in date, then a check-out date.
 * `blocked` is a Set of taken nights; they are crossed out and cannot be part of a stay.
 */
export default function DateRangePicker({ checkIn, checkOut, onChange, blocked = new Set(), months = 1, maxNights = MAX_NIGHTS }) {
  const today = todayISO()
  const start = parseISO(checkIn) ?? new Date()
  const [cursor, setCursor] = useState({ y: start.getFullYear(), m: start.getMonth() })
  const [hover, setHover] = useState('')

  const atCurrentMonth = cursor.y === new Date().getFullYear() && cursor.m === new Date().getMonth()
  const shift = (delta) => setCursor(({ y, m }) => { const d = new Date(y, m + delta, 1); return { y: d.getFullYear(), m: d.getMonth() } })

  const pick = (iso) => {
    const choosingEnd = checkIn && !checkOut && iso > checkIn
    if (choosingEnd && !rangeBlocked(blocked, checkIn, iso) && nightsBetween(checkIn, iso) <= maxNights) onChange(checkIn, iso)
    else onChange(iso, '')
    setHover('')
  }

  const isDisabled = (iso) => {
    if (iso < today) return true
    if (checkIn && !checkOut && iso > checkIn) return rangeBlocked(blocked, checkIn, iso) || nightsBetween(checkIn, iso) > maxNights
    return blocked.has(iso)
  }

  const previewEnd = checkOut || (checkIn && hover > checkIn && !isDisabled(hover) ? hover : '')
  const panels = useMemo(() => Array.from({ length: months }, (_, i) => {
    const d = new Date(cursor.y, cursor.m + i, 1)
    return { y: d.getFullYear(), m: d.getMonth() }
  }), [cursor, months])

  const quick = (n) => {
    if (!checkIn) return
    const out = addDays(checkIn, n)
    if (n <= maxNights && !rangeBlocked(blocked, checkIn, out)) onChange(checkIn, out)
  }

  return (
    <div>
      <div className={`grid gap-8 ${months > 1 ? 'sm:grid-cols-2' : ''}`}>
        {panels.map((panel, index) => {
          const label = new Date(panel.y, panel.m, 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
          return (
            <div key={`${panel.y}-${panel.m}`}>
              <div className="mb-3 flex items-center justify-between">
                {index === 0 ? (
                  <button type="button" onClick={() => shift(-1)} disabled={atCurrentMonth} aria-label="Previous month" className="grid h-9 w-9 place-items-center rounded-full text-forest transition hover:bg-forest/10 disabled:opacity-25 disabled:hover:bg-transparent"><Icon name="chevronL" className="h-5 w-5" /></button>
                ) : <span className="h-9 w-9" />}
                <p className="text-sm font-bold text-forest" aria-live="polite">{label}</p>
                {index === panels.length - 1 ? (
                  <button type="button" onClick={() => shift(1)} aria-label="Next month" className="grid h-9 w-9 place-items-center rounded-full text-forest transition hover:bg-forest/10"><Icon name="chevronR" className="h-5 w-5" /></button>
                ) : <span className="h-9 w-9" />}
              </div>
              <div className="grid grid-cols-7 text-center text-[0.65rem] font-bold uppercase tracking-[0.08em] text-forest/45">
                {WEEKDAYS.map((day) => <span key={day} className="py-1.5">{day}</span>)}
              </div>
              <div className="grid grid-cols-7" onMouseLeave={() => setHover('')}>
                {monthCells(panel.y, panel.m).map((iso, i) => {
                  if (!iso) return <span key={`gap-${i}`} />
                  const disabled = isDisabled(iso)
                  const taken = blocked.has(iso)
                  const isStart = iso === checkIn
                  const isEnd = iso === checkOut
                  const inRange = checkIn && previewEnd && iso > checkIn && iso < previewEnd
                  const edge = isStart || isEnd || (!checkOut && iso === previewEnd)
                  const rangeBg = checkIn && previewEnd && (isStart || iso === previewEnd || inRange)
                  return (
                    <div key={iso} className={`relative py-0.5 ${rangeBg ? 'bg-sun/20' : ''} ${isStart && previewEnd ? 'rounded-l-full' : ''} ${iso === previewEnd ? 'rounded-r-full' : ''} ${isStart && !previewEnd ? 'rounded-full' : ''}`}>
                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() => pick(iso)}
                        onMouseEnter={() => setHover(iso)}
                        onFocus={() => setHover(iso)}
                        aria-pressed={isStart || isEnd}
                        aria-label={`${parseISO(iso).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}${taken ? ', not available' : ''}${isStart ? ', check-in' : ''}${isEnd ? ', check-out' : ''}`}
                        className={`mx-auto grid h-9 w-9 place-items-center rounded-full text-sm transition ${
                          edge ? 'bg-forest font-bold text-cream'
                            : disabled ? (taken ? 'text-forest/30 line-through' : 'text-forest/25')
                              : `font-semibold text-forest hover:bg-forest hover:text-cream ${iso === today ? 'ring-1 ring-forest/40' : ''}`
                        } ${disabled ? 'cursor-not-allowed' : ''}`}
                      >
                        {Number(iso.slice(8))}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-forest/10 pt-4">
        {checkIn && !checkOut ? (
          <>
            <span className="mr-1 text-xs font-semibold text-forest/60">Stay for</span>
            {QUICK.map((n) => {
              const out = addDays(checkIn, n)
              const off = rangeBlocked(blocked, checkIn, out)
              return <button key={n} type="button" disabled={off} onClick={() => quick(n)} className="rounded-full border border-forest/25 px-3 py-1.5 text-xs font-semibold text-forest transition hover:border-forest hover:bg-forest hover:text-cream disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-forest">{n} {n === 1 ? 'night' : 'nights'}</button>
            })}
          </>
        ) : (
          <p className="text-xs text-forest/60">{checkOut ? `${nightsBetween(checkIn, checkOut)} ${nightsBetween(checkIn, checkOut) === 1 ? 'night' : 'nights'} selected.` : 'Pick your check-in date, then your check-out date.'}</p>
        )}
        {(checkIn || checkOut) && <button type="button" onClick={() => onChange('', '')} className="ml-auto text-xs font-semibold text-forest underline decoration-sun decoration-2 underline-offset-4">Clear dates</button>}
      </div>
    </div>
  )
}
