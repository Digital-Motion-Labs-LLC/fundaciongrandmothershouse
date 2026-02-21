'use client'
import { useEffect } from 'react'
import AOS from 'aos'

export function AosInit() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true })
  }, [])
  return null
}
