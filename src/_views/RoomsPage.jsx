'use client'

import { PageHero } from '../components/ui.jsx'
import Rooms from '../components/Rooms.jsx'
import CtaBanner from '../components/CtaBanner.jsx'

export default function RoomsPage() {
  return (
    <>
      <PageHero
        eyebrow="Accommodations & BHK Packages"
        title="Rest well in Sarangkot."
        text="From 1 BHK couple suites with private Annapurna balconies to 4 BHK and 7 BHK full private villa estates for up to 24 guests. All rooms include hot water, Wi-Fi, and breakfast."
        image="/images/room-couple.webp"
        position="50% 55%"
      />
      <Rooms />
      <CtaBanner />
    </>
  )
}
