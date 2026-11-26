'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, animate, motion, useMotionValue, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight, Bath, BedDouble, Check, CheckCheck, Coffee, ListChecks, MapPin, MessageCircle, Minus, Phone, Plus, ShieldCheck, Utensils, Wifi,
} from 'lucide-react'
import { useKitchenStatus } from '../lib/kitchen.js'

const ease = [0.22, 1, 0.36, 1]

/* ------------------------------------------------------------------ */
/*  Shared: scroll position drives which step is active                 */
/* ------------------------------------------------------------------ */

function useScrollSteps(ref, n) {
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [index, setIndex] = useState(0)
  const pick = (v) => Math.max(0, Math.min(n - 1, Math.floor(v * n)))
  useMotionValueEvent(scrollYProgress, 'change', (v) => setIndex(pick(v)))
  useEffect(() => { setIndex(pick(scrollYProgress.get())) }, []) // eslint-disable-line react-hooks/exhaustive-deps
  // 0 to 1 inside the current step
  const seg = useTransform(scrollYProgress, (v) => {
    const x = Math.min(Math.max(v, 0), 0.9999) * n
    return x - Math.floor(x)
  })
  const jumpTo = (i) => {
    const el = ref.current
    if (!el) return
    const top = window.scrollY + el.getBoundingClientRect().top
    const range = el.offsetHeight - window.innerHeight
    window.scrollTo({ top: top + range * ((i + 0.5) / n), behavior: 'smooth' })
  }
  return { index, seg, progress: scrollYProgress, jumpTo }
}

/* ------------------------------------------------------------------ */
/*  1 · Every package includes: scroll to move through the six items   */
/* ------------------------------------------------------------------ */

const includes = [
  { id: 'private', icon: BedDouble, title: 'Private room or floor', image: '/images/pyramid.webp',
    text: 'Your own space — a room, a full floor, or the entire estate. No shared dorms.',
    chips: ['A room', 'A full floor', 'The entire estate'] },
  { id: 'breakfast', icon: Coffee, title: 'Daily breakfast', image: '/images/garden.webp',
    text: 'Freshly cooked breakfast every morning at the Pyramid Restro, included in every stay.',
    chips: ['Every morning', 'Pyramid Restro'] },
  { id: 'water', icon: Bath, title: 'Hot water, 24/7', image: '/images/room-deluxe.webp',
    text: 'Attached bathrooms with continuous hot water across all rooms and floors.',
    chips: ['24/7', 'All rooms & floors'] },
  { id: 'wifi', icon: Wifi, title: 'Free Wi-Fi & parking', image: '/images/day-aerial.webp',
    text: 'High-speed Wi-Fi throughout both buildings and free parking for cars and bikes.',
    chips: ['Both buildings', 'Cars & bikes'] },
  { id: 'restro', icon: Utensils, title: 'Pyramid Restro access', image: '/images/night-aerial.webp',
    text: 'Open daily 7 AM–10 PM for Nepali, Newari, wood-fired plates and evening drinks.', live: 'kitchen' },
  { id: 'cancel', icon: ShieldCheck, title: 'Free cancellation', image: '/images/hero.webp',
    text: 'Cancel free within 48 hours of booking, as long as check-in is 24+ hours away.', live: 'timeline' },
]

