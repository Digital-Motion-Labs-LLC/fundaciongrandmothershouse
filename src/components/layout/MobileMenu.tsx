'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export function MobileMenu({ header, locale }: { header: any; locale: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [openSub, setOpenSub] = useState<number | null>(null)

  const socialIconMap: Record<string, string> = {
    facebook: 'fa-facebook-f', instagram: 'fa-instagram', youtube: 'fa-youtube',
    tiktok: 'fa-tiktok', x: 'fa-twitter', linkedin: 'fa-linkedin-in', other: 'fa-globe',
  }

  useEffect(() => {
    const openBtn = document.querySelector('.open-offcanvas-nav')
    if (!openBtn) return
    const handler = () => setIsOpen(true)
    openBtn.addEventListener('click', handler)
    return () => openBtn.removeEventListener('click', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const logoUrl = header.logo?.url || '/logos/main-logo.svg'

  return (
    <>
      {/* Backdrop — always in DOM, toggled via opacity */}
      <div
        className="d-block d-xl-none"
        onClick={() => setIsOpen(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          background: 'rgba(0,0,0,0.5)',
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? 'visible' : 'hidden',
          transition: 'opacity 0.3s ease, visibility 0.3s ease',
        }}
      />

      {/* Panel — always in DOM, toggled via transform */}
      <nav
        className="d-block d-xl-none"
        style={{
          position: 'fixed', top: 0, left: 0, bottom: 0,
          width: '300px', maxWidth: '85vw',
          background: '#fff', zIndex: 9999,
          display: 'flex', flexDirection: 'column',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease',
          boxShadow: isOpen ? '4px 0 20px rgba(0,0,0,0.1)' : 'none',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #f1f5f9', flexShrink: 0 }}>
          <Link href="/" onClick={() => setIsOpen(false)}>
            <img src={logoUrl} alt="Logo" style={{ maxHeight: '40px' }} />
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="close menu"
            style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#1E293B', padding: '8px', lineHeight: 1 }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Nav links */}
        <div style={{ flex: 1, padding: '8px 0' }}>
          {header.navigation?.map((item: any, i: number) => (
            <div key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
              {item.children?.length ? (
                <>
                  <button
                    onClick={() => setOpenSub(openSub === i ? null : i)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      width: '100%', padding: '14px 20px',
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: '15px', fontWeight: 700, color: '#1E293B',
                      fontFamily: 'inherit',
                    }}
                  >
                    {item.label}
                    <i className={`fa-solid fa-chevron-${openSub === i ? 'up' : 'down'}`} style={{ fontSize: '11px', color: '#94a3b8' }}></i>
                  </button>
                  <div style={{
                    maxHeight: openSub === i ? '200px' : '0',
                    overflow: 'hidden',
                    transition: 'max-height 0.2s ease',
                    background: '#f8fafc',
                  }}>
                    {item.children.map((child: any, j: number) => (
                      <Link
                        key={j}
                        href={child.link}
                        onClick={() => setIsOpen(false)}
                        style={{ display: 'block', padding: '11px 20px 11px 36px', color: '#475569', fontSize: '14px', textDecoration: 'none', fontWeight: 500 }}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  href={item.link}
                  onClick={() => setIsOpen(false)}
                  style={{ display: 'block', padding: '14px 20px', color: '#1E293B', fontSize: '15px', fontWeight: 700, textDecoration: 'none' }}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #f1f5f9', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            className="donate-trigger"
            data-donate-trigger="true"
            style={{
              width: '100%', padding: '12px', borderRadius: '30px',
              background: '#E8447A', color: '#fff', border: 'none',
              fontSize: '15px', fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
          >
            {header.donateButtonText || (locale === 'es' ? 'Donar Ahora' : 'Donate Now')} <i className="fa-solid fa-arrow-right"></i>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {header.phone && (
              <a href={`tel:${header.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1E293B', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
                <i className="fa-solid fa-phone" style={{ color: '#14B8A6', fontSize: '13px' }}></i> {header.phone}
              </a>
            )}
            <div style={{ display: 'flex', gap: '8px' }}>
              {header.socialLinks?.map((link: any, i: number) => (
                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" style={{
                  width: '34px', height: '34px', borderRadius: '50%', background: '#1E293B',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '14px', textDecoration: 'none',
                }}>
                  <i className={`fa-brands ${socialIconMap[link.platform] || 'fa-globe'}`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
