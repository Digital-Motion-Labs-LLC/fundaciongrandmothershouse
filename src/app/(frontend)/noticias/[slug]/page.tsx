import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cookies } from 'next/headers'
import { PageBanner } from '@/components/PageBanner'
import { notFound } from 'next/navigation'
import { BlogDetail } from '@/components/BlogDetail'

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cookieStore = await cookies()
  const locale = (cookieStore.get('locale')?.value || 'en') as 'en' | 'es'
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'news',
    where: { slug: { equals: slug }, published: { equals: true } },
    locale,
    limit: 1,
  })

  const article = result.docs[0]
  if (!article) notFound()

  return (
    <>
      <PageBanner title={article.title} />
      <BlogDetail article={article} />
    </>
  )
}