function KitchenPill({ light = false }) {
  const status = useKitchenStatus()
  if (!status) return <span className="inline-block h-9" aria-hidden="true" />
  return (
    <span className={`t-small inline-flex items-center gap-2.5 rounded-full px-4 py-2 font-medium ${light ? 'bg-forest/[0.07] text-forest' : 'bg-white/15 text-white backdrop-blur'}`}>
      <span className="relative flex h-2.5 w-2.5">
        {status.open && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70 motion-reduce:hidden" />}
        <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${status.open ? 'bg-emerald-400' : 'bg-amber-400'}`} />
      </span>
      {status.label}
    </span>
  )
}

function CancelSteps() {
  const steps = ['You book', '48 hours to cancel free', 'Check-in 24h+ away']
  return (
    <ol className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-0">
      {steps.map((st, i) => (
        <li key={st} className="flex items-center gap-4 sm:flex-1 sm:flex-col sm:items-start sm:gap-4 sm:pr-5">
          <span className="flex items-center sm:w-full">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-sm font-semibold text-forest-dark">{i + 1}</span>
            {i < steps.length - 1 && <span className="ml-4 hidden h-px flex-1 bg-white/30 sm:block" aria-hidden="true" />}
          </span>
          <span className="text-base leading-snug text-white/90">{st}</span>
        </li>
      ))}
    </ol>
  )
}

export function IncludesExplorer() {
  const by = Object.fromEntries(includes.map((i) => [i.id, i]))
  const fade = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.6, delay, ease },
  })
  const hero = by.private
  const cancel = by.cancel
  const HeroIcon = hero.icon
  const CancelIcon = cancel.icon

  return (
    <section className="border-t border-forest/10 bg-white section-y">
      <div className="wrap">
        <motion.header {...fade()} className="head-gap max-w-2xl">
          <p className="label">Every package includes</p>
          <h2 className="type-section font-display font-semibold text-forest">What you always get.</h2>
          <p className="mt-4 text-base leading-relaxed text-forest/70 md:text-lg">
            No matter which package you choose — couple stay, group weekend, or full buyout — these come with every booking.
          </p>
        </motion.header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-4">
          {/* Feature tile: private space */}
          <motion.div {...fade()} className="group relative min-h-[18rem] overflow-hidden rounded-3xl bg-forest-dark sm:min-h-[22rem] md:col-span-2 lg:row-span-2 lg:min-h-[26rem]">
            <img src={hero.image} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-[1200ms] group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/90 via-forest-dark/35 to-transparent" aria-hidden="true" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
              <HeroIcon className="h-8 w-8" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="mt-4 font-display text-xl font-semibold leading-tight sm:text-2xl md:text-3xl">{hero.title}</h3>
              <p className="mt-3 max-w-md text-base leading-relaxed text-white/85">{hero.text}</p>
            </div>
          </motion.div>

          {/* Four quiet tiles */}
          {['breakfast', 'water', 'wifi', 'restro'].map((id, i) => {
            const it = by[id]
            const Ico = it.icon
            return (
              <motion.div key={id} {...fade(0.08 * (i + 1))} className="flex flex-col rounded-3xl bg-forest/[0.045] p-5 sm:p-6 lg:p-7 transition-colors hover:bg-forest/[0.075]">
                <Ico className="h-7 w-7 text-forest md:h-8 md:w-8" strokeWidth={1.5} aria-hidden="true" />
                <h3 className="mt-4 text-base font-semibold leading-snug text-forest sm:text-lg">{it.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-forest/70">{it.text}</p>
                {it.live === 'kitchen' && <div className="mt-5"><KitchenPill light /></div>}
              </motion.div>
            )
          })}

          {/* Free cancellation, full width */}
          <motion.div {...fade()} className="grid gap-6 rounded-3xl bg-forest-dark p-6 text-white sm:p-8 md:col-span-2 md:gap-8 lg:col-span-4 lg:grid-cols-[1fr_1.3fr] lg:items-center lg:gap-12 lg:p-10">
            <div>
              <CancelIcon className="h-8 w-8" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="mt-4 font-display text-xl font-semibold leading-tight sm:text-2xl md:text-3xl">{cancel.title}</h3>
              <p className="mt-3 max-w-md text-base leading-relaxed text-white/80">{cancel.text}</p>
            </div>
            <CancelSteps />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  2 · How to book: scroll through the three steps                    */
/* ------------------------------------------------------------------ */

const stays = ['Couple stay', 'Group weekend', 'Full villa buyout']
const steps = [
  { icon: ListChecks, title: 'Pick your package', text: 'Choose the couple stay, group weekend, or full villa buyout that fits your group size and budget.' },
  { icon: MessageCircle, title: 'Send a quick WhatsApp', text: 'Message us directly — tell us your dates, guest count, and any extras.' },
  { icon: MapPin, title: 'Arrive & enjoy', text: 'No prepayment needed. Our on-site Sarangkot team will confirm your stay and have everything ready.' },
]

function Typing() {
  return (
    <div className="flex w-fit items-center gap-1 rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm" aria-label="Typing">
      {[0, 1, 2].map((d) => (
        <motion.span key={d} className="h-2 w-2 rounded-full bg-forest/40" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: d * 0.15 }} />
      ))}
    </div>
  )
}

export function BookingFlow({ whatsapp, tel }) {
  const sectionRef = useRef(null)
  const { index: step, progress, jumpTo } = useScrollSteps(sectionRef, steps.length)
  const [stay, setStay] = useState(stays[1])
  const [guests, setGuests] = useState(6)
  const [typing, setTyping] = useState(false)

  useEffect(() => {
    if (step === 0) { setTyping(false); return undefined }
    setTyping(true)
    const t = setTimeout(() => setTyping(false), 1000)
    return () => clearTimeout(t)
  }, [step])

  const message = `Hello G'Host Villa! I'd like to plan a ${stay.toLowerCase()} package for ${guests} ${guests === 1 ? 'guest' : 'guests'}.`
  const pill = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-base font-semibold transition active:scale-[0.98]'

  return (
    <section className="bg-forest/[0.05]">
      <div ref={sectionRef} className="relative" style={{ height: `calc(100svh + ${steps.length * 50}svh)` }}>
        <div className="sticky top-[4.5rem] flex h-[calc(100svh-8rem)] items-center py-3 md:h-[calc(100svh-4.5rem)] md:py-8">
          <div className="wrap grid w-full items-center gap-4 lg:grid-cols-[1fr_23rem] lg:gap-20">
            <div>
              <p className="label !mb-1">Simple process</p>
              <h2 className="type-section font-display font-semibold text-forest">How to book your stay.</h2>
              <p className="t-lead mt-3 hidden max-w-xl text-forest/70 md:block">
                No online payment forms, no hidden fees. Just a quick WhatsApp message and we handle the rest.
              </p>

              <ol className="relative mt-4 grid grid-cols-3 gap-2 lg:mt-8 lg:block lg:space-y-1">
                <span className="absolute bottom-8 left-[1.375rem] top-8 hidden w-px bg-forest/15 lg:block" aria-hidden="true" />
                <motion.span style={{ scaleY: progress }} className="absolute bottom-8 left-[1.375rem] top-8 hidden w-px origin-top bg-forest lg:block" aria-hidden="true" />
                {steps.map((st, i) => {
                  const active = i === step
                  const done = i < step
                  return (
                    <li key={st.title} className="relative">
                      <button
                        type="button"
                        onClick={() => jumpTo(i)}
                        aria-current={active ? 'step' : undefined}
                        className={`relative flex w-full flex-col items-center gap-2 rounded-2xl p-2.5 text-center transition-colors lg:flex-row lg:items-start lg:gap-4 lg:p-3 lg:text-left ${active ? 'bg-white shadow-soft' : 'hover:bg-white/60'}`}
                      >
                        <span className={`relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full text-forest-dark transition-colors ${active ? 'bg-sun' : 'bg-white ring-1 ring-forest/15'}`}>
                          {done ? <Check className="h-5 w-5" aria-hidden="true" /> : <st.icon className="h-5 w-5" aria-hidden="true" />}
                        </span>
                        <span>
                          <span className="block text-[0.9375rem] font-semibold leading-tight text-forest lg:type-item lg:font-display">{st.title}</span>
                          <span className={`t-body mt-1 hidden transition-colors lg:block ${active ? 'text-forest/80' : 'text-forest/55'}`}>{st.text}</span>
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ol>
            </div>

            {/* Phone */}
            <div className="mx-auto w-full max-w-sm">
              <div className="overflow-hidden rounded-[2rem] bg-[#ECE5DD] text-forest shadow-2xl ring-1 ring-forest/10">
                <div className="flex items-center gap-3 bg-leaf px-4 py-2.5 text-white sm:py-3">
                  <img src="/images/logo-icon.webp" alt="" className="h-9 w-9 rounded-full bg-white object-contain p-1" />
                  <div className="leading-tight">
                    <p className="text-base font-semibold">G’Host Villa</p>
                    <p className="t-small text-white/80">Sarangkot team</p>
                  </div>
                </div>

                <div className="min-h-[12.5rem] space-y-3 p-4 sm:min-h-[18rem]">
                  <AnimatePresence mode="wait" initial={false}>
                    {step === 0 && (
                      <motion.div key="s0" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="space-y-3 sm:space-y-4">
                        <div>
                          <p className="t-small mb-2 font-medium text-forest/70">Choose your stay</p>
                          <div className="flex flex-wrap gap-2" role="group" aria-label="Choose your stay">
                            {stays.map((s) => (
                              <button key={s} type="button" aria-pressed={stay === s} onClick={() => setStay(s)} className={`t-small min-h-11 rounded-full px-4 font-semibold transition-colors ${stay === s ? 'bg-forest text-white' : 'bg-white text-forest hover:bg-white/70'}`}>
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <p className="t-small font-medium text-forest/70">How many guests?</p>
                          <div className="inline-flex items-center rounded-full bg-white">
                            <button type="button" aria-label="Fewer guests" onClick={() => setGuests((g) => Math.max(1, g - 1))} className="grid h-11 w-11 place-items-center rounded-full text-forest-dark hover:bg-forest/5"><Minus className="h-5 w-5" aria-hidden="true" /></button>
                            <span className="min-w-9 text-center text-lg font-semibold tabular-nums" aria-live="polite">{guests}</span>
                            <button type="button" aria-label="More guests" onClick={() => setGuests((g) => Math.min(30, g + 1))} className="grid h-11 w-11 place-items-center rounded-full text-forest-dark hover:bg-forest/5"><Plus className="h-5 w-5" aria-hidden="true" /></button>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {step >= 1 && (
                      <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                        <motion.div initial={{ opacity: 0, y: 12, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.4, ease }} className="ml-auto max-w-[88%] rounded-2xl rounded-tr-sm bg-[#DCF8C6] px-4 py-3 text-[0.9375rem] leading-snug shadow-sm">
                          {message}
                          <span className="mt-1 flex items-center justify-end gap-1 text-sm text-forest/60">now <CheckCheck className="h-4 w-4 text-sky-600" aria-hidden="true" /></span>
                        </motion.div>
                        {step === 2 && (typing ? <Typing /> : (
                          <motion.div initial={{ opacity: 0, y: 12, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.4, ease }} className="max-w-[88%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-[0.9375rem] leading-snug shadow-sm">
                            Namaste! No prepayment needed. We’ll confirm your stay and have everything ready for you.
                          </motion.div>
                        ))}
                        {step === 1 && typing && <Typing />}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex flex-col gap-1 border-t border-forest/10 bg-white/60 p-3">
                  {step === 0 && <button type="button" onClick={() => jumpTo(1)} className={`${pill} bg-forest text-white hover:bg-forest-dark`}>Preview my message</button>}
                  {step === 1 && (
                    <>
                      <a href={whatsapp(message)} target="_blank" rel="noopener noreferrer" className={`${pill} bg-sun text-white hover:bg-sun-dark`}><MessageCircle className="h-5 w-5" aria-hidden="true" /> Send on WhatsApp</a>
                      <button type="button" onClick={() => jumpTo(2)} className={`${pill} min-h-11 text-forest hover:bg-forest/5`}>See what happens next</button>
                    </>
                  )}
                  {step === 2 && (
                    <>
                      <a href={whatsapp(message)} target="_blank" rel="noopener noreferrer" className={`${pill} bg-sun text-white hover:bg-sun-dark`}><MessageCircle className="h-5 w-5" aria-hidden="true" /> Start my booking</a>
                      <button type="button" onClick={() => jumpTo(0)} className={`${pill} min-h-11 text-forest hover:bg-forest/5`}>Start over</button>
                    </>
                  )}
                </div>
              </div>
              <p className="t-small mt-2 text-center text-forest/60">Example chat · scroll for the next step</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick CTA row */}
      <div className="wrap section-pb">
        <div className="flex flex-col gap-5 rounded-3xl bg-forest-dark p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="type-sub font-display font-semibold text-white">Ready to plan your stay?</p>
            <p className="t-body mt-1 text-white/75">Message us directly — no booking fees, no prepayment.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href={whatsapp("Hello G'Host Villa! I'd like to plan a package stay.")} target="_blank" rel="noopener noreferrer" className={`${pill} bg-sun text-white hover:bg-sun-dark`}>
              <MessageCircle className="h-5 w-5" aria-hidden="true" /> WhatsApp us
            </a>
            <a href={tel} className={`${pill} bg-white text-forest-dark hover:bg-white/85`}>
              <Phone className="h-5 w-5" aria-hidden="true" /> Call us
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  0 · Package picker: photos, a live price estimate, the day plan    */
/* ------------------------------------------------------------------ */

const digits = (str) => Number(String(str ?? '').replace(/[^\d]/g, '')) || 0
const guestRange = (str) => {
  const m = String(str ?? '').match(/(\d+)\s*[–-]\s*(\d+)/)
  return m ? [Number(m[1]), Number(m[2])] : [1, 30]
}

function CountTo({ value }) {
  const mv = useMotionValue(value)
  const text = useTransform(mv, (v) => Math.round(v).toLocaleString('en-US'))
  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.5, ease })
    return () => controls.stop()
  }, [value, mv])
  return <motion.span>{text}</motion.span>
}

export function PackagePicker({ packages, whatsapp, terms = [] }) {
  const [id, setId] = useState(packages[0]?.id)
  const [guestsById, setGuestsById] = useState({})
  const [shot, setShot] = useState(0)
  const [step, setStep] = useState(0)
  const pkg = packages.find((p) => p.id === id) ?? packages[0]
  if (!pkg) return null

  const [min, rangeMax] = guestRange(pkg.guestsRange)
  const upTo = String(pkg.guestsRange ?? '').match(/up to\s*(\d+)/i)
  const max = upTo ? Number(upTo[1]) : rangeMax
  const fallback = Math.min(max, Math.max(min, Number(pkg.defaultGuests) || min))
  const guests = guestsById[pkg.id] ?? fallback
  const setGuests = (n) => setGuestsById((g) => ({ ...g, [pkg.id]: Math.min(max, Math.max(min, n)) }))
  const perPerson = /per person/i.test(pkg.note || '')
  const rate = digits(pkg.price)
  const gallery = pkg.gallery?.length ? pkg.gallery : [pkg.image]
  const itinerary = pkg.itinerary ?? []
  const message = `Hello G'Host Villa! I'd like to plan the "${pkg.title}" package for ${guests} ${guests === 1 ? 'guest' : 'guests'}.`

  const choose = (nextId) => { setId(nextId); setShot(0); setStep(0) }

  return (
    <div>
      {/* Package switcher: underline tabs, sliding indicator, badge sits inline */}
      <div role="tablist" aria-label="Choose a package" className="mt-3 flex border-b border-forest/15">
        {packages.map((p) => {
          const selected = p.id === pkg.id
          return (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="pkg-panel"
              onClick={() => choose(p.id)}
              className={`relative flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 px-2 py-2.5 text-center transition-colors sm:flex-row sm:gap-2.5 sm:px-6 ${selected ? 'text-forest' : 'text-forest/55 hover:text-forest'}`}
            >
              <span className="text-[0.9375rem] font-semibold leading-tight sm:text-lg">{p.label || p.badge}</span>
              {p.popular && (
                <span className="rounded-full bg-sun/25 px-2 py-0.5 text-[0.75rem] font-semibold leading-tight text-forest-dark">Most popular</span>
              )}
              {selected && <motion.span layoutId="pkg-underline" className="absolute inset-x-2 -bottom-px h-[3px] rounded-full bg-forest" transition={{ duration: 0.4, ease }} />}
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pkg.id}
          id="pkg-panel"
          role="tabpanel"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease }}
          className="mt-8 grid gap-x-10 gap-y-8 md:mt-10 lg:gap-x-12 lg:grid-cols-[1.05fr_1fr] lg:items-start"
        >
          {/* Photos (left, top) */}
          <div className="lg:col-start-1 lg:row-start-1">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-forest-dark lg:aspect-[5/4]">
              <AnimatePresence initial={false}>
                <motion.img
                  key={gallery[shot]}
                  src={gallery[shot]}
                  alt={`${pkg.title}, photo ${shot + 1}`}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ opacity: { duration: 0.5 }, scale: { duration: 1.6, ease } }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
            </div>
            {gallery.length > 1 && (
              <ul className="mt-4 flex gap-3">
                {gallery.map((src, i) => (
                  <li key={src} className="flex-1">
                    <button
                      type="button"
                      onClick={() => setShot(i)}
                      aria-label={`Show photo ${i + 1}`}
                      aria-pressed={i === shot}
                      className={`block aspect-[4/3] w-full overflow-hidden rounded-xl transition ${i === shot ? 'ring-2 ring-forest ring-offset-2' : 'opacity-60 hover:opacity-100'}`}
                    >
                      <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Details (right, spans both rows on desktop; second on phones so the price and button come early) */}
          <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <p className="text-base font-semibold text-sun-text">{pkg.badge}</p>
            <h3 className="type-sub mt-1 font-display font-semibold text-forest">{pkg.title}</h3>
            <p className="mt-4 text-base leading-relaxed text-forest/75">{pkg.intro}</p>

            <dl className="mt-5 grid grid-cols-[4.5rem_1fr] gap-x-4 gap-y-2.5 border-y border-forest/10 py-4 md:mt-6 md:py-5 text-[0.9375rem] leading-snug">
              {pkg.spaceLabel && (<><dt className="font-semibold text-forest">Space</dt><dd className="text-forest/75">{pkg.spaceLabel}</dd></>)}
              {pkg.mealsLabel && (<><dt className="font-semibold text-forest">Meals</dt><dd className="text-forest/75">{pkg.mealsLabel}</dd></>)}
              {pkg.guestsRange && (<><dt className="font-semibold text-forest">Guests</dt><dd className="text-forest/75">{pkg.guestsRange}</dd></>)}
            </dl>

            {/* Guest counter and live estimate */}
            <div className="mt-5 rounded-2xl bg-forest/[0.05] p-4 sm:p-6 md:mt-6">
              <div className="flex items-center justify-between gap-4">
                <p className="text-base font-semibold text-forest">How many guests?</p>
                <div className="inline-flex items-center rounded-full bg-white">
                  <button type="button" aria-label="Fewer guests" onClick={() => setGuests(guests - 1)} disabled={guests <= min} className="grid h-12 w-12 place-items-center rounded-full hover:bg-forest/5 disabled:opacity-30">
                    <Minus className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <span className="min-w-9 text-center text-lg font-semibold tabular-nums" aria-live="polite">{guests}</span>
                  <button type="button" aria-label="More guests" onClick={() => setGuests(guests + 1)} disabled={guests >= max} className="grid h-12 w-12 place-items-center rounded-full hover:bg-forest/5 disabled:opacity-30">
                    <Plus className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
              <div className="mt-4 border-t border-forest/10 pt-4">
                {perPerson && rate > 0 ? (
                  <>
                    <p className="font-display text-4xl font-semibold tracking-[-0.03em] text-forest">
                      <span className="text-xl font-medium text-forest/60">NPR </span><CountTo value={rate * guests} />
                    </p>
                    <p className="mt-1 text-sm leading-snug text-forest/65">Starting estimate: NPR {rate.toLocaleString('en-US')} per person × {guests}. We confirm the final quote on WhatsApp.</p>
                  </>
                ) : (
                  <>
                    <p className="font-display text-3xl font-semibold tracking-[-0.03em] text-forest">{pkg.price}</p>
                    <p className="mt-1 text-sm leading-snug text-forest/65">{pkg.note}</p>
                  </>
                )}
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6 md:mt-6">
              <a href={whatsapp(message)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-sun px-6 text-base font-semibold text-white transition hover:bg-sun-dark active:scale-[0.98]">
                <MessageCircle className="h-5 w-5" aria-hidden="true" /> Plan this on WhatsApp
              </a>
              <Link href={`/packages/${pkg.id}`} className="inline-flex min-h-12 items-center justify-center gap-1.5 text-base font-semibold text-forest underline decoration-sun decoration-2 underline-offset-4">
                Full details <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            {/* Booking terms: icon rows that fill the right column under the price card */}
            {terms.length > 0 && (
              <ul aria-label="Booking terms" className="mt-8 md:mt-10 divide-y divide-forest/10 overflow-hidden rounded-3xl border border-forest/12 bg-white shadow-soft">
                {terms.map(({ Icon, title, text }) => (
                  <li key={title} className="flex items-start gap-4 px-5 py-5 sm:gap-5 sm:px-6 sm:py-6">
                    <Icon className="mt-0.5 h-7 w-7 shrink-0 text-forest" strokeWidth={1.5} aria-hidden="true" />
                    <div>
                      <p className="text-base font-semibold text-forest">{title}</p>
                      <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-forest/70">{text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Day plan (left, below the photos on desktop; last on phones) */}
          {itinerary.length > 0 && (
            <div className="lg:col-start-1 lg:row-start-2">
              <h4 className="type-item font-display font-semibold text-forest">How the stay unfolds</h4>
              <ol className="relative mt-2">
                <span className="absolute bottom-6 left-[5px] top-6 w-px bg-forest/15" aria-hidden="true" />
                {itinerary.map((it, i) => {
                  const open = i === step
                  return (
                    <li key={it.title} className="relative pl-7">
                      <span className={`absolute left-0 top-[1.4rem] h-[11px] w-[11px] rounded-full transition-colors ${i <= step ? 'bg-sun' : 'bg-forest/25'}`} aria-hidden="true" />
                      <button type="button" aria-expanded={open} onClick={() => setStep(i)} className="block min-h-14 w-full py-3 text-left">
                        <span className="block text-sm text-forest/60">{it.time}</span>
                        <span className={`mt-0.5 block text-base leading-snug transition-colors ${open ? 'font-semibold text-forest' : 'text-forest/80'}`}>{it.title}</span>
                      </button>
                      <div className={`grid transition-[grid-template-rows] duration-300 motion-reduce:transition-none ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`} inert={!open}>
                        <p className="overflow-hidden text-[0.9375rem] leading-relaxed text-forest/70"><span className="block pb-3">{it.text}</span></p>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
