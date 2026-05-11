import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { PageBanner } from '@/components/PageBanner'
import { EventCard } from '@/components/EventCard'
import { Pagination } from '@/components/Pagination'
import { JsonLd } from '@/components/JsonLd'
import { listActivities } from '@/content'
import { localize } from '@/content/localize'
import { readLocaleFromCookie } from '@/content/schema'

export const metadata: Metadata = {
  title: 'Nuestras Actividades',
  description:
    'Conoce las actividades y eventos que realiza Fundación Grandmother\'s House para el bienestar de los niños en Juan Dolio, República Dominicana.',
  alternates: { canonical: '/actividades' },
  openGraph: {
    title: "Actividades — Fundación Grandmother's House",
    description:
      'Jornadas, eventos y proyectos sociales para los niños de Los Guayacanes, Juan Dolio y comunidades de SPM.',
    url: 'https://fundaciongrandmothershouse.com/actividades',
    type: 'website',
  },
}

export default async function ActivitiesPage({ searchParams }: { searchParams: Promise<{ page?: string; q?: string }> }) {
  const params = await searchParams
  const cookieStore = await cookies()
  const locale = readLocaleFromCookie(cookieStore.get('locale')?.value)

  const currentPage = Number(params.page) || 1
  const query = params.q || ''

  const result = listActivities({ page: currentPage, limit: 6, query })
  const activities = {
    ...result,
    docs: localize(result.docs, locale) as Array<Record<string, unknown> & { id: number }>,
  }

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: locale === 'es' ? 'Actividades' : 'Activities',
    url: 'https://fundaciongrandmothershouse.com/actividades',
    isPartOf: {
      '@type': 'WebSite',
      name: "Fundación Grandmother's House",
      url: 'https://fundaciongrandmothershouse.com',
    },
    about: {
      '@type': 'NGO',
      name: "Fundación Grandmother's House",
    },
  }

  return (
    <>
      <JsonLd data={collectionJsonLd} />
      <PageBanner title={locale === 'es' ? 'Actividades' : 'Activities'} />
      <section className="event event-alt">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-xl-7">
              <div className="section__header text-center">
                <h2>{locale === 'es' ? 'Nuestras Actividades' : 'Our Activities'}</h2>
              </div>
              <form method="GET" className="mb-4" style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <input type="text" name="q" defaultValue={query} placeholder={locale === 'es' ? 'Buscar por título...' : 'Search by title...'} className="form-control" style={{ maxWidth: '300px' }} />
                <button type="submit" className="btn--primary">{locale === 'es' ? 'Buscar' : 'Search'}</button>
              </form>
            </div>
          </div>
          <div className="row gutter-30">
            {activities.docs.map((activity: any, i: number) => (
              <EventCard key={activity.id} activity={activity} index={i} locale={locale} />
            ))}
          </div>
          {activities.totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={activities.totalPages} basePath="/actividades" />
          )}
        </div>
      </section>
    </>
  )
}
