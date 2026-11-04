// Lenis smooth scrolling. Skipped entirely for visitors who prefer reduced motion.
import Lenis from 'lenis'

let lenis = null
// Anchors land below the sticky header via `scroll-padding-top` in index.css (Lenis respects it).

export function initSmoothScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}

  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // gentle expo-out
    smoothWheel: true, // touch devices keep their native, fast-feeling scroll
  })

  let raf
  const loop = (time) => {
    lenis.raf(time)
    raf = requestAnimationFrame(loop)
  }
  raf = requestAnimationFrame(loop)

  // one delegated handler so every #anchor link (nav, buttons, mobile menu, footer) glides
  const onClick = (e) => {
    const a = e.target.closest?.('a[href^="#"]')
    if (!a || a.getAttribute('href') === '#') return
    const target = document.querySelector(a.getAttribute('href'))
    if (!target) return
    e.preventDefault()
    lenis.scrollTo(target, { duration: 1.4 })
  }
  document.addEventListener('click', onClick)

  return () => {
    document.removeEventListener('click', onClick)
    cancelAnimationFrame(raf)
    lenis.destroy()
    lenis = null
  }
}

/** Lock / unlock page scroll (mobile menu, lightbox). Works with or without Lenis. */
export function lockScroll(locked) {
  document.body.style.overflow = locked ? 'hidden' : ''
  if (lenis) locked ? lenis.stop() : lenis.start()
}

/** Jump to the top of the page (used on route changes). */
export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
  else window.scrollTo(0, 0)
}
