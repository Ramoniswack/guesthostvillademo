'use client'

import Link from 'next/link'
import {
  ArrowRight, Bath, Car, Coffee, MapPin, MessageCircle, Star, Users, Wifi,
} from 'lucide-react'
import { faqs } from '../data/faq.js'
import { buildingLabel, findStay } from '../data/rooms.js'
import { reviews } from '../data/reviews.js'
import { directionsLink, mapEmbed, site, stats, waLink } from '../data/site.js'
import KineticNumber from './KineticNumber.jsx'
import { Button, Reveal, StaggerGrid, StaggerItem } from './ui.jsx'

const featuredIds = ['mountain-view-room', 'city-view-room', 'villa-top-floor']

const amenities = [
  { icon: Wifi, label: 'Free Wi-Fi' },
  { icon: Bath, label: 'Hot water' },
  { icon: Coffee, label: 'Breakfast included' },
  { icon: Car, label: 'Free parking' },
]

const galleryMoments = [
  {
    title: 'Pyramid Restro & Bar',
    subtitle: 'Daily breakfast, Nepali plates & sunset drinks',
    image: '/images/pyramid.webp',
  },
  {
    title: 'Garden & Outdoor BBQ',
    subtitle: 'Open lawns, bonfire evenings & valley air',
    image: '/images/garden.webp',
  },
  {
    title: 'After Dark Above Pokhara',
    subtitle: 'Quiet hilltop nights overlooking city lights',
    image: '/images/night-aerial.webp',
  },
]

