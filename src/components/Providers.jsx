'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, MotionConfig, useScroll, useSpring } from 'framer-motion'
import { initSmoothScroll, scrollToTop } from '../lib/smoothScroll.js'
import { BackendProvider } from '../lib/backend.jsx'
import Navbar, { MobileBar } from './Navbar.jsx'
import Footer from './Footer.jsx'
import BackToTop from './BackToTop.jsx'

/** Every page change starts at the top. */
function ScrollToTop() {
  const pathname = usePathname()
  useEffect(() => scrollToTop(), [pathname])
  return null
}

/** Thin progress bar at the top edge showing scroll position on every page. */
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 32, restDelta: 0.001 })
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2.5px] origin-left bg-sun"
      style={{ scaleX }}
    />
  )
}

export default function Providers({ children }) {
  const pathname = usePathname()
  useEffect(() => initSmoothScroll(), [])

  return (
    // reducedMotion="user": visitors who prefer less motion get fades only, no movement
    <BackendProvider>
      <MotionConfig reducedMotion="user">
        <ScrollToTop />
        <ScrollProgress />
        <Navbar />
        <main>
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </main>
        <Footer />
        <MobileBar />
        <BackToTop />
      </MotionConfig>
    </BackendProvider>
  )
}
