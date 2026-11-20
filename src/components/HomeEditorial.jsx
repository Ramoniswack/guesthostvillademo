'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Bath, Car, CheckCircle2, Clock, Coffee, MapPin, MessageCircle, ShieldCheck, Wifi,
} from 'lucide-react'
import { faqs } from '../data/faq.js'
import { rooms } from '../data/rooms.js'
import { reviews } from '../data/reviews.js'
import { directionsLink, mapEmbed, site, stats, waLink } from '../data/site.js'
import { gallery } from '../data/gallery.js'
import CtaBanner from './CtaBanner.jsx'
import KineticNumber from './KineticNumber.jsx'
import { ArrowCircle, Button, Reveal } from './ui.jsx'

const spaces = [
  {
    label: 'Mountain view',
    title: 'Wake up to the Annapurna range.',
    text: 'A quiet hilltop room in the Pyramid Building with mountain views and breakfast included.',
    image: '/images/room-couple.webp',
    meta: 'Phewa Valley · 1–4 guests',
    price: `From NPR ${rooms[0].price.toLocaleString('en-US')} / night`,
    href: `/rooms/${rooms[0].id}`,
  },
  {
    label: 'City view',
    title: 'Above Pokhara, away from the noise.',
    text: 'Look across the green hills and city lights from a warm wood-floored base.',
    image: '/images/room-deluxe.webp',
    meta: 'Sarangkot · 20 mins from Lakeside',
    price: `From NPR ${rooms[1].price.toLocaleString('en-US')} / night`,
    href: `/rooms/${rooms[1].id}`,
  },
  {
    label: 'Suite section',
    title: 'A little more room for two.',
    text: 'Private, warm and unhurried—made for slow mornings and longer stays in the Main Villa.',
    image: '/images/day-aerial.webp',
    meta: 'Main Villa · 1–4 guests',
    price: `From NPR ${rooms[4].price.toLocaleString('en-US')} / night`,
    href: `/rooms/${rooms[4].id}`,
  },
]

const pillars = [
  {
    tag: 'Stay',
    title: 'Hilltop rooms & villa floors',
    text: 'Private rooms, a 2BHK top floor or the whole estate for up to 24 guests.',
    image: '/images/room-couple.webp',
    href: '/rooms',
    link: 'Browse stays',
  },
  {
    tag: 'Dine',
    title: 'Pyramid restro & bottle bar',
    text: 'Slow breakfasts, local favourites and sunset drinks overlooking the valley.',
    image: '/images/pyramid.webp',
    href: '/menu',
    link: 'See the menu',
  },
  {
    tag: 'Gather',
    title: 'Garden & private events',
    text: 'Open lawns, BBQ evenings and space for birthdays, reunions and retreats.',
    image: '/images/garden.webp',
    href: '/packages',
    link: 'View packages',
  },
]

const amenities = [
  { icon: Wifi, label: 'Free Wi-Fi' },
  { icon: Bath, label: 'Hot water' },
  { icon: Car, label: 'Free parking' },
  { icon: Coffee, label: 'Breakfast included' },
  { icon: Clock, label: 'Check-in 2 PM' },
]

const directBenefits = [
  { icon: CheckCircle2, label: 'Best direct rate' },
  { icon: MessageCircle, label: 'Instant WhatsApp reply' },
  { icon: ShieldCheck, label: 'Free cancellation (48h)' },
]

const trustBadges = [
  { name: 'Google', detail: '4.5★ · 379+ reviews', href: site.social.tripadvisor },
  { name: 'eSewa Hotels', detail: 'Verified listing', href: site.social.esewa },
  { name: 'MakeMyTrip', detail: 'Listed partner', href: site.social.makemytrip },
]

function TextLink({ href, children }) {
  const inner = <><span>{children}</span><ArrowCircle /></>
  const className = 'inline-flex shrink-0 items-center gap-3 whitespace-nowrap text-xs font-bold uppercase tracking-[0.12em] text-forest transition hover:text-sun-dark'
  if (href.startsWith('/')) return <Link href={href} className={className}>{inner}</Link>
  return <a href={href} className={className} target="_blank" rel="noopener noreferrer">{inner}</a>
}

