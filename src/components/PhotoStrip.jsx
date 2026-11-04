'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Icon from './Icons.jsx'
import { lockScroll } from '../lib/smoothScroll.js'
import { gallery } from '../data/gallery.js'

/** Click-to-enlarge viewer with keyboard support (Esc, ← →). */
function Lightbox({ index, onClose, onMove }) {
  const closeRef = useRef(null)
  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onMove(-1)
      if (e.key === 'ArrowRight') onMove(1)
    }
    lockScroll(true)
    window.addEventListener('keydown', onKey)
    return () => {
      lockScroll(false)
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose, onMove])

  const item = gallery[index]
  const btn =
    'absolute flex h-12 w-12 items-center justify-center rounded-full bg-cream text-forest shadow-soft hover:bg-sand'
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      className="on-dark fixed inset-0 z-[60] flex items-center justify-center bg-forest-dark/95 p-4"
      onClick={onClose}
    >
      <img
        src={item.src}
        alt={item.alt}
        className="max-h-[82vh] max-w-full rounded-2xl object-contain"
        onClick={(e) => e.stopPropagation()}
      />
      <p className="absolute inset-x-0 bottom-5 px-16 text-center text-sm text-cream/90">{item.alt}</p>
      <button ref={closeRef} type="button" aria-label="Close photo" className={`${btn} right-4 top-4`} onClick={onClose}>
        <Icon name="close" />
      </button>
      <button type="button" aria-label="Previous photo" className={`${btn} left-3 top-1/2 -translate-y-1/2`} onClick={(e) => { e.stopPropagation(); onMove(-1) }}>
        <Icon name="chevronL" />
      </button>
      <button type="button" aria-label="Next photo" className={`${btn} right-3 top-1/2 -translate-y-1/2`} onClick={(e) => { e.stopPropagation(); onMove(1) }}>
        <Icon name="chevronR" />
      </button>
    </div>
  )
}

export default function PhotoStrip() {
  const scroller = useRef(null)
  const paused = useRef(false)
  const resumeTimer = useRef(null)
  const [open, setOpen] = useState(null)
  const openRef = useRef(null)
  openRef.current = open

  // Slow auto-scroll. A real scroll container, so it also swipes/drags on phones.
  useEffect(() => {
    const el = scroller.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf
    let pos = 0
    let last = performance.now()
    const tick = (t) => {
      const dt = t - last
      last = t
      const half = el.scrollWidth / 2
      if (paused.current || openRef.current !== null) {
        pos = el.scrollLeft
      } else {
        pos += dt * 0.035 // px per ms ≈ 35px/s
        if (pos >= half) pos -= half
        el.scrollLeft = pos
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const pause = () => { clearTimeout(resumeTimer.current); paused.current = true }
  const resume = (delay = 0) => { clearTimeout(resumeTimer.current); resumeTimer.current = setTimeout(() => (paused.current = false), delay) }

  // keep the loop seamless when the visitor drags manually
  const onScroll = () => {
    const el = scroller.current
    const half = el.scrollWidth / 2
    if (el.scrollLeft >= half) el.scrollLeft -= half
    else if (el.scrollLeft <= 0 && paused.current) el.scrollLeft = half
  }

  const move = useCallback((d) => setOpen((i) => (i === null ? i : (i + d + gallery.length) % gallery.length)), [])
  const close = useCallback(() => setOpen(null), [])

  const tiles = [...gallery, ...gallery]
  return (
    <section id="gallery" className="pb-24 pt-12 md:pb-40 md:pt-24" aria-label="Photo gallery">
      <div
        ref={scroller}
        className="no-scrollbar flex items-end gap-5 overflow-x-auto px-5 py-3"
        onMouseEnter={pause}
        onMouseLeave={() => resume(0)}
        onTouchStart={pause}
        onTouchEnd={() => resume(2500)}
        onFocus={pause}
        onBlur={() => resume(0)}
        onScroll={onScroll}
      >
        {tiles.map((g, i) => {
          const dup = i >= gallery.length
          return (
            <button
              key={i}
              type="button"
              tabIndex={dup ? -1 : 0}
              aria-hidden={dup || undefined}
              aria-label={dup ? undefined : `Enlarge photo: ${g.alt}`}
              onClick={() => setOpen(i % gallery.length)}
              className={`group shrink-0 overflow-hidden rounded-3xl shadow-soft ${g.h}`}
            >
              <img
                src={g.src}
                alt={dup ? '' : g.alt}
                loading="lazy"
                draggable="false"
                className="h-full w-auto max-w-none object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </button>
          )
        })}
      </div>
      <p className="wrap mt-4 text-center text-sm text-muted">Swipe or hover to pause. Tap a photo to enlarge.</p>
      {open !== null && <Lightbox index={open} onClose={close} onMove={move} />}
    </section>
  )
}
