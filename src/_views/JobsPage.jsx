'use client'

import Jobs from '../components/Jobs.jsx'
import { PageHeader } from '../components/ui.jsx'
import { useBackendData } from '../lib/backend.jsx'

export default function JobsPage() {
  const backend = useBackendData()
  const content = backend?.jobs?.content
  return (
    <div className="bg-white text-forest">
      <PageHeader
        eyebrow={content?.heroEyebrow || 'Careers'}
        title={content?.heroTitle || 'Join the villa team.'}
        text={content?.heroText || 'Help us welcome travellers to Sarangkot.'}
      />
      <Jobs />
    </div>
  )
}
