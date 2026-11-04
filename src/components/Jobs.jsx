'use client'

import Icon from './Icons.jsx'
import { Button, Reveal } from './ui.jsx'
import { jobs } from '../data/jobs.js'
import { site, waLink } from '../data/site.js'

export default function Jobs() {
  return (
    <section id="jobs" className="pb-24 pt-20 md:pb-40 md:pt-28">
      <div className="wrap">
        <Reveal className="max-w-2xl">
          <p className="label">Work with us</p>
          <h2 className="h2">Work where the view never gets old</h2>
          <p className="lead mt-6">We are a small, friendly team above Pokhara. If you like looking after people, we would love to hear from you.</p>
        </Reveal>

        {jobs.length === 0 ? (
          <div className="mt-14 rounded-[28px] bg-sand p-10 text-center text-lg text-forest">
            <p className="font-display text-3xl font-semibold">No confirmed openings right now.</p>
            <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-forest/70">Send a short introduction and your experience. When the right role opens, the villa team can reach out directly.</p>
          </div>
        ) : (
          <ul className="mt-16 grid gap-5 md:mt-20 md:grid-cols-2">
            {jobs.map((j, i) => (
              <li key={j.id}>
                <Reveal delay={(i % 2) * 0.08} className="h-full">
                  <article className="flex h-full flex-col rounded-[28px] bg-sand p-8 md:p-10">
                    <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                      <span className="rounded-full bg-cream px-3 py-1 text-forest">{j.type}</span>
                      <span className="rounded-full bg-cream px-3 py-1 text-forest">{j.team}</span>
                    </div>
                    <h3 className="mt-6 font-display text-2xl font-semibold text-forest md:text-[1.75rem]">{j.title}</h3>
                    <p className="mt-3 flex-1 text-lg text-ink/80">{j.blurb}</p>
                    <div className="mt-8">
                      <Button href={waLink(`Hello! I'd like to apply for the ${j.title} position at G'Host Villa.`)} icon="chat" arrow={false} variant="solid">
                        Apply on WhatsApp
                      </Button>
                    </div>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        )}

        <Reveal className="mt-16 md:mt-24">
          <div className="rounded-[32px] bg-forest p-10 text-center text-cream md:p-16">
            <h3 className="font-display text-3xl font-semibold md:text-5xl" style={{ letterSpacing: '-0.03em' }}>Don't see your role?</h3>
            <p className="mx-auto mt-4 max-w-xl text-xl text-cream/80">
              Send us a short message about yourself and your experience, and we'll keep you in mind.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button href={waLink("Hello! I'd like to work at G'Host Villa.")} icon="chat" arrow={false}>WhatsApp us</Button>
              <Button href={`mailto:${site.email}?subject=${encodeURIComponent("Job enquiry: G'Host Villa")}`} variant="light" icon="mail" arrow={false}>
                Email your CV
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
