import { LanguageSelector } from '../LanguageSelector'

export function Topbar({ header, locale }: { header: any; locale: string }) {
  const socialIconMap: Record<string, string> = {
    facebook: 'fa-facebook-f',
    instagram: 'fa-instagram',
    youtube: 'fa-youtube',
    tiktok: 'fa-tiktok',
    x: 'fa-twitter',
    linkedin: 'fa-linkedin-in',
    other: 'fa-globe',
  }

  return (
    <div className="topbar topbar--secondary d-none d-lg-block">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="topbar__inner">
              <div className="row align-items-center">
                <div className="col-12 col-lg-6 col-xxl-4">
                  <div className="topbar__list-wrapper">
                    <ul className="topbar__list">
                      {header.email && (
                        <li><a href={`mailto:${header.email}`}><i className="fa-regular fa-envelope"></i>{header.email}</a></li>
                      )}
                      {header.phone && (
                        <li><a href={`tel:${header.phone}`}><i className="fa-solid fa-phone"></i>{header.phone}</a></li>
                      )}
                    </ul>
                  </div>
                </div>
                <div className="col-12 col-xxl-4 d-none d-xxl-block">
                  <div className="topbar__extra text-center">
                    <p><i className="icon-heart-hand"></i> {locale === 'es' ? '¿Estás listo para ayudar? ¡Sé voluntario!' : 'Are you ready to help them? Let\'s become a volunteer!'}</p>
                  </div>
                </div>
                <div className="col-12 col-lg-6 col-xxl-4">
                  <div className="topbar__items justify-content-end">
                    <LanguageSelector locale={locale} />
                    <div className="social">
                      {header.socialLinks?.map((link: any, i: number) => (
                        <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" title={link.label || link.platform}>
                          <i className={`fa-brands ${socialIconMap[link.platform] || 'fa-globe'}`}></i>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
