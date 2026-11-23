'use client'

import { DM_Mono, Pacifico } from 'next/font/google'
import { Reveal } from './ui.jsx'
import { signatureBeverages, signatureDesserts, signatureDishes } from '../data/signature.js'
import { site, telLink } from '../data/site.js'
import { useBackendData } from '../lib/backend.jsx'

const scriptFont = Pacifico({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

const monoFont = DM_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  display: 'swap',
})

const formatPrice = (dish) => {
  if (dish.slug === 'crispy-fried-chicken') return `from NPR ${dish.price} (2 pcs)`
  if (dish.priceNote) return `NPR ${dish.price} (${dish.priceNote})`
  return `NPR ${dish.price}`
}

function SimpleList({ title, items }) {
  return (
    <div>
      <h3 className={`${scriptFont.className} text-3xl text-ink sm:text-4xl`}>{title}</h3>
      <div className="mt-3 h-px w-12 bg-sun" aria-hidden="true" />
      <ul className="mt-6 space-y-4">
        {items.map((item) => (
          <li key={item.name} className="border-b border-ink/10 pb-3 last:border-b-0 last:pb-0">
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-base font-bold text-ink">{item.name}</span>
              <span className={`${monoFont.className} shrink-0 text-sm font-medium tabular-nums text-ink/70`}>
                NPR {item.price}
              </span>
            </div>
            {item.desc && (
              <p className={`${monoFont.className} mt-1 text-xs leading-relaxed text-ink/65`}>
                {item.desc}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function SignatureMenu() {
  const backend = useBackendData()
  const currentSite = backend?.site || site
  const currentTel = currentSite.phoneTel ? `tel:${currentSite.phoneTel}` : telLink
  const instagramUrl = currentSite.social?.instagram || site.social.instagram
  const facebookUrl = currentSite.social?.facebook || site.social.facebook

  return (
    <section aria-labelledby="signature-menu-heading" className="bg-white py-16 text-ink sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-6 sm:px-10">
        {/* Printed-style Header Row */}
        <Reveal className="flex flex-col justify-between gap-6 border-b border-sun/70 pb-8 sm:flex-row sm:items-end">
          <div className="flex items-center gap-4">
            <img
              src="/images/logo-icon.webp"
              alt="G'Host Villa logo"
              width={56}
              height={56}
              className="h-12 w-12 shrink-0 object-contain sm:h-14 sm:w-14"
            />
            <div>
              <h2 id="signature-menu-heading" className="font-display text-2xl font-bold tracking-[-0.03em] text-ink sm:text-3xl">
                G&apos;Host Villa
              </h2>
              <p className={`${scriptFont.className} mt-0.5 text-lg text-ink/80 sm:text-xl`}>
                Mountain-view kitchen
              </p>
            </div>
          </div>

          <ul className={`${monoFont.className} space-y-1 text-xs text-ink/75 sm:text-right`}>
            <li className="flex items-center gap-2 sm:justify-end">
              <span className="h-1 w-1 rounded-full bg-sun" aria-hidden="true" />
              <span>{currentSite.hours}</span>
            </li>
            <li className="flex items-center gap-2 sm:justify-end">
              <span className="h-1 w-1 rounded-full bg-sun" aria-hidden="true" />
              <a href={currentTel} className="underline-offset-4 transition-colors hover:text-ink hover:underline hover:decoration-sun">
                {currentSite.phoneDisplay}
              </a>
            </li>
          </ul>
        </Reveal>

        {/* 2-Column Signature Dish Grid */}
        <div className="mt-14 grid grid-cols-1 gap-x-12 gap-y-14 md:grid-cols-2 lg:gap-x-24 lg:gap-y-16">
          {signatureDishes.map((dish, index) => (
            <Reveal
              key={dish.slug}
              delay={Math.min(index * 0.04, 0.2)}
              className="group flex flex-row items-center justify-between gap-5 max-[379px]:flex-col-reverse max-[379px]:items-start"
            >
              <div className="min-w-0 flex-1">
                <h3 className={`${scriptFont.className} text-[1.75rem] leading-tight text-ink sm:text-[2.15rem]`}>
                  {dish.name}
                </h3>
                <p className={`${monoFont.className} mt-1.5 text-sm font-medium text-ink/55`}>
                  {formatPrice(dish)}
                </p>
                <div className={`${monoFont.className} mt-3.5 space-y-0.5 text-[0.78rem] leading-[1.65] text-ink/80`}>
                  {dish.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>

              <div className="w-[40%] max-w-[230px] shrink-0 max-[379px]:w-[68%] md:w-[clamp(170px,19vw,235px)]">
                <img
                  src={`/images/menu/${dish.slug}.webp`}
                  alt={`${dish.name} served on a light-grey rimmed plate`}
                  width={900}
                  height={900}
                  loading="lazy"
                  className="aspect-square w-full object-contain mix-blend-multiply transition-transform duration-500 ease-out group-hover:rotate-[3deg] group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:transform-none"
                />
              </div>
            </Reveal>
          ))}
        </div>

        {/* Dessert & Beverage 2-Column Block */}
        <Reveal className="mt-20 grid grid-cols-1 gap-12 border-t border-ink/10 pt-12 md:grid-cols-2 lg:gap-24">
          <SimpleList title="Dessert" items={signatureDesserts} />
          <SimpleList title="Beverage" items={signatureBeverages} />
        </Reveal>

        {/* Printed Footer Line & Full Menu Anchor */}
        <Reveal className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-sun/60 pt-7 text-center sm:flex-row sm:text-left">
          <p className={`${monoFont.className} text-xs text-ink/70`}>
            Follow us on{' '}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ink underline decoration-sun underline-offset-4 transition-colors hover:text-forest"
            >
              Instagram
            </a>{' '}
            and{' '}
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ink underline decoration-sun underline-offset-4 transition-colors hover:text-forest"
            >
              Facebook
            </a>{' '}
            for special offers.
          </p>

          <a
            href="#menu"
            className={`${monoFont.className} text-xs font-medium text-ink underline decoration-sun underline-offset-4 transition-colors hover:text-forest`}
          >
            See the full menu ↓
          </a>
        </Reveal>
      </div>
    </section>
  )
}
