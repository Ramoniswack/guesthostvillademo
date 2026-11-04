'use client'

import { useEffect, useState } from 'react'
import Icon from './Icons.jsx'

/** Round leaf-icon "back to top" button; sits above the mobile quick-action bar. */
export default function BackToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const on = () => setShow(window.scrollY > 700)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <button
      type="button"
      onClick={() => (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? window.scrollTo(0, 0) : window.scrollTo({ top: 0, behavior: 'smooth' }))}
      aria-label="Back to top"
      className={`fixed bottom-24 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-forest text-cream shadow-warm transition-all duration-300 hover:bg-forest-dark md:bottom-6 md:right-6 ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <Icon name="leaf" className="h-6 w-6 -rotate-45" />
    </button>
  )
}
