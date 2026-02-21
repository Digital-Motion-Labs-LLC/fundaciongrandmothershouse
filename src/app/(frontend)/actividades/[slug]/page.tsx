import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cookies } from 'next/headers'
import { PageBanner } from '@/components/PageBanner'
import { notFound } from 'next/navigation'
import { EventDetail } from '@/components/EventDetail'

export default async function ActivityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cookieStore = await cookies()
  const locale = (cookieStore.get('locale')?.value || 'en') as 'en' | 'es'
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
