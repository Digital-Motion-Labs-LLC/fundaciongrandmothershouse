import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cookies } from 'next/headers'
import { PageBanner } from '@/components/PageBanner'
import { notFound } from 'next/navigation'
import { BlogDetail } from '@/components/BlogDetail'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'news',
    where: { slug: { equals: slug }, published: { equals: true } },
    limit: 1,
  })

  const article = result.docs[0]
  if (!article) {
    return { title: 'Noticia no encontrada' }
  }

  const description = typeof article.content === 'string'
    ? article.content.slice(0, 160)
    : Array.isArray(article.content)
      ? article.content
          .map((block: any) =>
            block.children?.map((child: any) => child.text).join('') || ''
          )
          .join(' ')
          .slice(0, 160)
      : ''

  const image = typeof article.image === 'object' && article.image?.url
    ? article.image.url
    : undefined

  return {
    title: article.title,
    description,
    openGraph: {
      title: article.title,
      description,
      ...(image ? { images: [{ url: image }] } : {}),
    },
  }
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cookieStore = await cookies()
  const locale = (cookieStore.get('locale')?.value || 'es') as 'en' | 'es'
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
