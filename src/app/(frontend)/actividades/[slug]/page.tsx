import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { PageBanner } from '@/components/PageBanner'
import { EventDetail } from '@/components/EventDetail'
import { JsonLd } from '@/components/JsonLd'
import { activities, findActivityBySlug } from '@/content'
import { localize, pickLocale } from '@/content/localize'
import { readLocaleFromCookie } from '@/content/schema'
import { breadcrumbJsonLd } from '@/lib/seo'

export const dynamicParams = false

export const generateStaticParams = async () =>
  activities.filter((a) => a.published).map((a) => ({ slug: a.slug }))

const extractText = (root: unknown): string => {
  if (!root || typeof root !== 'object') return ''
  const r = root as { children?: Array<{ text?: string; children?: unknown[] }> }
  if (!r.children) return ''
  return r.children
    .map((c) => c.text ?? extractText(c))
    .join(' ')
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const activity = findActivityBySlug(slug)
  if (!activity) return { title: 'Actividad no encontrada' }

  const name = pickLocale(activity.name, 'es') ?? slug
  const description = pickLocale(activity.description, 'es')
  const desc =
    description && typeof description === 'object'
      ? extractText((description as { root?: unknown }).root).slice(0, 160)
      : typeof description === 'string'
        ? description.slice(0, 160)
        : ''
  const image = activity.featuredImage?.url ?? undefined

  return {
    title: name,
    description: desc,
    alternates: {
      canonical: `/actividades/${slug}`,
      languages: {
        es: `/actividades/${slug}`,
        en: `/actividades/${slug}`,
        'x-default': `/actividades/${slug}`,
      },
    },
    openGraph: {
      title: name,
      description: desc,
      url: `https://fundaciongrandmothershouse.com/actividades/${slug}`,
      type: 'article',
    locale: 'es_DO',
    alternateLocale: 'en_US',
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: name,
      description: desc,
      ...(image ? { images: [image] } : {}),
    },
  }
}

export default async function ActivityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cookieStore = await cookies()
  const locale = readLocaleFromCookie(cookieStore.get('locale')?.value)

  const raw = findActivityBySlug(slug)
  if (!raw) notFound()
  const activity = localize(raw, locale) as Record<string, unknown> & {
    name: string
    date: string
    location?: string | null
    featuredImage?: { url?: string | null } | null
  }

  const eventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: activity.name,
    startDate: activity.date,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: activity.location ?? 'San Pedro de Macorís',
      address: { '@type': 'PostalAddress', addressCountry: 'DO', addressRegion: 'San Pedro de Macorís' },
    },
    organizer: {
      '@type': 'NGO',
      name: "Fundación Grandmother's House",
      url: 'https://fundaciongrandmothershouse.com',
    },
    image: activity.featuredImage?.url
      ? [`https://fundaciongrandmothershouse.com${activity.featuredImage.url}`]
      : undefined,
    url: `https://fundaciongrandmothershouse.com/actividades/${slug}`,
  }

  const crumbs = breadcrumbJsonLd([
    { name: locale === 'es' ? 'Inicio' : 'Home', path: '/' },
    { name: locale === 'es' ? 'Actividades' : 'Activities', path: '/actividades' },
    { name: activity.name as string, path: `/actividades/${slug}` },
  ])

  return (
    <>
      <JsonLd data={eventJsonLd} />
      <JsonLd data={crumbs} />
      <PageBanner title={activity.name} />
      <EventDetail activity={activity} />
    </>
  )
}
