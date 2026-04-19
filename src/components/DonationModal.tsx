'use client'
import { useState, useEffect } from 'react'

export function DonationModal({ settings, locale = 'es' }: { settings: any; locale?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const isEs = locale === 'es'

  useEffect(() => {
    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement
      if (target.closest('[data-donate-trigger]') || target.closest('.donate-trigger')) {
        e.preventDefault()
        setIsOpen(true)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  if (!isOpen) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} onClick={() => setIsOpen(false)} />
      <div style={{ position: 'relative', background: '#fff', borderRadius: '16px', padding: '40px', maxWidth: '550px', width: '90%', maxHeight: '80vh', overflowY: 'auto' }}>
        <button onClick={() => setIsOpen(false)} style={{ position: 'absolute', top: '15px', right: '20px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>
          <i className="fa-solid fa-xmark"></i>
        </button>
        <h3 style={{ marginBottom: '10px', color: 'var(--secondary)' }}>{settings.modalTitle || (isEs ? 'Hacer una Donación' : 'Make a Donation')}</h3>
        {settings.modalDescription && <p style={{ marginBottom: '24px', color: '#666' }}>{settings.modalDescription}</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {settings.paypal?.enabled && settings.paypal?.link && (
            <a
              href={settings.paypal.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: '#FFC439',
                color: '#003087',
                padding: '14px 20px',
                borderRadius: '999px',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'
              }}
            >
              <i className="fa-brands fa-paypal" style={{ fontSize: '20px', color: '#003087' }}></i>
              <span style={{ color: '#003087' }}>Pay</span>
              <span style={{ color: '#009CDE', marginLeft: '-4px' }}>Pal</span>
              <span style={{ color: '#003087', fontWeight: 500, marginLeft: '6px' }}>
                {isEs ? '· Donar' : '· Donate'}
              </span>
            </a>
          )}

          {settings.bankTransfer?.enabled && (
            <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px' }}>
              <h6 style={{ marginBottom: '8px' }}><i className="fa-solid fa-building-columns"></i> {isEs ? 'Transferencia Bancaria' : 'Bank Transfer'}</h6>
              {settings.bankTransfer.bankName && <p style={{ margin: '4px 0', fontSize: '14px' }}><strong>{isEs ? 'Banco' : 'Bank'}:</strong> {settings.bankTransfer.bankName}</p>}
              {settings.bankTransfer.accountNumber && <p style={{ margin: '4px 0', fontSize: '14px' }}><strong>{isEs ? 'Cuenta' : 'Account'}:</strong> {settings.bankTransfer.accountNumber}</p>}
              {settings.bankTransfer.accountType && <p style={{ margin: '4px 0', fontSize: '14px' }}><strong>{isEs ? 'Tipo' : 'Type'}:</strong> {isEs ? (settings.bankTransfer.accountType === 'Checking' ? 'Corriente' : settings.bankTransfer.accountType) : settings.bankTransfer.accountType}</p>}
              {settings.bankTransfer.accountHolder && <p style={{ margin: '4px 0', fontSize: '14px' }}><strong>{isEs ? 'Titular' : 'Holder'}:</strong> {settings.bankTransfer.accountHolder}</p>}
              {settings.bankTransfer.routingNumber && <p style={{ margin: '4px 0', fontSize: '14px' }}><strong>Routing:</strong> {settings.bankTransfer.routingNumber}</p>}
              {settings.bankTransfer.swift && <p style={{ margin: '4px 0', fontSize: '14px' }}><strong>SWIFT:</strong> {settings.bankTransfer.swift}</p>}
            </div>
          )}

          {settings.zelle?.enabled && (
            <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px' }}>
              <h6 style={{ marginBottom: '8px' }}><i className="fa-solid fa-bolt"></i> Zelle</h6>
              <p style={{ fontSize: '14px' }}>{settings.zelle.emailOrPhone}</p>
            </div>
          )}

          {settings.otherMethods?.map((method: any, i: number) => (
            <div key={i} style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px' }}>
              <h6 style={{ marginBottom: '8px' }}>{method.icon && <i className={method.icon}></i>} {method.name}</h6>
              <p style={{ fontSize: '14px' }}>{method.instructions}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
