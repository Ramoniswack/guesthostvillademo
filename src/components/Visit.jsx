'use client'

import { Button, Reveal } from './ui.jsx'
import { directionsLink } from '../data/site.js'

const steps = [
  {
    n: '01',
    title: 'How to reach us',
    text: "Located along Sarangkot Road and Ranipauwa (Fulbari), about 20 minutes from central Pokhara and Lakeside. Take a quick taxi, car, or ride a bike or scooter up the scenic hillside road. Tap 'Get Directions' below to navigate directly.",
  },
  {
    n: '02',
    title: 'Best time to visit',
    text: 'Come at sunrise for golden Himalayan views over Annapurna and Machhapuchhre. Mornings are crisp and clear; evenings are magical for dinner and drinks at the pyramid restro as the valley lights glow.',
  },
  {
    n: '03',
    title: 'Dining & group bookings',
    text: 'We host groups and private villa buyouts up to 24 guests. Shared packages start from NPR 1,550/person with welcome drinks and breakfast. Pre-order barbecue platters or reserve your date via WhatsApp.',
  },
]

export default function Visit() {
  return (
    <section id="find-us" className="section">
      <div className="wrap grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] shadow-warm">
            <img
              src="/images/night-aerial.webp"
              alt="Night aerial photo showing the winding road up to G'Host Villa through the forest above Pokhara"
              width="1200"
              height="1496"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover object-[50%_58%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/90 via-forest-dark/20 to-transparent" />
            <h3 className="absolute inset-x-0 bottom-0 p-7 font-display text-3xl font-semibold leading-tight text-white md:text-4xl">
              Plan Your Visit to Sarangkot
            </h3>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="label">Find us</p>
          <h2 className="h2">Getting here is part of the view</h2>
          <ol className="mt-12 space-y-9">
            {steps.map((s) => (
              <li key={s.n} className="flex gap-5">
                <span className="font-display text-4xl font-semibold leading-none text-sun-text">{s.n}</span>
                <div>
                  <h3 className="text-xl font-medium text-forest">{s.title}</h3>
                  <p className="mt-1 text-base text-ink/90">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <Button href={directionsLink} variant="solid" className="mt-12">Get Directions</Button>
        </Reveal>
      </div>
    </section>
  )
}
