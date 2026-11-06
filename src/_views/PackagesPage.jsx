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

const comparisonSets = {
  packages: {
    label: 'Stay packages',
    headers: ['Package', 'Stay length', 'Double occupancy', 'Extra adult', 'Child'],
    rows: [
      ['Couple escape', '1–2 nights', 'NPR 6,800', 'NPR 6,800', 'Ask us'],
      ['Group weekend', '3–4 nights', 'NPR 1,550 pp', 'NPR 1,550', 'NPR 950'],
      ['Full villa buyout', '4+ nights', 'Custom', 'Custom', 'Ask us'],
    ],
  },
  services: {
    label: 'Hosted services',
    headers: ['Service', 'Couple escape', 'Group weekend', 'Full buyout'],
    rows: [
      ['Breakfast', 'For two', 'For everyone', 'Daily service'],
      ['Private hosting', 'On request', 'Included', 'Dedicated team'],
      ['Celebration setup', 'Add-on', 'Add-on', 'Included planning'],
    ],
  },
  amenities: {
    label: 'Included amenities',
    headers: ['Amenity', 'Couple escape', 'Group weekend', 'Full buyout'],
    rows: [
      ['Mountain and valley views', '✓', '✓', '✓'],
      ['Hot water and Wi-Fi', '✓', '✓', '✓'],
      ['Garden, dining and common spaces', 'Shared', 'Private wing', 'Entire estate'],
    ],
  },
}

