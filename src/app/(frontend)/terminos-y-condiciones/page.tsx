import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cookies } from 'next/headers'
import { PageBanner } from '@/components/PageBanner'
import { TextSection } from '@/components/TextSection'

export default async function TermsPage() {
  const cookieStore = await cookies()
  const locale = (cookieStore.get('locale')?.value || 'es') as 'en' | 'es'
  const payload = await getPayload({ config: configPromise })

  const page = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'terms' } },
    locale,
    limit: 1,
  })

  const pageData = page.docs[0]
  const blocks = pageData?.layout || []

  return (
    <>
      <PageBanner title={pageData?.title || (locale === 'es' ? 'Términos y condiciones' : 'Terms and conditions')} />
      {blocks.map((block: any, i: number) => {
        switch (block.blockType) {
          case 'textSection':
            return <TextSection key={i} data={block} />
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
    </>
  )
}
