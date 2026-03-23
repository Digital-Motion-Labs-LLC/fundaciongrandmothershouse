import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cookies } from 'next/headers'
import { HeroBanner } from '@/components/home/HeroBanner'
import { DifferenceSlider } from '@/components/home/DifferenceSlider'
import { HelpSection } from '@/components/home/HelpSection'
import { TestimonialSlider } from '@/components/home/TestimonialSlider'
import { BlogPreview } from '@/components/home/BlogPreview'
import { SectionWrapper } from '@/components/SectionWrapper'

export const metadata: Metadata = {
  title: 'Inicio',
  description:
    'Fundación Grandmother\'s House — un entorno seguro y cariñoso donde cada niño puede crecer. Más de 2,100 niños impactados en Juan Dolio, RD.',
}

export default async function HomePage() {
  const cookieStore = await cookies()
  const locale = (cookieStore.get('locale')?.value || 'es') as 'en' | 'es'

  const payload = await getPayload({ config: configPromise })

  const siteSettings = await payload.findGlobal({ slug: 'site-settings' })

  const homePage = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    locale,
    limit: 1,
  })

  const page = homePage.docs[0]
  const blocks = page?.layout || []

  const heroBlock = blocks.find((b: any) => b.blockType === 'heroSlider')
  const differenceBlock = blocks.find((b: any) => b.blockType === 'difference')
  const helpBlock = blocks.find((b: any) => b.blockType === 'help')
  const testimonialBlock = blocks.find((b: any) => b.blockType === 'testimonial')
  const blogPreviewBlock = blocks.find((b: any) => b.blockType === 'blogPreview')

  // Fetch latest activities for preview
  const latestActivities = await payload.find({
    collection: 'activities',
    where: { published: { equals: true } },
    sort: '-date',
    limit: 3,
    locale,
  })

  return (
    <>
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
        <BlogPreview data={blogPreviewBlock} news={latestActivities.docs} locale={locale} linkBase="/actividades" />
      </SectionWrapper>
    </>
  )
}
