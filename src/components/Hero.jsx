'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Icon from './Icons.jsx'
import { Button, Divider } from './ui.jsx'

const heroMedia = [
  { type: 'video', src: '/videos/stock-hero.mp4', poster: '/images/hero.webp', position: '50% 54%' },
  { type: 'image', src: '/images/hero.webp', position: '52% 62%' },
  { type: 'image', src: '/images/day-aerial.webp', position: '50% 54%' },
  { type: 'image', src: '/images/garden.webp', position: '50% 52%' },
  { type: 'image', src: '/images/pyramid.webp', position: '50% 48%' },
]

export default function Hero() {
  const [heroIndex, setHeroIndex] = useState(0)
  const { scrollY } = useScroll()
  const shouldReduceMotion = useReducedMotion()
  const dragStart = useRef(null)
  const videoRef = useRef(null)
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

  useEffect(() => {
    if (currentMedia.type === 'video' && !shouldReduceMotion) videoRef.current?.play().catch(() => {})
  }, [currentMedia.type, heroIndex, shouldReduceMotion])

  const handlePointerUp = (event) => {
    if (dragStart.current === null) return
    const distance = event.clientX - dragStart.current
    dragStart.current = null
    if (Math.abs(distance) < 48) return
    if (distance < 0) nextSlide()
    else previousSlide()
  }

  return (
    <section id="home" data-hero onPointerDown={(event) => { dragStart.current = event.clientX }} onPointerUp={handlePointerUp}
      className="relative isolate flex min-h-[100svh] cursor-grab items-end overflow-hidden bg-forest-dark active:cursor-grabbing">
      <AnimatePresence initial={false}>
        {currentMedia.type === 'video' ? (
          <motion.video ref={videoRef} key={currentMedia.src} src={currentMedia.src} poster={currentMedia.poster} autoPlay={!shouldReduceMotion} muted playsInline preload="auto" onEnded={nextSlide} initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: shouldReduceMotion ? 0 : 0.8, ease: 'easeInOut' }} className="absolute inset-0 -z-20 h-full w-full object-cover" style={{ objectPosition: currentMedia.position }} />
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
        <button type="button" aria-label="Previous hero slide" onPointerDown={(event) => event.stopPropagation()} onClick={previousSlide} className="grid h-10 w-10 place-items-center border border-white/50 bg-forest-dark/35 text-white backdrop-blur transition hover:bg-sun hover:text-forest sm:h-12 sm:w-12"><Icon name="chevronL" className="h-5 w-5" /></button>
        <button type="button" aria-label="Next hero slide" onPointerDown={(event) => event.stopPropagation()} onClick={nextSlide} className="grid h-10 w-10 place-items-center border border-white/50 bg-forest-dark/35 text-white backdrop-blur transition hover:bg-sun hover:text-forest sm:h-12 sm:w-12"><Icon name="chevronR" className="h-5 w-5" /></button>
      </div>

      <div className="wrap relative flex min-h-[100svh] select-none items-center justify-center py-32 text-center">
          <div className="max-w-5xl">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-sun">Sarangkot, Pokhara · Nepal</p>
            <motion.h1
              className="mt-6 font-display text-5xl font-semibold leading-[0.92] text-white sm:text-7xl lg:text-[7rem]"
              style={{ letterSpacing: '-0.04em', y: headlineY, opacity: headlineOpacity }}
            >
              Your private space.<br />Hosted your way.
            </motion.h1>
            <motion.p
              className="mx-auto mt-6 max-w-xl text-lg leading-[1.4] text-white/85 md:text-xl"
              style={{ y: descY, opacity: descOpacity }}
            >
              A hilltop villa, restro and bar made for quiet stays, big gatherings and slow Pokhara days.
            </motion.p>
            <div className="mt-9" onPointerDown={(event) => event.stopPropagation()}><Button href="/rooms" className="!rounded-none">Find your stay</Button></div>
          </div>
      </div>

      <div className="absolute inset-x-0 bottom-0">
        <Divider prev="transparent" next="cream" />
      </div>
    </section>
  )
}
