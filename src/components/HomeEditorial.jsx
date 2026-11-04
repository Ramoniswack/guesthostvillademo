'use client'

import Link from 'next/link'
import { faqs } from '../data/faq.js'
import { rooms } from '../data/rooms.js'
import { reviews } from '../data/reviews.js'
import { stats, waLink } from '../data/site.js'
import { ArrowCircle, Button, Reveal } from './ui.jsx'

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

function TextLink({ href, children }) {
  const inner = <><span>{children}</span><ArrowCircle /></>
  const className = 'inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.12em] text-forest transition hover:text-sun-dark'
  if (href.startsWith('/')) return <Link href={href} className={className}>{inner}</Link>
  return <a href={href} className={className} target="_blank" rel="noopener noreferrer">{inner}</a>
}

export default function HomeEditorial() {
  const featuredRooms = [rooms[0], rooms[3]]
  const quote = reviews[0]

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
          {stats.map((stat, index) => <div key={stat.label} className={`px-4 py-5 text-center first:pl-0 last:pr-0 md:px-7 ${index % 2 === 1 ? 'border-l border-forest/15' : ''} ${index >= 2 ? 'border-t border-forest/15 md:border-t-0' : ''} ${index > 0 ? 'md:border-l md:border-forest/15' : ''}`}><p className="font-display text-3xl leading-none tracking-[-0.04em] text-forest sm:text-4xl">{stat.value}{stat.suffix}</p><p className="mx-auto mt-3 max-w-32 text-xs font-semibold leading-snug text-forest/65">{stat.label}</p></div>)}
        </div>
      </section>

      <section className="bg-cream py-20 md:py-32">
        <div className="wrap">
          <Reveal className="mb-12 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end">
            <div><p className="label">The G’Host rhythm</p><h2 className="mt-4 max-w-xl font-display text-5xl font-semibold leading-[0.96] tracking-[-0.045em] text-forest sm:text-6xl">Choose your kind of escape.</h2></div>
            <p className="max-w-sm leading-relaxed text-forest/70">Stay the night, come hungry or bring the whole crew. Every reason to visit gets its own beautiful corner.</p>
          </Reveal>
          <div className="grid gap-7 md:grid-cols-3">
            {experiences.map((item, index) => <Reveal key={item.title} delay={index * 0.1} className="group">
              <article className="h-full bg-sand">
                <div className="relative overflow-hidden"><img src={item.image} alt="" loading="lazy" className="h-72 w-full object-cover transition duration-700 group-hover:scale-105" /><span className="absolute left-5 top-5 bg-cream px-3 py-2 text-xs font-bold tracking-[0.15em] text-forest">{item.number}</span></div>
                <div className="flex min-h-64 flex-col p-7"><h3 className="font-display text-3xl leading-none tracking-[-0.035em] text-forest">{item.title}</h3><p className="mt-4 leading-relaxed text-forest/70">{item.text}</p><div className="mt-auto pt-7"><TextLink href={item.href}>{item.link}</TextLink></div></div>
              </article>
            </Reveal>)}
          </div>
        </div>
      </section>

      <section className="bg-forest-dark px-6 py-20 text-cream md:py-32">
        <Reveal className="mx-auto max-w-5xl text-center"><p className="label !text-sun">Made for the moments between plans</p><h2 className="mt-6 font-display text-5xl font-semibold leading-[0.94] tracking-[-0.05em] sm:text-7xl lg:text-8xl">Less rushing.<br />More remembering.</h2><p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-cream/75">Wake up with the hills, linger over breakfast, then let the day decide what it wants to be.</p></Reveal>
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
          <Reveal><p className="label">Come as you are</p><h2 className="mt-4 font-display text-5xl font-semibold leading-[0.96] tracking-[-0.045em] text-forest sm:text-6xl">Private moments, bigger memories.</h2><p className="mt-6 max-w-md text-lg leading-relaxed text-forest/75">A low-key couple’s night, a birthday table, a family buyout—there’s enough room for every version of together.</p><div className="mt-8"><Button variant="outline" href={waLink('Hello G\'Host Villa! I would like to enquire about a private event or group stay.')}>Ask about groups</Button></div></Reveal>
          <Reveal delay={0.12} className="grid grid-cols-2 gap-3 sm:gap-5"><img src="/images/night-aerial.webp" alt="G'Host Villa lit up in the evening" loading="lazy" className="h-72 w-full object-cover sm:h-96" /><div className="space-y-3 pt-10 sm:space-y-5 sm:pt-16"><img src="/images/room-deluxe.webp" alt="A room at G'Host Villa" loading="lazy" className="h-44 w-full object-cover sm:h-56" /><img src="/images/garden.webp" alt="Villa garden for gatherings" loading="lazy" className="h-32 w-full object-cover sm:h-40" /></div></Reveal>
        </div>
      </section>

      <section className="bg-cream py-20 md:py-32">
        <div className="wrap grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <Reveal><p className="label">Guest notes</p><blockquote className="mt-5 font-display text-4xl leading-[1.02] tracking-[-0.04em] text-forest sm:text-5xl">“{quote.short}”</blockquote><p className="mt-7 font-semibold text-forest">{quote.name} <span className="font-normal text-forest/60">· {quote.source}</span></p><p className="mt-3 text-sun-dark">{'★'.repeat(quote.rating)}</p></Reveal>
          <Reveal delay={0.12}><p className="label">Need to know</p><h2 className="mt-4 font-display text-4xl font-semibold leading-none tracking-[-0.04em] text-forest sm:text-5xl">A few quick answers.</h2><div className="mt-7 divide-y divide-forest/15 border-y border-forest/15">{faqs.slice(0, 3).map((faq) => <details key={faq.q} className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-semibold text-forest"><span>{faq.q}</span><span className="text-xl transition group-open:rotate-45">+</span></summary><p className="max-w-2xl pt-4 leading-relaxed text-forest/70">{faq.a}</p></details>)}</div><div className="mt-7"><TextLink href="/faq">Read all FAQs</TextLink></div></Reveal>
        </div>
      </section>
    </div>
  )
}
