import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { PageBanner } from '@/components/PageBanner'
import { BlogDetail } from '@/components/BlogDetail'
import { JsonLd } from '@/components/JsonLd'
import { news, findNewsBySlug } from '@/content'
import { localize, pickLocale } from '@/content/localize'
import { readLocaleFromCookie } from '@/content/schema'

export const dynamicParams = false

export const generateStaticParams = async () =>
  news.filter((n) => n.published).map((n) => ({ slug: n.slug }))

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = findNewsBySlug(slug)
  if (!article) return { title: 'Noticia no encontrada' }

  const title = pickLocale(article.title, 'es') ?? slug
  const excerpt = pickLocale(article.excerpt, 'es') ?? ''
  const image = article.image?.url ?? undefined

  return {
    title,
    description: excerpt.slice(0, 160),
    alternates: { canonical: `/noticias/${slug}` },
    openGraph: {
      title,
      description: excerpt.slice(0, 160),
      url: `https://fundaciongrandmothershouse.com/noticias/${slug}`,
      type: 'article',
      publishedTime: article.date,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: excerpt.slice(0, 160),
      ...(image ? { images: [image] } : {}),
    },
  }
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cookieStore = await cookies()
  const locale = readLocaleFromCookie(cookieStore.get('locale')?.value)

  const raw = findNewsBySlug(slug)
  if (!raw) notFound()
  const article = localize(raw, locale) as Record<string, unknown> & {
    title: string
    date: string
    image?: { url?: string | null } | null
    excerpt?: string | null
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    datePublished: article.date,
    dateModified: article.date,
    author: {
      '@type': 'NGO',
      name: "Fundación Grandmother's House",
      url: 'https://fundaciongrandmothershouse.com',
    },
    publisher: {
      '@type': 'Organization',
      name: "Fundación Grandmother's House",
      logo: { '@type': 'ImageObject', url: 'https://fundaciongrandmothershouse.com/og-image.png' },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://fundaciongrandmothershouse.com/noticias/${slug}`,
    },
    description: article.excerpt ?? undefined,
    image: article.image?.url
      ? [`https://fundaciongrandmothershouse.com${article.image.url}`]
      : undefined,
  }

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <PageBanner title={article.title} />
      <BlogDetail article={article} />
    </>
  )
}
