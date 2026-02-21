import Link from 'next/link'

export function Header({ header, locale }: { header: any; locale: string }) {
  const logoUrl = header.logo?.url || '/logos/logo-full.png'

  return (
    <header className="header header-secondary">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="main-header__menu-box">
              <nav className="navbar p-0">
                <div className="navbar-logo">
                  <Link href="/">
                    <img src={logoUrl} alt="Fundación Grandmother's House" style={{  }} /> 
                    {/* maxHeight: '60px' */}
                  </Link>
                </div>
                <div className="navbar__menu-wrapper">
                  <div className="navbar__menu d-none d-xl-block">
                    <ul className="navbar__list">
                      {header.navigation?.map((item: any, i: number) => (
                        <li key={i} className={`navbar__item ${item.children?.length ? 'navbar__item--has-children' : ''} nav-fade`}>
                          {item.children?.length ? (
                            <>
                              <a href={item.link || '#'} aria-label="dropdown menu" className="navbar__dropdown-label dropdown-label-alter">
                                {item.label}
                              </a>
                              <ul className="navbar__sub-menu">
                                {item.children.map((child: any, j: number) => (
                                  <li key={j}>
                                    <Link href={child.link}>{child.label}</Link>
                                  </li>
                                ))}
                              </ul>
                            </>
                          ) : (
                            <Link href={item.link}>{item.label}</Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {header.phone && (
                    <div className="contact-btn">
                      <div className="contact-icon">
                        <i className="icon-support"></i>
                      </div>
                      <div className="contact-content">
                        <p>{locale === 'es' ? 'Llámanos' : 'Call Us Now'}</p>
                        <a href={`tel:${header.phone}`}>{header.phone}</a>
                      </div>
                    </div>
                  )}
                </div>
                <div className="navbar__options">
                  <div className="navbar__mobile-options">
                    <button className="btn--primary d-none d-md-flex donate-trigger" data-donate-trigger="true">
                      {header.donateButtonText || (locale === 'es' ? 'Donar Ahora' : 'Donate Now')} <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                  <button className="open-offcanvas-nav d-flex d-xl-none" aria-label="toggle mobile menu" title="open offcanvas menu">
                    <span className="icon-bar top-bar"></span>
                    <span className="icon-bar middle-bar"></span>
                    <span className="icon-bar bottom-bar"></span>
                  </button>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
