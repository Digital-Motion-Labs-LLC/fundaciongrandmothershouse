import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { PageBanner } from '@/components/PageBanner'
import { TextSection } from '@/components/TextSection'
import { JsonLd } from '@/components/JsonLd'
import { getPage } from '@/content'
import { localize } from '@/content/localize'
import { readLocaleFromCookie } from '@/content/schema'
import { breadcrumbJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Nuestra Visión',
  description:
    'La visión de Fundación Grandmother\'s House: ser referentes en el cuidado infantil y la educación en República Dominicana.',
  alternates: {
    canonical: "/quienes-somos/vision",
    languages: { es: "/quienes-somos/vision", en: "/quienes-somos/vision", "x-default": "/quienes-somos/vision" },
  },
  openGraph: {
    title: "Nuestra Visión — Fundación Grandmother's House",
    description: 'Ser referentes en cuidado infantil y educación en República Dominicana.',
    url: 'https://fundaciongrandmothershouse.com/quienes-somos/vision',
    type: 'website',
    locale: 'es_DO',
    alternateLocale: 'en_US',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: "Fundación Grandmother\u0027s House" }],
  },
}

export default async function VisionPage() {
  const cookieStore = await cookies()
  const locale = readLocaleFromCookie(cookieStore.get('locale')?.value)

  const pageData = localize(getPage('vision'), locale) as { title: string; layout: Array<{ blockType: string }> }
  const blocks = pageData.layout

  const crumbs = breadcrumbJsonLd([
    { name: locale === 'es' ? 'Inicio' : 'Home', path: '/' },
    { name: locale === 'es' ? 'Quiénes Somos' : 'About Us', path: '/quienes-somos' },
    { name: locale === 'es' ? 'Visión' : 'Vision', path: '/quienes-somos/vision' },
  ])

  return (
    <>
      <JsonLd data={crumbs} />
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
