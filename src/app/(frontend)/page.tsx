import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { HeroBanner } from '@/components/home/HeroBanner'
import { DifferenceSlider } from '@/components/home/DifferenceSlider'
import { HelpSection } from '@/components/home/HelpSection'
import { TestimonialSlider } from '@/components/home/TestimonialSlider'
import { BlogPreview } from '@/components/home/BlogPreview'
import { SectionWrapper } from '@/components/SectionWrapper'
import { JsonLd } from '@/components/JsonLd'
import { siteSettings, getPage, topActivities } from '@/content'
import { localize } from '@/content/localize'
import { readLocaleFromCookie } from '@/content/schema'

export const metadata: Metadata = {
  title: 'Inicio',
  description:
    'Fundación Grandmother\'s House — un entorno seguro y cariñoso donde cada niño puede crecer. Más de 2,100 niños impactados en Juan Dolio, RD.',
  alternates: { canonical: '/' },
  openGraph: {
    title: "Fundación Grandmother's House",
    description:
      'Un entorno seguro y cariñoso donde cada niño puede crecer. Más de 2,100 niños impactados en Juan Dolio, RD.',
    url: 'https://fundaciongrandmothershouse.com/',
    type: 'website',
    locale: 'es_DO',
    alternateLocale: 'en_US',
    siteName: "Fundación Grandmother's House",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Fundación Grandmother's House",
    description:
      'Un entorno seguro y cariñoso donde cada niño puede crecer. Más de 2,100 niños impactados en Juan Dolio, RD.',
  },
}

export default async function HomePage() {
  const cookieStore = await cookies()
  const locale = readLocaleFromCookie(cookieStore.get('locale')?.value)

  const page = localize(getPage('home'), locale)
  const blocks = page.layout
  const heroBlock = blocks.find((b: { blockType: string }) => b.blockType === 'heroSlider')
  const differenceBlock = blocks.find((b: { blockType: string }) => b.blockType === 'difference')
  const helpBlock = blocks.find((b: { blockType: string }) => b.blockType === 'help')
  const testimonialBlock = blocks.find((b: { blockType: string }) => b.blockType === 'testimonial')
  const blogPreviewBlock = blocks.find((b: { blockType: string }) => b.blockType === 'blogPreview')

  const latestActivities = localize(topActivities(3), locale) as Array<Record<string, unknown>>

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: "Fundación Grandmother's House",
    url: 'https://fundaciongrandmothershouse.com',
    inLanguage: ['es', 'en'],
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://fundaciongrandmothershouse.com/actividades?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <>
      <JsonLd data={websiteJsonLd} />
      <SectionWrapper show={siteSettings.showHeroBanner}>
        <HeroBanner data={heroBlock} />
      </SectionWrapper>

      <SectionWrapper show={siteSettings.showDifference}>
        <DifferenceSlider data={differenceBlock} />
      </SectionWrapper>

      <SectionWrapper show={siteSettings.showHelp}>
        <HelpSection data={helpBlock} />
      </SectionWrapper>

      <SectionWrapper show={siteSettings.showTestimonial}>
        <TestimonialSlider data={testimonialBlock} />
      </SectionWrapper>

      <SectionWrapper show={siteSettings.showBlogPreview}>
        <BlogPreview data={blogPreviewBlock} news={latestActivities} locale={locale} linkBase="/actividades" />
      </SectionWrapper>
    </>
  )
}
