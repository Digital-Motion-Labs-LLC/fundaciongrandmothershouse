import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cookies } from 'next/headers'
import { PageBanner } from '@/components/PageBanner'
import { notFound } from 'next/navigation'
import { EventDetail } from '@/components/EventDetail'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'activities',
    where: { slug: { equals: slug }, published: { equals: true } },
    limit: 1,
  })

  const activity = result.docs[0]
  if (!activity) {
    return { title: 'Actividad no encontrada' }
  }

  const description = typeof activity.description === 'string'
    ? activity.description.slice(0, 160)
    : Array.isArray(activity.description)
      ? activity.description
          .map((block: any) =>
            block.children?.map((child: any) => child.text).join('') || ''
          )
          .join(' ')
          .slice(0, 160)
      : ''

  const image = typeof activity.image === 'object' && activity.image?.url
    ? activity.image.url
    : undefined

  return {
    title: activity.name,
    description,
    openGraph: {
      title: activity.name,
      description,
      ...(image ? { images: [{ url: image }] } : {}),
    },
  }
}

export default async function ActivityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cookieStore = await cookies()
  const locale = (cookieStore.get('locale')?.value || 'es') as 'en' | 'es'
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'activities',
    where: { slug: { equals: slug }, published: { equals: true } },
    locale,
    limit: 1,
  })

  const activity = result.docs[0]
  if (!activity) notFound()

  return (
    <>
      <PageBanner title={activity.name} />
      <EventDetail activity={activity} />
    </>
  )
}
