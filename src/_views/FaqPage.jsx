'use client'

import { PageHero } from '../components/ui.jsx'
import Faq from '../components/Faq.jsx'

export default function FaqPage() {
  return (
    <>
      <PageHero eyebrow="Good to know" title="Questions, answered." text="Check-in, food, getting here and more." image="/images/day-aerial.webp" position="50% 55%" />
      <Faq />
    </>
  )
}
