import type { MetadataRoute } from 'next'
import { activities, news } from '@/content'

const BASE_URL = 'https://fundaciongrandmothershouse.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/quienes-somos`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/quienes-somos/mision`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/quienes-somos/vision`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/actividades`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/noticias`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/contacto`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/terminos-y-condiciones`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const activityPages: MetadataRoute.Sitemap = activities
    .filter((a) => a.published)
    .map((a) => ({
      url: `${BASE_URL}/actividades/${a.slug}`,
      lastModified: new Date(a.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

  const newsPages: MetadataRoute.Sitemap = news
    .filter((n) => n.published)
    .map((n) => ({
      url: `${BASE_URL}/noticias/${n.slug}`,
      lastModified: new Date(n.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

  return [...staticPages, ...activityPages, ...newsPages]
}
