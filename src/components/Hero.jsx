'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Icon from './Icons.jsx'
import { Button } from './ui.jsx'
import { useBackendData } from '../lib/backend.jsx'

const heroMedia = [
  { type: 'video', src: '/videos/stock-hero.mp4', poster: '/images/hero.webp', position: '50% 54%' },
  { type: 'image', src: '/images/hero.webp', position: '52% 62%' },
  { type: 'image', src: '/images/day-aerial.webp', position: '50% 54%' },
  { type: 'image', src: '/images/garden.webp', position: '50% 52%' },
  { type: 'image', src: '/images/pyramid.webp', position: '50% 48%' },
]

const CURTAIN_COLS = 6

export default function Hero() {
  const backend = useBackendData()
  const heroContent = backend?.home?.hero
  const slides = heroContent?.slides?.length ? heroContent.slides : heroMedia
  const [heroIndex, setHeroIndex] = useState(0)
  const [introDone, setIntroDone] = useState(false)
  const { scrollY } = useScroll()
  const shouldReduceMotion = useReducedMotion()
  const dragStart = useRef(null)
  const videoRef = useRef(null)
  const currentMedia = slides[heroIndex % slides.length]
  const nextSlide = useCallback(() => setHeroIndex((index) => (index + 1) % slides.length), [slides.length])
  const previousSlide = useCallback(() => setHeroIndex((index) => (index - 1 + slides.length) % slides.length), [slides.length])

  useEffect(() => {
    if (heroIndex >= slides.length) setHeroIndex(0)
  }, [heroIndex, slides.length])

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
      className="relative isolate flex min-h-[calc(100svh-3.5rem)] cursor-grab items-end overflow-hidden bg-forest-dark active:cursor-grabbing md:min-h-[100svh]">
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

      <div className="absolute inset-x-2 top-1/2 z-20 flex -translate-y-1/2 justify-between sm:inset-x-5">
        <button type="button" aria-label="Previous hero slide" onPointerDown={(event) => event.stopPropagation()} onClick={previousSlide} className="grid h-9 w-9 place-items-center rounded-full border border-white/50 bg-forest-dark/35 text-white backdrop-blur transition hover:bg-sun hover:text-forest sm:h-12 sm:w-12"><Icon name="chevronL" className="h-4 w-4 sm:h-5 sm:w-5" /></button>
        <button type="button" aria-label="Next hero slide" onPointerDown={(event) => event.stopPropagation()} onClick={nextSlide} className="grid h-9 w-9 place-items-center rounded-full border border-white/50 bg-forest-dark/35 text-white backdrop-blur transition hover:bg-sun hover:text-forest sm:h-12 sm:w-12"><Icon name="chevronR" className="h-4 w-4 sm:h-5 sm:w-5" /></button>
      </div>

      <div className="wrap relative flex min-h-[calc(100svh-3.5rem)] select-none items-center justify-center px-12 pb-28 pt-20 text-center sm:px-10 md:min-h-[100svh] md:pb-[clamp(8rem,20vw,20rem)] md:pt-24">
          <div className="w-full max-w-5xl">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-sun sm:text-[0.68rem]">{heroContent?.eyebrow || 'Sarangkot, Pokhara · Nepal'}</p>
            <motion.h1
              className="mt-4 font-display text-[clamp(2.25rem,8.5vw,3.5rem)] font-semibold leading-[0.94] text-white sm:mt-6 sm:text-7xl lg:text-[7rem]"
              style={{ letterSpacing: '-0.04em', y: headlineY, opacity: headlineOpacity }}
            >
              {heroContent?.headlineLine1 || 'Your private space.'}<br />{heroContent?.headlineLine2 || 'Hosted your way.'}
            </motion.h1>
            <motion.p
              className="mx-auto mt-4 max-w-xl text-base leading-[1.45] text-white/85 sm:mt-6 sm:text-lg md:text-xl"
              style={{ y: descY, opacity: descOpacity }}
            >
              {heroContent?.description || 'A hilltop villa, restro and bar made for quiet stays, big gatherings and slow Pokhara days.'}
            </motion.p>
            <div className="mt-6 sm:mt-7" onPointerDown={(event) => event.stopPropagation()}><Button href={heroContent?.ctaHref || '/rooms'}>{heroContent?.ctaLabel || 'Find your stay'}</Button></div>
          </div>
      </div>

      {/* Hero's bottom edge: page-coloured band masked by the traced outer line SVG of the mountain photo at its natural 1024:217 aspect ratio */}
      <div
        aria-hidden="true"
        data-mountain-ridge
        className="pointer-events-none absolute inset-x-0 -bottom-px z-10 h-24 w-full sm:h-28 md:h-auto md:aspect-[1024/217] md:translate-y-12 lg:translate-y-16"
        style={{
          backgroundColor: '#FFFFFF',
          WebkitMaskImage: 'url(/images/mountain-edge.svg)',
          maskImage: 'url(/images/mountain-edge.svg)',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskSize: '100% 100%',
          maskSize: '100% 100%',
          WebkitMaskPosition: 'center bottom',
          maskPosition: 'center bottom',
        }}
      />

      {!shouldReduceMotion && !introDone && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[5] grid grid-cols-6 overflow-hidden"
        >
          {Array.from({ length: CURTAIN_COLS }, (_, i) => (
            <motion.div
              key={i}
              initial={{ y: '0%' }}
              animate={{ y: '100%' }}
              transition={{
                duration: 0.85,
                delay: 0.08 + i * 0.07,
                ease: [0.76, 0, 0.24, 1],
              }}
              onAnimationComplete={i === CURTAIN_COLS - 1 ? () => setIntroDone(true) : undefined}
              className="h-full w-full bg-white"
              style={{ willChange: 'transform' }}
            />
          ))}
        </div>
      )}
    </section>
  )
}
