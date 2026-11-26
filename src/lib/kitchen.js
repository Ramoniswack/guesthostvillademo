import { useEffect, useState } from 'react'

/** Pyramid Restro is open daily 7 AM to 10 PM Nepal time, whatever timezone the visitor is in. */
export function kitchenStatus(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kathmandu', hour: 'numeric', minute: 'numeric', hour12: false,
  }).formatToParts(now)
  const h = Number(parts.find((p) => p.type === 'hour').value) % 24
  const m = Number(parts.find((p) => p.type === 'minute').value)
  const mins = h * 60 + m
  if (mins >= 7 * 60 && mins < 22 * 60) return { open: true, label: 'Open now · until 10 PM' }
  return { open: false, label: mins < 7 * 60 ? 'Closed now · opens 7 AM' : 'Closed now · opens 7 AM tomorrow' }
}

/** Returns null on the server and first paint (avoids hydration mismatch), then updates every minute. */
export function useKitchenStatus() {
  const [status, setStatus] = useState(null)
  useEffect(() => {
    const tick = () => setStatus(kitchenStatus())
    tick()
    const id = setInterval(tick, 60000)
    return () => clearInterval(id)
  }, [])
  return status
}
