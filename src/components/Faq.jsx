'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, MessageCircle, Navigation, Phone, Search, X } from 'lucide-react'
import { Reveal } from './ui.jsx'
import { faqs } from '../data/faq.js'
import { directionsLink, site, telLink, waLink } from '../data/site.js'
import { backendWhatsAppLink, useBackendData } from '../lib/backend.jsx'

const TOPICS = [
  { id: 'all', label: 'All questions' },
  { id: 'stays', label: 'Stays & Rates' },
  { id: 'checkin', label: 'Check-in & Amenities' },
  { id: 'dining', label: 'Dining & Events' },
  { id: 'location', label: 'Location & Booking' },
]

function inferTopic(faq) {
  if (faq.topic) return faq.topic
  const text = `${faq.q} ${faq.a}`.toLowerCase()
  if (text.includes('rate') || text.includes('bhk') || text.includes('room type')) return 'stays'
  if (text.includes('check-in') || text.includes('amenities') || text.includes('parking')) return 'checkin'
  if (text.includes('breakfast') || text.includes('parties') || text.includes('retreat')) return 'dining'
  return 'location'
}

export default function Faq() {
  const backend = useBackendData()
  const currentFaqs = backend?.faq?.faqs?.length ? backend.faq.faqs : faqs
  const content = backend?.faq?.content
  const currentSite = backend?.site ?? site
  const currentTel = currentSite.phoneTel ? `tel:${currentSite.phoneTel}` : telLink
  const currentDirections = currentSite.directionsLink ?? directionsLink
  const currentWhatsApp = (msg) => backendWhatsAppLink(currentSite, msg) ?? waLink(msg)

  const [openIndex, setOpenIndex] = useState(0)
  const [topic, setTopic] = useState('all')
  const [query, setQuery] = useState('')

  const q = query.trim().toLowerCase()

  const filteredFaqs = useMemo(() => {
    return currentFaqs.filter((item) => {
      const itemTopic = inferTopic(item)
      if (topic !== 'all' && itemTopic !== topic) return false
      if (!q) return true
      return `${item.q} ${item.a}`.toLowerCase().includes(q)
    })
  }, [currentFaqs, topic, q])

  return (
    <section id="faq" className="bg-white py-14 md:py-20">
      <div className="wrap">
        {/* Search & Topic Filter Bar */}
        <div className="mb-8 flex flex-col gap-3 border-b border-forest/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
            {TOPICS.map((t) => {
              const active = topic === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setTopic(t.id)
                    setOpenIndex(0)
                  }}
                  aria-pressed={active}
                  className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-forest text-white'
                      : 'border border-forest/15 bg-white text-forest/75 hover:border-forest/40 hover:text-forest'
                  }`}
                >
                  {t.label}
                </button>
              )
            })}
          </div>

          <label className="relative flex w-full items-center sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-forest/45" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setOpenIndex(0)
              }}
              placeholder="Search questions..."
              aria-label="Search FAQ"
              className="w-full rounded-full border border-forest/15 bg-white py-2 pl-10 pr-9 text-xs font-medium text-forest placeholder:text-forest/45 focus:border-forest focus:outline-none sm:text-sm"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-3 text-forest/45 hover:text-forest"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </label>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-12">
          {/* Left Sticky Help Card */}
          <Reveal className="rounded-2xl border border-forest/15 bg-white p-6 shadow-soft lg:sticky lg:top-24">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-sun-text">
              {content?.sectionEyebrow || 'Direct support'}
            </p>
            <h2 className="mt-1.5 font-display text-2xl font-semibold leading-tight tracking-[-0.025em] text-forest">
              {content?.sectionTitle || 'Still have a question?'}
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-forest/70 sm:text-sm">
              {content?.sectionLead || "Message our front desk on WhatsApp or give us a call—we're happy to help with custom group rates, transport or dietary requests."}
            </p>

            <div className="mt-5 space-y-2">
              <a
                href={currentWhatsApp("Hello G'Host Villa! I have a quick question.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[40px] w-full items-center justify-center gap-2 rounded-full bg-sun px-4 text-xs font-bold text-forest-dark transition hover:bg-sun-dark"
              >
                <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Ask on WhatsApp</span>
              </a>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={currentTel}
                  className="inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-full border border-forest/20 bg-white px-3 text-xs font-semibold text-forest transition hover:border-forest"
                >
                  <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>Call us</span>
                </a>
                <a
                  href={currentDirections}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-full border border-forest/20 bg-white px-3 text-xs font-semibold text-forest transition hover:border-forest"
                >
                  <Navigation className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>Directions</span>
                </a>
              </div>
            </div>
          </Reveal>

          {/* Right Accordion List */}
          <div>
            {filteredFaqs.length === 0 ? (
              <div className="rounded-2xl border border-forest/15 bg-white p-10 text-center shadow-soft">
                <p className="font-display text-lg font-semibold text-forest">No matching questions found.</p>
                <p className="mt-1 text-xs text-forest/65">Try another keyword or switch back to all questions.</p>
                <button
                  type="button"
                  onClick={() => {
                    setTopic('all')
                    setQuery('')
                  }}
                  className="mt-4 rounded-full bg-sun px-5 py-2 text-xs font-bold text-forest-dark transition hover:bg-sun-dark"
                >
                  Show all questions
                </button>
              </div>
            ) : (
              <ul className="space-y-3">
                {filteredFaqs.map((f, i) => {
                  const isOpen = openIndex === i
                  return (
                    <li
                      key={f.q}
                      className={`overflow-hidden rounded-2xl border bg-white transition-colors ${
                        isOpen
                          ? 'border-forest/35 shadow-soft'
                          : 'border-forest/15 hover:border-forest/30'
                      }`}
                    >
                      <h3>
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          aria-controls={`faq-panel-${i}`}
                          id={`faq-btn-${i}`}
                          onClick={() => setOpenIndex(isOpen ? null : i)}
                          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-display text-base font-semibold leading-snug text-forest sm:px-6 sm:text-lg"
                        >
                          <span>{f.q}</span>
                          <span
                            className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-transform duration-300 ${
                              isOpen
                                ? 'rotate-180 border-sun bg-sun text-forest-dark'
                                : 'border-forest/15 bg-white text-forest'
                            }`}
                          >
                            <ChevronDown className="h-4 w-4" aria-hidden="true" />
                          </span>
                        </button>
                      </h3>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            id={`faq-panel-${i}`}
                            role="region"
                            aria-labelledby={`faq-btn-${i}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.24, ease: 'easeInOut' }}
                          >
                            <p className="border-t border-forest/10 px-5 pb-5 pt-3.5 text-sm leading-relaxed text-forest/75 sm:px-6">
                              {f.a}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
