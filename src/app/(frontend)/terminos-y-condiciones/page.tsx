import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { PageBanner } from '@/components/PageBanner'
import { TextSection } from '@/components/TextSection'
import { getPage } from '@/content'
import { localize } from '@/content/localize'
import { readLocaleFromCookie } from '@/content/schema'

export const metadata: Metadata = {
  title: 'Términos y Condiciones',
  description:
    'Términos y condiciones de uso del sitio web de Fundación Grandmother\'s House.',
  alternates: { canonical: '/terminos-y-condiciones' },
  robots: { index: true, follow: true },
}

export default async function TermsPage() {
  const cookieStore = await cookies()
  const locale = readLocaleFromCookie(cookieStore.get('locale')?.value)

  const pageData = localize(getPage('terms'), locale) as { title: string; layout: Array<{ blockType: string }> }
  const blocks = pageData.layout

  return (
    <>
      <PageBanner title={pageData?.title || (locale === 'es' ? 'Términos y condiciones' : 'Terms and conditions')} />
      {blocks.map((block, i: number) => {
        if (block.blockType === 'textSection') {
          return <TextSection key={i} data={block} />
        }
        return null
      })}
    </>
  )
}
