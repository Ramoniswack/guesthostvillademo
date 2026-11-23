'use client'

import { Mail, MessageCircle } from 'lucide-react'
import { Reveal } from './ui.jsx'
import { jobs } from '../data/jobs.js'
import { site, waLink } from '../data/site.js'
import { backendWhatsAppLink, useBackendData } from '../lib/backend.jsx'

export default function Jobs() {
  const backend = useBackendData()
  const currentJobs = backend?.jobs?.jobs ?? jobs
  const content = backend?.jobs?.content
  const currentSite = backend?.site ?? site
  const currentWhatsApp = (message) => backendWhatsAppLink(currentSite, message) ?? waLink(message)

  return (
    <section id="jobs" className="py-14 md:py-20">
      <div className="wrap">
        {currentJobs.length > 0 && (
          <>
            <Reveal className="max-w-2xl">
              <p className="label">{content?.sectionEyebrow || 'Work with us'}</p>
              <h2 className="mt-1 font-display text-3xl font-semibold tracking-[-0.03em] text-forest sm:text-4xl">
                {content?.sectionTitle || 'Work where the view never gets old.'}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-forest/70 sm:text-base">
                {content?.sectionLead || 'We are a small, friendly team above Pokhara. If you like looking after people, we would love to hear from you.'}
              </p>
            </Reveal>

            <ul className="mt-8 grid gap-4 md:grid-cols-2">
              {currentJobs.map((j, i) => (
                <li key={j.id}>
                  <Reveal delay={(i % 2) * 0.06} className="h-full">
                    <article className="flex h-full flex-col rounded-2xl border border-forest/15 bg-white p-6 shadow-soft">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                        <span className="rounded-full bg-forest/5 px-3 py-1 text-forest">{j.type}</span>
                        <span className="rounded-full bg-sun/20 px-3 py-1 text-forest-dark">{j.team}</span>
                      </div>
                      <h3 className="mt-3 font-display text-xl font-semibold text-forest">{j.title}</h3>
                      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-forest/75">{j.blurb}</p>
                      <div className="mt-5">
                        <a
                          href={currentWhatsApp(`Hello! I'd like to apply for the ${j.title} position at G'Host Villa.`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-[38px] items-center justify-center gap-2 rounded-full bg-forest px-5 text-xs font-bold text-white transition hover:bg-forest-dark"
                        >
                          <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Apply on WhatsApp</span>
                        </a>
                      </div>
                    </article>
                  </Reveal>
                </li>
              ))}
            </ul>
          </>
        )}

        <Reveal className={currentJobs.length > 0 ? 'mt-10' : ''}>
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-forest-dark p-7 text-white shadow-warm md:flex-row md:items-center md:p-9">
            <div className="max-w-xl">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-sun">
                {content?.sectionEyebrow || 'Careers at G’Host Villa'}
              </p>
              <h2 className="mt-1.5 font-display text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
                {currentJobs.length === 0
                  ? content?.emptyTitle || 'Interested in joining our hilltop team?'
                  : content?.ctaTitle || "Don't see your role?"}
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-white/75 sm:text-sm">
                {currentJobs.length === 0
                  ? content?.emptyText || 'We have no open listings today, but we always welcome introductions from friendly kitchen, service and housekeeping staff in Pokhara.'
                  : content?.ctaText || "Send us a short message about yourself and your experience, and we'll keep you in mind."}
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2.5">
              <a
                href={currentWhatsApp("Hello! I'd like to work at G'Host Villa.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-full bg-sun px-5 text-xs font-bold text-forest-dark transition hover:bg-sun-dark"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                <span>Introduce yourself</span>
              </a>
              <a
                href={`mailto:${currentSite.email}?subject=${encodeURIComponent("Job enquiry: G'Host Villa")}`}
                className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-full border border-white/25 px-5 text-xs font-semibold text-white transition hover:border-white hover:bg-white hover:text-forest-dark"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                <span>Email your CV</span>
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
