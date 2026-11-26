'use client'

import { useEffect } from 'react'

// Tawk.to live chat, loaded only where this component is mounted (the FAQ page).
// Get both ids from Tawk.to: Administration > Channels > Chat Widget > "Direct Chat Link"
// https://tawk.to/chat/<PROPERTY_ID>/<WIDGET_ID>
// Paste your ids here (or set the env vars). Example link: https://tawk.to/chat/65f0abc123/1hq9xyz -> property '65f0abc123', widget '1hq9xyz'
const TAWK_PROPERTY_ID = '6b069c3f93885d3cb81c50a6'
const TAWK_WIDGET_ID = '1k88u64b1'
const PROPERTY_ID = TAWK_PROPERTY_ID || process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID
const WIDGET_ID = TAWK_WIDGET_ID !== 'default' ? TAWK_WIDGET_ID : process.env.NEXT_PUBLIC_TAWK_WIDGET_ID || 'default'

export const tawkConfigured = Boolean(PROPERTY_ID)

const directLink = `https://tawk.to/chat/${PROPERTY_ID}/${WIDGET_ID}`

// Open the chat. If the widget script is blocked or hasn't loaded, open Tawk.to's hosted chat page instead so it always works.
export function openTawk() {
  if (typeof window === 'undefined') return
  const api = window.Tawk_API
  if (api?.maximize && api.isChatHidden !== undefined) {
    api.showWidget?.()
    api.maximize()
    return
  }
  window.open(directLink, '_blank', 'noopener,noreferrer')
}

// Hand a question the FAQ bot couldn't answer to a live agent, then open the chat.
export function askTawk(question) {
  if (typeof window === 'undefined') return
  const api = window.Tawk_API
  const q = String(question).slice(0, 500)
  try { api?.addEvent?.('unanswered-faq-question', { question: q }, () => {}) } catch {}
  try { api?.setAttributes?.({ 'last-question': q }, () => {}) } catch {}
  openTawk()
}

export default function TawkTo() {
  useEffect(() => {
    if (!PROPERTY_ID) return undefined
    const src = `https://embed.tawk.to/${PROPERTY_ID}/${WIDGET_ID}`
    window.Tawk_API = window.Tawk_API || {}
    window.Tawk_LoadStart = new Date()

    if (document.querySelector(`script[src="${src}"]`)) {
      window.Tawk_API.showWidget?.()
    } else {
      // Same as Tawk.to's official snippet
      const s1 = document.createElement('script')
      const s0 = document.getElementsByTagName('script')[0]
      s1.async = true
      s1.src = src
      s1.charset = 'UTF-8'
      s1.setAttribute('crossorigin', '*')
      s0.parentNode.insertBefore(s1, s0)
    }
    return undefined // keep the widget available when navigating; it is only mounted from the FAQ page
  }, [])

  return null
}
