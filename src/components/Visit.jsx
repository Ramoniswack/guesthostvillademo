'use client'

import { Button, Reveal } from './ui.jsx'
import { directionsLink } from '../data/site.js'

const steps = [
  {
    n: '01',
    title: 'How to reach us',
    text: "From Lakeside or central Pokhara, take a taxi, or ride a bike or scooter up the winding road to Sarangkot. The road in the night photo is the one you'll follow. Open Google Maps with the button below.",
  },
  {
    n: '02',
    title: 'Best time to visit',
    text: 'Come at sunrise for the best light on the Himalayas. Clear, dry months usually give the sharpest views; mornings are clearest. Evenings are perfect for dinner as the valley lights come on.',
  },
  {
    n: '03',
    title: 'Dining & group tips',
    text: 'Sharing platters are great for groups. For parties, sushi or special dishes, order ahead on WhatsApp so everything is ready when you arrive.',
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
