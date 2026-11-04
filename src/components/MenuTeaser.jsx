'use client'

import { Button, Reveal } from './ui.jsx'
import { menuItemCount } from '../data/menu.js'

/** Home-page teaser for the full Menu page. */
export default function MenuTeaser() {
  return (
    <section id="restaurant" className="section contour bg-sand">
      <div className="wrap grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
        <Reveal delay={0.1} className="order-2 lg:order-1">
          <p className="label">Restro &amp; Bar</p>
          <h2 className="h2">Fresh food, mountain air</h2>
          <p className="lead mt-6">
            Momo, Newari plates, pizza and pasta, plus drinks from the bar. {menuItemCount}+ dishes and drinks, with a veg-only
            filter and search built in.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/menu">View full menu</Button>
          </div>
        </Reveal>
        <Reveal className="order-1 lg:order-2">
          <img
            src="/images/garden.webp"
            alt="Garden with a white elephant statue, ferns and a lawn beside the villa"
            loading="lazy"
            className="aspect-[4/3] w-full rounded-[32px] object-cover"
          />
        </Reveal>
      </div>
    </section>
  )
}
