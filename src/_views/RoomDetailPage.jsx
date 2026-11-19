'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
  BedDouble, Building2, CalendarCheck, CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, Clock, Coffee, DoorOpen,
  Eye, Heart, Images, KeyRound, Mail, MapPin, MessageCircle, Mountain, Send, Share2, ShieldCheck, Sparkles, Star, Sun, User,
  Users, Utensils, Wallet, Wifi, Bath, Wine, X, ArrowRight,
} from 'lucide-react'
import { Stars } from '../components/Icons.jsx'
import { Button, Reveal } from '../components/ui.jsx'
import CtaBanner from '../components/CtaBanner.jsx'
import BookingPanel from '../components/BookingPanel.jsx'
import {
  rooms, findStay, buildingLabel, describePrice, rateTable, formatNpr, stayMessage, MAP_ADD, plans,
} from '../data/rooms.js'
import { reviews } from '../data/reviews.js'
import { faqs } from '../data/faq.js'
import { gallery as siteGallery } from '../data/gallery.js'
import { site, waLink } from '../data/site.js'
import { blockedSetFor, fmtDate, nightsBetween, parseISO, rangeBlocked, stayQuery, stayQuote, todayISO } from '../lib/booking.js'

const cellText = (result) => {
  if (result.kind === 'ask') return 'On WhatsApp'
  if (result.kind === 'range') return `${formatNpr(result.min)} – ${result.max.toLocaleString('en-US')}`
  return formatNpr(result.total)
}

// Picks a lucide icon that matches a feature line
function featureIcon(text) {
  const t = text.toLowerCase()
  if (t.includes('wi-fi') || t.includes('wifi')) return Wifi
  if (t.includes('bathroom') || t.includes('hot water')) return Bath
  if (t.includes('breakfast')) return Coffee
  if (t.includes('restro') || t.includes('bar')) return Wine
  if (t.includes('view')) return Mountain
  if (t.includes('sleeps') || t.includes('guest') || t.includes('group')) return Users
  if (t.includes('bedroom') || t.includes('bed')) return BedDouble
  return Sparkles
}

