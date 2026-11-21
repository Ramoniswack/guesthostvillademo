'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight, Bath, BedDouble, Car, Check, CheckCircle2, Clock, Coffee, MapPin, MessageCircle, ShieldCheck, Star, Users, Utensils, Wifi,
} from 'lucide-react'
import { faqs } from '../data/faq.js'
import { buildingLabel, describePrice, findStay } from '../data/rooms.js'
import { reviews } from '../data/reviews.js'
import { directionsLink, mapEmbed, site, stats, waLink } from '../data/site.js'
import { gallery } from '../data/gallery.js'
import CtaBanner from './CtaBanner.jsx'
import KineticNumber from './KineticNumber.jsx'
import { Button, Reveal, StaggerGrid, StaggerItem } from './ui.jsx'

const trustBadges = [
  { name: 'Google', detail: '4.5★ · 379+ reviews', href: site.social.tripadvisor },
  { name: 'eSewa Hotels', detail: 'Verified listing', href: site.social.esewa },
  { name: 'MakeMyTrip', detail: 'Listed partner', href: site.social.makemytrip },
]

const directBenefits = [
  { icon: CheckCircle2, label: 'Best direct rate' },
  { icon: MessageCircle, label: 'Instant WhatsApp reply' },
  { icon: ShieldCheck, label: 'Free cancellation (48h)' },
]

const amenities = [
  { icon: Wifi, label: 'Free Wi-Fi' },
  { icon: Bath, label: 'Hot water' },
  { icon: Car, label: 'Free parking' },
  { icon: Coffee, label: 'Breakfast included' },
  { icon: Clock, label: 'Check-in 2 PM' },
  { icon: Utensils, label: 'Pyramid restro & bar' },
]

const stayIds = [
  'mountain-view-room',
  'city-view-room',
  'villa-top-floor',
  'suite',
  'pyramid-dome-house',
  'whole-villa',
]

const stayFilters = [
  { id: 'all', label: 'All stays' },
  { id: 'couples', label: 'Couples (1–4)' },
  { id: 'groups', label: 'Groups (4–8)' },
  { id: 'estate', label: 'Whole Estate (8–24)' },
]

const pillars = [
  {
    tag: 'Stay',
    title: 'Hilltop rooms & villa floors',
    text: 'Private rooms in the dome, a 2BHK top floor or the whole 7-BHK estate for up to 24 guests.',
    bullets: ['Attached hot-water bathrooms', 'Daily breakfast included on BB'],
    image: '/images/room-couple.webp',
    href: '/rooms',
    link: 'Browse stays',
  },
  {
    tag: 'Dine',
    title: 'Pyramid restro & bottle bar',
    text: 'Slow breakfasts, Nepali & Newari dishes, wood-fired plates and sunset drinks overlooking the valley.',
    bullets: ['Open daily · 7:00 AM – 10:00 PM', 'Optional MAP meal plan (+NPR 550 pp)'],
    image: '/images/pyramid.webp',
    href: '/menu',
    link: 'See the menu',
  },
  {
    tag: 'Gather',
    title: 'Garden lawns & private events',
    text: 'Open lawns, outdoor BBQ fireplace and flexible spaces for birthdays, reunions and retreats.',
    bullets: ['Garden seating & bonfire setup', 'Tailored group & buyout packages'],
    image: '/images/garden.webp',
    href: '/packages',
    link: 'View packages',
  },
]

