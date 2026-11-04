'use client'

import Icon from './Icons.jsx'
import { Button, Reveal } from './ui.jsx'

const highlights = [
  '1 BHK, 4 BHK & 7 BHK layouts (up to 24 guests)',
  'Attached hot-water bath & air conditioning',
  'Private balconies with Annapurna mountain views',
  'Pyramid-roof restaurant & classy bottle bar',
  'Sprawling garden with elephant statue & lawns',
  'Natural pool, deck area & outdoor BBQ fireplace',
  'Complimentary breakfast & welcome drinks',
  '20 mins scenic drive from Lakeside Pokhara',
]

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
          <p className="label">About The G'Host Villa</p>
          <h2 className="h2">A Japanese-styled hilltop villa above Pokhara</h2>
          <p className="mt-5 text-lg text-ink/90">
            The G'Host Villa Restro and Bar sits along the tranquil Sarangkot / Ranipauwa ridge, just 20 minutes from the bustle of Pokhara.
            Wrapped in lush forest, ferns, and fresh mountain air, the property blends Japanese-inspired architecture with warm Nepalese hospitality.
          </p>
          <p className="mt-4 text-lg text-ink/90">
            Choose from peaceful 1 BHK Couple Deluxe suites or host your family and group in 4-BHK wings and 7-BHK full private villa buyouts (hosting up to 24 guests).
            Dine under the iconic pyramid-roof restaurant, sip handcrafted drinks at the bottle bar, or unwind around an evening BBQ and bonfire.
          </p>
          <ul className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {highlights.map((h) => (
              <li key={h} className="flex items-center gap-3 text-sm font-semibold text-forest sm:text-base">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sage/30 text-forest">
                  <Icon name="check" className="h-4 w-4" strokeWidth={2.5} />
                </span>
                {h}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/rooms" variant="solid">See All BHK &amp; Rooms</Button>
            <Button href="/menu" variant="outline">Restaurant &amp; Bar Menu</Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
