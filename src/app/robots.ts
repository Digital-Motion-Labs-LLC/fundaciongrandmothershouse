import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/api/media/'],
      },
    ],
    sitemap: 'https://fundaciongrandmothershouse.com/sitemap.xml',
    host: 'https://fundaciongrandmothershouse.com',
  }
}
