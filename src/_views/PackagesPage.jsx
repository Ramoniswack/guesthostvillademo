'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, CalendarDays, Check, Clock, Send, ShieldCheck, Star } from 'lucide-react'
import { BookingFlow, IncludesExplorer, PackagePicker } from '../components/PackageExtras.jsx'
import { CustomSelect, PageHeader, Reveal } from '../components/ui.jsx'
import { extras, packageFaqs, packages } from '../data/packages.js'
import { reviews } from '../data/reviews.js'
import { site, waLink } from '../data/site.js'
import { backendWhatsAppLink, useBackendData } from '../lib/backend.jsx'

export default function PackagesPage() {
  const backend = useBackendData()
  const packagesData = backend?.packages
  const currentSite = backend?.site ?? site
  const currentPackages = packagesData?.packages?.length ? packagesData.packages : packages
  const currentPackageFaqs = packagesData?.packageFaqs?.length ? packagesData.packageFaqs : packageFaqs
  const currentReviews = backend?.home?.reviews?.length ? backend.home.reviews : reviews
  const termIcons = [CalendarDays, Clock, ShieldCheck]
  const currentBookingTerms = packagesData?.bookingTerms?.length
    ? packagesData.bookingTerms.map((item, index) => ({ ...item, Icon: termIcons[index] ?? Check }))
    : null
  const bookingTerms = currentBookingTerms ?? [
    { Icon: CalendarDays, title: 'Minimum stay', text: '1 night for rooms & groups; flexible for full buyouts.' },
    { Icon: Clock, title: 'Check-in & check-out', text: 'Check-in from 2:00 PM · Check-out by 10:00 AM.' },
    { Icon: ShieldCheck, title: 'Cancellation', text: 'Free cancellation within 48 hours of booking (24h+ before check-in).' },
  ]
  const currentContent = packagesData?.content ?? {}
  const currentWhatsApp = (message) => backendWhatsAppLink(currentSite, message) ?? waLink(message)
  const [openFaq, setOpenFaq] = useState(0)
  const [enquiry, setEnquiry] = useState({ occasion: 'Group weekend', guests: '8', dates: '', name: '', notes: '' })

  const sendGroupEnquiry = (event) => {
    event.preventDefault()
    const lines = [
      `Hello G'Host Villa! I'd like to plan a ${enquiry.occasion} package.`,
      enquiry.guests ? `Guests: ${enquiry.guests}` : null,
      enquiry.dates ? `Dates: ${enquiry.dates}` : null,
      enquiry.name ? `Name: ${enquiry.name}` : null,
      enquiry.notes.trim() ? `Notes: ${enquiry.notes.trim()}` : null,
    ].filter(Boolean)
    window.open(currentWhatsApp(lines.join('\n')), '_blank', 'noopener,noreferrer')
  }

  const field = 'mt-1.5 w-full rounded-xl border border-forest/20 bg-white px-3.5 py-2.5 text-sm text-forest outline-none placeholder:text-forest/40 focus:border-forest'

  return (
    <>
      {/* 1 · Editorial Header */}
      <PageHeader
        eyebrow={currentContent.eyebrow || 'Packages · Private Stays · Group Buyouts'}
        title={currentContent.title || 'Make the stay yours.'}
        text={currentContent.subtitle || 'Choose a clear starting package for two, a weekend with friends, or an exclusive 7-BHK buyout above Pokhara.'}
      />

      {/* 2 · 3-Column Package Tier Cards + Booking Terms */}
      <section className="bg-white section-pb">
        <div className="wrap">
          <PackagePicker packages={currentPackages} whatsapp={currentWhatsApp} terms={bookingTerms} />
        </div>
      </section>

      {/* 3 · What's always included (interactive) */}
      <IncludesExplorer />

      {/* 4 · How to book (interactive chat walkthrough) */}
      <BookingFlow whatsapp={currentWhatsApp} tel={`tel:${currentSite.phoneTel || ''}`} />


      {/* 6 · Package Planner + Reviews & FAQ */}
      <section id="package-planner" className="scroll-mt-24 bg-white section-y">
        <div className="wrap grid items-start gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14">
          <Reveal className="rounded-2xl border border-forest/15 bg-white p-6 shadow-soft sm:p-8">
            <p className="label">{currentContent.plannerEyebrow || 'Custom package planner'}</p>
            <h2 className="mt-2 font-display font-semibold text-forest type-sub">
              {currentContent.plannerTitle || 'Tell us your dates & group size.'}
            </h2>
            <p className="mt-2 text-sm text-forest/70">
              {currentContent.plannerSubtitle || 'Send your details directly to our Sarangkot team on WhatsApp—no payment needed now.'}
            </p>

            <form onSubmit={sendGroupEnquiry} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="block text-xs font-bold uppercase tracking-[0.12em] text-forest/60">
                  <span>Package / Occasion</span>
                  <CustomSelect
                    ariaLabel="Package or Occasion"
                    value={enquiry.occasion}
                    onChange={(val) => setEnquiry({ ...enquiry, occasion: val })}
                    options={[
                      { value: 'Couple escape', label: 'Couple escape' },
                      { value: 'Group weekend', label: 'Group weekend' },
                      { value: 'Full villa buyout', label: 'Full villa buyout' },
                      { value: 'Birthday / celebration', label: 'Birthday / celebration' },
                    ]}
                    triggerClassName={`${field} font-semibold normal-case tracking-normal`}
                  />
                </div>
                <label className="block text-xs font-bold uppercase tracking-[0.12em] text-forest/60">
                  Guests
                  <input type="number" min="1" max="30" value={enquiry.guests}
                    onChange={(e) => setEnquiry({ ...enquiry, guests: e.target.value })}
                    className={`${field} normal-case tracking-normal`} />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-bold uppercase tracking-[0.12em] text-forest/60">
                  Preferred dates
                  <input value={enquiry.dates} onChange={(e) => setEnquiry({ ...enquiry, dates: e.target.value })}
                    placeholder="e.g. 12–14 Nov" className={`${field} normal-case tracking-normal`} />
                </label>
                <label className="block text-xs font-bold uppercase tracking-[0.12em] text-forest/60">
                  Your name
                  <input value={enquiry.name} onChange={(e) => setEnquiry({ ...enquiry, name: e.target.value })}
                    placeholder="Full name" className={`${field} normal-case tracking-normal`} />
                </label>
              </div>
              <label className="block text-xs font-bold uppercase tracking-[0.12em] text-forest/60">
                Add-ons or special requests
                <textarea rows={3} value={enquiry.notes}
                  onChange={(e) => setEnquiry({ ...enquiry, notes: e.target.value })}
                  placeholder="BBQ, bonfire, birthday decoration, MAP meal plan…"
                  className={`${field} normal-case tracking-normal`} />
              </label>
              <button type="submit"
                className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-sun px-6 text-sm font-semibold text-white transition hover:bg-sun-dark">
                <Send className="h-4 w-4" aria-hidden="true" />
                Send enquiry on WhatsApp
              </button>
            </form>
          </Reveal>

          <Reveal delay={0.08} className="space-y-8">
            {/* Guest reviews */}
            <div className="space-y-4">
              <p className="label">Guest reviews</p>
              {currentReviews.slice(0, 2).map((r) => (
                <blockquote key={r.name} className="rounded-2xl border border-forest/15 bg-white p-5 shadow-soft">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: r.rating }, (_, i) => (
                      <Star key={i} className="h-4 w-4 fill-sun text-sun" aria-hidden="true" />
                    ))}
                  </div>
                  <p className="mt-2.5 text-sm leading-relaxed text-forest/80">"{r.text}"</p>
                  <footer className="mt-2.5 text-xs font-semibold text-forest">
                    {r.name} <span className="font-normal text-forest/55">· {r.country} · {r.source}</span>
                  </footer>
                </blockquote>
              ))}
            </div>

            {/* FAQ */}
            <div>
              <p className="label">Package FAQ</p>
              <ul className="mt-3 divide-y divide-forest/15 border-y border-forest/15">
                {currentPackageFaqs.map((item, idx) => {
                  const isOpen = openFaq === idx
                  return (
                    <li key={item.q}>
                      <button type="button" aria-expanded={isOpen}
                        onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                        className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-semibold text-forest">
                        <span>{item.q}</span>
                        <span className="text-lg text-forest/60">{isOpen ? '−' : '+'}</span>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <p className="pb-4 text-sm leading-relaxed text-forest/75">{item.a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  )
                })}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
