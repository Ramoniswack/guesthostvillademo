'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

/**
 * One filter in the rooms filter bar: a pill button that opens a panel underneath it.
 * Closes on outside click and on Escape. `active` highlights it when the filter is set.
 */
export default function FilterDropdown({ icon: IconCmp, label, value, active = false, children }) {
  const [open, setOpen] = useState(false)
  const root = useRef(null)
  const panelId = useId()

  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => { if (event.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('keydown', onKey) }
  }, [open])

  return (
    <div ref={root}>
      <button
        type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((v) => !v)}
        className={`flex min-h-[3.25rem] w-full items-center gap-3 border px-4 py-2 text-left transition ${active ? 'border-forest bg-forest/5' : 'border-forest/20 bg-white hover:border-forest/50'} ${open ? 'ring-1 ring-forest' : ''}`}
      >
        {IconCmp && <IconCmp className="h-5 w-5 shrink-0 text-sun-text" strokeWidth={1.8} aria-hidden="true" />}
        <span className="min-w-0 flex-1">
          <span className="block text-[0.62rem] font-bold uppercase tracking-[0.14em] text-forest/55">{label}</span>
          <span className="block truncate text-sm font-semibold text-forest">{value}</span>
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-forest/60 transition ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {open && (
        <div
          id={panelId} role="group" aria-label={label}
          className="border border-t-0 border-forest/20 bg-white p-5"
        >
          {children}
        </div>
      )}
    </div>
  )
}
