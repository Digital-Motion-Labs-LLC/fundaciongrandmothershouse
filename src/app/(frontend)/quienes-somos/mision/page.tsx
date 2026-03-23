import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cookies } from 'next/headers'
import { PageBanner } from '@/components/PageBanner'
import { TextSection } from '@/components/TextSection'

export const metadata: Metadata = {
  title: 'Nuestra Misión',
  description:
    'La misión de Fundación Grandmother\'s House: proporcionar un entorno seguro y estimulante para el desarrollo integral de cada niño.',
}

export default async function MisionPage() {
  const cookieStore = await cookies()
  const locale = (cookieStore.get('locale')?.value || 'es') as 'en' | 'es'
  const payload = await getPayload({ config: configPromise })

  const page = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'mission' } },
    locale,
    limit: 1,
  })

  const pageData = page.docs[0]
  const blocks = pageData?.layout || []

  return (
    <>
      <PageBanner title={pageData?.title || (locale === 'es' ? 'Misión' : 'Mission')} />
      {blocks.map((block: any, i: number) => {
        if (block.blockType === 'textSection') {
          return <TextSection key={i} data={block} />
        }
        return null
      })}
    </>
  )
}
