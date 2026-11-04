'use client'

import { PageHero } from '../components/ui.jsx'
import Menu from '../components/Menu.jsx'

export default function MenuPage() {
  return (
    <>
      <PageHero eyebrow="Restro & Bar" title="Fresh food, mountain air." text="Momo, Newari plates, pizza, drinks and more, served with a view." image="/images/garden.webp" position="50% 60%" />
      <Menu />
    </>
  )
}
