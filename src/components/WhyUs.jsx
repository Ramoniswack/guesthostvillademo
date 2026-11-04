'use client'

import { motion } from 'framer-motion'
import Icon from './Icons.jsx'
import { Reveal } from './ui.jsx'
import KineticNumber from './KineticNumber.jsx'
import { stats } from '../data/site.js'
import { menuItemCount } from '../data/menu.js'
import { rooms } from '../data/rooms.js'

// computed stats resolve to live numbers from the data files
const COMPUTED = { MENU_COUNT: menuItemCount, ROOM_COUNT: rooms.length }

const benefits = [
  { icon: 'mountain', title: 'Mountain views', text: 'Phewa valley and the Annapurna range from the hilltop.', emoji: '🏔️' },
  { icon: 'bed', title: 'Rooms with breakfast', text: 'Comfortable rooms, breakfast every morning.', emoji: '🛏️' },
  { icon: 'utensils', title: 'Restaurant & bar on site', text: 'Momo, Newari plates, pizza, drinks and more.', emoji: '🍽️' },
  { icon: 'pine', title: 'Quiet, green hilltop', text: 'Pine, ferns and fresh air, away from the noise.', emoji: '🌲' },
]

function BenefitCard({ b, i }) {
  return (
    <motion.div
      className="group relative h-full cursor-default overflow-hidden rounded-[28px] bg-sand p-8 text-center"
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Animated gradient glow on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-[28px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(47,74,58,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Icon circle with interactive pulse */}
      <motion.span
        className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cream text-forest shadow-sm"
        whileHover={{ scale: 1.15, rotate: 6 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      >
        <Icon name={b.icon} className="h-7 w-7 transition-transform duration-300 group-hover:scale-110" />

        {/* Ping ring on hover */}
        <span className="absolute inset-0 rounded-full bg-forest/10 opacity-0 transition-all duration-500 group-hover:scale-[1.7] group-hover:opacity-100 group-hover:animate-ping" />
      </motion.span>

      <h3 className="mt-6 text-xl font-semibold text-forest transition-colors duration-300 group-hover:text-forest-dark">
        {b.title}
      </h3>
      <p className="mt-2 text-base text-muted transition-colors duration-300 group-hover:text-ink/70">
        {b.text}
      </p>

      {/* Bottom accent line that grows on hover */}
      <div className="absolute bottom-0 left-1/2 h-[3px] w-0 -translate-x-1/2 rounded-full bg-sun transition-all duration-500 group-hover:w-16" />
    </motion.div>
  )
}

function StatItem({ s, i }) {
  return (
    <motion.li
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group cursor-default"
    >
      <p
        className="font-display text-5xl font-semibold text-forest transition-colors duration-300 group-hover:text-sun-text md:text-6xl"
        style={{ letterSpacing: '-0.04em' }}
      >
        <KineticNumber value={COMPUTED[s.value] ?? s.value} suffix={s.suffix} />
      </p>
      <p className="mt-2 text-base text-muted transition-colors duration-300 group-hover:text-ink/70">
        {s.label}
      </p>
    </motion.li>
  )
}

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
                <BenefitCard b={b} i={i} />
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal className="mt-20 md:mt-28">
          <ul className="mx-auto grid max-w-5xl grid-cols-2 gap-10 border-y border-sage/40 py-12 text-center lg:grid-cols-4">
            {stats.map((s, i) => (
              <StatItem key={s.label} s={s} i={i} />
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
