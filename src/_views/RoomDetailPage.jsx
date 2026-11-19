'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Icon from '../components/Icons.jsx'
import { Button, Reveal } from '../components/ui.jsx'
import CtaBanner from '../components/CtaBanner.jsx'
import BookingPanel from '../components/BookingPanel.jsx'
import {
  rooms, plans, findStay, buildingLabel, describePrice, rateTable, formatNpr, stayMessage,
} from '../data/rooms.js'
import { reviews } from '../data/reviews.js'
import { waLink } from '../data/site.js'
import { blockedSetFor, fmtDate, nightsBetween, parseISO, rangeBlocked, stayQuery, stayQuote, todayISO } from '../lib/booking.js'

const cellText = (result) => {
  if (result.kind === 'ask') return 'On WhatsApp'
  if (result.kind === 'range') return `${formatNpr(result.min)} – ${result.max.toLocaleString('en-US')}`
  return formatNpr(result.total)
}

export default function RoomDetailPage({ room }) {
  const [guests, setGuests] = useState(room.defaultGuests)
  const [plan, setPlan] = useState('BB')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [slide, setSlide] = useState(0)
  const [panelVisible, setPanelVisible] = useState(true)
  const [ready, setReady] = useState(false)
  const panelRef = useRef(null)
  const setDates = (inDate, outDate) => { setCheckIn(inDate); setCheckOut(outDate) }

  // Pick up what the guest chose on the rooms list (?guests=&plan=&in=&out=)
  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    const g = Number(q.get('guests'))
    if (g >= room.minGuests && g <= room.maxGuests) setGuests(g)
    if (q.get('plan') === 'MAP') setPlan('MAP')
    const i = q.get('in'), o = q.get('out')
    if (parseISO(i) && parseISO(o) && i >= todayISO() && o > i && !rangeBlocked(blockedSetFor(room), i, o)) setDates(i, o)
    setReady(true)
  }, [room])

  // Keep the address bar shareable
  useEffect(() => {
    if (!ready) return
    const query = stayQuery({ guests: guests !== room.defaultGuests ? guests : null, plan, checkIn, checkOut })
    window.history.replaceState(null, '', `${window.location.pathname}${query}`)
  }, [ready, guests, plan, checkIn, checkOut, room])

  // The mobile booking bar only shows while the full booking panel is off screen
  useEffect(() => {
    const el = panelRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return undefined
    const observer = new IntersectionObserver(([entry]) => setPanelVisible(entry.isIntersecting), { threshold: 0.05 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  const gallery = room.gallery
  const includes = (room.includes ?? []).map(findStay).filter(Boolean)
  const table = useMemo(() => rateTable(room), [room])
  const similar = useMemo(() => {
    const others = rooms.filter((item) => item.id !== room.id && item.catalog)
    return [...others.filter((item) => item.building === room.building), ...others.filter((item) => item.building !== room.building)].slice(0, 3)
  }, [room])
  const highlights = [
    { icon: 'home', value: buildingLabel(room) },
    { icon: 'users', value: room.capacity },
    { icon: 'bed', value: room.bed },
    ...(room.viewText ? [{ icon: 'mountain', value: room.viewText }] : []),
  ]
  const askOnly = table.every((row) => row.bb.kind === 'ask')

  const nights = nightsBetween(checkIn, checkOut)
  const quote = nights > 0 && !room.whatsappOnly ? stayQuote(room, guests, plan, nights) : null
  const barPrice = describePrice(room, guests, plan)
  const barReady = room.whatsappOnly || nights > 0
  const guestNote = reviews[0]
  const facts = [
    { icon: 'clock', title: 'Check-in', text: 'From 2 PM' },
    { icon: 'clock', title: 'Check-out', text: 'By 10 AM' },
    { icon: 'check', title: 'Cancellation', text: 'Free within 48 hours' },
    { icon: 'chat', title: 'Payment', text: 'None until confirmed' },
  ]

  return (
    <main className="bg-cream pb-40 pt-0 md:pb-28 lg:pb-16">
      <section className="relative min-h-[26rem] overflow-hidden bg-forest-dark text-cream md:min-h-[24rem]">
        <img src={room.image} alt={room.alt} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/25" />
        <div className="wrap relative flex min-h-[26rem] items-end pb-10 pt-32 md:min-h-[24rem] md:pb-12">
          <div className="max-w-4xl">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-cream/70">
              <Link href="/rooms" className="transition hover:text-sun">Rooms</Link> / {buildingLabel(room)}
            </p>
            <p className="mt-6 text-sm font-semibold text-sun">{room.badge}</p>
            <h1 className="mt-2 max-w-4xl font-display text-4xl leading-[1] tracking-[-0.045em] text-cream sm:text-5xl md:text-6xl">{room.name}</h1>
            <div className="mt-6 flex flex-wrap gap-x-7 gap-y-3 text-sm text-cream/85">
              {highlights.map((item) => <span key={item.value} className="inline-flex items-center gap-2"><Icon name={item.icon} className="h-5 w-5 text-sun" />{item.value}</span>)}
            </div>
          </div>
        </div>
      </section>

      <section className="wrap grid grid-cols-[minmax(0,1fr)] gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-16 lg:py-16">
        {/* Booking panel: first on phones so dates are one scroll away, sticky beside the details on desktop */}
        <div className="lg:order-2 lg:self-start">
          <div className="lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
            <BookingPanel room={room} guests={guests} setGuests={setGuests} plan={plan} setPlan={setPlan} checkIn={checkIn} checkOut={checkOut} setDates={setDates} panelRef={panelRef} />
          </div>
        </div>

        <div className="lg:order-1">
          <nav aria-label="On this page" className="flex flex-wrap gap-2">
            {[['#overview', 'Overview'], ['#rates', 'Rates'], ['#good-to-know', 'Good to know'], ['#gallery', 'Gallery'], ['#similar', 'Other stays']].map(([href, label]) => (
              <a key={href} href={href} className="rounded-full border border-forest/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-forest/70 transition hover:border-forest hover:bg-forest hover:text-cream">{label}</a>
            ))}
          </nav>

          <section id="overview" className="mt-12">
            <p className="label">{buildingLabel(room)}</p>
            <h2 className="max-w-3xl font-display text-4xl leading-[1.05] tracking-[-0.04em] text-forest sm:text-5xl">{room.bhk}</h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-forest/70">{room.blurb}</p>
            <p className="mt-5 max-w-2xl leading-relaxed text-forest/70"><strong className="font-semibold text-forest">Best for:</strong> {room.bestFor}</p>

            <div className="mt-10 grid grid-cols-2 gap-px border border-forest/15 bg-forest/15 sm:grid-cols-4">
              {facts.map((fact) => (
                <div key={fact.title} className="bg-cream p-5">
                  <Icon name={fact.icon} className="h-5 w-5 text-sun-text" />
                  <p className="mt-3 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-forest/55">{fact.title}</p>
                  <p className="mt-1 text-sm font-semibold text-forest">{fact.text}</p>
                </div>
              ))}
            </div>

            <h3 className="mt-12 text-sm font-bold text-forest">What this stay offers</h3>
            <ul className="mt-5 grid gap-x-10 gap-y-4 sm:grid-cols-2">
              {room.features.map((feature) => <li key={feature} className="flex gap-3 text-[0.95rem] leading-snug text-forest/75"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-sun-text" />{feature}</li>)}
            </ul>
          </section>

          {includes.length > 0 && (
            <section className="mt-16 border-t border-forest/15 pt-12">
              <p className="label">What’s included</p>
              <h2 className="font-display text-3xl leading-none tracking-[-0.04em] text-forest">This stay combines</h2>
              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                {includes.map((item) => (
                  <Link key={item.id} href={`/rooms/${item.id}`} className="group flex gap-5 border border-forest/15 bg-cream p-4 transition hover:border-forest/40">
                    <img src={item.image} alt={item.alt} loading="lazy" className="h-20 w-24 shrink-0 object-cover" />
                    <span className="min-w-0 self-center"><span className="block font-display text-xl leading-tight text-forest">{item.name}</span><span className="mt-1.5 block text-xs text-forest/60">{buildingLabel(item)}</span></span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section id="rates" className="mt-16 border-t border-forest/15 pt-12">
            <p className="label">Rates by group size</p>
            <h2 className="font-display text-3xl leading-none tracking-[-0.04em] text-forest">What you’d pay per night</h2>
            {askOnly ? (
              <p className="mt-6 max-w-2xl leading-relaxed text-forest/70">Bigger groups are booked directly. Send us your dates and group size on WhatsApp and the team will confirm the price.</p>
            ) : (
              <details className="group mt-7 border border-forest/15" open={table.length <= 4}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-forest [&::-webkit-details-marker]:hidden">
                  <span>See all {table.length} group sizes</span>
                  <Icon name="chevron" className="h-5 w-5 transition group-open:rotate-180" />
                </summary>
                <div className="overflow-x-auto border-t border-forest/15">
                  <table className="w-full min-w-[30rem] text-left text-sm">
                    <thead className="bg-sand text-xs font-bold uppercase tracking-[0.12em] text-forest/60">
                      <tr><th className="px-5 py-3.5">Guests</th><th className="px-5 py-3.5">Bed &amp; Breakfast</th><th className="px-5 py-3.5">With meal plan</th></tr>
                    </thead>
                    <tbody>
                      {table.map((row) => (
                        <tr key={row.guests} className={`border-t border-forest/10 ${row.guests === guests ? 'bg-sun/15' : ''}`}>
                          <td className="px-5 py-3.5 font-semibold text-forest">{row.guests}</td>
                          <td className="px-5 py-3.5 text-forest/80">{cellText(row.bb)}</td>
                          <td className="px-5 py-3.5 text-forest/80">{cellText(row.map)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            )}
            {!askOnly && <p className="mt-4 text-xs leading-relaxed text-forest/55">Rates are per night. The meal plan adds NPR 550 per person. Final price is confirmed when you book.</p>}
          </section>

          <section id="good-to-know" className="mt-16 border-t border-forest/15 pt-12">
            <p className="label">Good to know</p>
            <h2 className="font-display text-3xl leading-none tracking-[-0.04em] text-forest">Rules and cancellation</h2>
            <div className="mt-7 grid gap-10 text-forest/70 md:grid-cols-2">
              <div><h3 className="font-semibold text-forest">Stay rules</h3><ul className="mt-4 list-disc space-y-2.5 pl-5 text-sm"><li>No smoking, parties or events.</li><li>Check-in from 2 PM, check-out by 10 AM.</li></ul></div>
              <div><h3 className="font-semibold text-forest">Cancellation</h3><p className="mt-4 text-sm leading-relaxed">Guests receive a full refund if they cancel within 48 hours of booking and at least 24 hours before check-in. We will confirm the final policy with your booking.</p></div>
            </div>
          </section>
        </div>
      </section>

      <section id="gallery" className="bg-sand py-16 md:py-24">
        <div className="wrap">
          <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-5">
            <div><p className="label">A closer look</p><h2 className="mt-3 font-display text-5xl leading-none tracking-[-0.05em] text-forest sm:text-6xl">The stay, in its own rhythm.</h2></div>
            <p className="max-w-sm text-sm leading-relaxed text-forest/65">Private corners, shared spaces and the small details that make a stay feel like yours.</p>
          </Reveal>
        </div>
        <div className="relative">
          <div className="grid gap-1 md:grid-cols-3">
            {[0, 1, 2].map((offset) => <img key={offset} src={gallery[(slide + offset) % gallery.length]} alt={`${room.name} photo ${((slide + offset) % gallery.length) + 1}`} loading="lazy" className="aspect-[1.25] w-full object-cover" />)}
          </div>
          <div className="mt-5 flex items-center justify-center gap-2">
            {gallery.map((image, index) => <button key={image} type="button" aria-label={`Show gallery slide ${index + 1}`} onClick={() => setSlide(index)} className={`h-2.5 w-2.5 rounded-full border border-forest/40 transition ${slide === index ? 'bg-forest' : 'bg-transparent'}`} />)}
          </div>
          <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-3">
            <button type="button" aria-label="Previous gallery slide" onClick={() => setSlide((slide - 1 + gallery.length) % gallery.length)} className="grid h-11 w-11 place-items-center rounded-full bg-cream/90 text-xl text-forest shadow-lg">←</button>
            <button type="button" aria-label="Next gallery slide" onClick={() => setSlide((slide + 1) % gallery.length)} className="grid h-11 w-11 place-items-center rounded-full bg-cream/90 text-xl text-forest shadow-lg">→</button>
          </div>
        </div>
      </section>

      <section className="bg-forest-dark px-6 py-10 text-cream md:py-12">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-5">
          <p className="font-display text-2xl sm:text-3xl">Need help choosing a stay?</p>
          <Button href={waLink(`Hello G'Host Villa! I have a question about ${room.name}.`)} variant="light">Contact us</Button>
        </div>
      </section>

      <section id="similar" className="bg-cream py-16 md:py-24">
        <div className="wrap">
          <Reveal><p className="label">Other stays</p><h2 className="mt-3 font-display text-5xl leading-none tracking-[-0.05em] text-forest sm:text-6xl">More ways to stay.</h2></Reveal>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {similar.map((item) => (
              <Link key={item.id} href={`/rooms/${item.id}`} className="group flex flex-col border border-forest/15 bg-cream transition hover:-translate-y-1 hover:shadow-warm">
                <img src={item.image} alt={item.alt} loading="lazy" className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-[1.02]" />
                <div className="flex flex-1 flex-col p-7">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-sun-text">{buildingLabel(item)}</p>
                  <h3 className="mt-2 font-display text-2xl leading-tight text-forest">{item.name}</h3>
                  <p className="mt-3 text-sm text-forest/60">{item.capacity}</p>
                  <p className="mt-3 text-sm font-semibold text-forest">{describePrice(item, null, 'BB').label} {describePrice(item, null, 'BB').main}</p>
                  <p className="mt-auto pt-5 text-sm font-bold uppercase tracking-[0.12em] text-forest underline decoration-sun underline-offset-4">View details</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap py-4">
        <Reveal>
          <div className="grid gap-4 border border-forest/15 bg-cream p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
            <div><p className="label">Guest note</p><h2 className="mt-2 font-display text-3xl text-forest">{guestNote.text}</h2><p className="mt-2 text-sm text-forest/60">{guestNote.name} · {guestNote.source}</p></div>
            <Link href="/rooms" className="text-sm font-bold uppercase tracking-[0.12em] text-forest underline decoration-sun underline-offset-4">Browse all stays</Link>
          </div>
        </Reveal>
      </section>
      <div className="mt-12"><CtaBanner /></div>

      {/* Phone booking bar: appears when the full panel has scrolled away */}
      <div className={`fixed inset-x-0 bottom-[calc(3.75rem+env(safe-area-inset-bottom))] z-40 border-t border-forest/15 bg-cream/95 py-3 pl-5 pr-20 md:pr-5 shadow-[0_-10px_30px_rgba(35,70,53,0.12)] backdrop-blur transition duration-300 md:bottom-0 lg:hidden ${panelVisible ? 'pointer-events-none translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`} aria-hidden={panelVisible}>
        <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
          <div className="min-w-0">
            {quote ? (
              <>
                <p className="truncate text-xs text-forest/60">{fmtDate(checkIn, { day: 'numeric', month: 'short' })} – {fmtDate(checkOut, { day: 'numeric', month: 'short' })}</p>
                <p className="truncate font-display text-lg font-semibold leading-tight text-forest">{quote.kind === 'range' ? `NPR ${quote.min.toLocaleString('en-US')}+` : `NPR ${quote.total.toLocaleString('en-US')}`} <span className="font-body text-xs font-normal text-forest/60">· {nights}n</span></p>
              </>
            ) : (
              <>
                {barPrice.label && <p className="text-xs text-forest/60">{barPrice.label}</p>}
                <p className="truncate font-display text-lg font-semibold leading-tight text-forest">{barPrice.main}</p>
              </>
            )}
          </div>
          {barReady ? (
            <a tabIndex={panelVisible ? -1 : 0} href={waLink(stayMessage(room, { guests, plan, checkIn, checkOut }))} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[48px] shrink-0 items-center justify-center bg-sun px-5 text-sm font-semibold text-forest-dark">{room.whatsappOnly ? 'Ask us' : 'Request stay'}</a>
          ) : (
            <button type="button" tabIndex={panelVisible ? -1 : 0} onClick={() => panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="inline-flex min-h-[48px] shrink-0 items-center justify-center bg-sun px-5 text-sm font-semibold text-forest-dark">Choose dates</button>
          )}
        </div>
      </div>
    </main>
  )
}
