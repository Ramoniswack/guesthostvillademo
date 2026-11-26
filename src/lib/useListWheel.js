'use client'
import { useEffect } from 'react'

/**
 * Makes a scrollable list react to the mouse wheel as soon as the pointer is over it.
 * The page behind never scrolls while the list can still move; at the top/bottom of the
 * list the wheel is released so the page doesn't feel stuck.
 *
 * Usage inside a dropdown:
 *   const listRef = useRef(null)
 *   useListWheel(listRef, open)
 *   <ul ref={listRef} role="listbox" data-lenis-prevent className="max-h-72 overflow-y-auto overscroll-contain">
 */
export function useListWheel(ref, active = true) {
  useEffect(() => {
    const el = ref.current
    if (!el || !active) return undefined

    const onWheel = (e) => {
      if (el.scrollHeight <= el.clientHeight) return
      const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY
      const atTop = el.scrollTop <= 0 && dy < 0
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1 && dy > 0
      e.stopPropagation()
      if (atTop || atBottom) return
      e.preventDefault()
      el.scrollTop += dy
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [ref, active])
}
