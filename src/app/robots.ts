import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const allCrawl = { allow: ['/', '/api/media/', '/llms.txt'] }
  return {
    rules: [
      { userAgent: '*', ...allCrawl },
      { userAgent: 'Googlebot', ...allCrawl },
      { userAgent: 'Googlebot-Image', ...allCrawl },
      { userAgent: 'Google-Extended', ...allCrawl },
      { userAgent: 'Bingbot', ...allCrawl },
      { userAgent: 'DuckDuckBot', ...allCrawl },
      { userAgent: 'GPTBot', ...allCrawl },
      { userAgent: 'OAI-SearchBot', ...allCrawl },
      { userAgent: 'ChatGPT-User', ...allCrawl },
      { userAgent: 'ClaudeBot', ...allCrawl },
      { userAgent: 'Claude-Web', ...allCrawl },
      { userAgent: 'anthropic-ai', ...allCrawl },
      { userAgent: 'PerplexityBot', ...allCrawl },
      { userAgent: 'Perplexity-User', ...allCrawl },
      { userAgent: 'CCBot', ...allCrawl },
      { userAgent: 'Applebot', ...allCrawl },
      { userAgent: 'Applebot-Extended', ...allCrawl },
      { userAgent: 'FacebookBot', ...allCrawl },
      { userAgent: 'meta-externalagent', ...allCrawl },
    ],
    sitemap: [
      'https://fundaciongrandmothershouse.com/sitemap.xml',
    ],
    host: 'https://fundaciongrandmothershouse.com',
  }
}
