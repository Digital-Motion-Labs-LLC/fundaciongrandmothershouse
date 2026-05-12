'use client'
import { useEffect } from 'react'

export function AosInit() {
  useEffect(() => {
    const idle =
      typeof window !== 'undefined' && 'requestIdleCallback' in window
        ? (window as unknown as { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback
        : (cb: () => void) => window.setTimeout(cb, 200)

    let cancelled = false
    idle(
      async () => {
        if (cancelled) return
        const AOS = (await import('aos')).default
        AOS.init({ duration: 1000, once: true })
      },
      { timeout: 2000 },
    )
    return () => {
      cancelled = true
    }
  }, [])
  return null
}
