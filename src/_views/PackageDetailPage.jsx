'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  BedDouble,
  CalendarDays,
  Check,
  Clock,
  Coffee,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  Users,
} from 'lucide-react'
import { Divider, Reveal } from '../components/ui.jsx'
import { packages, packageFaqs } from '../data/packages.js'
import { rooms } from '../data/rooms.js'
import { site, telLink, waLink } from '../data/site.js'
import { backendWhatsAppLink, useBackendData } from '../lib/backend.jsx'

const isVideoSlot = (slot) =>
  !!slot?.src && (slot.type === 'video' || (slot.type !== 'image' && /\.(mp4|webm|mov)(\?|$)/i.test(slot.src)))

function SlotMedia({ slot, poster, alt = '', className }) {
  if (isVideoSlot(slot)) {
    return <video src={slot.src} poster={slot.poster || poster} autoPlay loop muted playsInline className={className} />
  }
  return <img src={slot.src} alt={slot.alt || alt} loading="lazy" className={className} />
}

const SLUG_ALIASES = {
  'villa-top-2bhk': 'villa-top-floor',
  'entire-villa': 'whole-villa',
}

export default function PackageDetailPage({ pkg: initialPkg }) {
  const backend = useBackendData()
  const packagesData = backend?.packages
  const content = packagesData?.content ?? {}
  const allPackages = packagesData?.packages?.length ? packagesData.packages : packages
  const pkg = allPackages.find((item) => item.id === initialPkg.id) ?? initialPkg
  const allRooms = backend?.stays?.rooms?.length ? backend.stays.rooms : rooms
  const currentPackageFaqs = packagesData?.packageFaqs?.length ? packagesData.packageFaqs : packageFaqs
  const currentSite = backend?.site ?? site
  const currentTel = currentSite.phoneTel ? `tel:${currentSite.phoneTel}` : telLink
  const currentWhatsApp = (message) => backendWhatsAppLink(currentSite, message) ?? waLink(message)

  const [guests, setGuests] = useState(pkg.defaultGuests || '4')
  const [dates, setDates] = useState('')
  const [selectedExtras, setSelectedExtras] = useState([])
  const [notes, setNotes] = useState('')

  const photos = pkg.gallery?.length ? pkg.gallery : [pkg.image, '/images/pyramid.webp', '/images/garden.webp']
  const slots = {
    left: pkg.grid?.left ?? { type: 'auto', src: pkg.video || content.detailDefaultVideo || '/videos/hero-pool.mp4' },
    top: pkg.grid?.top ?? { type: 'image', src: photos[0] },
    bottom: pkg.grid?.bottom ?? { type: 'image', src: photos[1] || photos[0] },
    right: pkg.grid?.right ?? { type: 'auto', src: pkg.sideVideo || photos[2] || photos[0] },
  }
  const matchingRooms = (pkg.roomSlugs || [])
    .map((slug) => allRooms.find((r) => r.id === slug || r.id === SLUG_ALIASES[slug]))
    .filter(Boolean)
  const otherPackages = allPackages.filter((p) => p.id !== pkg.id)

  const toggleExtra = (item) => {
    setSelectedExtras((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item],
    )
  }

  const handleBookPackage = (e) => {
    e.preventDefault()
    const lines = [
      `Hello G'Host Villa! I'd like to book the "${pkg.title}" (${pkg.badge}) package.`,
      guests ? `Guests: ${guests}` : null,
      dates ? `Preferred dates: ${dates}` : null,
      selectedExtras.length ? `Add-ons: ${selectedExtras.join(', ')}` : null,
      notes.trim() ? `Notes: ${notes.trim()}` : null,
    ].filter(Boolean)
    window.open(currentWhatsApp(lines.join('\n')), '_blank', 'noopener,noreferrer')
  }

  const iconMap = { Users, BedDouble, Coffee, Clock, CalendarDays, MapPin, Check }
  const facts = pkg.customFacts?.length
    ? pkg.customFacts.map((f) => ({ icon: iconMap[f.icon] ?? Users, label: f.label || f.title, value: f.value || f.text }))
    : [
      { icon: Users, label: 'Group size', value: pkg.guestsRange || pkg.note },
      { icon: BedDouble, label: 'Space', value: pkg.spaceLabel || 'Private villa stay' },
      { icon: Coffee, label: 'Meals', value: pkg.mealsLabel || 'Daily breakfast' },
      { icon: Clock, label: 'Check-in / Out', value: pkg.checkInOut || content.detailCheckInOut || '2:00 PM / 10:00 AM' },
    ]

  return (
    <div className="bg-white">
      {/* 1 · Breadcrumb & Title Header */}
      <header className="wrap pt-28 md:pt-32">
        <nav aria-label="Breadcrumb" className="text-xs text-forest/55">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="transition hover:text-forest">
                Home
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li>
              <Link href="/packages" className="transition hover:text-forest">
                Packages
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li className="font-semibold text-forest/85">{pkg.title}</li>
          </ol>
        </nav>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-3 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.12em] ${
                  pkg.popular ? 'bg-sun text-white' : 'bg-forest/10 text-forest'
                }`}
              >
                {pkg.badge}
              </span>
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-sun-text">
                {pkg.label}
              </span>
            </div>
            <h1 className="mt-2 font-display font-semibold text-forest type-page">
              {pkg.title}
            </h1>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-forest/70">
              <MapPin className="h-4 w-4 text-sun-text" aria-hidden="true" />
              <span>{pkg.locationLabel || content.detailLocationLabel || 'Sarangkot, Pokhara'} · {pkg.note}</span>
            </p>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-forest/55">
              {content.cardRateLabel || 'Starting rate'}
            </p>
            <p className="font-display text-2xl font-bold text-forest sm:text-3xl">
              {pkg.price}
            </p>
            <p className="text-xs text-forest/60">{pkg.note}</p>
          </div>
        </div>
      </header>

      {/* 2 · 4-Panel Media Grid ([ video ] | [ image / image ] | [ video / image ]) */}
      <section aria-label="Package photos and video" className="wrap mt-5">
        <div className="relative grid h-[17rem] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-2xl sm:h-[22rem] lg:h-[26rem]">
          <div className="relative col-span-4 row-span-2 overflow-hidden bg-forest-dark md:col-span-2">
            <SlotMedia slot={slots.left} poster={photos[0]} alt={pkg.title} className="h-full w-full object-cover" />
          </div>
          <div className="relative hidden overflow-hidden bg-white md:col-start-3 md:row-start-1 md:block">
            <SlotMedia slot={slots.top} alt={pkg.title} className="h-full w-full object-cover" />
          </div>
          <div className="relative hidden overflow-hidden bg-white md:col-start-3 md:row-start-2 md:block">
            <SlotMedia slot={slots.bottom} className="h-full w-full object-cover" />
          </div>
          <div className="relative hidden overflow-hidden bg-forest-dark md:col-start-4 md:row-span-2 md:row-start-1 md:block">
            <SlotMedia slot={slots.right} poster={photos[0]} className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* 3 · Main 2-Column Content + Sticky Package Booking Sidebar */}
      <section className="wrap grid grid-cols-1 gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-14">
        {/* Sticky Booking Panel */}
        <aside className="lg:sticky lg:top-24 lg:order-2 lg:self-start">
          <div className="rounded-2xl border border-forest/15 bg-white p-6 shadow-[0_18px_45px_rgba(35,70,53,0.08)]">
            <div className="border-b border-forest/10 pb-4">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-sun-text">
                {pkg.badge}
              </p>
              <p className="mt-1 font-display text-2xl font-bold text-forest">
                {pkg.price}
              </p>
              <p className="text-xs text-forest/60">{pkg.note}</p>
            </div>

            <form onSubmit={handleBookPackage} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-2 gap-2.5">
                <label className="block text-[0.68rem] font-bold uppercase tracking-[0.12em] text-forest/60">
                  Guests
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-forest/20 bg-white px-3 py-2 text-sm font-semibold text-forest outline-none focus:border-forest"
                  />
                </label>
                <label className="block text-[0.68rem] font-bold uppercase tracking-[0.12em] text-forest/60">
                  Dates
                  <input
                    type="text"
                    value={dates}
                    onChange={(e) => setDates(e.target.value)}
                    placeholder="e.g. Dec 12–14"
                    className="mt-1 w-full rounded-xl border border-forest/20 bg-white px-3 py-2 text-sm font-semibold normal-case tracking-normal text-forest outline-none placeholder:text-forest/40 focus:border-forest"
                  />
                </label>
              </div>

              {pkg.extra?.length > 0 && (
                <div>
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-forest/60">
                    Optional add-ons
                  </p>
                  <div className="mt-1.5 space-y-1.5">
                    {pkg.extra.map((item) => {
                      const active = selectedExtras.includes(item)
                      return (
                        <label
                          key={item}
                          className={`flex cursor-pointer items-start gap-2 rounded-xl border px-3 py-2 text-xs transition ${
                            active
                              ? 'border-sun bg-sun/10 font-semibold text-forest'
                              : 'border-forest/15 bg-white text-forest/75 hover:border-forest/30'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={() => toggleExtra(item)}
                            className="mt-0.5 accent-forest"
                          />
                          <span>{item}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              )}

              <label className="block text-[0.68rem] font-bold uppercase tracking-[0.12em] text-forest/60">
                Special requests
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Occasion, meal plan, arrival time..."
                  className="mt-1 w-full rounded-xl border border-forest/20 bg-white px-3 py-2 text-xs normal-case tracking-normal text-forest outline-none placeholder:text-forest/40 focus:border-forest"
                />
              </label>

              <button
                type="submit"
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-sun px-5 text-xs font-bold uppercase tracking-[0.1em] text-white transition hover:bg-sun-dark"
              >
                <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Book package on WhatsApp</span>
              </button>

              <a
                href={currentTel}
                className="inline-flex min-h-[38px] w-full items-center justify-center gap-1.5 rounded-full border border-forest/20 bg-white px-4 text-xs font-semibold text-forest transition hover:border-forest"
              >
                <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>Call {currentSite.phoneDisplay}</span>
              </a>
            </form>
          </div>
        </aside>

        {/* Left Main Details */}
        <div className="space-y-10 lg:order-1">
          {/* Quick Facts Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {facts.map(({ icon: Ico, label, value }) => (
              <div
                key={label}
                className="rounded-2xl border border-forest/15 bg-white p-3.5 shadow-soft"
              >
                <Ico className="h-4 w-4 text-sun-text" aria-hidden="true" />
                <p className="mt-2 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-forest/55">
                  {label}
                </p>
                <p className="mt-0.5 text-xs font-bold leading-snug text-forest">
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Overview */}
          <Reveal>
            <h2 className="font-display font-semibold text-forest type-sub">
              {content.detailAboutTitle || 'About this package'}
            </h2>
            <p className="mt-2.5 text-sm leading-relaxed text-forest/75 sm:text-base">
              {pkg.description || pkg.intro}
            </p>
          </Reveal>

          {/* What's Included & Optional Add-ons */}
          <Reveal className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl border border-forest/15 bg-white p-5 shadow-soft">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-leaf">
                {content.detailIncludedHeading || 'What’s included'}
              </p>
              <ul className="mt-3 space-y-2.5">
                {(pkg.included || []).map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-xs font-medium leading-relaxed text-forest/85 sm:text-sm"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-leaf" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-forest/15 bg-white p-5 shadow-soft">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-sun-text">
                {content.detailExtraHeading || 'Optional add-ons'}
              </p>
              <ul className="mt-3 space-y-2.5">
                {(pkg.extra || []).map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-xs leading-relaxed text-forest/75 sm:text-sm"
                  >
                    <Plus className="mt-0.5 h-4 w-4 shrink-0 text-sun-text" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Sample Stay Flow */}
          {pkg.itinerary?.length > 0 && (
            <Reveal>
              <h2 className="font-display font-semibold text-forest type-sub">
                {content.detailItineraryTitle || 'How the stay flows'}
              </h2>
              <div className="mt-4 grid gap-3.5 sm:grid-cols-3">
                {pkg.itinerary.map((step, i) => (
                  <div
                    key={step.title}
                    className="rounded-2xl border border-forest/15 bg-white p-4 shadow-soft"
                  >
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-sun-text">
                      0{i + 1} · {step.time}
                    </p>
                    <h3 className="mt-1.5 font-display text-base font-semibold leading-snug text-forest">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-forest/70">
                      {step.text}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          {/* Included Spaces / Rooms */}
          {matchingRooms.length > 0 && (
            <Reveal>
              <h2 className="font-display font-semibold text-forest type-sub">
                {content.detailSpacesTitle || 'Spaces in this package'}
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {matchingRooms.map((room) => (
                  <Link
                    key={room.id}
                    href={`/rooms/${room.id}`}
                    className="group flex items-center gap-3.5 rounded-2xl border border-forest/15 bg-white p-3 shadow-soft transition hover:border-forest/35"
                  >
                    <img
                      src={room.image}
                      alt={room.name}
                      loading="lazy"
                      className="h-16 w-20 shrink-0 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-base font-semibold text-forest group-hover:text-sun-text">
                        {room.name}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-forest/60">
                        {room.capacity} · {room.bhk}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-forest/45 transition group-hover:translate-x-0.5 group-hover:text-forest" />
                  </Link>
                ))}
              </div>
            </Reveal>
          )}

          {/* Package FAQs */}
          <Reveal>
            <h2 className="font-display font-semibold text-forest type-sub">
              {content.detailFaqTitle || 'Common questions'}
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {currentPackageFaqs.map((item) => (
                <div
                  key={item.q}
                  className="rounded-2xl border border-forest/15 bg-white p-4 shadow-soft"
                >
                  <h3 className="font-display text-sm font-semibold text-forest">
                    {item.q}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-forest/70">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4 · Compare Other Packages */}
      <section className="border-t border-forest/10 bg-white section-y">
        <div className="wrap">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="label">{content.detailOtherEyebrow || 'Explore more'}</p>
              <h2 className="mt-1 font-display font-semibold text-forest type-sub">
                {content.detailOtherTitle || 'Other packages'}
              </h2>
            </div>
            <Link
              href="/packages"
              className="text-xs font-semibold text-forest underline decoration-sun underline-offset-4 hover:text-sun-text"
            >
              {content.detailAllPackagesLabel || 'All packages →'}
            </Link>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {otherPackages.map((other) => (
              <Link
                key={other.id}
                href={`/packages/${other.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-forest/15 bg-white shadow-soft transition hover:-translate-y-0.5 hover:border-forest/35 sm:flex-row"
              >
                <div className="h-36 w-full shrink-0 overflow-hidden bg-forest-dark sm:h-auto sm:w-44">
                  <img
                    src={other.image}
                    alt={other.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <span className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-sun-text">
                      {other.badge} · {other.label}
                    </span>
                    <h3 className="mt-0.5 font-display text-lg font-semibold text-forest">
                      {other.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs text-forest/65">
                      {other.intro}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-forest/10 pt-2.5">
                    <span className="font-display text-sm font-bold text-forest">
                      {other.price}{' '}
                      <span className="font-body text-[0.68rem] font-normal text-forest/55">
                        · {other.note}
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-forest group-hover:text-sun-text">
                      View <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Divider prev="cream" next="forest" />
    </div>
  )
}
