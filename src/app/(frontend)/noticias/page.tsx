import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cookies } from 'next/headers'
import { PageBanner } from '@/components/PageBanner'
import { BlogCard } from '@/components/BlogCard'
import { Pagination } from '@/components/Pagination'

export const metadata: Metadata = {
  title: 'Noticias',
  description:
    'Últimas noticias y novedades de Fundación Grandmother\'s House. Mantente informado sobre nuestro trabajo con los niños.',
}

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams
  const cookieStore = await cookies()
  const locale = (cookieStore.get('locale')?.value || 'es') as 'en' | 'es'
  const payload = await getPayload({ config: configPromise })

  const currentPage = Number(params.page) || 1

  const news = await payload.find({
    collection: 'news',
    where: { published: { equals: true } },
    sort: '-date',
    page: currentPage,
    limit: 6,
    locale,
  })

  return (
    <>
      <PageBanner title={locale === 'es' ? 'Noticias' : 'News'} />
      <section className="blog-main blog cm-details">
        <div className="container">
          <div className="row gutter-30">
            {news.docs.map((article: any, i: number) => (
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
