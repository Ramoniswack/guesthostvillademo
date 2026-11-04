'use client'

import { PageHero } from '../components/ui.jsx'
import Rooms from '../components/Rooms.jsx'
import CtaBanner from '../components/CtaBanner.jsx'

export default function RoomsPage() {
  return (
    <>
      <PageHero eyebrow="Rooms" title="Rest well in the hills." text="Quiet rooms with breakfast, hot water and Himalayan views. Rates per night." image="/images/room-couple.webp" position="50% 55%" />
      <Rooms />
      <CtaBanner />
    </>
  )
}
