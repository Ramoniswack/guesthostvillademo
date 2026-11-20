'use client'

import { PageHero } from '../components/ui.jsx'
import Faq from '../components/Faq.jsx'
import Jobs from '../components/Jobs.jsx'
import CtaBanner from '../components/CtaBanner.jsx'

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="Good to know · Careers"
        title="Questions & careers."
        text="Check-in, food, getting here—and how to join the villa team."
        image="/images/day-aerial.webp"
        position="50% 55%"
        compact
      />

      <div className="border-b border-forest/10 bg-white py-4">
        <div className="wrap flex flex-wrap items-center gap-3">
          <a
            href="#faq"
            className="rounded-full bg-forest px-4 py-2 text-xs font-semibold text-cream transition hover:bg-forest-dark"
          >
            Guest FAQ
          </a>
          <a
            href="#jobs"
            className="rounded-full border border-forest/20 bg-white px-4 py-2 text-xs font-semibold text-forest transition hover:border-forest"
          >
            Work with us (Careers)
          </a>
        </div>
      </div>

      <Faq />

      <div className="border-t border-forest/10 bg-white/35">
        <Jobs />
      </div>

      <CtaBanner />
    </>
  )
}
