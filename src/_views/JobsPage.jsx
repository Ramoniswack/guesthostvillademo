'use client'

import { PageHero } from '../components/ui.jsx'
import Jobs from '../components/Jobs.jsx'

export default function JobsPage() {
  return (
    <>
      <PageHero eyebrow="Careers" title="Join the villa team." text="Help us welcome travellers to Sarangkot." image="/images/pyramid.webp" position="40% 50%" />
      <Jobs />
    </>
  )
}
