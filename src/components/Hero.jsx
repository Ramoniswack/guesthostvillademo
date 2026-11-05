'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Icon, { Stars } from './Icons.jsx'
import { Button, Divider } from './ui.jsx'
import { directionsLink } from '../data/site.js'
import { reviews } from '../data/reviews.js'

const chips = [
  { icon: 'pin', text: 'Sarangkot, Pokhara' },
  { icon: 'utensils', text: 'Restaurant & Bar' },
  { icon: 'bed', text: 'Rooms with breakfast' },
]

const heroMedia = [
  { type: 'video', src: '/videos/hero-pool.mp4', poster: '/images/hero.webp', position: '50% 54%' },
  { type: 'image', src: '/images/hero.webp', position: '52% 62%' },
  { type: 'image', src: '/images/day-aerial.webp', position: '50% 54%' },
  { type: 'image', src: '/images/garden.webp', position: '50% 52%' },
  { type: 'image', src: '/images/pyramid.webp', position: '50% 48%' },
]

export default function Hero() {
  const [i, setI] = useState(0)
  const [heroIndex, setHeroIndex] = useState(0)
  const { scrollY } = useScroll()
  const shouldReduceMotion = useReducedMotion()
  const dragStart = useRef(null)
  const currentMedia = heroMedia[heroIndex]
  const nextSlide = useCallback(() => setHeroIndex((index) => (index + 1) % heroMedia.length), [])
  const previousSlide = useCallback(() => setHeroIndex((index) => (index - 1 + heroMedia.length) % heroMedia.length), [])

  // Headline: fades out and moves up as you scroll
  const headlineY = useTransform(scrollY, [0, 200], [0, -50])
  const headlineOpacity = useTransform(scrollY, [0, 200], [1, 0])

  // Description: fades in and moves up as you scroll
  const descY = useTransform(scrollY, [0, 200], [50, 0])
  const descOpacity = useTransform(scrollY, [0, 200], [0, 1])

  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % reviews.length), 6000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (shouldReduceMotion || currentMedia.type === 'video') return undefined

    let interval
    const start = () => {
      clearInterval(interval)
      interval = setInterval(nextSlide, 3000)
    }
    const handleVisibility = () => {
      if (document.hidden) clearInterval(interval)
      else start()
    }

    start()
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [currentMedia.type, nextSlide, shouldReduceMotion])

  const handlePointerUp = (event) => {
    if (dragStart.current === null) return
    const distance = event.clientX - dragStart.current
    dragStart.current = null
    if (Math.abs(distance) < 48) return
    if (distance < 0) nextSlide()
    else previousSlide()
  }

  const r = reviews[i]

  return (
    <section id="home" data-hero onPointerDown={(event) => { dragStart.current = event.clientX }} onPointerUp={handlePointerUp}
      className="relative isolate flex min-h-[100svh] cursor-grab items-end overflow-hidden bg-forest-dark active:cursor-grabbing">
      <AnimatePresence initial={false}>
        {currentMedia.type === 'video' ? (
          <motion.video key={currentMedia.src} src={currentMedia.src} poster={currentMedia.poster} autoPlay={!shouldReduceMotion} muted playsInline preload="metadata" onEnded={nextSlide} initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: shouldReduceMotion ? 0 : 0.8, ease: 'easeInOut' }} className="absolute inset-0 -z-20 h-full w-full object-cover" style={{ objectPosition: currentMedia.position }} />
        ) : (
          <motion.img key={currentMedia.src} src={currentMedia.src} alt="" aria-hidden="true" fetchPriority="high" initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: shouldReduceMotion ? 0 : 0.8, ease: 'easeInOut' }} className="absolute inset-0 -z-20 h-full w-full object-cover" style={{ objectPosition: currentMedia.position }} />
        )}
      </AnimatePresence>
      {/* soft green gradient + a whisper of warm tint */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-dark/95 via-forest-dark/40 to-forest-dark/5" />
      <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-black/35 to-transparent" />
      <div className="absolute inset-0 -z-10 bg-sun/[0.06]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-dark/45 via-transparent to-transparent" />

      <div className="absolute inset-x-3 top-1/2 z-20 flex -translate-y-1/2 justify-between sm:inset-x-5">
        <button type="button" aria-label="Previous hero slide" onPointerDown={(event) => event.stopPropagation()} onClick={previousSlide} className="grid h-10 w-10 place-items-center border border-white/50 bg-forest-dark/35 text-xl text-white backdrop-blur transition hover:bg-sun hover:text-forest sm:h-12 sm:w-12 sm:text-2xl">←</button>
        <button type="button" aria-label="Next hero slide" onPointerDown={(event) => event.stopPropagation()} onClick={nextSlide} className="grid h-10 w-10 place-items-center border border-white/50 bg-forest-dark/35 text-xl text-white backdrop-blur transition hover:bg-sun hover:text-forest sm:h-12 sm:w-12 sm:text-2xl">→</button>
      </div>

      <div className="wrap relative pb-20 pt-32 md:pb-28">
        <div className="grid items-end gap-12 lg:grid-cols-[1fr_20rem]">
          <div className="max-w-5xl">
            <motion.h1
              className="font-display text-[2.9rem] font-semibold leading-[1.03] text-white sm:text-6xl lg:text-[5.25rem]"
              style={{ letterSpacing: '-0.04em', y: headlineY, opacity: headlineOpacity }}
            >
              Stay, Dine &amp; Breathe Above&nbsp;Pokhara.
            </motion.h1>
            <motion.p
              className="mt-5 max-w-xl text-xl leading-[1.4] text-white/90 md:text-[1.4rem]"
              style={{ y: descY, opacity: descOpacity }}
            >
              A hilltop villa, restaurant and bar in Sarangkot with valley and Himalayan views.
            </motion.p>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-base text-white/90">
              {chips.map((c) => (
                <li key={c.text} className="inline-flex items-center gap-2">
                  <Icon name={c.icon} className="h-5 w-5 text-sun" /> {c.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Rotating "Guests say" card, bottom right on desktop */}
          <aside className="glass hidden -mt-16 mr-8 rounded-[28px] p-6 lg:block self-end" aria-label="Guest review">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white/80">
                Guests say
              </span>
              <Stars />
            </div>
            <div className="mt-3 min-h-[4.5rem]" aria-live="off">
              <AnimatePresence mode="wait">
                <motion.p
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="font-display text-lg font-medium leading-snug text-white"
                >
                  “{r.short}”
                </motion.p>
              </AnimatePresence>
            </div>
            {r.source ? (
              <p className="mt-2 text-xs font-semibold text-sun">{r.source} · 4.5★</p>
            ) : r.placeholder ? (
              <p className="mt-2 text-xs font-semibold text-white/70">Sample review</p>
            ) : null}
          </aside>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0">
        <Divider prev="transparent" next="cream" />
      </div>
    </section>
  )
}
