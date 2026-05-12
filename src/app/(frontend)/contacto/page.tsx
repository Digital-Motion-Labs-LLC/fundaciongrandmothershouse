import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { PageBanner } from '@/components/PageBanner'
import { ContactForm } from '@/components/ContactForm'
import { JsonLd } from '@/components/JsonLd'
import { header as staticHeader, footer as staticFooter } from '@/content'
import { contactFAQs, faqJsonLd } from '@/content/faqs'
import { localize } from '@/content/localize'
import { readLocaleFromCookie } from '@/content/schema'

export const metadata: Metadata = {
  title: 'Contacto y Voluntariado',
  description:
    'Contáctanos para ser voluntario, donar o conocer más sobre Fundación Grandmother\'s House en Juan Dolio, San Pedro de Macorís.',
  alternates: {
    canonical: "/contacto",
    languages: { es: "/contacto", en: "/contacto", "x-default": "/contacto" },
  },
  openGraph: {
    title: "Contacto — Fundación Grandmother's House",
    description: 'Contáctanos para voluntariado, donaciones o información.',
    url: 'https://fundaciongrandmothershouse.com/contacto',
    type: 'website',
    locale: 'es_DO',
    alternateLocale: 'en_US',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: "Fundación Grandmother\u0027s House" }],
  },
}

export default async function ContactPage() {
  const cookieStore = await cookies()
  const locale = readLocaleFromCookie(cookieStore.get('locale')?.value)

  const header = localize(staticHeader, locale) as {
    phone?: string | null
    email?: string | null
    socialLinks?: Array<{ platform: string; url: string }>
  }
  const footer = localize(staticFooter, locale) as {
    contactInfo?: { address?: string | null; addressLink?: string | null; phone?: string | null; email?: string | null }
  }

  const contactJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: locale === 'es' ? 'Contacto' : 'Contact',
    url: 'https://fundaciongrandmothershouse.com/contacto',
    mainEntity: {
      '@type': 'NGO',
      name: "Fundación Grandmother's House",
      telephone: header.phone ?? undefined,
      email: header.email ?? undefined,
      address: footer.contactInfo?.address
        ? {
            '@type': 'PostalAddress',
            streetAddress: footer.contactInfo.address,
            addressCountry: 'DO',
          }
        : undefined,
    },
  }

  return (
    <>
      <JsonLd data={contactJsonLd} />
      <JsonLd data={faqJsonLd(contactFAQs, locale)} />
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
                          {header.socialLinks.map((link, i: number) => (
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
