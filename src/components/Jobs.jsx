'use client'

import { jobs } from '../data/jobs.js'
import { site, waLink } from '../data/site.js'
import { backendWhatsAppLink, useBackendData } from '../lib/backend.jsx'
import { Button } from './ui.jsx'

export default function Jobs() {
  const backend = useBackendData()
  const currentJobs = backend?.jobs?.jobs ?? jobs
  const content = backend?.jobs?.content
  const currentSite = backend?.site ?? site
  const whatsapp = (message) => backendWhatsAppLink(currentSite, message) ?? waLink(message)
  const empty = currentJobs.length === 0

  return (
    <section id="jobs" className="border-t border-forest/15 section-y">
      <div className="wrap grid gap-3 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
        <p className="label !mb-0">{content?.sectionEyebrow || 'Careers'}</p>

        <div className="min-w-0 max-w-3xl">
          <h2 className="font-display font-semibold text-forest type-section">
            {empty ? content?.emptyTitle || 'Interested in joining our hilltop team?' : content?.sectionTitle || 'Work where the view never gets old.'}
          </h2>
          <p className="t-body mt-3 text-muted">
            {empty
              ? content?.emptyText || 'We have no open listings today, but we always welcome introductions from friendly kitchen, service and housekeeping staff in Pokhara.'
              : content?.sectionLead || 'We are a small, friendly team above Pokhara. If you like looking after people, we would love to hear from you.'}
          </p>

          {!empty && (
            <ul className="mt-8 border-t border-forest/15">
              {currentJobs.map((j) => (
                <li key={j.id} className="border-b border-forest/15 py-5">
                  <p className="t-small text-muted">{j.type} · {j.team}</p>
                  <h3 className="mt-1 font-display type-item font-semibold text-forest">{j.title}</h3>
                  <p className="t-body mt-2 text-muted">{j.blurb}</p>
                  <a href={whatsapp(`Hello! I'd like to apply for the ${j.title} position at G'Host Villa.`)} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-12 items-center text-base underline underline-offset-4 hover:text-sun-text">
                    Apply on WhatsApp
                  </a>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button href={whatsapp("Hello! I'd like to work at G'Host Villa.")} icon="chat" arrow={false}>Introduce yourself</Button>
            <a href={`mailto:${currentSite.email}?subject=${encodeURIComponent("Job enquiry: G'Host Villa")}`} className="inline-flex min-h-12 items-center text-base underline underline-offset-4 hover:text-sun-text">
              Email your CV
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
