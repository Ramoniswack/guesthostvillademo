'use client'

import { Button, Reveal } from './ui.jsx'
import { site, telLink, waLink } from '../data/site.js'
import { backendWhatsAppLink, useBackendData } from '../lib/backend.jsx'

export default function CtaBanner() {
  const backend = useBackendData()
  const currentSite = backend?.site ?? site
  const cta = backend?.home?.ctaBanner
  const currentTelLink = currentSite.phoneTel ? `tel:${currentSite.phoneTel}` : telLink
  const currentWhatsApp = backendWhatsAppLink(currentSite) ?? waLink()
  return (
    <section id="book" className="px-4 pb-24 pt-4 sm:px-10 md:pb-40">
      <Reveal className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-2xl bg-forest-dark">
          <img
            src={cta?.image || '/images/night-aerial.webp'}
            alt={cta?.imageAlt || "G'Host Villa lit up at night among the dark forested hills"}
            width="1200"
            height="1496"
            loading="lazy"
            className="h-[23rem] w-full object-cover object-[50%_60%] sm:h-[26rem] md:h-[30rem]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest-dark/65 via-forest-dark/25 to-transparent" />
          <div className="absolute inset-x-0 top-0 p-6 text-center sm:p-8 md:p-12">
            <p className="text-sm font-semibold text-cream/90 sm:text-[1.0625rem]">{cta?.eyebrow || 'Sarangkot, Pokhara'}</p>
            <p className="mx-auto mt-2.5 max-w-2xl font-display text-2xl font-semibold leading-tight text-white sm:mt-3 sm:text-3xl md:text-5xl">
              {cta?.headline || 'Your table, or your pillow, is waiting up here.'}
            </p>
          </div>
        </div>

        <div className="relative z-10 mx-3 -mt-14 flex flex-col items-center justify-between gap-4 rounded-2xl border border-forest/15 bg-white p-5 text-center shadow-warm sm:mx-4 sm:-mt-16 sm:gap-5 sm:p-6 md:mx-14 md:-mt-12 md:flex-row md:p-8 md:text-left">
          <p className="font-display text-xl font-semibold text-forest sm:text-2xl md:text-3xl">{cta?.bottomPrompt || 'Planning a stay or a meal with a view?'}</p>
          <div className="flex w-full shrink-0 flex-col justify-center gap-2.5 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-3">
            <Button href={currentWhatsApp} icon="chat" arrow={false} className="w-full sm:w-auto">{cta?.whatsappButtonLabel || 'Book on WhatsApp'}</Button>
            <Button href={currentTelLink} variant="outline" icon="phone" arrow={false} className="w-full sm:w-auto">{cta?.callButtonLabel || 'Call Us'}</Button>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
