import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { PageBanner } from '@/components/PageBanner'
import { TextSection } from '@/components/TextSection'
import { getPage } from '@/content'
import { localize } from '@/content/localize'
import { readLocaleFromCookie } from '@/content/schema'

export const metadata: Metadata = {
  title: 'Nuestra Visión',
  description:
    'La visión de Fundación Grandmother\'s House: ser referentes en el cuidado infantil y la educación en República Dominicana.',
  alternates: { canonical: '/quienes-somos/vision' },
  openGraph: {
    title: "Nuestra Visión — Fundación Grandmother's House",
    description: 'Ser referentes en cuidado infantil y educación en República Dominicana.',
    url: 'https://fundaciongrandmothershouse.com/quienes-somos/vision',
    type: 'website',
  },
}

export default async function VisionPage() {
  const cookieStore = await cookies()
  const locale = readLocaleFromCookie(cookieStore.get('locale')?.value)

  const pageData = localize(getPage('vision'), locale) as { title: string; layout: Array<{ blockType: string }> }
  const blocks = pageData.layout

  return (
    <>
      <PageBanner title={pageData?.title || (locale === 'es' ? 'Visión' : 'Vision')} />
      {blocks.map((block, i: number) => {
        if (block.blockType === 'textSection') {
          return <TextSection key={i} data={block} />
        }
        return null
      })}
    </>
  )
}
