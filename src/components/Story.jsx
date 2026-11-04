'use client'

import Icon from './Icons.jsx'
import { Button, Reveal } from './ui.jsx'

const highlights = ['Free Wi-Fi', 'Hot water', 'Attached bathroom', 'Private balcony', 'Tea / coffee maker', 'Breakfast included']

export default function Story() {
  return (
    <section id="about" className="section contour bg-sand">
      <div className="wrap grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
        <Reveal>
          <div className="relative">
            <img
              src="/images/pyramid.webp"
              alt="The pyramid-roof building at G'Host Villa with Annapurna and Machhapuchhre rising behind Pokhara valley"
              width="1600"
              height="900"
              loading="lazy"
              className="aspect-[4/3] w-full rounded-[28px] object-cover object-[40%_50%] shadow-warm"
            />
            <span className="absolute -bottom-5 right-5 inline-flex items-center gap-2 rounded-full bg-cream px-5 py-2.5 text-sm font-semibold text-forest shadow-soft">
              <Icon name="mountain" className="h-5 w-5 text-sun-text" /> Annapurna &amp; Machhapuchhre views
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="label">About us</p>
          <h2 className="h2">A quiet hilltop home away from home</h2>
          <p className="mt-5 text-lg text-ink/90">
            G'Host Villa sits high in Sarangkot, wrapped in pine and ferns. From the terrace you look over Phewa valley
            to the snow line of the Annapurna range. Stay in a simple, comfortable room, wake up to the mountains, then
            come down to our restaurant and bar for fresh food, a cold drink and an unhurried evening.
          </p>
          <p className="mt-4 text-lg text-ink/90">
            For three years we have looked after travellers from around the world, with over 10,000 guests welcomed so far.
          </p>
          <ul className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {highlights.map((h) => (
              <li key={h} className="flex items-center gap-3 text-base font-semibold text-forest">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sage/30 text-forest">
                  <Icon name="check" className="h-4 w-4" strokeWidth={2.5} />
                </span>
                {h}
              </li>
            ))}
          </ul>
          <Button href="/rooms" variant="outline" className="mt-10">See Rooms</Button>
        </Reveal>
      </div>
    </section>
  )
}
