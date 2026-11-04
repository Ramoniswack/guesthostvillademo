'use client'

import Icon from './Icons.jsx'
import { Reveal } from './ui.jsx'
import KineticNumber from './KineticNumber.jsx'
import { stats } from '../data/site.js'
import { menuItemCount } from '../data/menu.js'
import { rooms } from '../data/rooms.js'

// computed stats resolve to live numbers from the data files
const COMPUTED = { MENU_COUNT: menuItemCount, ROOM_COUNT: rooms.length }

const benefits = [
  { icon: 'mountain', title: 'Mountain views', text: 'Phewa valley and the Annapurna range from the hilltop.' },
  { icon: 'bed', title: 'Rooms with breakfast', text: 'Comfortable rooms, breakfast every morning.' },
  { icon: 'utensils', title: 'Restaurant & bar on site', text: 'Momo, Newari plates, pizza, drinks and more.' },
  { icon: 'pine', title: 'Quiet, green hilltop', text: 'Pine, ferns and fresh air, away from the noise.' },
]

export default function WhyUs() {
  return (
    <section id="why" className="section pb-16 pt-12 md:pb-24 md:pt-24">
      <div className="wrap">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="label">Why G'Host Villa</p>
          <h2 className="h2">A calm place, kept simple</h2>
        </Reveal>

        <ul className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b, i) => (
            <li key={b.title}>
              <Reveal delay={i * 0.08} className="h-full">
                <div className="h-full rounded-[28px] bg-sand p-8 text-center">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cream text-forest">
                    <Icon name={b.icon} className="h-7 w-7" />
                  </span>
                  <h3 className="mt-6 text-xl font-semibold text-forest">{b.title}</h3>
                  <p className="mt-2 text-base text-muted">{b.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal className="mt-20 md:mt-28">
          <ul className="mx-auto grid max-w-5xl grid-cols-2 gap-10 border-y border-sage/40 py-12 text-center lg:grid-cols-4">
            {stats.map((s) => (
              <li key={s.label}>
                <p className="font-display text-5xl font-semibold text-forest md:text-6xl" style={{ letterSpacing: '-0.04em' }}>
                  <KineticNumber value={COMPUTED[s.value] ?? s.value} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-base text-muted">{s.label}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
