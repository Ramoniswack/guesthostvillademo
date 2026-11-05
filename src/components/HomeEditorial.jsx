'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { faqs } from '../data/faq.js'
import { rooms } from '../data/rooms.js'
import { reviews } from '../data/reviews.js'
import { stats, waLink } from '../data/site.js'
import { gallery } from '../data/gallery.js'
import { ArrowCircle, Button, Reveal } from './ui.jsx'

const spaces = [
  { label: 'Mountain view', title: 'Wake up to the Annapurna range.', text: 'A quiet hilltop room with a private balcony, warm timber details and the valley opening out below.', image: '/images/room-couple.webp', meta: 'Phewa Valley · 1–2 guests', href: '/rooms' },
  { label: 'City view', title: 'Above Pokhara, away from the noise.', text: 'Look across the green hills and city lights from a relaxed base made for slow mornings and long dinners.', image: '/images/day-aerial.webp', meta: 'Sarangkot · 20 mins from Lakeside', href: '/rooms' },
  { label: 'Couple suite', title: 'A little more room for two.', text: 'Private, warm and unhurried—designed for the kind of stay where breakfast can wait.', image: '/images/room-deluxe.webp', meta: 'Couple Deluxe · breakfast included', href: '/rooms' },
]

const experiences = [
  {
    number: '01',
    title: 'Stay above the city',
    text: 'Private balconies, warm timber rooms and the kind of quiet that makes a weekend feel longer.',
    image: '/images/room-couple.webp',
    href: '/rooms',
    link: 'Explore rooms',
  },
  {
    number: '02',
    title: 'Dine at the pyramid',
    text: 'Slow breakfasts, local favourites and sunset drinks in our open-air restro and bar.',
    image: '/images/pyramid.webp',
    href: '/menu',
    link: 'See the menu',
  },
  {
    number: '03',
    title: 'Gather privately',
    text: 'A whole villa, a garden and space for the people you came to celebrate with.',
    image: '/images/garden.webp',
    href: waLink('Hello G\'Host Villa! I would like to plan a group stay or celebration.'),
    link: 'Plan a gathering',
  },
]

const moments = [
  { label: 'After dark', title: 'A villa all to yourselves.', text: 'Come together for a birthday, a reunion or an unhurried weekend with room for every plan.', image: '/images/night-aerial.webp', alt: "G'Host Villa lit up in the evening" },
  { label: 'Slow mornings', title: 'Wake up a little later.', text: 'Wooden rooms, mountain air and nowhere you need to be before breakfast is ready.', image: '/images/room-deluxe.webp', alt: "A room at G'Host Villa" },
  { label: 'Outside days', title: 'Gather in the garden.', text: 'A relaxed setting for shared meals, celebrations and the stories that stretch into evening.', image: '/images/garden.webp', alt: 'Villa garden for gatherings' },
]

function TextLink({ href, children }) {
  const inner = <><span>{children}</span><ArrowCircle /></>
  const className = 'inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.12em] text-forest transition hover:text-sun-dark'
  if (href.startsWith('/')) return <Link href={href} className={className}>{inner}</Link>
  return <a href={href} className={className} target="_blank" rel="noopener noreferrer">{inner}</a>
}