export default function HomeEditorial() {
  const [stayTab, setStayTab] = useState('all')
  const [activeGallery, setActiveGallery] = useState(null)
  const [reviewIndex, setReviewIndex] = useState(0)
  const galleryCloseRef = useRef(null)
  const galleryTriggerRef = useRef(null)

  const allFeaturedStays = useMemo(() => stayIds.map(findStay).filter(Boolean), [])
  const visibleStays = useMemo(() => {
    if (stayTab === 'couples') {
      return allFeaturedStays.filter((r) => ['mountain-view-room', 'city-view-room', 'suite'].includes(r.id))
    }
    if (stayTab === 'groups') {
      return allFeaturedStays.filter((r) => ['pyramid-dome-house', 'villa-top-floor'].includes(r.id))
    }
    if (stayTab === 'estate') {
      return allFeaturedStays.filter((r) => ['villa-top-floor', 'whole-villa'].includes(r.id))
    }
    return allFeaturedStays
  }, [allFeaturedStays, stayTab])

  const quote = reviews[reviewIndex]
  const changeReview = (direction) =>
    setReviewIndex((index) => (index + direction + reviews.length) % reviews.length)

  useEffect(() => {
    if (!activeGallery) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    galleryCloseRef.current?.focus()
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setActiveGallery(null)
      if (event.key === 'Tab') {
        event.preventDefault()
        galleryCloseRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      galleryTriggerRef.current?.focus()
    }
  }, [activeGallery])

  return (
    <div className="bg-white">
      {/* 1 · Stats & Verified Partners Strip */}
      <section className="border-b border-forest/10 bg-white py-8 md:py-10">
        <div className="wrap">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`px-4 py-4 text-center first:pl-0 last:pr-0 md:px-6 ${
                  index % 2 === 1 ? 'border-l border-forest/10' : ''
                } ${index >= 2 ? 'border-t border-forest/10 md:border-t-0' : ''} ${
                  index > 0 ? 'md:border-l md:border-forest/10' : ''
                }`}
              >
                <p className="font-display text-3xl font-semibold leading-none tracking-[-0.04em] text-forest sm:text-4xl">
                  <KineticNumber value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mx-auto mt-2.5 max-w-36 text-xs font-semibold leading-snug text-forest/65">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 border-t border-forest/10 pt-6">
            {trustBadges.map((badge) => (
              <a
                key={badge.name}
                href={badge.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-forest/15 bg-white px-4 py-2 text-xs font-semibold text-forest shadow-sm transition hover:border-forest/40"
              >
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-leaf" aria-hidden="true" />
                <span>{badge.name}</span>
                <span className="text-forest/55">· {badge.detail}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 2 · Editorial Intro: Stay, dine & gather */}
      <section className="bg-white py-16 md:py-24">
        <div className="wrap grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <Reveal className="max-w-xl">
            <p className="label">A hilltop hideaway · Pokhara</p>
            <h2 className="mt-2 font-display text-4xl font-semibold leading-[0.95] tracking-[-0.04em] text-forest sm:text-5xl lg:text-6xl">
              Stay, dine &amp; gather.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-forest/75 md:text-lg">
              G’Host Villa brings crisp mountain air, warm rooms and easy hospitality together along the Sarangkot ridge—just 20 minutes above Lakeside Pokhara.
            </p>
            <p className="mt-3 text-base leading-relaxed text-forest/75">
              Check into a quiet room in our Crystal Pyramid Dome House, dine under the pyramid roof, or take over the 7-BHK Main Villa for a private group gathering.
            </p>

            {/* Why book direct pills */}
            <div className="mt-7 grid gap-2 sm:grid-cols-3">
              {directBenefits.map(({ icon: Ico, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-forest/15 bg-white px-3 py-2 text-[0.72rem] font-semibold text-forest"
                >
                  <Ico className="h-3.5 w-3.5 shrink-0 text-leaf" aria-hidden="true" />
                  <span className="truncate">{label}</span>
                </span>
              ))}
            </div>

            {/* 6-item Amenity Grid */}
            <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 border-y border-forest/10 py-5 text-xs font-semibold text-forest sm:grid-cols-3">
              {amenities.map(({ icon: Ico, label }) => (
                <li key={label} className="inline-flex items-center gap-2">
                  <Ico className="h-4 w-4 shrink-0 text-sun-text" aria-hidden="true" />
                  <span>{label}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href="/rooms" className="w-full sm:w-auto">Explore rooms</Button>
              <Button href="/about" variant="outline" arrow={false} className="w-full sm:w-auto">
                Our story
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 overflow-hidden rounded-2xl border border-forest/15 shadow-soft">
                <img
                  src="/images/day-aerial.webp"
                  alt="G’Host Villa buildings on the forested ridge above Pokhara"
                  className="h-60 w-full object-cover object-[50%_58%] sm:h-72"
                />
              </div>
              <div className="overflow-hidden rounded-2xl border border-forest/15 shadow-soft">
                <img
                  src="/images/garden.webp"
                  alt="Garden lawns and seating at G’Host Villa"
                  loading="lazy"
                  className="h-44 w-full object-cover sm:h-52"
                />
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex-1 overflow-hidden rounded-2xl border border-forest/15 shadow-soft">
                  <img
                    src="/images/pyramid.webp"
                    alt="Crystal Pyramid Dome House and restaurant"
                    loading="lazy"
                    className="h-28 w-full object-cover sm:h-32"
                  />
                </div>
                <div className="rounded-2xl bg-sun px-4 py-3.5 text-forest-dark shadow-soft">
                  <p className="font-display text-2xl font-semibold leading-none">
                    <KineticNumber value={20} suffix=" mins" />
                  </p>
                  <p className="mt-1 text-[0.68rem] font-bold uppercase tracking-[0.12em]">
                    above Lakeside Pokhara
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3 · Interactive Stay Collection with Group Filter Tabs */}
      <section className="border-t border-forest/10 bg-white py-16 md:py-24">
        <div className="wrap">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <Reveal>
              <p className="label">Stay collection</p>
              <h2 className="mt-2 font-display text-4xl font-semibold leading-[0.96] tracking-[-0.04em] text-forest sm:text-5xl">
                Find a space that fits your plans.
              </h2>
            </Reveal>

            <div className="flex flex-wrap items-center gap-2">
              {stayFilters.map((f) => {
                const active = stayTab === f.id
                return (
                  <button
                    key={f.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setStayTab(f.id)}
                    className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                      active
                        ? 'bg-forest text-white shadow-sm'
                        : 'border border-forest/20 bg-white text-forest hover:border-forest'
                    }`}
                  >
                    {f.label}
                  </button>
                )
              })}
              <Link
                href="/rooms"
                className="inline-flex items-center gap-1.5 rounded-full border border-forest/20 bg-white px-4 py-2 text-xs font-bold text-sun-text transition hover:border-forest hover:text-forest"
              >
                <span>View all rooms</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleStays.slice(0, 3).map((room) => {
              const price = describePrice(room, null, 'BB')
              return (
                <Link
                  key={room.id}
                  href={`/rooms/${room.id}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-forest/15 bg-white shadow-soft transition hover:-translate-y-1 hover:border-forest/35 hover:shadow-warm"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-forest-dark">
                    <img
                      src={room.image}
                      alt={room.alt}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    {room.badge && (
                      <span className="absolute left-3.5 top-3.5 rounded-full bg-sun px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-forest-dark">
                        {room.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-sun-text">
                      {buildingLabel(room)}
                    </p>
                    <h3 className="mt-2 font-display text-xl font-semibold leading-snug text-forest sm:text-2xl">
                      {room.name}
                    </h3>
                    <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-forest/70">
                      {room.blurb}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-medium text-forest/65">
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 shrink-0 text-forest/50" aria-hidden="true" />
                        <span>{room.capacity}</span>
                      </span>
                      {room.bed && (
                        <span className="inline-flex items-center gap-1.5">
                          <BedDouble className="h-3.5 w-3.5 shrink-0 text-forest/50" aria-hidden="true" />
                          <span>{room.bed}</span>
                        </span>
                      )}
                    </div>
                    <div className="mt-auto pt-6">
                      <div className="flex items-center justify-between gap-3 border-t border-forest/10 pt-4">
                        <div className="min-w-0">
                          {price.label && (
                            <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-forest/55">
                              {price.label}
                            </span>
                          )}
                          <p className="font-display text-lg font-bold leading-snug text-forest">
                            {price.main}
                          </p>
                        </div>
                        <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-forest/15 bg-white px-3.5 py-2 text-xs font-semibold text-forest transition group-hover:border-sun group-hover:bg-sun group-hover:text-forest-dark">
                          <span>View &amp; book</span>
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* 4 · Stay, Dine & Gather Pillars + Group Buyout Card */}
      <section className="border-t border-forest/10 bg-white py-16 md:py-24">
        <div className="wrap">
          <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="label">The G’Host experience</p>
              <h2 className="mt-2 font-display text-4xl font-semibold leading-[0.96] tracking-[-0.04em] text-forest sm:text-5xl">
                Three ways to enjoy the hilltop.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-forest/70">
              Whether you’re here for a quiet night, a table with a view, or a family celebration.
            </p>
          </Reveal>

          <StaggerGrid className="grid gap-6 md:grid-cols-3">
            {pillars.map((item) => (
              <StaggerItem key={item.tag} className="h-full">
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-forest/15 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-warm">
                  <div className="relative aspect-[16/10] overflow-hidden bg-forest-dark">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-[0.14em] text-forest">
                      {item.tag}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-2xl font-semibold leading-tight text-forest">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-forest/75">{item.text}</p>
                    <ul className="mt-4 space-y-1.5 border-t border-forest/10 pt-4 text-xs font-medium text-forest/80">
                      {item.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-leaf" aria-hidden="true" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto pt-5">
                      <Link
                        href={item.href}
                        className="inline-flex items-center gap-2 rounded-full border border-forest/20 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-forest transition hover:border-forest hover:bg-forest hover:text-white"
                      >
                        <span>{item.link}</span>
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerGrid>

          <Reveal className="mt-6 flex flex-col items-start justify-between gap-5 rounded-2xl border border-forest/15 bg-white p-6 shadow-soft sm:flex-row sm:items-center sm:p-7">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-sun-text">
                Group bookings · 8–24 guests
              </p>
              <h3 className="mt-1.5 font-display text-2xl font-semibold text-forest">
                A villa all to yourselves.
              </h3>
              <p className="mt-1 text-sm text-forest/70">
                Birthdays, family reunions or team retreats—book a private floor or take over the entire 7-BHK Main Villa.
              </p>
            </div>
            <Button
              variant="outline"
              href={waLink("Hello G'Host Villa! I would like to enquire about a group booking or whole-villa stay.")}
              arrow={false}
            >
              Ask about groups
            </Button>
          </Reveal>
        </div>
      </section>

      {/* 5 · Inside G'Host Villa — 6-Photo Mosaic & Lightbox */}
      <section className="bg-forest-dark py-16 text-white md:py-24">
        <div className="wrap">
          <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="label !text-sun">Villa gallery</p>
              <h2 className="mt-2 font-display text-4xl font-semibold leading-[0.96] tracking-[-0.04em] text-white sm:text-5xl">
                Inside G’Host Villa.
              </h2>
            </div>
            <p className="text-sm text-white/65">Tap any photo to view it full screen.</p>
          </Reveal>

          <div
            aria-label="Villa gallery"
            className="grid auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[190px] sm:gap-5 md:grid-cols-4"
          >
            {gallery.slice(0, 6).map((photo, index) => (
              <motion.button
                key={photo.src}
                type="button"
                onClick={(event) => {
                  galleryTriggerRef.current = event.currentTarget
                  setActiveGallery(photo)
                }}
                whileHover={{ scale: 0.985 }}
                className={`group relative overflow-hidden rounded-2xl text-left ${
                  index === 0 ? 'row-span-2 md:row-span-3' : ''
                } ${index === 1 ? 'md:row-span-2' : ''} ${index === 2 ? 'md:col-span-2' : ''} ${
                  index === 3 ? 'row-span-2' : ''
                }`}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105 group-hover:opacity-80"
                />
                <span className="absolute inset-x-3 bottom-3 translate-y-3 text-xs font-bold uppercase tracking-[0.14em] text-white opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100 sm:inset-x-5 sm:bottom-5">
                  View moment <span aria-hidden="true">↗</span>
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activeGallery && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-forest-dark/95 p-5 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Expanded gallery image"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveGallery(null)}
          >
            <motion.div
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.96 }}
              className="relative max-h-[90svh] max-w-6xl"
              onClick={(event) => event.stopPropagation()}
            >
              <img
                src={activeGallery.src}
                alt={activeGallery.alt}
                className="max-h-[82svh] w-auto max-w-full rounded-2xl object-contain"
              />
              <button
                ref={galleryCloseRef}
                type="button"
                aria-label="Close gallery"
                onClick={() => setActiveGallery(null)}
                className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-forest-dark/80 text-2xl text-white transition hover:bg-sun hover:text-forest-dark"
              >
                ×
              </button>
              <p className="mt-3 text-sm text-white/75">{activeGallery.alt}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 7 · Guest Testimonials & Hilltop Video Showcase */}
      <section aria-label="Guest testimonials" className="bg-white py-16 md:py-24">
        <div className="wrap">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
            <Reveal className="flex min-h-[26rem] flex-col">
              <p className="label">Testimonials</p>
              <h2 className="mt-2 font-display text-4xl font-semibold leading-[0.96] tracking-[-0.04em] text-forest sm:text-5xl">
                What guests say.
              </h2>
              <span className="mt-6 block font-display text-6xl leading-none text-sun-text">“</span>
              <AnimatePresence mode="wait">
                <motion.div
                  key={quote.name}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                >
                  <blockquote className="mt-2 max-w-xl font-display text-2xl leading-[1.14] tracking-[-0.03em] text-forest sm:text-3xl">
                    {quote.text}
                  </blockquote>
                  <div className="mt-6 flex items-center gap-4">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-sun font-display text-lg font-semibold text-forest-dark">
                      {quote.name.charAt(0)}
                    </span>
                    <div>
                      <p className="font-semibold text-forest">
                        {quote.name}{' '}
                        <span className="rounded-full border border-forest/15 px-2.5 py-0.5 text-[0.68rem] font-semibold text-forest/70">
                          {quote.trip}
                        </span>
                      </p>
                      <p className="mt-0.5 text-xs text-forest/60">
                        {quote.country} · {quote.source} · {'★'.repeat(quote.rating)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="mt-auto flex gap-3 pt-8">
                <button
                  type="button"
                  onClick={() => changeReview(-1)}
                  aria-label="Previous testimonial"
                  className="grid h-11 w-11 place-items-center rounded-full border border-forest/20 text-forest transition hover:bg-forest hover:text-white"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => changeReview(1)}
                  aria-label="Next testimonial"
                  className="grid h-11 w-11 place-items-center rounded-full border border-forest/20 text-forest transition hover:bg-forest hover:text-white"
                >
                  →
                </button>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="relative min-h-[24rem] overflow-hidden rounded-2xl bg-forest-dark sm:min-h-[28rem]">
              <video
                autoPlay
                muted
                playsInline
                loop
                preload="metadata"
                poster="/images/day-aerial.webp"
                className="absolute inset-0 h-full w-full object-cover"
              >
                <source src="/videos/stock-hero.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-forest-dark/20" />
              <div className="absolute inset-x-5 bottom-5 flex items-center justify-between gap-4 text-white sm:inset-x-7 sm:bottom-7">
                <p className="text-xs font-bold uppercase tracking-[0.15em]">A little more room to breathe</p>
                <span className="grid h-11 w-11 place-items-center rounded-full border border-white/60 bg-white/90 text-forest" aria-hidden="true">
                  ▶
                </span>
              </div>
            </Reveal>
          </div>

          <StaggerGrid className="mt-10 grid gap-5 md:grid-cols-3">
            {reviews.slice(0, 3).map((r) => (
              <StaggerItem key={r.name} className="h-full">
                <blockquote className="flex h-full flex-col rounded-2xl border border-forest/15 bg-white p-5 shadow-soft">
                  <div className="flex items-center gap-1 text-sun">
                    {Array.from({ length: r.rating }, (_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-sun" aria-hidden="true" />
                    ))}
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-forest/80">“{r.short}”</p>
                  <footer className="mt-4 border-t border-forest/10 pt-3 text-xs font-semibold text-forest">
                    {r.name} <span className="font-normal text-forest/55">· {r.country}</span>
                  </footer>
                </blockquote>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* 8 · Location, Map, Quick FAQ & Closing CTA */}
      <section className="border-t border-forest/10 bg-white pt-16 md:pt-24">
        <div className="wrap grid items-start gap-12 pb-14 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="label">Location &amp; map</p>
            <h2 className="mt-2 font-display text-3xl font-semibold leading-none tracking-[-0.03em] text-forest sm:text-4xl">
              Easy to reach, above it all.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-forest/75">{site.address}</p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-forest/15 bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-sun-text">Lakeside</p>
                <p className="mt-1 font-display text-xl font-semibold text-forest">~20 mins</p>
              </div>
              <div className="rounded-2xl border border-forest/15 bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-sun-text">Pokhara Airport</p>
                <p className="mt-1 font-display text-xl font-semibold text-forest">~30 mins</p>
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-forest/15 bg-white">
              <iframe
                title="G'Host Villa location map"
                src={mapEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-56 w-full border-0"
              />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Button href={directionsLink} variant="solid" arrow={false} className="w-full">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Get Directions</span>
                </span>
              </Button>
              <Button
                href={waLink("Hello G'Host Villa! Could you share directions to the villa?")}
                variant="outline"
                arrow={false}
                className="w-full"
              >
                <span className="inline-flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Ask on WhatsApp</span>
                </span>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="label">FAQ</p>
            <h2 className="mt-2 font-display text-3xl font-semibold leading-none tracking-[-0.03em] text-forest sm:text-4xl">
              Quick answers.
            </h2>
            <div className="mt-5 divide-y divide-forest/15 border-y border-forest/15">
              {faqs.slice(0, 5).map((faq) => (
                <details key={faq.q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-sm font-semibold text-forest">
                    <span>{faq.q}</span>
                    <span className="text-lg text-forest/60 transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="max-w-2xl pt-3 text-sm leading-relaxed text-forest/75">{faq.a}</p>
                </details>
              ))}
            </div>
            <div className="mt-6">
              <Link
                href="/faq"
                className="inline-flex items-center gap-2 rounded-full border border-forest/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-forest transition hover:border-forest hover:bg-forest hover:text-white"
              >
                <span>Read all FAQs</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>

        <CtaBanner />
      </section>
    </div>
  )
}
