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

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const logoUrl = header.logo?.url || '/logos/main-logo.svg'

  return (
    <>
      <div className={`mobile-menu mobile-menu--primary d-block d-xxl-none ${isOpen ? 'show-menu' : ''}`}>
        <nav className="mobile-menu__wrapper">
          <div className="mobile-menu__header nav-fade">
            <div className="logo">
              <Link href="/" onClick={() => setIsOpen(false)}>
                <img src={logoUrl} alt="Logo" style={{ maxHeight: '50px' }} />
              </Link>
            </div>
            <button aria-label="close mobile menu" className="close-mobile-menu" onClick={() => setIsOpen(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div className="mobile-menu__list">
            <ul className="navbar__list">
              {header.navigation?.map((item: any, i: number) => (
                <li key={i} className={`navbar__item ${item.children?.length ? 'navbar__item--has-children' : ''}`}>
                  {item.children?.length ? (
                    <>
                      <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); setOpenSub(openSub === i ? null : i) }}
                        className="navbar__dropdown-label dropdown-label-alter"
                      >
                        {item.label}
                      </a>
                      <ul className="navbar__sub-menu" style={{ display: openSub === i ? 'block' : 'none' }}>
                        {item.children.map((child: any, j: number) => (
                          <li key={j}>
                            <Link href={child.link} onClick={() => setIsOpen(false)}>{child.label}</Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <Link href={item.link} onClick={() => setIsOpen(false)}>{item.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="mobile-menu__cta nav-fade d-block d-md-none">
            <button className="btn--primary donate-trigger" data-donate-trigger="true">
              {header.donateButtonText || (locale === 'es' ? 'Donar Ahora' : 'Donate Now')} <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
          <div className="mobile-menu__social social nav-fade">
            {header.socialLinks?.map((link: any, i: number) => (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" title={link.label || link.platform}>
                <i className={`fa-brands ${socialIconMap[link.platform] || 'fa-globe'}`}></i>
              </a>
            ))}
          </div>
        </nav>
      </div>
      {isOpen && <div className="mobile-menu__backdrop mobile-menu__backdrop-active" onClick={() => setIsOpen(false)}></div>}
    </>
  )
}
