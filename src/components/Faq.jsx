'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Icon from './Icons.jsx'
import { Reveal } from './ui.jsx'
import { faqs } from '../data/faq.js'

export default function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <section id="faq" className="pb-24 pt-20 md:pb-40 md:pt-28">
      <div className="wrap grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
        <Reveal>
          <p className="label">Good to know</p>
          <h2 className="h2">Questions, answered</h2>
          <p className="lead mt-5 max-w-sm">Can't find it here? Message us on WhatsApp and we'll reply as soon as we can.</p>
        </Reveal>

        <Reveal delay={0.1}>
          <ul className="space-y-4">
            {faqs.map((f, i) => {
              const isOpen = open === i
              return (
                <li key={f.q} className="overflow-hidden rounded-3xl bg-sand">
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`faq-${i}`}
                      id={`faq-btn-${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex min-h-[64px] w-full items-center justify-between gap-4 px-6 py-4 text-left font-display text-xl font-semibold text-forest"
                    >
                      {f.q}
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                        <Icon name="chevron" className="h-5 w-5" strokeWidth={2.2} />
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-${i}`}
                        role="region"
                        aria-labelledby={`faq-btn-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <p className="px-6 pb-6 text-lg text-ink/90">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              )
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
