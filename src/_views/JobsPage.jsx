'use client'

import { PageHero } from '../components/ui.jsx'
import Jobs from '../components/Jobs.jsx'
import { useBackendData } from '../lib/backend.jsx'

export default function JobsPage() {
  const backend = useBackendData()
  const content = backend?.jobs?.content
  return (
    <>
      <PageHero
        eyebrow={content?.heroEyebrow || 'Careers'}
        title={content?.heroTitle || 'Join the villa team.'}
        text={content?.heroText || 'Help us welcome travellers to Sarangkot.'}
        image={content?.heroImage || '/images/pyramid.webp'}
        position={content?.heroPosition || '40% 50%'}
      />
      <Jobs />
    </>
  )
}
