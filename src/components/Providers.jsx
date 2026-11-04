'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { MotionConfig } from 'framer-motion'
import { initSmoothScroll, scrollToTop } from '../lib/smoothScroll.js'
import Navbar, { MobileBar } from './Navbar.jsx'
import Footer from './Footer.jsx'
import BackToTop from './BackToTop.jsx'

/** Every page change starts at the top. */
function ScrollToTop() {
  const pathname = usePathname()
  useEffect(() => scrollToTop(), [pathname])
  return null
}

export default function Providers({ children }) {
  useEffect(() => initSmoothScroll(), [])
  return (
    // reducedMotion="user": visitors who prefer less motion get fades only, no movement
    <MotionConfig reducedMotion="user">
      <ScrollToTop />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <MobileBar />
      <BackToTop />
    </MotionConfig>
  )
}
