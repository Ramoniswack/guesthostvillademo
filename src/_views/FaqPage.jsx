'use client'

import Faq from '../components/Faq.jsx'
import Jobs from '../components/Jobs.jsx'
import { PageHeader } from '../components/ui.jsx'
import { useBackendData } from '../lib/backend.jsx'

export default function FaqPage() {
  const backend = useBackendData()
  const content = backend?.faq?.content

  return (
    <div className="bg-white text-forest">
      <PageHeader
        eyebrow={content?.heroEyebrow || content?.eyebrow || 'FAQ'}
        title={content?.heroTitle || 'Questions, answered.'}
        text={content?.heroText || 'Ask the host anything about rooms, rates, check-in, dining or getting here.'}
      >
        <a href="#jobs" className="mt-2 inline-flex min-h-12 items-center text-base underline underline-offset-4 hover:text-sun-text">Looking for work? See careers</a>
      </PageHeader>

      <Faq />
      <Jobs />
    </div>
  )
}
