import type { Metadata } from 'next'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { PageBanner } from '@/components/PageBanner'
import { HelpSection } from '@/components/home/HelpSection'
import { TestimonialSlider } from '@/components/home/TestimonialSlider'
import { TextSection } from '@/components/TextSection'
import { CtaBanner } from '@/components/CtaBanner'
import { JsonLd } from '@/components/JsonLd'
import { getPage } from '@/content'
import { aboutFAQs, faqJsonLd } from '@/content/faqs'
import { localize } from '@/content/localize'
import { readLocaleFromCookie } from '@/content/schema'

export const metadata: Metadata = {
  title: 'Quiénes Somos',
  description:
    'Conoce la historia y el equipo detrás de Fundación Grandmother\'s House, dedicada al cuidado infantil en Juan Dolio, RD.',
  alternates: {
    canonical: "/quienes-somos",
    languages: { es: "/quienes-somos", en: "/quienes-somos", "x-default": "/quienes-somos" },
  },
  openGraph: {
    title: "Quiénes Somos — Fundación Grandmother's House",
    description: 'Más de un siglo dedicados al cuidado y desarrollo integral de los niños de la República Dominicana.',
    url: 'https://fundaciongrandmothershouse.com/quienes-somos',
    type: 'website',
    locale: 'es_DO',
    alternateLocale: 'en_US',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: "Fundación Grandmother\u0027s House" }],
  },
}

export default async function AboutPage() {
  const cookieStore = await cookies()
  const locale = readLocaleFromCookie(cookieStore.get('locale')?.value)

  const pageData = localize(getPage('about'), locale) as { title: string; layout: Array<{ blockType: string }> }
  const blocks = pageData.layout

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: locale === 'es' ? 'Inicio' : 'Home', item: 'https://fundaciongrandmothershouse.com/' },
      { '@type': 'ListItem', position: 2, name: locale === 'es' ? 'Quiénes Somos' : 'About Us', item: 'https://fundaciongrandmothershouse.com/quienes-somos' },
    ],
  }

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={faqJsonLd(aboutFAQs, locale)} />
      <PageBanner title={pageData?.title || (locale === 'es' ? 'Quiénes Somos' : 'About Us')} />
      {blocks.map((block: any, i: number) => {
        switch (block.blockType) {
          case 'help':
            return <HelpSection key={i} data={block} />
          case 'testimonial':
            return <TestimonialSlider key={i} data={block} />
          case 'textSection':
            return <TextSection key={i} data={block} index={i} />
          case 'ctaBanner':
            return <CtaBanner key={i} data={block} />
          case 'richContent':
            return (
              <section key={i} className="cm-details">
                <div className="container">
                  <div className="row">
                    <div className="col-12">
                      <div className="cm-group cta" dangerouslySetInnerHTML={{ __html: block.content_html || '' }} />
                    </div>
                  </div>
                </div>
              </section>
            )
          default:
            return null
        }
      })}
      {blocks.length === 0 && (
        <section className="cm-details" style={{ padding: '80px 0' }}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-lg-8 text-center">
                <p>{locale === 'es' ? 'Contenido próximamente.' : 'Content coming soon.'}</p>
                <div style={{ marginTop: '30px' }}>
                  <Link href="/" className="btn--primary">
                    {locale === 'es' ? 'Volver al Inicio' : 'Back to Home'} <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
