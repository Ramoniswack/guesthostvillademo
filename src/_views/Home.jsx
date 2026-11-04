'use client'

import Hero from '../components/Hero.jsx'
import WhyUs from '../components/WhyUs.jsx'
import PhotoStrip from '../components/PhotoStrip.jsx'
import Story from '../components/Story.jsx'
import Rooms from '../components/Rooms.jsx'
import MenuTeaser from '../components/MenuTeaser.jsx'
import Visit from '../components/Visit.jsx'
import Guests from '../components/Guests.jsx'
import CtaBanner from '../components/CtaBanner.jsx'
import { Divider } from '../components/ui.jsx'

export default function Home() {
  return (
    <>
      <Hero />
      <WhyUs />
      <PhotoStrip />
      <Divider prev="cream" next="sand" />
      <Story />
      <Divider prev="sand" next="cream" />
      <Rooms preview />
      <Divider prev="cream" next="sand" />
      <MenuTeaser />
      <Divider prev="sand" next="cream" />
      <Visit />
      <Divider prev="cream" next="sand" />
      <Guests />
      <Divider prev="sand" next="cream" />
      <CtaBanner />
    </>
  )
}
