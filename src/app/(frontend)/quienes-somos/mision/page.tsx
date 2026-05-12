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
  title: 'Nuestra Misión',
  description:
    'La misión de Fundación Grandmother\'s House: proporcionar un entorno seguro y estimulante para el desarrollo integral de cada niño.',
  alternates: {
    canonical: "/quienes-somos/mision",
    languages: { es: "/quienes-somos/mision", en: "/quienes-somos/mision", "x-default": "/quienes-somos/mision" },
  },
  openGraph: {
    title: "Nuestra Misión — Fundación Grandmother's House",
    description: 'Un entorno seguro y estimulante para el desarrollo integral de cada niño.',
    url: 'https://fundaciongrandmothershouse.com/quienes-somos/mision',
    type: 'website',
    locale: 'es_DO',
    alternateLocale: 'en_US',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: "Fundación Grandmother\u0027s House" }],
  },
}

export default async function MisionPage() {
  const cookieStore = await cookies()
  const locale = readLocaleFromCookie(cookieStore.get('locale')?.value)

  const pageData = localize(getPage('mission'), locale) as { title: string; layout: Array<{ blockType: string }> }
  const blocks = pageData.layout

  const crumbs = breadcrumbJsonLd([
    { name: locale === 'es' ? 'Inicio' : 'Home', path: '/' },
    { name: locale === 'es' ? 'Quiénes Somos' : 'About Us', path: '/quienes-somos' },
    { name: locale === 'es' ? 'Misión' : 'Mission', path: '/quienes-somos/mision' },
  ])

  return (
    <>
      <JsonLd data={crumbs} />
      <PageBanner title={pageData?.title || (locale === 'es' ? 'Misión' : 'Mission')} />
      {blocks.map((block, i: number) => {
        if (block.blockType === 'textSection') {
          return <TextSection key={i} data={block} />
        }
        return null
      })}
    </>
  )
}