export default function HomeEditorial() {
  const [activeSpace, setActiveSpace] = useState(0)
  const [activeGallery, setActiveGallery] = useState(null)
  const [reviewIndex, setReviewIndex] = useState(0)
  const galleryCloseRef = useRef(null)
  const galleryTriggerRef = useRef(null)
  const space = spaces[activeSpace]
  const quote = reviews[reviewIndex]
  const changeReview = (direction) => setReviewIndex((index) => (index + direction + reviews.length) % reviews.length)

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
    <div>
      {/* 1 · Stats & Trust strip */}
      <section className="border-y border-forest/15 bg-white py-8 md:py-10">
        <div className="wrap">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className={`px-4 py-4 text-center first:pl-0 last:pr-0 md:px-7 ${index % 2 === 1 ? 'border-l border-forest/15' : ''} ${index >= 2 ? 'border-t border-forest/15 md:border-t-0' : ''} ${index > 0 ? 'md:border-l md:border-forest/15' : ''}`}
              >
                <p className="font-display text-3xl leading-none tracking-[-0.04em] text-forest sm:text-4xl">
                  <KineticNumber value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mx-auto mt-2.5 max-w-36 text-xs font-semibold leading-snug text-forest/65">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 border-t border-forest/10 pt-6">
            {trustBadges.map((badge) => (
              <a
                key={badge.name}
                href={badge.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-forest/15 bg-white px-4 py-2 text-xs font-semibold text-forest shadow-sm transition hover:border-forest/40 hover:bg-white/80"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-leaf" aria-hidden="true" />
                <span>{badge.name}</span>
                <span className="text-forest/55">· {badge.detail}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 2 · Intro: Stay, dine & gather + Why book direct + Amenities */}
      <section className="overflow-hidden bg-white py-16 md:py-24">
        <div className="wrap grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-16">
          <Reveal className="max-w-xl">
            <p className="label">A hilltop hideaway · Pokhara</p>
            <h2 className="mt-4 font-display text-5xl font-semibold leading-[0.94] tracking-[-0.045em] text-forest sm:text-6xl">
              Stay, dine &amp; gather.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-forest/75">
              G’Host Villa brings mountain air, warm rooms and easy hospitality together above Pokhara. Check in for a quiet escape or take over the villa with your favourite people.
            </p>

            {/* Why book direct strip */}
            <div className="mt-7 grid gap-2 sm:grid-cols-3">
              {directBenefits.map(({ icon: Ico, label }) => (
                <span key={label} className="inline-flex items-center justify-center gap-1.5 rounded-full border border-forest/15 bg-white px-3 py-2 text-[0.72rem] font-semibold text-forest">
                  <Ico className="h-3.5 w-3.5 shrink-0 text-leaf" aria-hidden="true" />
                  <span className="truncate">{label}</span>
                </span>
              ))}
            </div>

            {/* Amenities icons */}
            <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-forest/10 pt-5 text-xs font-semibold text-forest/75 sm:grid-cols-3">
              {amenities.map(({ icon: Ico, label }) => (
                <li key={label} className="inline-flex items-center gap-2">
                  <Ico className="h-4 w-4 shrink-0 text-sun-text" aria-hidden="true" />
                  <span>{label}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8"><Button href="/rooms">Find your stay</Button></div>
          </Reveal>

          <Reveal delay={0.12} className="relative mx-auto w-full max-w-2xl">
            <div className="grid grid-cols-5 gap-3 sm:gap-5">
              <img src="/images/day-aerial.webp" alt="G'Host Villa in the Pokhara hills" className="col-span-3 h-[320px] w-full rounded-2xl object-cover sm:h-[420px]" />
              <div className="col-span-2 flex flex-col justify-end gap-3 sm:gap-5">
                <img src="/images/garden.webp" alt="Garden setting at G'Host Villa" className="h-[150px] w-full rounded-2xl object-cover sm:h-[200px]" />
                <div className="rounded-2xl bg-sun px-5 py-6 text-forest sm:px-7 sm:py-8">
                  <p className="font-display text-3xl leading-none sm:text-4xl"><KineticNumber value={20} suffix=" min" /></p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.1em]">from Lakeside</p>
                </div>
              </div>
            </div>
            <img src="/images/pyramid.webp" alt="Pyramid restaurant at G'Host Villa" loading="lazy" className="absolute -bottom-8 left-[12%] h-28 w-44 rounded-2xl border-[7px] border-cream object-cover sm:h-36 sm:w-56" />
          </Reveal>
        </div>
      </section>

      {/* 3 · Stay cards: Find a stay that fits your plans */}
      <section className="bg-white py-16 md:py-24">
        <div className="wrap">
          <Reveal className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="label">Stay collection</p>
              <h2 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-[0.96] tracking-[-0.045em] text-forest sm:text-5xl">
                Find a stay that fits your plans.
              </h2>
            </div>
            <TextLink href="/rooms">View all rooms</TextLink>
          </Reveal>

          <div aria-label="Villa stay options" className="grid gap-5 md:grid-cols-3">
            {spaces.map((item, index) => (
              <button
                key={item.label}
                type="button"
                aria-pressed={activeSpace === index}
                onClick={() => setActiveSpace(index)}
                className={`group flex flex-col overflow-hidden rounded-2xl border text-left transition duration-300 ${
                  activeSpace === index
                    ? 'border-forest bg-white shadow-lg shadow-forest/10'
                    : 'border-forest/15 bg-white/65 hover:-translate-y-1 hover:border-forest/35 hover:bg-white'
                }`}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-forest-dark">
                  <img src={item.image} alt={item.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/65 via-transparent to-transparent" />
                  <span className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.13em] ${activeSpace === index ? 'bg-sun text-forest' : 'bg-white/90 text-forest'}`}>
                    {activeSpace === index ? 'Selected stay' : `0${index + 1}`}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-forest/55">{item.meta}</p>
                  <h3 className="mt-2.5 font-display text-2xl leading-none tracking-[-0.03em] text-forest sm:text-3xl">{item.label}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-forest/70">{item.title}</p>
                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-forest/15 pt-4 text-xs font-bold text-forest">
                    <span className="font-display text-base font-semibold">{item.price}</span>
                    <ArrowCircle className={activeSpace === index ? 'bg-sun text-forest' : 'transition group-hover:bg-sun group-hover:text-forest'} />
                  </div>
                </div>
              </button>
            ))}
          </div>

          <Reveal className="mt-5 flex flex-col gap-5 rounded-2xl border border-forest/15 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-sun-dark">{space.price}</p>
              <p className="mt-1.5 font-display text-2xl leading-none text-forest">{space.title}</p>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-forest/65">{space.text}</p>
            </div>
            <TextLink href={space.href}>View &amp; book</TextLink>
          </Reveal>
        </div>
      </section>

      {/* 4 · Stay, Dine and Gather + Group bookings card */}
      <section className="bg-white py-16 md:py-24">
        <div className="wrap">
          <Reveal className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="label">The G’Host experience</p>
              <h2 className="mt-3 font-display text-4xl font-semibold leading-[0.96] tracking-[-0.045em] text-forest sm:text-5xl">
                Stay, Dine &amp; Gather.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-forest/70">
              Three ways to enjoy the hilltop—whether you’re here for a night, a meal or a celebration.
            </p>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-3">
            {pillars.map((item, index) => (
              <Reveal key={item.tag} delay={index * 0.08} className="group">
                <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-forest/15 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-warm">
                  <div className="relative overflow-hidden">
                    <img src={item.image} alt="" loading="lazy" className="h-56 w-full object-cover transition duration-700 group-hover:scale-105" />
                    <span className="absolute left-4 top-4 rounded-full bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-[0.14em] text-forest">
                      {item.tag}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-2xl leading-tight tracking-[-0.03em] text-forest">{item.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-forest/70">{item.text}</p>
                    <div className="mt-auto pt-5"><TextLink href={item.href}>{item.link}</TextLink></div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          {/* Small group-bookings card ("A villa all to yourselves") */}
          <Reveal className="mt-6 flex flex-col items-start justify-between gap-5 rounded-2xl border border-forest/15 bg-white p-6 shadow-soft sm:flex-row sm:items-center sm:p-7">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-sun-text">Group bookings · 8–24 guests</p>
              <h3 className="mt-1.5 font-display text-2xl font-semibold text-forest">A villa all to yourselves.</h3>
              <p className="mt-1 text-sm text-forest/70">Birthdays, family reunions or team retreats—book a private floor or the entire 7BHK estate.</p>
            </div>
            <Button variant="outline" href={waLink("Hello G'Host Villa! I would like to enquire about a group booking or whole-villa stay.")} arrow={false}>
              Ask about groups
            </Button>
          </Reveal>
        </div>
      </section>

      {/* 5 · Dark photo gallery */}
      <section className="bg-forest-dark py-16 text-cream md:py-24">
        <div className="wrap">
          <Reveal className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="label !text-sun">Villa gallery</p>
              <h2 className="mt-3 font-display text-4xl font-semibold leading-[0.96] tracking-[-0.045em] text-cream sm:text-5xl">
                Inside G’Host Villa.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-cream/65">Tap any photo to view it full screen.</p>
          </Reveal>
          <div aria-label="Villa gallery" className="grid auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[190px] sm:gap-5 md:grid-cols-4">
            {gallery.slice(0, 6).map((photo, index) => (
              <motion.button
                key={photo.src}
                type="button"
                onClick={(event) => { galleryTriggerRef.current = event.currentTarget; setActiveGallery(photo) }}
                whileHover={{ scale: 0.985 }}
                className={`group relative overflow-hidden rounded-2xl text-left ${index === 0 ? 'row-span-2 md:row-span-3' : ''} ${index === 1 ? 'md:row-span-2' : ''} ${index === 2 ? 'md:col-span-2' : ''} ${index === 3 ? 'row-span-2' : ''}`}
              >
                <img src={photo.src} alt={photo.alt} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105 group-hover:opacity-80" />
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
            <motion.div initial={{ scale: 0.96 }} animate={{ scale: 1 }} exit={{ scale: 0.96 }} className="relative max-h-[90svh] max-w-6xl" onClick={(event) => event.stopPropagation()}>
              <img src={activeGallery.src} alt={activeGallery.alt} className="max-h-[82svh] w-auto max-w-full rounded-2xl object-contain" />
              <button ref={galleryCloseRef} type="button" aria-label="Close gallery" onClick={() => setActiveGallery(null)} className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-forest-dark/80 text-2xl text-cream transition hover:bg-sun hover:text-forest">×</button>
              <p className="mt-3 text-sm text-cream/70">{activeGallery.alt}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6 · Reviews (single testimonial section with video) */}
      <section aria-label="Guest testimonials" className="bg-white py-16 md:py-24">
        <div className="wrap grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          <Reveal className="flex min-h-[28rem] flex-col">
            <p className="label">Testimonials</p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-[0.96] tracking-[-0.045em] text-forest sm:text-5xl">
              What guests say.
            </h2>
            <span className="mt-6 block font-display text-6xl leading-none text-sun-text">“</span>
            <AnimatePresence mode="wait">
              <motion.div key={quote.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
                <blockquote className="mt-2 max-w-xl font-display text-2xl leading-[1.12] tracking-[-0.03em] text-forest sm:text-3xl">
                  {quote.text}
                </blockquote>
                <div className="mt-6 flex items-center gap-4">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-sun font-display text-lg font-semibold text-forest">{quote.name.charAt(0)}</span>
                  <div>
                    <p className="font-semibold text-forest">{quote.name}</p>
                    <p className="text-xs text-forest/60">{quote.source} · {'★'.repeat(quote.rating)}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="mt-auto flex gap-3 pt-8">
              <button type="button" onClick={() => changeReview(-1)} aria-label="Previous testimonial" className="grid h-11 w-11 place-items-center rounded-full border border-forest/20 text-forest transition hover:bg-forest hover:text-cream">←</button>
              <button type="button" onClick={() => changeReview(1)} aria-label="Next testimonial" className="grid h-11 w-11 place-items-center rounded-full border border-forest/20 text-forest transition hover:bg-forest hover:text-cream">→</button>
            </div>
          </Reveal>

          <Reveal delay={0.12} className="relative min-h-[24rem] overflow-hidden rounded-2xl bg-forest-dark sm:min-h-[30rem]">
            <video autoPlay muted playsInline loop preload="metadata" poster="/images/day-aerial.webp" className="absolute inset-0 h-full w-full object-cover">
              <source src="/videos/stock-hero.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-forest-dark/20" />
            <div className="absolute inset-x-5 bottom-5 flex items-center justify-between gap-4 text-cream sm:inset-x-7 sm:bottom-7">
              <p className="text-xs font-bold uppercase tracking-[0.15em]">A little more room to breathe</p>
              <span className="grid h-11 w-11 place-items-center rounded-full border border-white/60 bg-white/90 text-forest" aria-hidden="true">▶</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 7 · Location, Map & FAQ */}
      <section className="bg-white py-16 md:py-24">
        <div className="wrap grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-16">
          <Reveal>
            <p className="label">Location &amp; map</p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-none tracking-[-0.04em] text-forest sm:text-5xl">
              Easy to reach, above it all.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-forest/75">
              {site.address}
            </p>
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
              <Button href={waLink("Hello G'Host Villa! Could you share directions to the villa?")} variant="outline" arrow={false} className="w-full">
                <span className="inline-flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Ask on WhatsApp</span>
                </span>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="label">Need to know</p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-none tracking-[-0.04em] text-forest sm:text-5xl">
              Quick answers.
            </h2>
            <div className="mt-6 divide-y divide-forest/15 border-y border-forest/15">
              {faqs.slice(0, 4).map((faq) => (
                <details key={faq.q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-semibold text-forest">
                    <span>{faq.q}</span>
                    <span className="text-xl transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="max-w-2xl pt-3 text-sm leading-relaxed text-forest/70">{faq.a}</p>
                </details>
              ))}
            </div>
            <div className="mt-6"><TextLink href="/faq">Read all FAQs</TextLink></div>
          </Reveal>
        </div>
      </section>

      {/* Final Call to Action */}
      <div className="pt-14 md:pt-20">
        <CtaBanner />
      </div>
    </div>
  )
}
