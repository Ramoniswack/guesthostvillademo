'use client'

import { useEffect, useRef } from 'react'
import Icon, { Stars } from './Icons.jsx'
import { Reveal } from './ui.jsx'
import { reviews } from '../data/reviews.js'

export default function Guests() {
  const track = useRef(null)
  const isPaused = useRef(false)
  const timer = useRef(null)

  const scrollBy = (dir) => {
    const el = track.current
    if (!el) return
    const card = el.querySelector('li')
    const cardWidth = card ? card.offsetWidth : 350
    const gap = 20
    const delta = (cardWidth + gap) * dir

    // If scrolling forward and reached end, wrap around to start
    if (dir > 0 && el.scrollLeft + el.clientWidth >= el.scrollWidth - 15) {
      el.scrollTo({ left: 0, behavior: 'smooth' })
    } else if (dir < 0 && el.scrollLeft <= 15) {
      el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' })
    } else {
      el.scrollBy({ left: delta, behavior: 'smooth' })
    }
  }

  // Auto-slide every 4 seconds
  useEffect(() => {
    const startAutoSlide = () => {
      timer.current = setInterval(() => {
        if (!isPaused.current) {
          scrollBy(1)
        }
      }, 4000)
    }

    startAutoSlide()
    return () => clearInterval(timer.current)
  }, [])

  const handleManualScroll = (dir) => {
    scrollBy(dir)
    // reset timer so it doesn't immediately slide right after a manual click
    clearInterval(timer.current)
    timer.current = setInterval(() => {
      if (!isPaused.current) {
        scrollBy(1)
      }
    }, 4000)
  }

  const pause = () => { isPaused.current = true }
  const resume = () => { isPaused.current = false }

  const arrow =
    'flex h-12 w-12 items-center justify-center rounded-full border-2 border-forest text-forest hover:bg-forest hover:text-cream transition-colors duration-200'

  return (
    <section id="guests" className="section contour bg-sand">
      <div className="wrap">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="label">Guest voices</p>
            <h2 className="h2">Loved by travellers</h2>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleManualScroll(-1)}
              aria-label="Previous reviews"
              className={arrow}
            >
              <Icon name="chevronL" />
            </button>
            <button
              type="button"
              onClick={() => handleManualScroll(1)}
              aria-label="Next reviews"
              className={arrow}
            >
              <Icon name="chevronR" />
            </button>
          </div>
        </Reveal>

        <ul
          ref={track}
          onMouseEnter={pause}
          onMouseLeave={resume}
          onTouchStart={pause}
          onTouchEnd={resume}
          className="no-scrollbar -mx-6 mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 sm:-mx-10 sm:px-10"
          aria-label="Guest reviews"
        >
          {reviews.map((r, i) => (
            <li key={i} className="w-[85%] shrink-0 snap-start sm:w-[22rem]">
              <figure className="flex h-full flex-col rounded-3xl bg-cream p-7 shadow-soft">
                <Stars />
                <blockquote className="mt-4 flex-1 font-display text-xl leading-snug text-forest">
                  “{r.text}”
                </blockquote>
                <figcaption className="mt-5 flex items-center justify-between gap-3 text-base">
                  <span>
                    <strong className="block text-ink">{r.name}</strong>
                    <span className="text-muted">{r.country}</span>
                  </span>
                  {r.source && (
                    <span className="rounded-full bg-sand px-2.5 py-1 text-xs font-semibold text-forest-dark">
                      {r.source}
                    </span>
                  )}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
