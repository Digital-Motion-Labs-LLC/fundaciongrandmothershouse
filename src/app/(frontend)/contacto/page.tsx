import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cookies } from 'next/headers'
import { PageBanner } from '@/components/PageBanner'
import { ContactForm } from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contacto',
  description:
    'Contáctanos para ser voluntario, donar o conocer más sobre Fundación Grandmother\'s House en Juan Dolio, San Pedro de Macorís.',
}

export default async function ContactPage() {
  const cookieStore = await cookies()
  const locale = (cookieStore.get('locale')?.value || 'es') as 'en' | 'es'
  const payload = await getPayload({ config: configPromise })

  const footer = await payload.findGlobal({ slug: 'footer', locale })
  const header = await payload.findGlobal({ slug: 'header', locale })

  return (
    <>
      <PageBanner title={locale === 'es' ? 'Contacto' : 'Contact Us'} />
      <section className="contact-main volunteer">
        <div className="container">
          <div className="row gutter-40">
            <div className="col-12 col-xl-6">
              <div className="contact__content">
                <div className="section__content">
                  <span className="sub-title"><i className="icon-donation"></i> {locale === 'es' ? 'Contáctanos' : 'Get In Touch'}</span>
                  <h2>{locale === 'es' ? 'Contacto' : 'Contact Us'}</h2>
                </div>
                <div className="contact-main__inner cta">
                  {footer.contactInfo?.address && (
                    <div className="contact-main__single">
                      <div className="thumb"><i className="fa-solid fa-location-dot"></i></div>
                      <div className="content">
                        <h6>{locale === 'es' ? 'Ubicación' : 'Location'}</h6>
                        <p><a href={footer.contactInfo.addressLink || '#'} target="_blank">{footer.contactInfo.address}</a></p>
                      </div>
                    </div>
                  )}
                  {header.phone && (
                    <div className="contact-main__single">
                      <div className="thumb"><i className="fa-solid fa-phone"></i></div>
                      <div className="content">
                        <h6>{locale === 'es' ? 'Teléfono' : 'Phone'}</h6>
                        <p><a href={`tel:${header.phone}`}>{header.phone}</a></p>
                      </div>
                    </div>
                  )}
                  {header.email && (
                    <div className="contact-main__single">
                      <div className="thumb"><i className="fa-solid fa-envelope"></i></div>
                      <div className="content">
                        <h6>Email</h6>
                        <p><a href={`mailto:${header.email}`}>{header.email}</a></p>
                      </div>
                    </div>
                  )}
                  {header.socialLinks && header.socialLinks.length > 0 && (
                    <div className="contact-main__single">
                      <div className="thumb"><i className="fa-solid fa-share-nodes"></i></div>
                      <div className="content">
                        <h6>Social</h6>
                        <div className="social">
                          {header.socialLinks.map((link: any, i: number) => (
                            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer">
                              <i className={`fa-brands fa-${link.platform === 'x' ? 'twitter' : link.platform}`}></i>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-12 col-xl-6">
              <ContactForm locale={locale} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