export default function HomeEditorial() {
  const featuredRooms = featuredIds.map(findStay).filter(Boolean)

  return (
    <div className="bg-white">
      {/* 1 · Minimal Stats Bar */}
      <section className="border-b border-forest/10 bg-white py-8">
        <div className="wrap grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`px-4 py-4 text-center first:pl-0 last:pr-0 md:px-6 ${
                index % 2 === 1 ? 'border-l border-forest/10' : ''
              } ${index >= 2 ? 'border-t border-forest/10 md:border-t-0' : ''} ${
                index > 0 ? 'md:border-l md:border-forest/10' : ''
              }`}
            >
              <p className="font-display text-3xl font-semibold leading-none tracking-[-0.04em] text-forest sm:text-4xl">
                <KineticNumber value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mx-auto mt-2 max-w-36 text-xs font-medium leading-snug text-forest/65">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 2 · Minimal Split Intro: Stay, dine & gather */}
      <section className="bg-white py-16 md:py-24">
        <div className="wrap grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <Reveal className="max-w-lg">
            <p className="label">Sarangkot, Pokhara</p>
            <h2 className="mt-2 font-display text-4xl font-semibold leading-[0.96] tracking-[-0.04em] text-forest sm:text-5xl">
              Stay, dine &amp; gather.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-forest/75">
              A quiet hilltop villa with mountain air, warm rooms and a pyramid restaurant—twenty minutes above Lakeside Pokhara.
            </p>

            <ul className="mt-7 grid grid-cols-2 gap-x-6 gap-y-3 border-y border-forest/10 py-5 text-xs font-semibold text-forest">
              {amenities.map(({ icon: Ico, label }) => (
                <li key={label} className="inline-flex items-center gap-2">
                  <Ico className="h-4 w-4 shrink-0 text-sun-text" aria-hidden="true" />
                  <span>{label}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7">
              <Button href="/rooms">Explore rooms</Button>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="grid grid-cols-2 gap-4">
              <div className="overflow-hidden rounded-2xl border border-forest/15">
                <img
                  src="/images/day-aerial.webp"
                  alt="G’Host Villa buildings in the hills above Pokhara"
                  className="h-64 w-full object-cover sm:h-80"
                />
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex-1 overflow-hidden rounded-2xl border border-forest/15">
                  <img
                    src="/images/pyramid.webp"
                    alt="Crystal Pyramid Dome House and restaurant at G’Host Villa"
                    loading="lazy"
                    className="h-full min-h-[11rem] w-full object-cover"
                  />
                </div>
                <div className="rounded-2xl bg-sun px-5 py-3.5 text-forest-dark">
                  <p className="text-xs font-bold uppercase tracking-[0.12em]">
                    <KineticNumber value={20} suffix=" mins" /> above Lakeside
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3 · Curated Stays: 3 Direct Room Cards */}
      <section className="border-t border-forest/10 bg-white py-16 md:py-24">
        <div className="wrap">
          <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="label">Stay collection</p>
              <h2 className="mt-2 font-display text-4xl font-semibold leading-[0.96] tracking-[-0.04em] text-forest sm:text-5xl">
                Choose your space.
              </h2>
            </div>
            <Link
              href="/rooms"
              className="inline-flex items-center gap-2 rounded-full border border-forest/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-forest transition hover:border-forest hover:bg-forest hover:text-white"
            >
              <span>View all rooms</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </Reveal>

          <StaggerGrid className="grid gap-6 md:grid-cols-3">
            {featuredRooms.map((room) => (
              <StaggerItem key={room.id} className="h-full">
                <Link
                  href={`/rooms/${room.id}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-forest/15 bg-white shadow-soft transition hover:-translate-y-1 hover:border-forest/35 hover:shadow-warm"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-forest-dark">
                    <img
                      src={room.image}
                      alt={room.alt}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-sun-text">
                      {buildingLabel(room)}
                    </p>
                    <h3 className="mt-1.5 font-display text-2xl font-semibold leading-tight text-forest">
                      {room.name}
                    </h3>
                    <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-forest/65">
                      <Users className="h-3.5 w-3.5 text-forest/50" aria-hidden="true" />
                      <span>{room.capacity}</span>
                    </p>
                    <div className="mt-auto pt-5">
                      <div className="flex items-center justify-between gap-3 border-t border-forest/10 pt-4">
                        <p className="font-display text-lg font-bold text-forest">
                          From NPR {room.price.toLocaleString('en-US')}{' '}
                          <span className="font-body text-xs font-normal text-forest/60">/ night</span>
                        </p>
                        <ArrowRight className="h-4 w-4 shrink-0 text-forest transition group-hover:translate-x-0.5" aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGrid>

          <Reveal className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-forest/15 bg-white px-6 py-4">
            <p className="text-sm font-medium text-forest">
              Planning for 8 to 24 guests?{' '}
              <span className="text-forest/70">Book a private wing or the entire 7-BHK villa.</span>
            </p>
            <Link
              href="/packages"
              className="inline-flex items-center gap-2 rounded-full bg-sun px-4 py-2 text-xs font-semibold text-forest-dark transition hover:bg-sun-dark"
            >
              <span>See group packages</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 4 · Dining & Gallery: Restro, Bar & Hilltop Moments */}
      <section className="bg-forest-dark py-16 text-white md:py-24">
        <div className="wrap">
          <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="label !text-sun">Restro, bar &amp; grounds</p>
              <h2 className="mt-2 font-display text-4xl font-semibold leading-[0.96] tracking-[-0.04em] text-white sm:text-5xl">
                Life on the hilltop.
              </h2>
            </div>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:border-sun hover:text-sun"
            >
              <span>View food &amp; drinks menu</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </Reveal>

          <StaggerGrid className="grid gap-6 md:grid-cols-3">
            {galleryMoments.map((item) => (
              <StaggerItem key={item.title} className="h-full">
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/15 bg-forest">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-2xl font-semibold leading-tight text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/75">{item.subtitle}</p>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* 5 · Guest Reviews, Location & Quick FAQ */}
      <section className="bg-white py-16 md:py-24">
        <div className="wrap">
          {/* Top: 3 Minimal Review Cards */}
          <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="label">Guest reviews</p>
              <h2 className="mt-2 font-display text-4xl font-semibold leading-[0.96] tracking-[-0.04em] text-forest sm:text-5xl">
                Rated 4.5★ on Google.
              </h2>
            </div>
            <p className="text-sm font-semibold text-forest/65">379+ verified reviews</p>
          </Reveal>

          <StaggerGrid className="grid gap-6 md:grid-cols-3">
            {reviews.slice(0, 3).map((r) => (
              <StaggerItem key={r.name} className="h-full">
                <blockquote className="flex h-full flex-col rounded-2xl border border-forest/15 bg-white p-6 shadow-soft">
                  <div className="flex items-center gap-1 text-sun">
                    {Array.from({ length: r.rating }, (_, i) => (
                      <Star key={i} className="h-4 w-4 fill-sun" aria-hidden="true" />
                    ))}
                  </div>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-forest/80">“{r.text}”</p>
                  <footer className="mt-5 border-t border-forest/10 pt-3.5 text-xs font-semibold text-forest">
                    {r.name} <span className="font-normal text-forest/55">· {r.country}</span>
                  </footer>
                </blockquote>
              </StaggerItem>
            ))}
          </StaggerGrid>

          {/* Bottom: Location & Quick Answers */}
          <div className="mt-16 grid items-start gap-12 border-t border-forest/10 pt-16 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <p className="label">Location</p>
              <h2 className="mt-2 font-display text-3xl font-semibold leading-none tracking-[-0.03em] text-forest sm:text-4xl">
                Easy to reach.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-forest/75">{site.address}</p>
              <p className="mt-1.5 text-xs font-semibold text-sun-text">
                ~20 mins from Lakeside · ~30 mins from Pokhara Airport
              </p>

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
                <Button
                  href={waLink("Hello G'Host Villa! Could you share directions to the villa?")}
                  variant="outline"
                  arrow={false}
                  className="w-full"
                >
                  <span className="inline-flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>Ask on WhatsApp</span>
                  </span>
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <p className="label">FAQ</p>
              <h2 className="mt-2 font-display text-3xl font-semibold leading-none tracking-[-0.03em] text-forest sm:text-4xl">
                Quick answers.
              </h2>
              <div className="mt-5 divide-y divide-forest/15 border-y border-forest/15">
                {faqs.slice(0, 4).map((faq) => (
                  <details key={faq.q} className="group py-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-sm font-semibold text-forest">
                      <span>{faq.q}</span>
                      <span className="text-lg text-forest/60 transition group-open:rotate-45">+</span>
                    </summary>
                    <p className="max-w-2xl pt-3 text-sm leading-relaxed text-forest/75">{faq.a}</p>
                  </details>
                ))}
              </div>
              <div className="mt-6">
                <Link
                  href="/faq"
                  className="inline-flex items-center gap-2 rounded-full border border-forest/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-forest transition hover:border-forest hover:bg-forest hover:text-white"
                >
                  <span>All FAQs</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  )
}