/** Collapsible FAQ list. */
function Accordion({ items }) {
  const [open, setOpen] = useState(0)
  return (
    <ul className="divide-y divide-forest/10 border-y border-forest/10">
      {items.map((item, index) => {
        const isOpen = open === index
        return (
          <li key={item.title}>
            <h3>
              <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? -1 : index)} className="flex w-full items-center gap-4 py-4 text-left">
                <span className="min-w-0 flex-1 text-[0.95rem] font-semibold leading-snug text-forest">{item.title}</span>
                <ChevronDown className={`h-5 w-5 shrink-0 text-forest/50 transition ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
            </h3>
            {isOpen && <div className="pb-5 pr-8 text-[0.95rem] leading-relaxed text-forest/70">{item.body}</div>}
          </li>
        )
      })}
    </ul>
  )
}

/** Numbered vertical timeline (the "itinerary" of a stay). */
function Timeline({ items }) {
  const [open, setOpen] = useState(0)
  return (
    <ol className="relative">
      {items.map((item, index) => {
        const isOpen = open === index
        const last = index === items.length - 1
        const Ico = item.icon
        return (
          <li key={item.title} className="relative flex gap-4 pb-2">
            {!last && <span aria-hidden="true" className="absolute left-[1.0625rem] top-10 bottom-0 w-px bg-forest/15" />}
            <span className={`relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold transition ${isOpen ? 'bg-sun text-forest-dark' : 'bg-sand text-forest'}`}>{index + 1}</span>
            <div className="min-w-0 flex-1 pb-4">
              <h3>
                <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? -1 : index)} className="flex w-full items-center gap-3 pt-1.5 text-left">
                  <span className="min-w-0 flex-1 font-semibold leading-snug text-forest">{item.title}</span>
                  {Ico && <Ico className="hidden h-4 w-4 shrink-0 text-sun-text sm:block" aria-hidden="true" />}
                  <ChevronDown className={`h-4 w-4 shrink-0 text-forest/50 transition ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>
              </h3>
              {isOpen && <p className="mt-2 text-[0.95rem] leading-relaxed text-forest/70">{item.body}</p>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function SectionTitle({ id, children, sub }) {
  return (
    <header>
      <h2 id={id} className="scroll-mt-28 font-display text-2xl font-semibold leading-tight tracking-[-0.03em] text-forest md:text-[1.75rem]">{children}</h2>
      {sub && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-forest/60">{sub}</p>}
    </header>
  )
}

/** Full-screen photo viewer. */
function Lightbox({ photos, index, setIndex, alt }) {
  const closeRef = useRef(null)
  const open = index !== null
  useEffect(() => {
    if (!open) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') setIndex(null)
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % photos.length)
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + photos.length) % photos.length)
    }
    document.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', onKey) }
  }, [open, photos.length, setIndex])
  if (!open) return null
  const btn = 'grid h-11 w-11 place-items-center border border-white/40 bg-forest-dark/60 text-white backdrop-blur transition hover:bg-sun hover:text-forest-dark'
  return (
    <div role="dialog" aria-modal="true" aria-label="Room photos" className="fixed inset-0 z-[60] flex flex-col bg-forest-dark/95 p-4 sm:p-8" onClick={() => setIndex(null)}>
      <div className="flex items-center justify-between text-sm text-white/80" onClick={(e) => e.stopPropagation()}>
        <span>{index + 1} / {photos.length}</span>
        <button ref={closeRef} type="button" aria-label="Close photos" onClick={() => setIndex(null)} className={btn}><X className="h-5 w-5" /></button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center py-4" onClick={(e) => e.stopPropagation()}>
        <img src={photos[index]} alt={`${alt} (photo ${index + 1})`} className="max-h-full max-w-full object-contain" />
        <button type="button" aria-label="Previous photo" onClick={() => setIndex((index - 1 + photos.length) % photos.length)} className={`${btn} absolute left-0 top-1/2 -translate-y-1/2`}><ChevronLeft className="h-5 w-5" /></button>
        <button type="button" aria-label="Next photo" onClick={() => setIndex((index + 1) % photos.length)} className={`${btn} absolute right-0 top-1/2 -translate-y-1/2`}><ChevronRight className="h-5 w-5" /></button>
      </div>
      <div className="no-scrollbar flex justify-center gap-2 overflow-x-auto" onClick={(e) => e.stopPropagation()}>
        {photos.map((src, i) => (
          <button key={src} type="button" aria-label={`Show photo ${i + 1}`} onClick={() => setIndex(i)} className={`h-14 w-20 shrink-0 overflow-hidden border-2 transition ${i === index ? 'border-sun' : 'border-transparent opacity-60 hover:opacity-100'}`}>
            <img src={src} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}

export default function RoomDetailPage({ room }) {
  const [guests, setGuests] = useState(room.defaultGuests)
  const [plan, setPlan] = useState('BB')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [panelVisible, setPanelVisible] = useState(true)
  const [ready, setReady] = useState(false)
  const [tab, setTab] = useState('booking') // booking | enquiry (sidebar card)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)
  const [photo, setPhoto] = useState(null) // lightbox index
  const [enquiry, setEnquiry] = useState({ name: '', phone: '', message: '' })
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
    try { setSaved(localStorage.getItem(`saved:${room.id}`) === '1') } catch { /* storage unavailable */ }
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
  }, [tab])

  const toggleSaved = () => {
    const next = !saved
    setSaved(next)
    try { localStorage.setItem(`saved:${room.id}`, next ? '1' : '0') } catch { /* storage unavailable */ }
  }
  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) await navigator.share({ title: room.name, url })
      else { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000) }
    } catch { /* cancelled */ }
  }
  const goToBooking = () => { setTab('booking'); requestAnimationFrame(() => panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })) }

  // Room photos first, topped up with villa photos so the mosaic always has five tiles
  const photos = useMemo(() => {
    const list = [...new Set([room.image, ...(room.gallery ?? []), ...siteGallery.map((g) => g.src)])]
    return list.slice(0, Math.max(5, new Set([room.image, ...(room.gallery ?? [])]).size))
  }, [room])

  const includes = (room.includes ?? []).map(findStay).filter(Boolean)
  const table = useMemo(() => rateTable(room), [room])
  const similar = useMemo(() => {
    const others = rooms.filter((item) => item.id !== room.id && item.catalog)
    return [...others.filter((item) => item.building === room.building), ...others.filter((item) => item.building !== room.building)].slice(0, 3)
  }, [room])
  const askOnly = table.every((row) => row.bb.kind === 'ask')
  const nights = nightsBetween(checkIn, checkOut)
  const quote = nights > 0 && !room.whatsappOnly ? stayQuote(room, guests, plan, nights) : null
  const barPrice = describePrice(room, guests, plan)
  const fromPrice = describePrice(room, null, 'BB')
  const barReady = room.whatsappOnly || nights > 0

  const facts = [
    { icon: Users, title: 'Capacity', text: room.capacity },
    { icon: BedDouble, title: 'Bed', text: room.bed },
    { icon: Building2, title: 'Building', text: buildingLabel(room) },
    { icon: Eye, title: 'View', text: room.viewText || 'Hilltop and garden' },
    { icon: Clock, title: 'Check-in / out', text: '2 PM / 10 AM' },
    { icon: Utensils, title: 'Meals', text: 'Breakfast included' },
  ]

  const steps = [
    { icon: KeyRound, title: 'Arrive and check in', body: `Check-in is from 2 PM. ${site.locationNote} on ${site.address.split(',')[0]}, an easy taxi, car or scooter ride. The team meets you at the pyramid and shows you to ${room.name}.` },
    { icon: BedDouble, title: 'Settle into your room', body: `${room.bhk}. ${room.bed}${room.viewText ? `, with ${room.viewText.toLowerCase()}` : ''}. ${room.bestFor}` },
    { icon: Utensils, title: 'Eat and drink', body: `Breakfast is included on the BB plan. Lunch and dinner are at the pyramid restro and bottle bar, or add the meal plan for NPR ${MAP_ADD} per person per night.` },
    { icon: Mountain, title: 'Enjoy the hilltop', body: 'You are up in the hills above Pokhara, so mornings start quiet and clear. Take the views in, then head down to Lakeside whenever you like.' },
    { icon: DoorOpen, title: 'Check out', body: 'Check-out is by 10 AM. Need a later departure? Ask on WhatsApp and the team will help where they can.' },
  ]

  const included = [...room.features, 'Check-in from 2 PM, check-out by 10 AM', 'Free cancellation within 48 hours of booking (at least 24 hours before check-in)']
  const excluded = [
    'Lunch and dinner on the Bed & Breakfast plan',
    'Drinks and orders at the restro and bottle bar',
    'Transport to and from Lakeside or the airport',
    'Extra guests beyond the number in the rate',
    'Personal expenses and tips',
  ]
  const roomFaqs = faqs.slice(0, 6).map((item) => ({ title: item.q, body: item.a }))
  const reviewCount = '379+'

  const sendEnquiry = (event) => {
    event.preventDefault()
    const lines = [`Hello G'Host Villa! I have a question about ${room.name}.`]
    if (enquiry.message.trim()) lines.push(enquiry.message.trim())
    if (enquiry.name.trim()) lines.push(`Name: ${enquiry.name.trim()}`)
    if (enquiry.phone.trim()) lines.push(`Phone: ${enquiry.phone.trim()}`)
    window.open(waLink(lines.join('\n')), '_blank', 'noopener,noreferrer')
  }
  const field = 'mt-1.5 w-full border border-forest/20 bg-cream px-3 py-2.5 text-sm text-forest outline-none placeholder:text-forest/40 focus:border-forest'

  return (
    <div className="bg-cream pb-40 md:pb-28 lg:pb-16">
      {/* 1 · Title row */}
      <header className="wrap pt-28 md:pt-32">
        <nav aria-label="Breadcrumb" className="text-xs text-forest/55">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li><Link href="/" className="transition hover:text-forest">Home</Link></li>
            <li aria-hidden="true">›</li>
            <li><Link href="/rooms" className="transition hover:text-forest">Rooms</Link></li>
            <li aria-hidden="true">›</li>
            <li className="text-forest/80">{buildingLabel(room)}</li>
          </ol>
        </nav>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-display text-3xl font-semibold leading-tight tracking-[-0.03em] text-forest sm:text-4xl">{room.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-forest/70">
              <span className="inline-flex items-center gap-1.5"><Stars n={5} className="h-4 w-4" /><strong className="font-semibold text-forest">4.5</strong> · <a href="#reviews" className="underline decoration-forest/30 underline-offset-4 hover:decoration-sun">{reviewCount} reviews</a></span>
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-sun-text" aria-hidden="true" />Sarangkot, Pokhara</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-forest">
            <button type="button" onClick={share} className="inline-flex items-center gap-2 px-3 py-2 transition hover:bg-sand"><Share2 className="h-4 w-4" aria-hidden="true" />{copied ? 'Link copied' : 'Share'}</button>
            <button type="button" onClick={toggleSaved} aria-pressed={saved} className="inline-flex items-center gap-2 px-3 py-2 transition hover:bg-sand"><Heart className={`h-4 w-4 ${saved ? 'fill-sun text-sun-text' : ''}`} aria-hidden="true" />{saved ? 'Saved' : 'Save'}</button>
          </div>
        </div>
      </header>

      {/* 2 · Photo mosaic: one large photo + four small */}
      <section aria-label="Room photos" className="wrap mt-5">
        <div className="relative grid h-[17rem] grid-cols-4 grid-rows-2 gap-2 overflow-hidden sm:h-[22rem] lg:h-[26rem]">
          {photos.slice(0, 5).map((src, i) => (
            <button key={src} type="button" onClick={() => setPhoto(i)} aria-label={`Open photo ${i + 1} of ${photos.length}`}
              className={`group relative overflow-hidden bg-sand ${i === 0 ? 'col-span-4 row-span-2 md:col-span-2' : 'hidden md:block'}`}>
              <img src={src} alt={i === 0 ? room.alt : ''} fetchPriority={i === 0 ? 'high' : undefined} loading={i === 0 ? undefined : 'lazy'} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
              <span className="absolute inset-0 bg-forest-dark/0 transition group-hover:bg-forest-dark/15" />
            </button>
          ))}
          {room.badge && <span className="pointer-events-none absolute left-3 top-3 bg-cream px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-forest">{room.badge}</span>}
          <button type="button" onClick={() => setPhoto(0)} className="absolute bottom-3 right-3 inline-flex items-center gap-2 border border-forest/15 bg-cream px-4 py-2 text-sm font-semibold text-forest shadow-soft transition hover:bg-sand">
            <Images className="h-4 w-4" aria-hidden="true" />Show all {photos.length} photos
          </button>
        </div>
      </section>

      <div className="wrap grid grid-cols-[minmax(0,1fr)] gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-14">
        {/* Sidebar: first on phones, sticky beside the details on desktop */}
        <aside className="space-y-5 lg:order-2 lg:self-start">
          <div className="border border-forest/15 bg-cream shadow-[0_18px_45px_rgba(35,70,53,0.08)]">
            <div className="px-5 pt-5">
              <p className="inline-flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-forest/55"><Wallet className="h-3.5 w-3.5" aria-hidden="true" />Price</p>
              <p className="mt-1.5 font-display text-2xl font-semibold leading-none tracking-[-0.02em] text-forest"><span className="mr-1.5 text-sm font-normal text-forest/55">{fromPrice.label}</span>{fromPrice.main}</p>
              <p className="mt-1.5 text-xs text-forest/55">{fromPrice.note}</p>
            </div>
            <div role="tablist" aria-label="Booking or enquiry" className="mt-4 grid grid-cols-2 border-b border-forest/15 px-5">
              {[['booking', 'Booking form', CalendarCheck], ['enquiry', 'Enquiry form', Mail]].map(([id, label, Ico]) => (
                <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
                  className={`inline-flex items-center justify-center gap-2 border-b-2 py-3 text-sm font-semibold transition ${tab === id ? 'border-sun text-forest' : 'border-transparent text-forest/50 hover:text-forest'}`}>
                  <Ico className="h-4 w-4" aria-hidden="true" />{label}
                </button>
              ))}
            </div>
            {tab === 'booking' ? (
              <BookingPanel embedded room={room} guests={guests} setGuests={setGuests} plan={plan} setPlan={setPlan} checkIn={checkIn} checkOut={checkOut} setDates={setDates} panelRef={panelRef} />
            ) : (
              <form onSubmit={sendEnquiry} className="space-y-4 p-5">
                <label className="block text-xs font-bold uppercase tracking-[0.12em] text-forest/55">Your name
                  <input value={enquiry.name} onChange={(e) => setEnquiry({ ...enquiry, name: e.target.value })} autoComplete="name" className={`${field} normal-case tracking-normal`} placeholder="Full name" /></label>
                <label className="block text-xs font-bold uppercase tracking-[0.12em] text-forest/55">Phone or WhatsApp
                  <input value={enquiry.phone} onChange={(e) => setEnquiry({ ...enquiry, phone: e.target.value })} autoComplete="tel" inputMode="tel" className={`${field} normal-case tracking-normal`} placeholder="+977…" /></label>
                <label className="block text-xs font-bold uppercase tracking-[0.12em] text-forest/55">Message
                  <textarea rows={4} value={enquiry.message} onChange={(e) => setEnquiry({ ...enquiry, message: e.target.value })} className={`${field} normal-case tracking-normal`} placeholder="Dates, group size, questions…" /></label>
                <button type="submit" className="inline-flex min-h-[54px] w-full items-center justify-center gap-3 bg-sun px-6 text-base font-semibold text-forest-dark transition hover:bg-sun-dark"><Send className="h-5 w-5" aria-hidden="true" />Send on WhatsApp</button>
              </form>
            )}
            <ul className="space-y-2 border-t border-forest/10 px-5 py-4 text-sm text-forest/70">
              <li className="flex gap-2.5"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-leaf" aria-hidden="true" />Free cancellation within 48 hours of booking</li>
              <li className="flex gap-2.5"><MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-leaf" aria-hidden="true" />Confirmed directly by the villa team</li>
            </ul>
          </div>

          <div className="flex items-center gap-4 border border-forest/15 bg-sand p-5">
            <div className="min-w-0 flex-1">
              <p className="font-display text-lg font-semibold text-forest">Have questions?</p>
              <p className="mt-1 text-sm leading-relaxed text-forest/70">We’ll shape the stay around you.</p>
            </div>
            <Button href={waLink(`Hello G'Host Villa! I have a question about ${room.name}.`)} icon="chat" arrow={false} className="!min-h-[44px] shrink-0 !px-4 text-sm">Ask us</Button>
          </div>
        </aside>

        {/* Main column */}
        <div className="space-y-12 lg:order-1">
          {/* 3 · Intro + key facts */}
          <section aria-labelledby="overview">
            <h2 id="overview" className="sr-only">Overview</h2>
            <p className="max-w-3xl text-lg leading-relaxed text-forest/80">{room.blurb}</p>
            <dl className="mt-8 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
              {facts.map(({ icon: Ico, title, text }) => (
                <div key={title} className="flex items-start gap-3.5">
                  <Ico className="mt-0.5 h-6 w-6 shrink-0 text-sun-text" strokeWidth={1.6} aria-hidden="true" />
                  <div className="min-w-0"><dt className="text-sm font-semibold text-forest">{title}</dt><dd className="mt-0.5 text-sm leading-snug text-forest/65">{text}</dd></div>
                </div>
              ))}
            </dl>
          </section>

          {/* 4 · Plan options (pick one, syncs with the booking form) */}
          <section aria-labelledby="options">
            <SectionTitle id="options" sub={room.whatsappOnly ? undefined : `Prices shown for ${guests} ${guests === 1 ? 'guest' : 'guests'} per night. Change the group size in the booking form.`}>Choose your plan</SectionTitle>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {plans.map((p) => {
                const price = describePrice(room, guests, p.id)
                const selected = plan === p.id
                return (
                  <div key={p.id} className={`flex flex-col border-2 p-5 transition ${selected ? 'border-sun bg-sun/[0.06]' : 'border-forest/15 bg-cream'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-forest">{p.label}</p>
                        <p className="mt-0.5 text-xs text-forest/60">{p.note}</p>
                      </div>
                      {selected && <span className="inline-flex items-center gap-1 bg-sun px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-forest-dark"><Check className="h-3 w-3" aria-hidden="true" />Selected</span>}
                    </div>
                    <ul className="mt-4 space-y-1.5 text-sm text-forest/70">
                      <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-leaf" aria-hidden="true" />Breakfast every morning</li>
                      <li className="flex gap-2">{p.id === 'MAP' ? <Check className="mt-0.5 h-4 w-4 shrink-0 text-leaf" aria-hidden="true" /> : <X className="mt-0.5 h-4 w-4 shrink-0 text-forest/35" aria-hidden="true" />}Lunch or dinner at the restro</li>
                    </ul>
                    <p className="mt-5 font-display text-xl font-semibold text-forest">{price.main}</p>
                    <p className="text-xs text-forest/55">{price.note}</p>
                    <button type="button" onClick={() => { setPlan(p.id); goToBooking() }}
                      className={`mt-4 inline-flex min-h-[46px] items-center justify-center gap-2 px-5 text-sm font-semibold transition ${selected ? 'bg-sun text-forest-dark hover:bg-sun-dark' : 'border border-forest/25 text-forest hover:border-forest'}`}>
                      {selected ? 'Choose dates' : 'Select'}<ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                )
              })}
            </div>
          </section>

          {/* 5 · Highlights */}
          <section aria-labelledby="highlights">
            <SectionTitle id="highlights">Highlights</SectionTitle>
            <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {room.features.map((feature) => {
                const Ico = featureIcon(feature)
                return <li key={feature} className="flex items-start gap-3 text-[0.95rem] leading-snug text-forest/80"><Ico className="mt-0.5 h-5 w-5 shrink-0 text-sun-text" aria-hidden="true" />{feature}</li>
              })}
            </ul>
            <div className="mt-6 border-l-4 border-sun bg-sand px-5 py-4">
              <p className="text-sm font-semibold text-forest">Is this room right for you?</p>
              <p className="mt-1 text-sm leading-relaxed text-forest/70">{room.bestFor}</p>
            </div>
          </section>

          {/* 6 · Your stay (the itinerary) */}
          <section aria-labelledby="your-stay">
            <SectionTitle id="your-stay" sub="From the moment you arrive to the morning you leave.">Your stay</SectionTitle>
            <div className="mt-6"><Timeline items={steps} /></div>
          </section>

          {/* 7 · Rates */}
          <section aria-labelledby="rates">
            <SectionTitle id="rates" sub={askOnly ? undefined : `Rates are per night. The meal plan adds NPR ${MAP_ADD} per person. Final price is confirmed when you book.`}>Rates by group size</SectionTitle>
            {askOnly ? (
              <p className="mt-5 max-w-2xl leading-relaxed text-forest/70">Bigger groups are booked directly. Send us your dates and group size on WhatsApp and the team will confirm the price.</p>
            ) : (
              <div className="mt-5 overflow-x-auto border border-forest/15">
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
            )}
          </section>

          {/* 8 · Included / Excluded side by side */}
          <section aria-labelledby="included">
            <SectionTitle id="included">What’s included</SectionTitle>
            <div className="mt-5 grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-leaf">Included</h3>
                <ul className="mt-3 space-y-2.5">
                  {included.map((item) => <li key={item} className="flex gap-2.5 text-[0.95rem] leading-snug text-forest/80"><Check className="mt-0.5 h-5 w-5 shrink-0 text-leaf" aria-hidden="true" />{item}</li>)}
                </ul>
              </div>
              <div>
                <h3 id="excluded" className="text-xs font-bold uppercase tracking-[0.14em] text-meat">Not included</h3>
                <ul className="mt-3 space-y-2.5">
                  {excluded.map((item) => <li key={item} className="flex gap-2.5 text-[0.95rem] leading-snug text-forest/80"><X className="mt-0.5 h-5 w-5 shrink-0 text-meat" aria-hidden="true" />{item}</li>)}
                </ul>
              </div>
            </div>
            {includes.length > 0 && (
              <>
                <h3 className="mt-8 text-sm font-bold text-forest">This stay combines</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {includes.map((item) => (
                    <Link key={item.id} href={`/rooms/${item.id}`} className="group flex gap-4 border border-forest/15 bg-cream p-3 transition hover:border-forest/40">
                      <img src={item.image} alt={item.alt} loading="lazy" className="h-20 w-24 shrink-0 object-cover" />
                      <span className="min-w-0 self-center"><span className="block font-display text-lg leading-tight text-forest">{item.name}</span><span className="mt-1 block text-xs text-forest/60">{buildingLabel(item)}</span></span>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </section>

          {/* 9 · Good to know */}
          <section aria-labelledby="good-to-know">
            <SectionTitle id="good-to-know">Good to know</SectionTitle>
            <div className="mt-5 grid gap-px border border-forest/15 bg-forest/15 md:grid-cols-3">
              <div className="bg-cream p-5"><h3 className="flex items-center gap-2 font-semibold text-forest"><ShieldCheck className="h-5 w-5 text-sun-text" aria-hidden="true" />Stay rules</h3><ul className="mt-2 space-y-1 text-sm leading-relaxed text-forest/70"><li>No smoking, parties or events.</li><li>Check-in from 2 PM, check-out by 10 AM.</li></ul></div>
              <div className="bg-cream p-5"><h3 className="flex items-center gap-2 font-semibold text-forest"><CalendarDays className="h-5 w-5 text-sun-text" aria-hidden="true" />Cancellation</h3><p className="mt-2 text-sm leading-relaxed text-forest/70">Full refund if you cancel within 48 hours of booking and at least 24 hours before check-in.</p></div>
              <div className="bg-cream p-5"><h3 className="flex items-center gap-2 font-semibold text-forest"><Sun className="h-5 w-5 text-sun-text" aria-hidden="true" />When to visit</h3><p className="mt-2 text-sm leading-relaxed text-forest/70">Sept–Nov and Mar–May bring the clearest mountain views from the hilltop.</p></div>
            </div>
          </section>

          {/* 10 · FAQs */}
          <section aria-labelledby="faqs">
            <SectionTitle id="faqs">Frequently asked questions</SectionTitle>
            <div className="mt-4"><Accordion items={roomFaqs} /></div>
          </section>
        </div>
      </div>

      {/* 11 · Reviews: summary on the left, list on the right */}
      <section aria-labelledby="reviews" className="border-t border-forest/10">
        <div className="wrap grid gap-10 py-14 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-14">
          <div>
            <h2 id="reviews" className="scroll-mt-28 font-display text-2xl font-semibold tracking-[-0.03em] text-forest md:text-[1.75rem]">Guest reviews</h2>
            <p className="mt-5 font-display text-5xl font-semibold leading-none text-forest">4.5<span className="text-xl text-forest/45">/5</span></p>
            <div className="mt-3"><Stars n={5} className="h-5 w-5" /></div>
            <p className="mt-2 text-sm text-forest/60">Based on {reviewCount} Google reviews</p>
            <a href={site.social.tripadvisor} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-forest underline decoration-sun decoration-2 underline-offset-4"><Star className="h-4 w-4" aria-hidden="true" />Write a review</a>
          </div>
          <ul className="divide-y divide-forest/10">
            {reviews.map((r) => (
              <li key={r.name} className="py-5 first:pt-0">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sand text-forest/60"><User className="h-5 w-5" aria-hidden="true" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold leading-tight text-forest">{r.name}</p>
                    <p className="text-xs text-forest/55">{r.country} · {r.source}</p>
                  </div>
                  <Stars n={r.rating} className="h-4 w-4" />
                </div>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-forest/75">{r.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 12 · Related stays */}
      <section aria-labelledby="similar" className="bg-sand py-14">
        <div className="wrap">
          <div className="flex items-end justify-between gap-4">
            <Reveal><h2 id="similar" className="font-display text-2xl font-semibold tracking-[-0.03em] text-forest md:text-[1.75rem]">Related stays</h2></Reveal>
            <Link href="/rooms" className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest underline decoration-sun decoration-2 underline-offset-4">All rooms<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {similar.map((item) => {
              const p = describePrice(item, null, 'BB')
              return (
                <Link key={item.id} href={`/rooms/${item.id}`} className="group flex flex-col border border-forest/15 bg-cream transition hover:-translate-y-1 hover:shadow-warm">
                  <div className="overflow-hidden"><img src={item.image} alt={item.alt} loading="lazy" className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105" /></div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-sun-text">{buildingLabel(item)}</p>
                    <h3 className="mt-2 font-display text-xl leading-tight text-forest">{item.name}</h3>
                    <p className="mt-1.5 flex items-center gap-1.5 text-sm text-forest/60"><Users className="h-4 w-4" aria-hidden="true" />{item.capacity}</p>
                    <p className="mt-auto pt-4 font-display text-lg font-semibold text-forest">{p.label} {p.main}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <CtaBanner />

      <Lightbox photos={photos} index={photo} setIndex={setPhoto} alt={room.alt} />

      {/* Phone booking bar: appears when the full panel has scrolled away */}
      <div className={`fixed inset-x-0 bottom-[calc(3.75rem+env(safe-area-inset-bottom))] z-40 border-t border-forest/15 bg-cream/95 py-3 pl-5 pr-20 shadow-[0_-10px_30px_rgba(35,70,53,0.12)] backdrop-blur transition duration-300 md:bottom-0 md:pr-5 lg:hidden ${panelVisible ? 'pointer-events-none translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`} aria-hidden={panelVisible}>
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
            <a tabIndex={panelVisible ? -1 : 0} href={waLink(stayMessage(room, { guests, plan, checkIn, checkOut }))} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 bg-sun px-5 text-sm font-semibold text-forest-dark"><MessageCircle className="h-4 w-4" aria-hidden="true" />{room.whatsappOnly ? 'Ask us' : 'Request stay'}</a>
          ) : (
            <button type="button" tabIndex={panelVisible ? -1 : 0} onClick={goToBooking} className="inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 bg-sun px-5 text-sm font-semibold text-forest-dark"><CalendarDays className="h-4 w-4" aria-hidden="true" />Choose dates</button>
          )}
        </div>
      </div>
    </div>
  )
}
