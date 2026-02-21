'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function LanguageSelector({ locale: initialLocale }: { locale: string }) {
  const router = useRouter()
  const [activeLocale, setActiveLocale] = useState(initialLocale)

  const switchLocale = (newLocale: string) => {
    document.cookie = `locale=${newLocale};path=/;max-age=31536000`
    setActiveLocale(newLocale)
    router.refresh()
  }

  return (
    <div className="select-country" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <button
        onClick={() => switchLocale('en')}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: activeLocale === 'en' ? 'var(--primary)' : 'inherit',
          fontWeight: activeLocale === 'en' ? 700 : 400,
          fontSize: '14px',
          padding: '2px 4px',
          textDecoration: activeLocale === 'en' ? 'underline' : 'none',
        }}
      >
        EN
      </button>
      <span style={{ opacity: 0.5 }}>|</span>
      <button
        onClick={() => switchLocale('es')}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: activeLocale === 'es' ? 'var(--primary)' : 'inherit',
          fontWeight: activeLocale === 'es' ? 700 : 400,
          fontSize: '14px',
          padding: '2px 4px',
          textDecoration: activeLocale === 'es' ? 'underline' : 'none',
        }}
      >
        ES
      </button>
    </div>
  )
}
