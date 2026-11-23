'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const BackendContext = createContext(null)

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000'
).replace(/\/+$/, '')

function resolveMediaUrls(value) {
  if (Array.isArray(value)) return value.map(resolveMediaUrls)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, resolveMediaUrls(item)]),
    )
  }
  if (typeof value === 'string' && value.startsWith('/media/')) {
    return `${API_BASE_URL}${value}`
  }
  return value
}

export function BackendProvider({ children }) {
  const [data, setData] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadContent() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/bootstrap/`, {
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error(`Django API returned HTTP ${response.status}`)
        }
        const payload = await response.json()
        if (!payload || typeof payload !== 'object') {
          throw new Error('Django API returned an invalid bootstrap payload')
        }
        setData(resolveMediaUrls(payload))
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Unable to load Django CMS content; using frontend fallback data.', error)
        }
      }
    }

    loadContent()
    return () => controller.abort()
  }, [])

  return <BackendContext.Provider value={data}>{children}</BackendContext.Provider>
}

export function useBackendData() {
  return useContext(BackendContext)
}

export function backendWhatsAppLink(site, message) {
  const number = site?.whatsappNumber
  if (!number) return null
  const text = message || site.defaultWhatsappGreeting || ''
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
}
