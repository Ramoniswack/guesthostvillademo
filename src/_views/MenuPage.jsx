'use client'

import Menu from '../components/Menu.jsx'
import SignatureMenu from '../components/SignatureMenu.jsx'
import { PageHero } from '../components/ui.jsx'

export default function MenuPage() {
  return (
    <>
      <PageHero
        compact
        eyebrow="Pyramid Restro & Bottle Bar"
        title="Fresh food, mountain air."
        text="Nepali classics, Newari platters, handmade momo, wood-fired plates and drinks served overlooking the valley."
        image="/images/pyramid.webp"
      />
      <SignatureMenu />
      <Menu />
    </>
  )
}
