import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cookies } from 'next/headers'
import { PageBanner } from '@/components/PageBanner'
import { HelpSection } from '@/components/home/HelpSection'
import { TestimonialSlider } from '@/components/home/TestimonialSlider'
import { TextSection } from '@/components/TextSection'
import { CtaBanner } from '@/components/CtaBanner'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Quiénes Somos',
  description:
    'Conoce la historia y el equipo detrás de Fundación Grandmother\'s House, dedicada al cuidado infantil en Juan Dolio, RD.',
}

export default async function AboutPage() {
  const cookieStore = await cookies()
  const locale = (cookieStore.get('locale')?.value || 'es') as 'en' | 'es'
  const payload = await getPayload({ config: configPromise })

  const page = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'about' } },
    locale,
    limit: 1,
  })

  const pageData = page.docs[0]
  const blocks = pageData?.layout || []

  return (
    <>
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
