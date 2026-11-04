'use client'

import { useRef } from 'react'
import Icon, { Stars } from './Icons.jsx'
import { Reveal } from './ui.jsx'
import { reviews } from '../data/reviews.js'

export default function Guests() {
  const track = useRef(null)
  const scrollBy = (dir) => track.current?.scrollBy({ left: dir * 340, behavior: 'smooth' })
  const arrow = 'flex h-12 w-12 items-center justify-center rounded-full border-2 border-forest text-forest hover:bg-forest hover:text-cream'

  return (
    <section id="guests" className="section contour bg-sand">
      <div className="wrap">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="label">Guest voices</p>
            <h2 className="h2">Loved by travellers</h2>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => scrollBy(-1)} aria-label="Previous reviews" className={arrow}><Icon name="chevronL" /></button>
            <button type="button" onClick={() => scrollBy(1)} aria-label="Next reviews" className={arrow}><Icon name="chevronR" /></button>
          </div>
        </Reveal>

        <ul
          ref={track}
          className="no-scrollbar -mx-6 mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 sm:-mx-10 sm:px-10"
          aria-label="Guest reviews"
        >
          {reviews.map((r, i) => (
            <li key={i} className="w-[85%] shrink-0 snap-start sm:w-[22rem]">
              <figure className="flex h-full flex-col rounded-3xl bg-cream p-7 shadow-soft">
                <Stars />
                <blockquote className="mt-4 flex-1 font-display text-xl leading-snug text-forest">“{r.text}”</blockquote>
                <figcaption className="mt-5 flex items-center justify-between gap-3 text-base">
                  <span>
                    <strong className="block text-ink">{r.name}</strong>
                    <span className="text-muted">Guest from {r.country}</span>
                  </span>
                  {r.placeholder && (
                    <span className="rounded-full bg-sun/25 px-2.5 py-1 text-xs font-bold uppercase text-forest-dark">Sample</span>
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
