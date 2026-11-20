// Small date + quote helpers for the booking calendar. All dates are local 'YYYY-MM-DD' strings.
import { blockedNights } from '../data/availability.js'
import { findStay, mapAddFor, priceFor, MAP_ADD } from '../data/rooms.js'

const pad = (n) => String(n).padStart(2, '0')
export const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const parseISO = (s) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s ?? '')) return null
  const [y, m, d] = s.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return Number.isNaN(date.getTime()) ? null : date
}
export const todayISO = () => toISO(new Date())
export const addDays = (iso, n) => { const d = parseISO(iso); d.setDate(d.getDate() + n); return toISO(d) }
export const nightsBetween = (a, b) => {
  const x = parseISO(a), y = parseISO(b)
  if (!x || !y) return 0
  return Math.max(0, Math.round((y - x) / 86400000))
}
export const fmtDate = (iso, opts = { weekday: 'short', day: 'numeric', month: 'short' }) => {
  const d = parseISO(iso)
  return d ? d.toLocaleDateString('en-GB', opts) : ''
}

// Every stay that physically overlaps this one (so a booked room blocks the building that contains it).
function relatedIds(room) {
  const ids = new Set([room.id])
  const walk = (item) => (item.includes ?? []).forEach((id) => { if (!ids.has(id)) { ids.add(id); const child = findStay(id); if (child) walk(child) } })
  walk(room)
  // and any stay that includes this one
  let grew = true
  while (grew) {
    grew = false
    for (const id of Object.keys(blockedNights)) {
      const other = findStay(id)
      if (other && !ids.has(id) && (other.includes ?? []).some((inc) => ids.has(inc))) { ids.add(id); grew = true }
    }
  }
  return ids
}

export function blockedSetFor(room) {
  const set = new Set()
  relatedIds(room).forEach((id) => (blockedNights[id] ?? []).forEach((d) => set.add(d)))
  return set
}

/** True when any night from checkIn (inclusive) to checkOut (exclusive) is taken. */
export function rangeBlocked(blocked, checkIn, checkOut) {
  for (let d = checkIn; d < checkOut; d = addDays(d, 1)) if (blocked.has(d)) return true
  return false
}

/** Full quote for the stay: lines for the price breakdown plus a total (or range, or ask). */
export function stayQuote(room, guests, plan, nights) {
  const n = Math.max(1, nights || 0)
  const bb = priceFor(room, guests, 'BB')
  const g = bb.guests
  if (bb.kind === 'ask') return { kind: 'ask', nights: n, guests: g }
  const mealPerNight = plan === 'MAP' ? mapAddFor(room, g) : 0
  const mealText = mealPerNight
    ? (room.pricing?.mapBase != null && g >= room.pricing.included
      ? `MAP meal plan × ${n} ${n === 1 ? 'night' : 'nights'}`
      : `NPR ${MAP_ADD} × ${g} guests × ${n} ${n === 1 ? 'night' : 'nights'}`)
    : null
  if (bb.kind === 'range') {
    return {
      kind: 'range', nights: n, guests: g,
      stayLabel: `NPR ${bb.min.toLocaleString('en-US')} – ${bb.max.toLocaleString('en-US')} × ${n} ${n === 1 ? 'night' : 'nights'}`,
      stayMin: bb.min * n, stayMax: bb.max * n,
      meal: mealPerNight * n, mealLabel: mealText,
      min: (bb.min + mealPerNight) * n, max: (bb.max + mealPerNight) * n,
    }
  }
  return {
    kind: 'exact', nights: n, guests: g,
    stay: bb.total * n, stayLabel: `NPR ${bb.total.toLocaleString('en-US')} × ${n} ${n === 1 ? 'night' : 'nights'}`,
    meal: mealPerNight * n, mealLabel: mealText,
    total: (bb.total + mealPerNight) * n,
  }
}

/** Query string that carries the guest's choices from the list page to a room page. */
export function stayQuery({ guests, plan, checkIn, checkOut } = {}) {
  const q = new URLSearchParams()
  if (guests) q.set('guests', guests)
  if (plan && plan !== 'BB') q.set('plan', plan)
  if (checkIn) q.set('in', checkIn)
  if (checkOut) q.set('out', checkOut)
  const s = q.toString()
  return s ? `?${s}` : ''
}
