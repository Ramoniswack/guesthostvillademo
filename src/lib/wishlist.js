'use client'

import { API_BASE_URL } from './backend.jsx'

export const STORAGE_KEY = 'ghost_villa_user_portal_v1'
export const WISHLIST_EVENT = 'ghost-villa-wishlist-change'

export const DEFAULT_WISHLIST_SLUGS = [
  'mountain-view-room',
  'villa-top-floor',
  'whole-villa',
]

function getAuthHeaders() {
  if (typeof window === 'undefined') return { 'Content-Type': 'application/json' }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    const token = parsed?.token
    if (token && token !== 'demo-token' && token !== 'local-demo-token' && !parsed?.loggedOut) {
      return {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      }
    }
  } catch {
    // ignore
  }
  return { 'Content-Type': 'application/json' }
}

/**
 * Read the current wishlist slugs from localStorage.
 */
export function getWishlistSlugs() {
  if (typeof window === 'undefined') return DEFAULT_WISHLIST_SLUGS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed?.profile?.wishlistSlugs)) {
        return [...parsed.profile.wishlistSlugs]
      }
    }

    const set = new Set(DEFAULT_WISHLIST_SLUGS)
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i)
      if (key && key.startsWith('saved:')) {
        const slug = key.slice('saved:'.length)
        const val = localStorage.getItem(key)
        if (val === '1') set.add(slug)
        else if (val === '0') set.delete(slug)
      }
    }
    return [...set]
  } catch {
    return DEFAULT_WISHLIST_SLUGS
  }
}

export function isStayWishlisted(slug) {
  if (!slug) return false
  return getWishlistSlugs().includes(slug)
}

/**
 * Write the authoritative wishlist slugs to localStorage (updating both the
 * user portal session and individual `saved:<slug>` keys) and notify listeners.
 */
export function setWishlistSlugs(nextSlugs, toggledSlug = null, isSaved = null) {
  if (typeof window === 'undefined') return
  const clean = [...new Set((nextSlugs || []).filter(Boolean))]
  try {
    // Clear old saved:<slug> keys that are no longer in clean
    const keysToUpdate = []
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i)
      if (key && key.startsWith('saved:')) {
        keysToUpdate.push(key.slice('saved:'.length))
      }
    }
    for (const s of keysToUpdate) {
      localStorage.setItem(`saved:${s}`, clean.includes(s) ? '1' : '0')
    }
    if (toggledSlug) {
      localStorage.setItem(`saved:${toggledSlug}`, isSaved ? '1' : '0')
    }
    for (const s of clean) {
      localStorage.setItem(`saved:${s}`, '1')
    }

    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      const updated = {
        ...parsed,
        profile: {
          ...(parsed.profile || {}),
          wishlistSlugs: clean,
        },
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } else {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          token: 'demo-token',
          profile: {
            id: 1,
            username: 'demo@ghostvilla.com',
            email: 'demo@ghostvilla.com',
            fullName: 'George Gika',
            phone: '+977 984-0023756',
            city: 'Jakarta',
            country: 'Indonesia',
            bio: 'Frequent traveller & mountain retreat enthusiast visiting Pokhara.',
            wishlistSlugs: clean,
          },
        }),
      )
    }
    window.dispatchEvent(new CustomEvent(WISHLIST_EVENT, { detail: { slugs: clean } }))
  } catch {
    // ignore storage errors
  }
}

/**
 * Fetch the latest wishlist (and user dashboard) from the Django backend
 * and update localStorage so all pages stay in sync with the database.
 */
export async function fetchWishlistFromBackend() {
  if (typeof window === 'undefined') return getWishlistSlugs()
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/user/dashboard/`, {
      headers: getAuthHeaders(),
    })
    if (res.ok) {
      const data = await res.json()
      const slugs = Array.isArray(data?.profile?.wishlistSlugs)
        ? data.profile.wishlistSlugs
        : getWishlistSlugs()

      const raw = localStorage.getItem(STORAGE_KEY)
      const parsed = raw ? JSON.parse(raw) : {}
      if (!parsed?.loggedOut) {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            ...parsed,
            ...data,
            token: data.token || parsed.token || 'demo-token',
          }),
        )
      }
      setWishlistSlugs(slugs)
      return slugs
    }
  } catch {
    // Backend offline; use local state
  }
  return getWishlistSlugs()
}

/**
 * Toggle a single room/stay slug in the user's wishlist and persist it
 * immediately to the Django backend (`/api/v1/user/wishlist/`).
 */
export async function toggleStayWishlist(slug) {
  if (!slug || typeof window === 'undefined') return false
  const current = getWishlistSlugs()
  const currentlySaved = current.includes(slug)
  const nextSaved = !currentlySaved
  const nextSlugs = nextSaved
    ? [...current, slug]
    : current.filter((item) => item !== slug)

  // Optimistic local update
  setWishlistSlugs(nextSlugs, slug, nextSaved)

  // Always sync with Django backend (works for both logged-in user and default demo user)
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/user/wishlist/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        slug,
        action: nextSaved ? 'add' : 'remove',
      }),
    })
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data?.profile?.wishlistSlugs)) {
        const raw = localStorage.getItem(STORAGE_KEY)
        const parsed = raw ? JSON.parse(raw) : {}
        if (!parsed?.loggedOut) {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              ...parsed,
              ...data,
              token: data.token || parsed.token || 'demo-token',
            }),
          )
        }
        setWishlistSlugs(
          data.profile.wishlistSlugs,
          slug,
          data.profile.wishlistSlugs.includes(slug),
        )
        return data.profile.wishlistSlugs.includes(slug)
      }
    }
  } catch {
    // Offline fallback already saved locally
  }

  return nextSaved
}
