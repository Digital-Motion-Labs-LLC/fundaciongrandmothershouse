const SITE = 'https://fundaciongrandmothershouse.com'

export type BreadcrumbCrumb = { name: string; path: string }

export const breadcrumbJsonLd = (crumbs: BreadcrumbCrumb[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: `${SITE}${c.path}`,
  })),
})
