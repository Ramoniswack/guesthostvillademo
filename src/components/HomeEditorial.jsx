'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight, Bath, BedDouble, Car, Check, CheckCircle2, Clock, Coffee, MapPin, MessageCircle, ShieldCheck, Star, Users, Utensils, Wifi,
} from 'lucide-react'
import { faqs } from '../data/faq.js'
import { buildingLabel, describePrice, rooms } from '../data/rooms.js'
import { reviews } from '../data/reviews.js'
import { directionsLink, mapEmbed, site, stats, waLink } from '../data/site.js'
import { gallery } from '../data/gallery.js'
import CtaBanner from './CtaBanner.jsx'
import KineticNumber from './KineticNumber.jsx'
import RoomCard from './RoomCard.jsx'
import { Button, Reveal, StaggerGrid, StaggerItem } from './ui.jsx'
import { backendWhatsAppLink, useBackendData } from '../lib/backend.jsx'

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
  const backend = useBackendData()
  const editorial = backend?.home?.editorial
  const currentSite = backend?.site ?? site
  const currentStats = backend?.stats?.length ? backend.stats : stats
  const currentTrustBadges = backend?.trustBadges?.length ? backend.trustBadges : trustBadges
  const iconByName = { CheckCircle2, MessageCircle, ShieldCheck, Wifi, Bath, Car, Coffee, Clock, Utensils, BedDouble, Users, Star, MapPin }
  const currentBenefits = backend?.home?.directBenefits?.length
    ? backend.home.directBenefits.map((item, index) => ({
        ...item,
        icon: iconByName[item.icon] ?? [CheckCircle2, MessageCircle, ShieldCheck][index] ?? CheckCircle2,
      }))
    : directBenefits
  const currentAmenities = backend?.home?.amenities?.length
    ? backend.home.amenities.map((item, index) => ({
        ...item,
        icon: iconByName[item.icon] ?? [Wifi, Bath, Car, Coffee, Clock, Utensils][index] ?? CheckCircle2,
      }))
    : amenities
  const currentStayFilters = backend?.home?.stayFilters?.length ? backend.home.stayFilters : stayFilters
  const currentPillars = backend?.home?.pillars?.length ? backend.home.pillars : pillars
  const currentGallery = backend?.home?.gallery?.length
    ? backend.home.gallery
    : gallery
  const currentReviews = backend?.home?.reviews?.length ? backend.home.reviews : reviews
  const currentFaqs = backend?.faq?.faqs?.length ? backend.faq.faqs : faqs
  const backendRooms = backend?.stays?.rooms
  const featuredStayIds = editorial?.stays?.featuredStayIds?.length
    ? editorial.stays.featuredStayIds
    : stayIds
  const currentWhatsApp = (message) => backendWhatsAppLink(currentSite, message) ?? waLink(message)
  const currentDirectionsLink = currentSite.directionsLink ?? directionsLink
  const currentMapEmbed = currentSite.mapEmbed ?? mapEmbed
  const [stayTab, setStayTab] = useState('all')
  const [activeGallery, setActiveGallery] = useState(null)
  const [reviewIndex, setReviewIndex] = useState(0)
  const galleryCloseRef = useRef(null)
  const galleryTriggerRef = useRef(null)

  const allFeaturedStays = useMemo(() => {
    const availableRooms = backendRooms?.length ? backendRooms : rooms
    return featuredStayIds.map((id) => availableRooms.find((room) => room.id === id)).filter(Boolean)
  }, [backendRooms, featuredStayIds])
  const visibleStays = useMemo(() => {
    const filter = currentStayFilters.find((item) => item.id === stayTab)
    if (filter?.roomIds?.length) return allFeaturedStays.filter((room) => filter.roomIds.includes(room.id))
    if (stayTab === 'couples') return allFeaturedStays.filter((r) => ['mountain-view-room', 'city-view-room', 'suite'].includes(r.id))
    if (stayTab === 'groups') return allFeaturedStays.filter((r) => ['pyramid-dome-house', 'villa-top-floor'].includes(r.id))
    if (stayTab === 'estate') return allFeaturedStays.filter((r) => ['villa-top-floor', 'whole-villa'].includes(r.id))
    return allFeaturedStays
  }, [allFeaturedStays, currentStayFilters, stayTab])

  const quote = currentReviews[reviewIndex] ?? currentReviews[0]
  const changeReview = (direction) =>
    setReviewIndex((index) => (index + direction + currentReviews.length) % currentReviews.length)

  useEffect(() => {
    if (reviewIndex >= currentReviews.length) setReviewIndex(0)
  }, [currentReviews.length, reviewIndex])

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
            {currentStats.map((stat, index) => (
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
            {currentTrustBadges.map((badge, idx) => (
              <a
                key={badge.name || idx}
                href={badge.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-forest/15 bg-white px-4 py-2 text-xs font-semibold text-forest shadow-sm transition hover:border-forest/40"
              >
                {idx === 0 ? (
                  <span className="text-sun-text">★</span>
                ) : (
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-leaf" aria-hidden="true" />
                )}
                <span>{badge.name}</span>
                {badge.detail && <span className="text-forest/50">· {badge.detail}</span>}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 2 · Editorial Intro: Stay, dine & gather (Collage Left, Content Right) */}
      <section className="bg-white section-y">
        <div className="wrap grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20">
          {/* Left: Asymmetric Curvy Photo Collage + 2 Overlapping Stat Cards */}
          <Reveal>
            <div className="grid grid-cols-2 items-start gap-4 sm:gap-6">
              {/* Left sub-column: Top portrait photo with top-left stat card + Bottom landscape photo */}
              <div className="space-y-4 sm:space-y-6">
                <div className="relative pl-3 pt-4 sm:pl-5 sm:pt-5">
                  <div className="overflow-hidden rounded-[24px] shadow-soft">
                    <img
                      src={editorial?.intro?.imageMain || '/images/day-aerial.webp'}
                      alt={editorial?.intro?.imageMainAlt || 'G’Host Villa buildings on the forested ridge above Pokhara'}
                      className="h-56 w-full object-cover object-[50%_58%] sm:h-68"
                    />
                  </div>
                  <div className="absolute left-0 top-0 rounded-2xl border border-forest/10 bg-white px-5 py-3.5 text-forest shadow-[0_16px_36px_rgba(20,41,29,0.14)] sm:px-6 sm:py-4">
                    <p className="font-display text-2xl font-bold leading-none sm:text-3xl">
                      <KineticNumber
                        value={Number(editorial?.intro?.badgeNumber) || 20}
                        suffix={editorial?.intro?.badgeSuffix || 'm'}
                      />
                    </p>
                    <p className="mt-1.5 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-forest/65">
                      {editorial?.intro?.badgeLabel || 'Above Lakeside'}
                    </p>
                  </div>
                </div>

                <div className="ml-3 overflow-hidden rounded-[24px] shadow-soft sm:ml-5">
                  <img
                    src={editorial?.intro?.imageGarden || '/images/garden.webp'}
                    alt={editorial?.intro?.imageGardenAlt || 'Garden lawns and seating at G’Host Villa'}
                    loading="lazy"
                    className="h-36 w-full object-cover sm:h-44"
                  />
                </div>
              </div>

              {/* Right sub-column: Tall portrait photo with bottom-center stat card */}
              <div className="relative mt-8 pb-8 sm:mt-10 sm:pb-9">
                <div className="overflow-hidden rounded-[24px] shadow-soft">
                  <img
                    src={editorial?.intro?.imagePyramid || '/images/pyramid.webp'}
                    alt={editorial?.intro?.imagePyramidAlt || 'Crystal Pyramid Dome House and restaurant'}
                    loading="lazy"
                    className="h-80 w-full object-cover sm:h-[26rem]"
                  />
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-2xl border border-forest/10 bg-white px-6 py-3.5 text-center text-forest shadow-[0_16px_36px_rgba(20,41,29,0.14)] sm:px-8 sm:py-4">
                  <p className="font-display text-2xl font-bold leading-none sm:text-3xl">
                    <KineticNumber value={24} suffix="+" />
                  </p>
                  <p className="mt-1.5 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-forest/65">
                    Guest Capacity
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right: Left-Aligned Editorial Content Matching Reference Image */}
          <Reveal delay={0.08} className="max-w-lg">
            <span className="inline-flex items-center rounded-full border border-forest/30 px-4 py-1 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-forest">
              {editorial?.intro?.eyebrow || 'A hilltop hideaway · Pokhara'}
            </span>
            <h2 className="mt-5 font-display font-semibold uppercase text-forest type-section">
              {editorial?.intro?.title || 'Stay, dine & gather.'}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-forest/75 sm:text-base">
              {editorial?.intro?.paragraph1 || 'G’Host Villa brings crisp mountain air, warm rooms and easy hospitality together along the Sarangkot ridge—just 20 minutes above Lakeside Pokhara.'}
            </p>

            {/* Feature Checklist (from reference image) + Horizontally-Expanding Amenity Icons */}
            <ul className="mt-6 space-y-2.5 text-sm font-medium text-forest/85">
              {currentBenefits.map(({ label }) => (
                <li key={label} className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 shrink-0 text-forest" strokeWidth={2.4} aria-hidden="true" />
                  <span>{label}</span>
                </li>
              ))}
            </ul>

            <ul
              aria-label="Villa features"
              className="mt-6 flex flex-wrap items-center justify-start gap-2"
            >
              {currentAmenities.map(({ icon: Ico, label }) => (
                <li key={label}>
                  <button
                    type="button"
                    aria-label={label}
                    className="group inline-flex h-10 items-center rounded-full border border-forest/15 bg-white px-3 text-forest shadow-xs transition-all duration-300 hover:border-sun hover:bg-sun hover:px-3.5 hover:text-forest-dark focus-visible:border-sun focus-visible:bg-sun focus-visible:px-3.5 focus-visible:text-forest-dark focus-visible:outline-none"
                  >
                    <Ico className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-semibold opacity-0 transition-all duration-300 group-hover:ml-2 group-hover:max-w-[11rem] group-hover:opacity-100 group-focus-visible:ml-2 group-focus-visible:max-w-[11rem] group-focus-visible:opacity-100">
                      {label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Button
                variant="solid"
                className="w-full sm:w-auto"
                href={editorial?.intro?.primaryCtaHref || '/rooms'}
              >
                {editorial?.intro?.primaryCtaLabel || 'Explore rooms'}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3 · Interactive Stay Collection with Group Filter Tabs */}
      <section className="border-t border-forest/10 bg-white section-y">
        <div className="wrap">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <Reveal>
              <p className="label">{editorial?.stays?.eyebrow || 'Stay collection'}</p>
              <h2 className="mt-2 font-display font-semibold text-forest type-section">
                {editorial?.stays?.title || 'Find a space that fits your plans.'}
              </h2>
            </Reveal>

            <div className="flex flex-wrap items-center gap-2">
              {currentStayFilters.map((filter) => {
                const active = stayTab === filter.id
                return (
                  <button
                    key={filter.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setStayTab(filter.id)}
                    className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
                      active
                        ? 'border-forest bg-forest text-white'
                        : 'border-forest/20 bg-white text-forest/75 hover:border-forest hover:text-forest'
                    }`}
                  >
                    {filter.label}
                  </button>
                )
              })}
              <Link
                href={editorial?.stays?.viewAllHref || '/rooms'}
                className="inline-flex items-center gap-1.5 rounded-full border border-forest/20 bg-white px-4 py-2 text-xs font-bold text-sun-text transition hover:border-forest hover:text-forest"
              >
                <span>{editorial?.stays?.viewAllLabel || 'View all rooms'}</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-12 lg:grid-cols-3 lg:items-center lg:gap-10">
            {visibleStays.slice(0, 3).map((room, index) => (
              <RoomCard key={room.id} room={room} featured={index === 1} />
            ))}
          </div>
        </div>
      </section>

      {/* 4 · Stay, Dine & Gather Pillars + Group Buyout Card */}
      <section className="border-t border-forest/10 bg-white section-y">
        <div className="wrap">
          <Reveal className="head-gap flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="label">{editorial?.pillarsSection?.eyebrow || 'The G’Host experience'}</p>
              <h2 className="mt-2 font-display font-semibold text-forest type-section">
                {editorial?.pillarsSection?.title || 'Three ways to enjoy the hilltop.'}
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-forest/70">
              {editorial?.pillarsSection?.subtitle || 'Whether you’re here for a quiet night, a table with a view, or a family celebration.'}
            </p>
          </Reveal>

          {/* One tall feature card + two horizontal cards, so it reads differently from the stay collection above */}
          <div className="grid gap-4 sm:gap-5 lg:grid-cols-[1.1fr_1fr] lg:grid-rows-2 lg:gap-6">
            {currentPillars.slice(0, 3).map((item, index) => index === 0 ? (
              <Reveal key={item.tag || item.title} className="h-full lg:row-span-2">
                <Link href={item.href} className="group relative flex h-full min-h-[20rem] flex-col justify-end overflow-hidden rounded-3xl bg-forest-dark sm:min-h-[24rem] lg:min-h-[30rem]">
                  <img src={item.image} alt={item.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <span className="absolute inset-0 bg-gradient-to-t from-forest-dark/90 via-forest-dark/30 to-transparent" aria-hidden="true" />
                  <div className="relative p-6 text-white sm:p-8 lg:p-10">
                    {item.tag && <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] backdrop-blur-sm">{item.tag}</span>}
                    <h3 className="mt-5 max-w-md font-display text-2xl font-semibold leading-tight sm:text-3xl">{item.title}</h3>
                    <span className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-sun px-5 py-2.5 text-sm font-semibold text-white transition group-hover:bg-sun-dark">
                      {item.link || 'Explore'} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ) : (
              <Reveal key={item.tag || item.title} className="h-full">
                <Link href={item.href} className="group grid h-full overflow-hidden rounded-3xl border border-forest/15 bg-white shadow-soft transition hover:border-forest/40 sm:grid-cols-[0.85fr_1fr]">
                  <div className="relative aspect-[16/9] overflow-hidden sm:aspect-auto sm:min-h-[11rem]">
                    <img src={item.image} alt={item.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  </div>
                  <div className="flex flex-col justify-center p-5 sm:p-6 lg:p-8">
                    {item.tag && <p className="text-xs font-bold uppercase tracking-[0.14em] text-sun-text">{item.tag}</p>}
                    <h3 className="mt-2.5 font-display text-xl font-semibold leading-snug text-forest">{item.title}</h3>
                    <span className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-forest underline decoration-sun decoration-2 underline-offset-4">
                      {item.link || 'Explore'} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-5 flex flex-col items-stretch justify-between gap-5 rounded-3xl border border-forest/15 bg-white p-6 shadow-soft sm:flex-row sm:items-center sm:p-8 md:mt-6 lg:p-10">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-sun-text">
                {editorial?.pillarsSection?.buyoutEyebrow || 'Group bookings · 8–24 guests'}
              </p>
              <h3 className="mt-1.5 font-display text-2xl font-semibold text-forest">
                {editorial?.pillarsSection?.buyoutTitle || 'A villa all to yourselves.'}
              </h3>
              <p className="mt-1 text-sm text-forest/70">
                {editorial?.pillarsSection?.buyoutDescription || 'Birthdays, family reunions or team retreats—book a private floor or take over the entire 7-BHK Main Villa.'}
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              href={currentWhatsApp(editorial?.pillarsSection?.buyoutWhatsappText || "Hello G'Host Villa! I would like to enquire about a group booking or whole-villa stay.")}
              arrow={false}
            >
              {editorial?.pillarsSection?.buyoutCtaLabel || 'Ask about groups'}
            </Button>
          </Reveal>
        </div>
      </section>

      {/* 5 · Inside G'Host Villa — 6-Photo Mosaic & Lightbox */}
      <section className="bg-forest-dark py-16 text-white md:py-24">
        <div className="wrap">
          <Reveal className="head-gap flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="label !text-sun">{editorial?.gallerySection?.eyebrow || 'Villa gallery'}</p>
              <h2 className="mt-2 font-display font-semibold text-white type-section">
                {editorial?.gallerySection?.title || 'Inside G’Host Villa.'}
              </h2>
            </div>
            <p className="text-sm text-white/65">{editorial?.gallerySection?.hint || 'Tap any photo to view it full screen.'}</p>
          </Reveal>

          <div
            aria-label="Villa gallery"
            className="grid auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[190px] sm:gap-5 md:grid-cols-4"
          >
            {currentGallery.slice(0, 6).map((photo, index) => (
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
                <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" aria-hidden="true" />
                <span className="absolute inset-x-3 bottom-3 inline-flex translate-y-2 items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:inset-x-5 sm:bottom-5">
                  <span>View moment</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
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
      <section aria-label="Guest testimonials" className="bg-white section-y">
        <div className="wrap">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
            <Reveal className="flex min-h-[26rem] flex-col">
              <p className="label">{editorial?.testimonialsSection?.eyebrow || 'Testimonials'}</p>
              <h2 className="mt-2 font-display font-semibold text-forest type-section">
                {editorial?.testimonialsSection?.title || 'What guests say.'}
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
                poster={editorial?.testimonialsSection?.videoPoster || '/images/day-aerial.webp'}
                className="absolute inset-0 h-full w-full object-cover"
              >
                <source src={editorial?.testimonialsSection?.videoSrc || '/videos/stock-hero.mp4'} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-forest-dark/20" />
              <div className="absolute inset-x-5 bottom-5 flex items-center justify-between gap-4 text-white sm:inset-x-7 sm:bottom-7">
                <p className="text-xs font-bold uppercase tracking-[0.15em]">{editorial?.testimonialsSection?.videoCaption || 'A little more room to breathe'}</p>
                <span className="grid h-11 w-11 place-items-center rounded-full border border-white/60 bg-white/90 text-forest" aria-hidden="true">
                  ▶
                </span>
              </div>
            </Reveal>
          </div>

          <StaggerGrid className="mt-10 grid gap-5 md:grid-cols-3">
            {currentReviews.slice(0, 3).map((r) => (
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
      <section className="border-t border-forest/10 bg-white section-pt">
        <div className="wrap grid items-start gap-12 pb-14 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="label">{editorial?.locationSection?.eyebrow || 'Location & map'}</p>
            <h2 className="mt-2 font-display font-semibold text-forest type-section">
              {editorial?.locationSection?.title || 'Easy to reach, above it all.'}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-forest/75">{currentSite.address}</p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-forest/15 bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-sun-text">{editorial?.locationSection?.lakesideLabel || 'Lakeside'}</p>
                <p className="mt-1 font-display text-xl font-semibold text-forest">{editorial?.locationSection?.lakesideTime || '~20 mins'}</p>
              </div>
              <div className="rounded-2xl border border-forest/15 bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-sun-text">{editorial?.locationSection?.airportLabel || 'Pokhara Airport'}</p>
                <p className="mt-1 font-display text-xl font-semibold text-forest">{editorial?.locationSection?.airportTime || '~30 mins'}</p>
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-forest/15 bg-white">
              <iframe
                title="G'Host Villa location map"
                src={currentMapEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-56 w-full border-0"
              />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Button href={currentDirectionsLink} variant="solid" arrow={false} className="w-full">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Get Directions</span>
                </span>
              </Button>
              <Button
                href={currentWhatsApp("Hello G'Host Villa! Could you share directions to the villa?")}
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
            <p className="label">{editorial?.locationSection?.faqEyebrow || 'FAQ'}</p>
            <h2 className="mt-2 font-display font-semibold text-forest type-section">
              {editorial?.locationSection?.faqTitle || 'Quick answers.'}
            </h2>
            <div className="mt-5 divide-y divide-forest/15 border-y border-forest/15">
              {currentFaqs.slice(0, 5).map((faq) => (
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
                href={editorial?.locationSection?.faqCtaHref || '/faq'}
                className="inline-flex items-center gap-2 rounded-full border border-forest/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-forest transition hover:border-forest hover:bg-forest hover:text-white"
              >
                <span>{editorial?.locationSection?.faqCtaLabel || 'Read all FAQs'}</span>
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
