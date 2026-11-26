'use client'

import Link from 'next/link'
import { ArrowRight, Bath, BedDouble, Coffee, Mountain, Users, Wifi } from 'lucide-react'
import { backendMediaUrl } from '../lib/backend.jsx'

/**
 * Full-bleed rounded portrait photo card with a soft bottom gradient,
 * bold white title, and optional frosted feature icons with hover tooltips.
 */
export default function RoomCard({
  room,
  href,
  featured = false,
  showIcons = false,
  plan = 'BB',
  className = '',
}) {
  const slug = room.slug || room.id
  const targetHref = href || `/rooms/${slug}`
  const sizeClass = featured
    ? 'h-[21rem] sm:h-[26rem] lg:h-[31rem]'
    : 'h-[19.5rem] sm:h-[24rem] lg:h-[24.5rem]'

  const icons = showIcons
    ? [
        room.capacity ? { icon: Users, label: room.capacity, mobileShowText: true } : null,
        room.bed ? { icon: BedDouble, label: room.bed, mobileShowText: true } : null,
        { icon: Wifi, label: 'Free Wi-Fi' },
        { icon: Bath, label: 'Hot water' },
        { icon: Coffee, label: plan === 'MAP' ? 'Meals included' : 'Breakfast included' },
        room.views?.length
          ? {
              icon: Mountain,
              label: room.views.includes('mountain') ? 'Mountain view' : 'City view',
              mobileShowText: true,
            }
          : null,
      ].filter(Boolean)
    : []

  return (
    <Link
      href={targetHref}
      className={`group/card relative block w-full overflow-hidden rounded-[24px] bg-forest-dark shadow-soft transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sun focus-visible:ring-offset-2 sm:rounded-[28px] ${sizeClass} ${className}`}
    >
      <img
        src={backendMediaUrl(room.image)}
        alt={room.alt || room.name}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
      />
      {showIcons ? (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/10 to-black/80"
          />

          {/* Top-left text */}
          <div className="absolute inset-x-0 top-0 p-5 sm:p-7">
            <h3 className="font-display text-xl font-bold leading-snug tracking-[-0.02em] text-white drop-shadow-xs sm:text-2xl">
              {room.name || room.title}
            </h3>
          </div>

          {/* Bottom-right icons: readable on touch devices, expanding on desktop hover */}
          {icons.length > 0 && (
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
              <ul className="flex flex-wrap items-center justify-start gap-1.5 sm:justify-end sm:gap-2" aria-label="Room features">
                {icons.map(({ icon: Ico, label, mobileShowText }) => (
                  <li key={label}>
                    <span
                      aria-label={label}
                      className="group/icon inline-flex h-8 items-center rounded-full border border-white/25 bg-white/15 px-2.5 text-white backdrop-blur-md transition-all duration-300 hover:border-sun hover:bg-sun hover:px-3.5 hover:text-forest-dark"
                    >
                      <Ico className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span
                        className={`overflow-hidden whitespace-nowrap text-[0.68rem] font-bold transition-all duration-300 ${
                          mobileShowText
                            ? 'ml-1.5 max-w-[10rem] opacity-100 sm:ml-0 sm:max-w-0 sm:opacity-0 sm:group-hover/icon:ml-1.5 sm:group-hover/icon:max-w-[10rem] sm:group-hover/icon:opacity-100'
                            : 'max-w-0 opacity-0 group-hover/icon:ml-1.5 group-hover/icon:max-w-[10rem] group-hover/icon:opacity-100'
                        }`}
                      >
                        {label}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
          />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
            <h3 className="font-display text-xl font-bold leading-snug tracking-[-0.02em] text-white sm:text-2xl">
              {room.name || room.title}
            </h3>
          </div>
        </>
      )}
    </Link>
  )
}
