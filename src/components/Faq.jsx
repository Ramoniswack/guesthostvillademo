'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Plus, Search } from 'lucide-react'
import { faqs } from '../data/faq.js'
import { directionsLink, site, telLink, waLink } from '../data/site.js'
import { backendWhatsAppLink, useBackendData } from '../lib/backend.jsx'
import { Button } from './ui.jsx'

const ease = [0.22, 1, 0.36, 1]

const TOPICS = [
  { id: 'all', label: 'All questions' },
  { id: 'stays', label: 'Stays & rates' },
  { id: 'checkin', label: 'Check-in' },
  { id: 'dining', label: 'Dining' },
  { id: 'location', label: 'Location & booking' },
]

const STOP = new Set(['the', 'and', 'for', 'can', 'are', 'you', 'how', 'what', 'does', 'with', 'have', 'there', 'your', 'our', 'any', 'is', 'do'])

// Entries in data/faq.js carry a `topic`. Entries from the CMS may not, so fall back to whole-word matching.
function inferTopic(faq) {
  if (faq.topic) return faq.topic
  const text = `${faq.q} ${faq.a}`.toLowerCase()
  if (/\b(rates?|bhk|room types?|price|prices)\b/.test(text)) return 'stays'
  if (/\b(check-in|check-out|amenities|parking)\b/.test(text)) return 'checkin'
  if (/\b(breakfast|restaurant|menu|food)\b/.test(text)) return 'dining'
  return 'location'
}

function score(faq, query) {
  const words = query.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2 && !STOP.has(w))
  if (!words.length) return 1
  const q = faq.q.toLowerCase()
  const a = faq.a.toLowerCase()
  return words.reduce((n, w) => n + (q.includes(w) ? 2 : 0) + (a.includes(w) ? 1 : 0), 0)
}

export default function Faq() {
  const backend = useBackendData()
  const reduce = useReducedMotion()
  const list = backend?.faq?.faqs?.length ? backend.faq.faqs : faqs
  const content = backend?.faq?.content
  const currentSite = backend?.site ?? site
  const tel = currentSite.phoneTel ? `tel:${currentSite.phoneTel}` : telLink
  const directions = currentSite.directionsLink ?? directionsLink
  const whatsapp = (msg) => backendWhatsAppLink(currentSite, msg) ?? waLink(msg)

  const [topic, setTopic] = useState('all')
  const [query, setQuery] = useState('')
  const [openIdx, setOpenIdx] = useState(null)

  const counts = useMemo(() => {
    const c = { all: list.length }
    list.forEach((f) => { const t = inferTopic(f); c[t] = (c[t] || 0) + 1 })
    return c
  }, [list])

  const visible = useMemo(() => {
    const q = query.trim()
    return list
      .map((f, i) => ({ f, i, s: q ? score(f, q) : 1 }))
      .filter(({ f, s }) => s > 0 && (topic === 'all' || inferTopic(f) === topic))
      .sort((a, b) => (q ? b.s - a.s : a.i - b.i))
  }, [list, topic, query])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: list.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }

  return (
    <section id="faq" className="section-pb">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <div className="wrap grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
        {/* Search + topics */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <label className="relative block">
            <span className="sr-only">Search questions</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-forest/50" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setOpenIdx(null) }}
              placeholder="Search questions"
              autoComplete="off"
              style={{ paddingLeft: '2.5rem' }}
              className="h-12 w-full rounded-xl border border-forest/20 bg-white pr-3.5 text-base text-forest placeholder:text-forest/45 focus:border-forest focus:outline-none"
            />
          </label>

          <div
            role="tablist"
            aria-label="Filter by topic"
            className="no-scrollbar -mx-5 mt-5 flex overflow-x-auto border-b border-forest/15 px-5 sm:-mx-8 sm:px-8 lg:mx-0 lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-l lg:px-0"
          >
            {TOPICS.filter((t) => t.id === 'all' || counts[t.id]).map((t) => {
              const selected = topic === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => { setTopic(t.id); setOpenIdx(null) }}
                  className={`-mb-px flex min-h-12 shrink-0 items-center justify-between gap-6 whitespace-nowrap border-b-2 px-3 text-left text-base transition-colors lg:-ml-px lg:mb-0 lg:border-b-0 lg:border-l-2 lg:px-4 ${selected ? 'border-forest font-semibold text-forest' : 'border-transparent text-forest/60 hover:text-forest'}`}
                >
                  <span>{t.label}</span>
                  <span className="hidden text-sm tabular-nums text-forest/45 lg:inline">{counts[t.id]}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Questions */}
        <div className="min-w-0 max-w-3xl">
          {visible.length > 0 ? (
            <>
              <p aria-live="polite" className="t-small mb-3 text-muted">
                {visible.length} {visible.length === 1 ? 'question' : 'questions'}
              </p>
              <ul className="border-t border-forest/15">
                {visible.map(({ f, i }, n) => {
                  const open = openIdx === i
                  return (
                    <li key={f.q} className="border-b border-forest/15">
                      <h3>
                        <button
                          type="button"
                          aria-expanded={open}
                          aria-controls={`faq-a-${n}`}
                          onClick={() => setOpenIdx(open ? null : i)}
                          className="flex min-h-16 w-full items-start justify-between gap-6 py-5 text-left"
                        >
                          <span className="font-display type-item font-semibold text-forest">{f.q}</span>
                          <Plus className={`mt-0.5 h-5 w-5 shrink-0 transition-transform duration-300 ${open ? 'rotate-45 text-forest' : 'text-forest/55'}`} aria-hidden="true" />
                        </button>
                      </h3>
                      <AnimatePresence initial={false}>
                        {open && (
                          <motion.div
                            id={`faq-a-${n}`}
                            initial={reduce ? false : { height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease }}
                            className="overflow-hidden"
                          >
                            <p className="t-body pb-6 pr-10 text-justify text-muted">{f.a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  )
                })}
              </ul>
            </>
          ) : (
            <div className="border-y border-forest/15 py-8">
              <p className="t-body text-muted">No answer for that yet. Ask the team directly and we’ll reply personally.</p>
              <Button href={whatsapp(`Hello G'Host Villa! ${query}`)} icon="chat" arrow={false} className="mt-4">Send on WhatsApp</Button>
            </div>
          )}

          <div className="mt-12 md:mt-16">
            <p className="label">{content?.sectionEyebrow || 'Talk to us'}</p>
            <h2 className="font-display font-semibold text-forest type-sub">{content?.sectionTitle || 'Still have a question?'}</h2>
            <p className="t-body mt-2 text-muted">
              {content?.sectionLead || 'Message or call the front desk. Custom group rates, transport and dietary requests are no trouble.'}
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Button href={whatsapp("Hello G'Host Villa! I have a quick question.")} icon="chat" arrow={false}>WhatsApp us</Button>
              <Button href={tel} variant="outline" icon="phone" arrow={false}>Call us</Button>
              <a href={directions} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center text-base underline underline-offset-4 hover:text-sun-text">Get directions</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
