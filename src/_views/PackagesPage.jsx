'use client'

import { useState } from 'react'
import { PageHero, Button, Reveal } from '../components/ui.jsx'
import Icon from '../components/Icons.jsx'
import { waLink } from '../data/site.js'

const packages = [
  {
    id: 'couple',
    label: 'For two',
    title: 'A quiet couple escape',
    intro: 'A warm private room, breakfast for two and a hilltop view that makes the weekend feel longer.',
    price: 'From NPR 6,800',
    note: 'per night · 1–2 adults',
    image: '/images/room-couple.webp',
    features: ['Couple Deluxe private suite', 'Breakfast for two', 'Valley and mountain views', 'Hot water, Wi-Fi and parking'],
  },
  {
    id: 'family',
    label: 'For groups',
    title: 'A weekend with your people',
    intro: 'Bring the family or your closest friends for a private villa wing with room to gather, eat and slow down.',
    price: 'From NPR 1,550',
    note: 'per person · 8–12 guests',
    image: '/images/garden.webp',
    features: ['4-BHK private villa wing', 'Breakfast and welcome drinks', 'Garden and viewing terraces', 'Group dining and BBQ options'],
  },
  {
    id: 'buyout',
    label: 'Private buyout',
    title: 'The whole villa, yours',
    intro: 'Take over the full G’Host estate for a celebration, retreat or family gathering with space for everyone.',
    price: 'From NPR 1,550',
    note: 'per person · 20–24 guests',
    image: '/images/pyramid.webp',
    features: ['7-BHK full estate buyout', 'Private host and kitchen team', 'Restaurant, garden and pool access', 'Flexible celebration planning'],
  },
]

const experiences = [
  { title: 'Breakfast at the pyramid', text: 'Start slowly with fresh breakfast and mountain air.', image: '/images/pyramid.webp' },
  { title: 'A table in the garden', text: 'Make room for shared meals, drinks and long conversations.', image: '/images/garden.webp' },
  { title: 'A hilltop reset', text: 'Step away from the city without going far from Pokhara.', image: '/images/day-aerial.webp' },
]

