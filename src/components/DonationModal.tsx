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

          {settings.paypal?.enabled && (
            <a href={settings.paypal.link} target="_blank" rel="noopener noreferrer" className="btn--primary" style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', textDecoration: 'none' }}>
              <i className="fa-brands fa-paypal"></i> PayPal
            </a>
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
