'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

/**
 * Kinetic "odometer" number: every digit is a reel that spins through the
 * digits and settles on its value, right-most digit last, when scrolled into view.
 * Non-numeric values (placeholders such as "[X]+") are shown as plain text.
 */
const LOOPS = 2 // how many full 0-9 turns before settling

function Reel({ digit, index, total, run }) {
  const reel = Array.from({ length: 10 * (LOOPS + 1) }, (_, i) => i % 10)
  const stop = LOOPS * 10 + digit // index the reel lands on
  const lead = total - 1 - index // left digits start slightly earlier
  return (
    <span className="relative inline-block h-[1.1em] w-[0.62em] overflow-hidden text-center leading-[1.1]" aria-hidden="true">
      <motion.span
        className="flex flex-col"
        initial={{ y: 0 }}
        animate={{ y: run ? `${(-stop / reel.length) * 100}%` : 0 }}
        transition={{ duration: 1.5 + (total - index) * 0.28, ease: [0.16, 1, 0.3, 1], delay: lead * 0.04 }}
        style={{ willChange: 'transform' }}
      >
        {reel.map((n, i) => (
          <span key={i} className="block h-[1.1em]">{n}</span>
        ))}
      </motion.span>
    </span>
  )
}

export default function KineticNumber({ value, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduce = useReducedMotion()

  if (typeof value !== 'number') return <span>{value}{suffix}</span>
  if (reduce) return <span>{value.toLocaleString('en-US')}{suffix}</span>

  // "10,000": digits spin, separators stay put
  const chars = value.toLocaleString('en-US').split('')
  const total = chars.filter((c) => /\d/.test(c)).length
  let n = -1
  return (
    <span ref={ref} className="inline-flex items-baseline" role="img" aria-label={`${value.toLocaleString('en-US')}${suffix}`}>
      {chars.map((c, i) =>
        /\d/.test(c) ? (
          <Reel key={i} digit={Number(c)} index={++n} total={total} run={inView} />
        ) : (
          <span key={i} aria-hidden="true">{c}</span>
        )
      )}
      {suffix && <span aria-hidden="true">{suffix}</span>}
    </span>
  )
}
