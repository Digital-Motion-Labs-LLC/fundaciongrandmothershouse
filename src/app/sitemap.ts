import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

const BASE_URL = 'https://fundaciongrandmothershouse.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/quienes-somos`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/quienes-somos/mision`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/quienes-somos/vision`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/actividades`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/noticias`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/contacto`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/terminos-y-condiciones`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]

  const dynamicPages: MetadataRoute.Sitemap = []

  try {
    const payload = await getPayload({ config: configPromise })

    const activities = await payload.find({
      collection: 'activities',
      where: { published: { equals: true } },
      limit: 1000,
      select: { slug: true, updatedAt: true },
    })

    for (const activity of activities.docs) {
      dynamicPages.push({
        url: `${BASE_URL}/actividades/${activity.slug}`,
        lastModified: new Date(activity.updatedAt as string),
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    }

    const news = await payload.find({
      collection: 'news',
      where: { published: { equals: true } },
      limit: 1000,
      select: { slug: true, updatedAt: true },
    })

    for (const article of news.docs) {
      dynamicPages.push({
        url: `${BASE_URL}/noticias/${article.slug}`,
        lastModified: new Date(article.updatedAt as string),
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    }
  } catch {
    // If DB is unavailable, return only static pages
  }

  return [...staticPages, ...dynamicPages]
}