export default function HomeEditorial() {
  const featuredRooms = [rooms[0], rooms[3]]
  const [activeMoment, setActiveMoment] = useState(0)
  const [activeSpace, setActiveSpace] = useState(0)
  const [activeGallery, setActiveGallery] = useState(null)
  const [reviewIndex, setReviewIndex] = useState(0)
  const galleryCloseRef = useRef(null)
  const galleryTriggerRef = useRef(null)
  const moment = moments[activeMoment]
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
      <section className="overflow-hidden bg-cream py-20 md:py-32">
        <div className="wrap grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-20">
          <Reveal className="max-w-xl">
            <p className="label">A hilltop hideaway · Pokhara</p>
            <h2 className="mt-5 font-display text-5xl font-semibold leading-[0.94] tracking-[-0.045em] text-forest sm:text-6xl lg:text-7xl">Stay, dine &amp; gather.</h2>
            <p className="mt-7 text-lg leading-relaxed text-forest/75">G’Host Villa is where mountain air, easy hospitality and a little more room to breathe come together. Check in for a quiet escape or take over the place with your favourite people.</p>
            <div className="mt-9"><Button href="/rooms">Find your stay</Button></div>
          </Reveal>
          <Reveal delay={0.12} className="relative mx-auto w-full max-w-2xl">
            <div className="grid grid-cols-5 gap-3 sm:gap-5">
              <img src="/images/day-aerial.webp" alt="G'Host Villa in the Pokhara hills" className="col-span-3 h-[330px] w-full object-cover sm:h-[440px]" />
              <div className="col-span-2 flex flex-col justify-end gap-3 sm:gap-5">
                <img src="/images/garden.webp" alt="Garden setting at G'Host Villa" className="h-[155px] w-full object-cover sm:h-[205px]" />
                <div className="bg-sun px-5 py-6 text-forest sm:px-7 sm:py-8"><p className="font-display text-3xl leading-none sm:text-4xl">20 min</p><p className="mt-2 text-xs font-bold uppercase tracking-[0.1em]">from Lakeside</p></div>
              </div>
            </div>
            <img src="/images/pyramid.webp" alt="Pyramid restaurant at G'Host Villa" loading="lazy" className="absolute -bottom-8 left-[12%] h-28 w-44 border-[7px] border-cream object-cover sm:h-36 sm:w-56" />
          </Reveal>
        </div>
      </section>

      <section className="border-y border-forest/15 bg-sand py-9 md:py-12">
        <div className="wrap grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, index) => <motion.div key={stat.label} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ delay: index * 0.08, duration: 0.5 }} className={`px-4 py-5 text-center first:pl-0 last:pr-0 md:px-7 ${index % 2 === 1 ? 'border-l border-forest/15' : ''} ${index >= 2 ? 'border-t border-forest/15 md:border-t-0' : ''} ${index > 0 ? 'md:border-l md:border-forest/15' : ''}`}><p className="font-display text-3xl leading-none tracking-[-0.04em] text-forest sm:text-4xl">{stat.value}{stat.suffix}</p><p className="mx-auto mt-3 max-w-32 text-xs font-semibold leading-snug text-forest/65">{stat.label}</p></motion.div>)}
        </div>
      </section>

      <section className="bg-sand py-20 md:py-28">
        <div className="wrap">
          <Reveal className="mb-10 flex flex-col justify-between gap-5 md:mb-12 md:flex-row md:items-end"><div><p className="label">Stay collection</p><h2 className="mt-4 max-w-2xl font-display text-5xl font-semibold leading-[0.94] tracking-[-0.045em] text-forest sm:text-6xl">Find a stay that fits your plans.</h2></div><p className="max-w-sm leading-relaxed text-forest/70">Choose a quiet room for two, a hilltop base or more space for the people you are bringing with you.</p></Reveal>
          <div aria-label="Villa stay options" className="grid gap-5 md:grid-cols-3">
            {spaces.map((item, index) => <button key={item.label} type="button" aria-pressed={activeSpace === index} onClick={() => setActiveSpace(index)} className={`group overflow-hidden border text-left transition duration-300 ${activeSpace === index ? 'border-forest bg-cream shadow-lg shadow-forest/10' : 'border-forest/15 bg-cream/60 hover:-translate-y-1 hover:border-forest/35 hover:bg-cream'}`}>
              <div className="relative aspect-[4/3] overflow-hidden bg-forest-dark"><img src={item.image} alt={item.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-forest-dark/65 via-transparent to-transparent" /><span className={`absolute left-4 top-4 px-3 py-2 text-[0.62rem] font-bold uppercase tracking-[0.13em] ${activeSpace === index ? 'bg-sun text-forest' : 'bg-cream/90 text-forest'}`}>{activeSpace === index ? 'Selected stay' : `0${index + 1}`}</span></div>
              <div className="p-5 sm:p-6"><p className="text-xs font-bold uppercase tracking-[0.14em] text-forest/55">{item.meta}</p><h3 className="mt-3 font-display text-3xl leading-none tracking-[-0.04em] text-forest">{item.label}</h3><p className="mt-3 min-h-[3rem] text-sm leading-relaxed text-forest/70">{item.title}</p><div className="mt-5 flex items-center justify-between gap-3 border-t border-forest/15 pt-4 text-xs font-bold uppercase tracking-[0.1em] text-forest"><span>Explore stay</span><ArrowCircle className={activeSpace === index ? 'bg-sun text-forest' : 'transition group-hover:bg-sun group-hover:text-forest'} /></div></div>
            </button>)}
          </div>
          <Reveal className="mt-5 flex flex-col gap-5 border border-forest/15 bg-cream p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-sun-dark">Your selected stay</p><p className="mt-2 font-display text-2xl leading-none text-forest">{space.title}</p><p className="mt-2 max-w-2xl text-sm leading-relaxed text-forest/65">{space.text}</p></div><TextLink href={space.href}>See stay options</TextLink></Reveal>
        </div>
      </section>

      <section className="bg-cream py-20 md:py-32">
        <div className="wrap">
          <Reveal className="mb-12 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end">
            <div><p className="label">Private celebrations · shared moments</p><h2 className="mt-4 max-w-2xl font-display text-5xl font-semibold leading-[0.96] tracking-[-0.045em] text-forest sm:text-6xl">Celebrate and party in a dream villa.</h2></div>
            <p className="max-w-sm leading-relaxed text-forest/70">Stay the night, come hungry or bring the whole crew. Every reason to visit gets its own beautiful corner.</p>
          </Reveal>
          <div className="grid gap-7 md:grid-cols-3">
            {experiences.map((item, index) => <Reveal key={item.title} delay={index * 0.1} className="group">
              <article className="h-full overflow-hidden bg-sand transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-forest/10 focus-within:-translate-y-1 focus-within:shadow-xl focus-within:shadow-forest/10">
                <div className="relative overflow-hidden"><img src={item.image} alt="" loading="lazy" className="h-72 w-full object-cover transition duration-700 group-hover:scale-105" /><span className="absolute left-5 top-5 bg-cream px-3 py-2 text-xs font-bold tracking-[0.15em] text-forest">{item.number}</span></div>
                <div className="flex min-h-64 flex-col p-7"><h3 className="font-display text-3xl leading-none tracking-[-0.035em] text-forest">{item.title}</h3><p className="mt-4 leading-relaxed text-forest/70">{item.text}</p><div className="mt-auto pt-7"><TextLink href={item.href}>{item.link}</TextLink></div></div>
              </article>
            </Reveal>)}
          </div>
        </div>
      </section>

      <section className="bg-forest-dark px-6 py-20 text-cream md:py-28">
        <div className="mx-auto max-w-[1440px]">
          <Reveal className="mb-10 flex flex-col justify-between gap-5 md:mb-14 md:flex-row md:items-end"><div><p className="label !text-sun">Villa experiences</p><h2 className="mt-4 max-w-2xl font-display text-5xl font-semibold leading-[0.94] tracking-[-0.045em] text-cream sm:text-6xl">A little more colour for your stay.</h2></div><p className="max-w-sm leading-relaxed text-cream/65">Tap any moment to see it closer—from quiet corners to the nights everyone talks about later.</p></Reveal>
          <div aria-label="Villa gallery" className="grid auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[190px] sm:gap-5 md:grid-cols-4"><>{gallery.slice(0, 6).map((photo, index) => <motion.button key={photo.src} type="button" onClick={(event) => { galleryTriggerRef.current = event.currentTarget; setActiveGallery(photo) }} whileHover={{ scale: 0.985 }} className={`group relative overflow-hidden text-left ${index === 0 ? 'row-span-2 md:row-span-3' : ''} ${index === 1 ? 'md:row-span-2' : ''} ${index === 2 ? 'md:col-span-2' : ''} ${index === 3 ? 'row-span-2' : ''}`}><img src={photo.src} alt={photo.alt} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105 group-hover:opacity-80" /><span className="absolute inset-x-3 bottom-3 translate-y-3 text-xs font-bold uppercase tracking-[0.14em] text-white opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100 sm:inset-x-5 sm:bottom-5">View moment <span aria-hidden="true">↗</span></span></motion.button>)}</></div>
        </div>
      </section>

      <AnimatePresence>{activeGallery && <motion.div className="fixed inset-0 z-50 grid place-items-center bg-forest-dark/95 p-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Expanded gallery image" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveGallery(null)}><motion.div initial={{ scale: 0.96 }} animate={{ scale: 1 }} exit={{ scale: 0.96 }} className="relative max-h-[90svh] max-w-6xl" onClick={(event) => event.stopPropagation()}><img src={activeGallery.src} alt={activeGallery.alt} className="max-h-[82svh] w-auto max-w-full object-contain" /><button ref={galleryCloseRef} type="button" aria-label="Close gallery" onClick={() => setActiveGallery(null)} className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-forest-dark/80 text-2xl text-cream transition hover:bg-sun hover:text-forest">×</button><p className="mt-3 text-sm text-cream/70">{activeGallery.alt}</p></motion.div></motion.div>}</AnimatePresence>

      <section aria-label="Guest testimonials" className="bg-cream py-20 md:py-28">
        <div className="wrap grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
          <Reveal className="flex min-h-[34rem] flex-col"><p className="label">Testimonials</p><h2 className="mt-5 font-display text-5xl font-semibold leading-[0.94] tracking-[-0.045em] text-forest sm:text-6xl">What they say.</h2><span className="mt-10 block font-display text-7xl leading-none text-sun-text">“</span><AnimatePresence mode="wait"><motion.div key={quote.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}><blockquote className="mt-2 max-w-xl font-display text-3xl leading-[1.05] tracking-[-0.035em] text-forest sm:text-4xl">{quote.text}</blockquote><p className="mt-6 max-w-lg leading-relaxed text-forest/65">A stay that felt easy from the first welcome—warm rooms, thoughtful hosting and the hills right outside.</p><div className="mt-8 flex items-center gap-4"><span className="grid h-12 w-12 place-items-center rounded-full bg-sun font-display text-xl text-forest">{quote.name.charAt(0)}</span><div><p className="font-semibold text-forest">{quote.name}</p><p className="text-sm text-forest/55">{quote.source} · {'★'.repeat(quote.rating)}</p></div></div></motion.div></AnimatePresence><div className="mt-auto flex gap-3 pt-10"><button type="button" onClick={() => changeReview(-1)} aria-label="Previous testimonial" className="grid h-11 w-11 place-items-center rounded-full border border-forest/20 text-forest transition hover:bg-forest hover:text-cream">←</button><button type="button" onClick={() => changeReview(1)} aria-label="Next testimonial" className="grid h-11 w-11 place-items-center rounded-full border border-forest/20 text-forest transition hover:bg-forest hover:text-cream">→</button></div></Reveal>
          <Reveal delay={0.12} className="relative min-h-[28rem] overflow-hidden bg-forest-dark sm:min-h-[34rem]"><video autoPlay muted playsInline loop preload="metadata" poster="/images/day-aerial.webp" className="absolute inset-0 h-full w-full object-cover"><source src="/videos/stock-hero.mp4" type="video/mp4" /></video><div className="absolute inset-0 bg-forest-dark/20" /><div className="absolute inset-x-5 bottom-5 flex items-center justify-between gap-4 text-cream sm:inset-x-7 sm:bottom-7"><p className="text-xs font-bold uppercase tracking-[0.15em]">A little more room to breathe</p><span className="grid h-11 w-11 place-items-center rounded-full border border-white/60 bg-cream/90 text-forest" aria-hidden="true">▶</span></div></Reveal>
        </div>
      </section>

      <section className="bg-forest-dark px-6 py-20 text-cream md:py-32">
        <Reveal className="mx-auto max-w-5xl text-center"><p className="label !text-sun">Made for the moments between plans</p><h2 className="mt-6 font-display text-5xl font-semibold leading-[0.94] tracking-[-0.05em] sm:text-7xl lg:text-8xl">Less rushing.<br />More remembering.</h2><p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-cream/75">Wake up with the hills, linger over breakfast, then let the day decide what it wants to be.</p><div className="mt-9"><Button href={waLink('Hello G\'Host Villa! I would like to plan a stay.')}>Plan your escape</Button></div></Reveal>
      </section>

      <section className="bg-cream py-20 md:py-32">
        <div className="wrap">
          <Reveal className="mb-12 flex flex-col gap-5 md:mb-16 md:flex-row md:items-end md:justify-between"><div><p className="label">Sleep in</p><h2 className="mt-4 font-display text-5xl font-semibold leading-[0.96] tracking-[-0.045em] text-forest sm:text-6xl">Rooms made for slow mornings</h2></div><TextLink href="/rooms">View all rooms</TextLink></Reveal>
          <div className="grid gap-6 lg:grid-cols-2">
            {featuredRooms.map((room, index) => <Reveal key={room.id} delay={index * 0.12}><article className="group grid overflow-hidden bg-sand sm:grid-cols-2"><img src={room.image} alt={room.alt} loading="lazy" className="h-64 w-full object-cover transition duration-700 group-hover:scale-105 sm:h-full" /><div className="flex min-h-72 flex-col p-7 sm:p-9"><p className="label">From NPR {room.price?.toLocaleString?.() ?? room.price} / {room.rateType}</p><h3 className="mt-4 font-display text-3xl leading-none tracking-[-0.035em] text-forest">{room.name}</h3><p className="mt-4 line-clamp-3 leading-relaxed text-forest/70">{room.blurb}</p><div className="mt-auto pt-8"><TextLink href="/rooms">Discover room</TextLink></div></div></article></Reveal>)}
          </div>
        </div>
      </section>

      <section className="bg-sand py-20 md:py-32">
        <div className="wrap grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <Reveal><AnimatePresence mode="wait"><motion.div key={moment.image} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45 }}><p className="label">Come as you are</p><h2 className="mt-4 font-display text-5xl font-semibold leading-[0.96] tracking-[-0.045em] text-forest sm:text-6xl">{moment.title}</h2><p className="mt-6 max-w-md text-lg leading-relaxed text-forest/75">{moment.text}</p><div className="mt-8"><Button variant="outline" href={waLink('Hello G\'Host Villa! I would like to enquire about a private event or group stay.')}>Ask about groups</Button></div></motion.div></AnimatePresence></Reveal>
          <Reveal delay={0.12} className="relative overflow-hidden bg-forest-dark"><AnimatePresence mode="wait"><motion.img key={moment.image} src={moment.image} alt={moment.alt} loading="lazy" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.99 }} transition={{ duration: 0.45 }} className="h-[420px] w-full object-cover sm:h-[500px]" /></AnimatePresence><div aria-label="Choose a villa moment" className="absolute inset-x-4 bottom-4 flex gap-2 overflow-x-auto">{moments.map((item, index) => <button key={item.label} type="button" aria-pressed={activeMoment === index} onClick={() => setActiveMoment(index)} className={`shrink-0 px-4 py-3 text-xs font-bold uppercase tracking-[0.1em] transition ${activeMoment === index ? 'bg-sun text-forest' : 'bg-forest-dark/75 text-cream backdrop-blur hover:bg-cream hover:text-forest'}`}>{item.label}</button>)}</div></Reveal>
        </div>
      </section>

      <section className="bg-cream py-20 md:py-32">
        <div className="wrap grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <Reveal><p className="label">Guest notes</p><div aria-label="Guest review carousel"><AnimatePresence mode="wait"><motion.div key={quote.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}><blockquote className="mt-5 font-display text-4xl leading-[1.02] tracking-[-0.04em] text-forest sm:text-5xl">“{quote.short}”</blockquote><p className="mt-7 font-semibold text-forest">{quote.name} <span className="font-normal text-forest/60">· {quote.source}</span></p><p className="mt-3 text-sun-dark">{'★'.repeat(quote.rating)}</p></motion.div></AnimatePresence><div className="mt-7 flex gap-3"><button type="button" onClick={() => changeReview(-1)} aria-label="Previous guest review" className="grid h-11 w-11 place-items-center border border-forest/25 text-forest transition hover:bg-forest hover:text-cream"><span aria-hidden="true">←</span></button><button type="button" onClick={() => changeReview(1)} aria-label="Next guest review" className="grid h-11 w-11 place-items-center border border-forest/25 text-forest transition hover:bg-forest hover:text-cream"><span aria-hidden="true">→</span></button></div></div></Reveal>
          <Reveal delay={0.12}><p className="label">Need to know</p><h2 className="mt-4 font-display text-4xl font-semibold leading-none tracking-[-0.04em] text-forest sm:text-5xl">A few quick answers.</h2><div className="mt-7 divide-y divide-forest/15 border-y border-forest/15">{faqs.slice(0, 3).map((faq) => <details key={faq.q} className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-semibold text-forest"><span>{faq.q}</span><span className="text-xl transition group-open:rotate-45">+</span></summary><p className="max-w-2xl pt-4 leading-relaxed text-forest/70">{faq.a}</p></details>)}</div><div className="mt-7"><TextLink href="/faq">Read all FAQs</TextLink></div></Reveal>
        </div>
      </section>
    </div>
  )
}
