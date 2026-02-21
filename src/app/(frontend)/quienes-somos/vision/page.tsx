import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cookies } from 'next/headers'
import { PageBanner } from '@/components/PageBanner'
import { TextSection } from '@/components/TextSection'

export default async function VisionPage() {
  const cookieStore = await cookies()
  const locale = (cookieStore.get('locale')?.value || 'en') as 'en' | 'es'
  const payload = await getPayload({ config: configPromise })

  const page = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'vision' } },
    locale,
    limit: 1,
  })

  const pageData = page.docs[0]
  const blocks = pageData?.layout || []

  return (
    <>
      <PageBanner title={pageData?.title || (locale === 'es' ? 'Visión' : 'Vision')} />
      {blocks.map((block: any, i: number) => {
        if (block.blockType === 'textSection') {
          return <TextSection key={i} data={block} />
        }
        return null
      })}
    </>
  )
}
