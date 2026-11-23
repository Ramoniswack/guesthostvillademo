'use client'

import SignatureMenu from '../components/SignatureMenu.jsx'
import { Divider } from '../components/ui.jsx'

export default function MenuPage() {
  return (
    <>
      <SignatureMenu />
      <Divider prev="cream" next="forest" />
    </>
  )
}