export default function PackagesPage() {
  const [activeId, setActiveId] = useState('couple')
  const [days, setDays] = useState('weekend')
  const [people, setPeople] = useState('couple')
  const [vibe, setVibe] = useState('slow')
  const [step, setStep] = useState(0)
  const [comparisonTab, setComparisonTab] = useState('packages')
  const activePackage = packages.find((item) => item.id === activeId) ?? packages[0]
  const recommendedId = people === 'buyout' || (people === 'group' && (days === 'long' || vibe === 'celebrate')) ? 'buyout' : people === 'group' ? 'family' : 'couple'
  const recommendedPackage = packages.find((item) => item.id === recommendedId) ?? packages[0]
  const comparison = comparisonSets[comparisonTab]
  const promptSteps = [
    { question: 'How many days are you staying?', value: days, setValue: setDays, options: [['short', '1–2 nights'], ['weekend', '3–4 nights'], ['long', '5+ nights']] },
    { question: 'Who are you bringing?', value: people, setValue: setPeople, options: [['couple', 'Just two'], ['group', 'Family / friends'], ['buyout', 'A private buyout']] },
    { question: 'What should the stay feel like?', value: vibe, setValue: setVibe, options: [['slow', 'Slow & scenic'], ['celebrate', 'Food & celebration'], ['mix', 'A little of everything']] },
  ]
  const currentPrompt = promptSteps[step]

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
          <Reveal className="mb-12 border border-forest/15 bg-cream p-6 sm:p-8 md:p-10"><div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-end"><div><p className="label">Find your fit · step {step + 1} of {promptSteps.length}</p><h2 className="mt-4 max-w-xl font-display text-4xl leading-[0.95] tracking-[-0.04em] text-forest sm:text-5xl">Tell us a little. We’ll suggest the right package.</h2><p className="mt-4 max-w-xl leading-relaxed text-forest/70">Answer three quick questions and we’ll narrow it down to the stay that fits.</p></div><div className="border-l-2 border-sun pl-5 text-forest/70"><p className="text-xs font-bold uppercase tracking-[0.14em] text-sun-dark">Your match updates live</p><p className="mt-2 font-display text-3xl leading-none text-forest">{recommendedPackage.title}</p><p className="mt-2 text-sm leading-relaxed">{recommendedPackage.price} · {recommendedPackage.note}</p></div></div><div className="mt-8 border-t border-forest/15 pt-7" aria-live="polite"><div className="mb-5 flex gap-2" aria-label="Recommendation progress">{promptSteps.map((item, index) => <span key={item.question} className={`h-1.5 flex-1 transition ${index <= step ? 'bg-sun-dark' : 'bg-forest/15'}`} />)}</div><p className="text-xs font-bold uppercase tracking-[0.14em] text-sun-dark">Question {step + 1}</p><h3 className="mt-2 font-display text-3xl leading-none text-forest sm:text-4xl">{currentPrompt.question}</h3><div role="radiogroup" aria-label={currentPrompt.question} className="mt-6 grid gap-3 sm:grid-cols-3">{currentPrompt.options.map(([value, label]) => <button key={value} type="button" role="radio" aria-checked={currentPrompt.value === value} onClick={() => currentPrompt.setValue(value)} className={`min-h-14 border px-4 text-left text-sm transition ${currentPrompt.value === value ? 'border-forest bg-forest text-cream' : 'border-forest/20 text-forest hover:border-forest/50'}`}>{label}<span className="float-right text-lg">{currentPrompt.value === value ? '✓' : '○'}</span></button>)}</div></div><div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-forest/15 pt-6"><button type="button" onClick={() => setStep((value) => Math.max(0, value - 1))} disabled={step === 0} className="min-h-11 px-1 text-sm font-bold uppercase tracking-[0.1em] text-forest/60 transition hover:text-forest disabled:invisible">← Back</button>{step < promptSteps.length - 1 ? <button type="button" onClick={() => setStep((value) => Math.min(promptSteps.length - 1, value + 1))} className="inline-flex min-h-12 items-center justify-center bg-sun px-6 text-sm font-bold uppercase tracking-[0.1em] text-forest transition hover:bg-sun-dark">Next question <span className="ml-3 text-lg">→</span></button> : <button type="button" onClick={() => setActiveId(recommendedPackage.id)} className="inline-flex min-h-12 items-center justify-center bg-sun px-6 text-sm font-bold uppercase tracking-[0.1em] text-forest transition hover:bg-sun-dark">See this package <span className="ml-3 text-lg">↗</span></button>}</div></Reveal>
          <div role="tablist" aria-label="Stay packages" className="mx-auto mb-8 grid max-w-4xl gap-px bg-forest/15 sm:grid-cols-3">{packages.map((item) => <button key={item.id} type="button" role="tab" aria-selected={activeId === item.id} onClick={() => setActiveId(item.id)} className={`min-h-14 bg-cream px-4 text-sm font-bold uppercase tracking-[0.1em] transition ${activeId === item.id ? 'bg-forest text-cream' : 'text-forest hover:bg-cream/70'}`}>{item.label}</button>)}</div>
          <Reveal className="grid overflow-hidden border border-forest/15 bg-cream lg:grid-cols-[0.85fr_1.15fr]" key={activePackage.id}><img src={activePackage.image} alt={activePackage.title} className="h-72 w-full object-cover lg:h-full" /><div className="p-7 sm:p-10"><p className="label">{activePackage.label}</p><h3 className="mt-4 font-display text-4xl leading-[0.95] tracking-[-0.04em] text-forest sm:text-5xl">{activePackage.title}</h3><p className="mt-5 max-w-xl leading-relaxed text-forest/70">{activePackage.intro}</p><div className="mt-7 flex flex-wrap items-end justify-between gap-4 border-y border-forest/15 py-5"><div><p className="font-display text-3xl leading-none text-forest">{activePackage.price}</p><p className="mt-2 text-sm text-forest/60">{activePackage.note}</p></div><span className="text-sm font-bold uppercase tracking-[0.1em] text-sun-dark">Customizable</span></div><ul className="mt-6 grid gap-3 sm:grid-cols-2">{activePackage.features.map((feature) => <li key={feature} className="flex gap-2 text-sm text-forest/75"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-sun-text" />{feature}</li>)}</ul><div className="mt-8"><Button href={waLink(`Hello G'Host Villa! I am interested in the ${activePackage.title} package.`)}>Plan this stay</Button></div></div></Reveal>

          <Reveal className="mt-14 border border-forest/15 bg-cream p-5 sm:p-8"><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="label">Package comparison</p><h2 className="mt-3 font-display text-4xl leading-none tracking-[-0.04em] text-forest sm:text-5xl">See what fits before you book.</h2></div><p className="max-w-sm text-sm leading-relaxed text-forest/65">A clear starting point for choosing a couple stay, group weekend or private villa buyout.</p></div><div role="tablist" aria-label="Package details" className="mt-8 flex flex-wrap border-b border-forest/15">{Object.entries(comparisonSets).map(([id, set]) => <button key={id} type="button" role="tab" aria-selected={comparisonTab === id} onClick={() => setComparisonTab(id)} className={`border-b-2 px-4 py-3 text-sm font-bold uppercase tracking-[0.08em] transition sm:px-6 ${comparisonTab === id ? 'border-sun bg-sun/15 text-forest' : 'border-transparent text-forest/55 hover:text-forest'}`}>{set.label}</button>)}</div><div className="mt-6 overflow-x-auto"><table className="min-w-[680px] w-full border-collapse text-left text-sm"><thead className="bg-forest text-cream"><tr>{comparison.headers.map((header) => <th key={header} className="px-4 py-4 font-bold sm:px-5">{header}</th>)}</tr></thead><tbody>{comparison.rows.map((row, rowIndex) => <tr key={row[0]} className={rowIndex % 2 === 0 ? 'bg-sage/30' : 'bg-cream'}>{row.map((cell, cellIndex) => <td key={`${row[0]}-${cellIndex}`} className={`border-b border-forest/10 px-4 py-4 sm:px-5 ${cellIndex === 0 ? 'font-semibold text-forest' : 'text-forest/70'}`}>{cell}</td>)}</tr>)}</tbody></table></div></Reveal>
        </div>
      </section>

      <section className="bg-forest-dark px-6 py-20 text-cream md:py-28"><div className="mx-auto max-w-[1440px]"><Reveal className="mx-auto mb-12 max-w-3xl text-center"><p className="label !text-sun">Recommended experiences</p><h2 className="mt-4 font-display text-5xl font-semibold leading-[0.94] tracking-[-0.045em] text-cream sm:text-6xl">Add a little more to the stay.</h2></Reveal><div className="grid gap-5 md:grid-cols-3">{experiences.map((item) => <article key={item.title} className="group overflow-hidden bg-cream text-forest"><div className="aspect-[4/3] overflow-hidden"><img src={item.image} alt={item.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /></div><div className="p-6"><h3 className="font-display text-3xl leading-none tracking-[-0.035em]">{item.title}</h3><p className="mt-3 leading-relaxed text-forest/65">{item.text}</p></div></article>)}</div></div></section>

      <section className="bg-cream py-20 md:py-28"><Reveal className="wrap grid gap-6 bg-sun p-8 md:grid-cols-[1fr_auto] md:items-center md:p-12"><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-forest/65">Have something else in mind?</p><h2 className="mt-3 max-w-2xl font-display text-4xl leading-none tracking-[-0.04em] text-forest sm:text-5xl">Tell us what would make the stay feel right.</h2></div><Button href={waLink('Hello G\'Host Villa! I would like to create a custom package.')} variant="dark">Create a custom plan</Button></Reveal></section>
    </>
  )
}