export default function PackagesPage() {
  const [activeId, setActiveId] = useState('couple')
  const activePackage = packages.find((item) => item.id === activeId) ?? packages[0]

  return (
    <>
      <PageHero eyebrow="Packages · private stays · villa experiences" title="Make the stay yours." text="Choose a package that fits the way you are travelling—from a quiet couple escape to a full G’Host Villa buyout above Pokhara." image="/images/pyramid.webp" position="50% 52%" center compact />

      <section className="bg-cream py-20 md:py-28">
        <div className="wrap grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
          <Reveal><p className="label">A stay with room for your plans</p><h2 className="mt-5 max-w-xl font-display text-5xl font-semibold leading-[0.94] tracking-[-0.045em] text-forest sm:text-6xl">Come for the view. Stay for everything around it.</h2><p className="mt-7 max-w-xl text-lg leading-relaxed text-forest/70">Every G’Host package keeps the essentials easy: a comfortable place to sleep, breakfast, hot water, Wi-Fi and a slower pace above the city. Add a table, a celebration or a little more privacy when you need it.</p><div className="mt-8"><Button href={waLink('Hello G\'Host Villa! I would like help choosing a package.')}>Talk through a package</Button></div></Reveal>
          <Reveal delay={0.12} className="grid grid-cols-5 gap-3 sm:gap-5"><img src="/images/day-aerial.webp" alt="G'Host Villa above Pokhara" className="col-span-3 h-[360px] w-full object-cover sm:h-[470px]" /><div className="col-span-2 grid gap-3 sm:gap-5"><img src="/images/room-deluxe.webp" alt="A private room at G'Host Villa" className="h-44 w-full object-cover sm:h-56" /><img src="/images/garden.webp" alt="Garden gathering at G'Host Villa" className="h-44 w-full object-cover sm:h-56" /></div></Reveal>
        </div>
      </section>

      <section className="bg-sand py-20 md:py-28">
        <div className="wrap"><Reveal className="mx-auto mb-10 max-w-3xl text-center md:mb-14"><p className="label">Package deals</p><h2 className="mt-4 font-display text-5xl font-semibold leading-[0.94] tracking-[-0.045em] text-forest sm:text-6xl">Pick the kind of escape you are after.</h2><p className="mx-auto mt-5 max-w-2xl leading-relaxed text-forest/70">Each option is a starting point. Tell us your dates, group and plans, and we will shape the details around you.</p></Reveal>
          <div role="tablist" aria-label="Stay packages" className="mx-auto mb-8 grid max-w-4xl gap-px bg-forest/15 sm:grid-cols-3">{packages.map((item) => <button key={item.id} type="button" role="tab" aria-selected={activeId === item.id} onClick={() => setActiveId(item.id)} className={`min-h-14 bg-cream px-4 text-sm font-bold uppercase tracking-[0.1em] transition ${activeId === item.id ? 'bg-forest text-cream' : 'text-forest hover:bg-cream/70'}`}>{item.label}</button>)}</div>
          <Reveal className="grid overflow-hidden border border-forest/15 bg-cream lg:grid-cols-[0.85fr_1.15fr]" key={activePackage.id}><img src={activePackage.image} alt={activePackage.title} className="h-72 w-full object-cover lg:h-full" /><div className="p-7 sm:p-10"><p className="label">{activePackage.label}</p><h3 className="mt-4 font-display text-4xl leading-[0.95] tracking-[-0.04em] text-forest sm:text-5xl">{activePackage.title}</h3><p className="mt-5 max-w-xl leading-relaxed text-forest/70">{activePackage.intro}</p><div className="mt-7 flex flex-wrap items-end justify-between gap-4 border-y border-forest/15 py-5"><div><p className="font-display text-3xl leading-none text-forest">{activePackage.price}</p><p className="mt-2 text-sm text-forest/60">{activePackage.note}</p></div><span className="text-sm font-bold uppercase tracking-[0.1em] text-sun-dark">Customizable</span></div><ul className="mt-6 grid gap-3 sm:grid-cols-2">{activePackage.features.map((feature) => <li key={feature} className="flex gap-2 text-sm text-forest/75"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-sun-text" />{feature}</li>)}</ul><div className="mt-8"><Button href={waLink(`Hello G'Host Villa! I am interested in the ${activePackage.title} package.`)}>Plan this stay</Button></div></div></Reveal>
        </div>
      </section>

      <section className="bg-forest-dark px-6 py-20 text-cream md:py-28"><div className="mx-auto max-w-[1440px]"><Reveal className="mx-auto mb-12 max-w-3xl text-center"><p className="label !text-sun">Recommended experiences</p><h2 className="mt-4 font-display text-5xl font-semibold leading-[0.94] tracking-[-0.045em] text-cream sm:text-6xl">Add a little more to the stay.</h2></Reveal><div className="grid gap-5 md:grid-cols-3">{experiences.map((item) => <article key={item.title} className="group overflow-hidden bg-cream text-forest"><div className="aspect-[4/3] overflow-hidden"><img src={item.image} alt={item.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /></div><div className="p-6"><h3 className="font-display text-3xl leading-none tracking-[-0.035em]">{item.title}</h3><p className="mt-3 leading-relaxed text-forest/65">{item.text}</p></div></article>)}</div></div></section>

      <section className="bg-cream py-20 md:py-28"><Reveal className="wrap grid gap-6 bg-sun p-8 md:grid-cols-[1fr_auto] md:items-center md:p-12"><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-forest/65">Have something else in mind?</p><h2 className="mt-3 max-w-2xl font-display text-4xl leading-none tracking-[-0.04em] text-forest sm:text-5xl">Tell us what would make the stay feel right.</h2></div><Button href={waLink('Hello G\'Host Villa! I would like to create a custom package.')} variant="dark">Create a custom plan</Button></Reveal></section>
    </>
  )
}
