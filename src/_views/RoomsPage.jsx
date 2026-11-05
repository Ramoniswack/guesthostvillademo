'use client'

import { PageHero } from '../components/ui.jsx'
import Rooms from '../components/Rooms.jsx'
import CtaBanner from '../components/CtaBanner.jsx'

export default function RoomsPage() {
  return (
    <>
      <PageHero
        eyebrow="Private stays · rooms · full villa buyouts"
        title="Choose your level of privacy."
        text="Book a quiet couple suite, a private room, a group villa wing, or the entire G’Host estate. Every stay comes with mountain air, breakfast, hot water and the freedom to make the place your own."
        image="/images/pyramid.webp"
        position="50% 58%"
        center
        compact
      />
      <Rooms />
      <CtaBanner />
    </>
  )
}
