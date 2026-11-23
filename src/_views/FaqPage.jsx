'use client'

import { Clock, Coffee, MapPin, Wifi } from 'lucide-react'
import Faq from '../components/Faq.jsx'
import Jobs from '../components/Jobs.jsx'
import { Divider, Reveal } from '../components/ui.jsx'
import { useBackendData } from '../lib/backend.jsx'

const quickFacts = [
  { icon: Clock, label: 'Check-in / Out', value: '2:00 PM · 11:00 AM' },
  { icon: MapPin, label: 'Location', value: '20 mins from Lakeside' },
  { icon: Coffee, label: 'Daily Breakfast', value: 'Included with stays' },
  { icon: Wifi, label: 'Parking & Wi-Fi', value: 'Free on-site' },
]

export default function FaqPage() {
  const backend = useBackendData()
  const content = backend?.faq?.content
  const iconByName = { Clock, MapPin, Coffee, Wifi }
  const facts = content?.quickFacts?.length
    ? content.quickFacts.map((f) => ({ ...f, icon: iconByName[f.icon] ?? Clock }))
    : quickFacts

  return (
    <>
      {/* 1 · Clean Editorial Header & Quick Facts */}
      <section className="border-b border-forest/10 bg-white pb-10 pt-28 md:pb-12 md:pt-36">
        <div className="wrap">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <Reveal className="max-w-2xl">
              <p className="label">{content?.heroEyebrow || 'Guest Guide · FAQ & Careers'}</p>
              <h1 className="mt-2 font-display text-4xl font-semibold leading-[0.94] tracking-[-0.045em] text-forest sm:text-6xl">
                {content?.heroTitle || 'Questions, answered.'}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-forest/75 md:text-lg">
                {content?.heroText || 'Everything you need to know about room configurations, rates, check-in, dining at the pyramid, and joining our hilltop team.'}
              </p>
            </Reveal>

            <Reveal delay={0.06} className="flex flex-wrap gap-2">
              <a
                href="#faq"
                className="rounded-full bg-forest px-4 py-2 text-xs font-semibold text-white transition hover:bg-forest-dark"
              >
                Guest FAQ
              </a>
              <a
                href="#jobs"
                className="rounded-full border border-forest/20 bg-white px-4 py-2 text-xs font-semibold text-forest transition hover:border-forest"
              >
                Careers
              </a>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {facts.map(({ icon: Ico, label, value }) => (
              <div
                key={label}
                className="flex items-start gap-3 rounded-2xl border border-forest/15 bg-white p-3.5 shadow-soft sm:p-4"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sun/20 text-sun-text">
                  <Ico className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-forest/55">{label}</p>
                  <p className="mt-0.5 truncate text-xs font-bold text-forest sm:text-sm">{value}</p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <Faq />

      <div className="border-t border-forest/10 bg-white">
        <Jobs />
      </div>

      <Divider prev="cream" next="forest" />
    </>
  )
}
