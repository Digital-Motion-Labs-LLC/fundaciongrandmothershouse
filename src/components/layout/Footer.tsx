import Link from 'next/link'

export function Footer({ footer, locale }: { footer: any; locale: string }) {
  const logoUrl = footer.logo?.url || '/logos/main-logo.svg'
  const socialIconMap: Record<string, string> = {
    facebook: 'fa-facebook-f', instagram: 'fa-instagram', youtube: 'fa-youtube',
    tiktok: 'fa-tiktok', x: 'fa-twitter', linkedin: 'fa-linkedin-in', other: 'fa-globe',
  }

  const quickLinksTitle = footer.quickLinksTitle || (locale === 'es' ? 'Enlaces Rápidos' : 'Quick Links')
  const servicesTitle = footer.servicesTitle || (locale === 'es' ? 'Nuestros Servicios' : 'Our Services')
  const contactTitle = footer.contactTitle || (locale === 'es' ? 'Contáctanos' : 'Get In Touch')

  return (
    <footer className="footer-two">
      <div className="container">
        <div className="row gutter-60">
          <div className="col-12 col-md-6 col-xl-3">
            <div className="footer-two__widget" data-aos="fade-up" data-aos-duration="1000">
              <div className="footer-two__widget-logo">
                <Link href="/"><img src={logoUrl} alt="Logo" style={{ maxHeight: '60px' }} /></Link>
              </div>
              <div className="footer-two__widget-content">
                {footer.description && <p>{footer.description}</p>}
                <div className="social">
                  {footer.socialLinks?.map((link: any, i: number) => (
                    <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" title={link.label || link.platform}>
                      <i className={`fa-brands ${socialIconMap[link.platform] || 'fa-globe'}`}></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-xl-2 offset-xl-1">
            <div className="footer-two__widget" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
              <div className="footer-two__widget-intro">
                <h5>{quickLinksTitle}</h5>
                <div className="line"><span className="large-line"></span><span className="small-line"></span><span className="small-line"></span></div>
              </div>
              <div className="footer-two__widget-content">
                <ul>
                  {footer.quickLinks?.map((link: any, i: number) => (
                    <li key={i}><Link href={link.link}><i className="fa-solid fa-arrow-right"></i>{link.label}</Link></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-xl-3">
            <div className="footer-two__widget footer-two__widget--alternate" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400">
              <div className="footer-two__widget-intro">
                <h5>{servicesTitle}</h5>
                <div className="line"><span className="large-line"></span><span className="small-line"></span><span className="small-line"></span></div>
              </div>
              <div className="footer-two__widget-content">
                <ul>
                  {footer.services?.map((link: any, i: number) => (
                    <li key={i}><Link href={link.link}><i className="fa-solid fa-arrow-right"></i>{link.label}</Link></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-xl-3">
            <div className="footer-two__widget footer-two__widget--alternate" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="600">
              <div className="footer-two__widget-intro">
                <h5>{contactTitle}</h5>
                <div className="line"><span className="large-line"></span><span className="small-line"></span><span className="small-line"></span></div>
              </div>
              <div className="footer-two__widget-content footer-two__widget-content--contact">
                <ul>
                  {footer.contactInfo?.address && (
                    <li><a href={footer.contactInfo.addressLink || '#'} target="_blank"><i className="fa-solid fa-location-dot"></i>{footer.contactInfo.address}</a></li>
                  )}
                  {footer.contactInfo?.phone && (
                    <li><a href={`tel:${footer.contactInfo.phone}`}><i className="fa-solid fa-phone"></i>{footer.contactInfo.phone}</a></li>
                  )}
                  {footer.contactInfo?.email && (
                    <li><a href={`mailto:${footer.contactInfo.email}`}><i className="fa-regular fa-envelope"></i>{footer.contactInfo.email}</a></li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-two__copyright">
        <div className="container">
          <div className="row align-items-center gutter-12">
            <div className="col-12 col-lg-6">
              <div className="footer-two__copyright-inner text-center text-lg-start">
                <p>{footer.copyrightText || `Copyright © ${new Date().getFullYear()} Fundación Grandmother's House. ${locale === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}`}</p>
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <div className="footer__bottom-left">
                <ul className="footer__bottom-list justify-content-center justify-content-lg-end">
                  {footer.legalLinks?.map((link: any, i: number) => (
                    <li key={i}><Link href={link.link}>{link.label}</Link></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="sprade" data-aos="zoom-in" data-aos-duration="1000">
        <img src="/assets/images/sprade.png" alt="Image" className="base-img" />
      </div>
      <div className="sprade-light" data-aos="zoom-in" data-aos-duration="1000">
        <img src="/assets/images/sprade-light.png" alt="Image" />
      </div>
    </footer>
  )
}
