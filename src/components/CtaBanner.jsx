'use client'

import { Button, Reveal } from './ui.jsx'
import { telLink, waLink } from '../data/site.js'

export default function CtaBanner() {
  return (
    <section id="book" className="px-6 pb-24 pt-4 sm:px-10 md:pb-40">
      <Reveal className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[32px] bg-forest-dark">
          <img
            src="/images/night-aerial.webp"
            alt="G'Host Villa lit up at night among the dark forested hills"
            width="1200"
            height="1496"
            loading="lazy"
            className="h-[26rem] w-full object-cover object-[50%_60%] md:h-[30rem]"
          />
          <div className="absolute inset-0 bg-forest/70" />
          <div className="absolute inset-x-0 top-0 p-8 text-center md:p-12">
            <p className="text-[1.0625rem] font-semibold text-cream/90">Sarangkot, Pokhara</p>
            <p className="mx-auto mt-3 max-w-2xl font-display text-3xl font-semibold leading-tight text-white md:text-5xl">
              Your table, or your pillow, is waiting up here.
            </p>
          </div>
        </div>

        <div className="relative z-10 mx-4 -mt-16 flex flex-col items-center justify-between gap-5 rounded-[28px] bg-cream p-6 text-center shadow-warm md:mx-14 md:-mt-12 md:flex-row md:p-8 md:text-left">
          <p className="font-display text-2xl font-semibold text-forest md:text-3xl">Planning a stay or a meal with a view?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button href={waLink()} icon="chat" arrow={false}>Book on WhatsApp</Button>
            <Button href={telLink} variant="outline" icon="phone" arrow={false}>Call Us</Button>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
