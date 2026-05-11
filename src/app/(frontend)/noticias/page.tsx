import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { PageBanner } from '@/components/PageBanner'
import { BlogCard } from '@/components/BlogCard'
import { Pagination } from '@/components/Pagination'
import { JsonLd } from '@/components/JsonLd'
import { listNews } from '@/content'
import { localize } from '@/content/localize'
import { readLocaleFromCookie } from '@/content/schema'

export const metadata: Metadata = {
  title: 'Noticias',
  description:
    'Últimas noticias y novedades de Fundación Grandmother\'s House. Mantente informado sobre nuestro trabajo con los niños.',
  alternates: { canonical: '/noticias' },
  openGraph: {
    title: "Noticias — Fundación Grandmother's House",
    description: 'Novedades del trabajo social, eventos y comunidad.',
    url: 'https://fundaciongrandmothershouse.com/noticias',
    type: 'website',
  },
}

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams
  const cookieStore = await cookies()
  const locale = readLocaleFromCookie(cookieStore.get('locale')?.value)

  const currentPage = Number(params.page) || 1
  const result = listNews({ page: currentPage, limit: 6 })
  const news = {
    ...result,
    docs: localize(result.docs, locale) as Array<Record<string, unknown> & { id: number }>,
  }

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: locale === 'es' ? 'Noticias' : 'News',
    url: 'https://fundaciongrandmothershouse.com/noticias',
    isPartOf: {
      '@type': 'WebSite',
      name: "Fundación Grandmother's House",
      url: 'https://fundaciongrandmothershouse.com',
    },
  }

  return (
    <>
      <JsonLd data={collectionJsonLd} />
      <PageBanner title={locale === 'es' ? 'Noticias' : 'News'} />
      <section className="blog-main blog cm-details">
        <div className="container">
          <div className="row gutter-30">
            {news.docs.map((article, i: number) => (
              <div key={article.id} className="col-12 col-lg-6 col-xl-4">
                <BlogCard article={article} index={i} locale={locale} />
              </div>
            ))}
          </div>
          {news.totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={news.totalPages} basePath="/noticias" />
          )}
        </div>
      </section>
    </>
  )
}
