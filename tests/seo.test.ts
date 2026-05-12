import { describe, it, expect, beforeAll } from 'vitest'

const BASE = process.env.SEO_TEST_BASE ?? 'http://localhost:3000'

const ROUTES = [
  '/',
  '/quienes-somos',
  '/quienes-somos/mision',
  '/quienes-somos/vision',
  '/actividades',
  '/actividades/te-de-primavera',
  '/noticias',
  '/noticias/rabietas-y-sobreestimulacion-de-pantallas',
  '/contacto',
  '/terminos-y-condiciones',
] as const

type Cache = Record<string, string>
const htmlCache: Cache = {}

const fetchHtml = async (path: string): Promise<string> => {
  if (htmlCache[path]) return htmlCache[path]
  const r = await fetch(BASE + path)
  expect(r.status, `HTTP ${r.status} on ${path}`).toBe(200)
  const t = await r.text()
  htmlCache[path] = t
  return t
}

const meta = (html: string, key: string) =>
  html.match(new RegExp(`<meta\\s+(?:name|property)="${key}"\\s+content="([^"]*)"`))?.[1]

const link = (html: string, rel: string) =>
  [...html.matchAll(new RegExp(`<link\\s+rel="${rel}"[^>]*>`, 'g'))].map((m) => m[0])

const linkRelAlternateHreflang = (html: string) =>
  [...html.matchAll(/<link\s+[^>]*?\bhref[Ll]ang=["']([^"']+)["']/g)].map((m) => m[1])

const jsonLdBlocks = (html: string) =>
  [...html.matchAll(/<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .map((m) => {
      try {
        return JSON.parse(m[1].replace(/\\u003c/g, '<').replace(/\\u003e/g, '>').replace(/\\u0026/g, '&'))
      } catch {
        return null
      }
    })
    .filter(Boolean)

beforeAll(async () => {
  // Warm cache
  await Promise.all(ROUTES.map(fetchHtml))
})

describe('SEO essentials per route', () => {
  for (const path of ROUTES) {
    describe(path, () => {
      it('returns 200', async () => {
        const r = await fetch(BASE + path)
        expect(r.status).toBe(200)
      })

      it('has unique <title>', async () => {
        const html = await fetchHtml(path)
        const titles = [...html.matchAll(/<title[^>]*>([\s\S]*?)<\/title>/g)]
        expect(titles.length, 'expected exactly one <title>').toBe(1)
        expect(titles[0][1].trim().length).toBeGreaterThan(5)
      })

      it('has meta description (50-200 chars)', async () => {
        const html = await fetchHtml(path)
        const desc = meta(html, 'description')
        expect(desc, 'missing description').toBeTruthy()
        expect(desc!.length).toBeGreaterThanOrEqual(50)
        expect(desc!.length).toBeLessThanOrEqual(200)
      })

      it('has canonical link', async () => {
        const html = await fetchHtml(path)
        const canon = link(html, 'canonical')
        expect(canon.length).toBe(1)
      })

      it('has hreflang alternates', async () => {
        const html = await fetchHtml(path)
        const hls = linkRelAlternateHreflang(html)
        expect(hls).toContain('es')
        expect(hls).toContain('en')
        expect(hls).toContain('x-default')
      })

      it('has OG image and OG type', async () => {
        const html = await fetchHtml(path)
        expect(meta(html, 'og:image'), 'og:image missing').toBeTruthy()
        expect(meta(html, 'og:type'), 'og:type missing').toBeTruthy()
      })

      it('has og:locale es_DO + alternate en_US', async () => {
        const html = await fetchHtml(path)
        expect(meta(html, 'og:locale')).toBe('es_DO')
        expect(meta(html, 'og:locale:alternate')).toBe('en_US')
      })

      it('has exactly one <h1>', async () => {
        const html = await fetchHtml(path)
        const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/)?.[1] ?? ''
        const h1s = [...body.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)]
        expect(h1s.length, `expected single <h1>, got ${h1s.length}`).toBe(1)
      })

      it('robots meta is index, follow', async () => {
        const html = await fetchHtml(path)
        const robots = meta(html, 'robots') ?? 'index, follow'
        expect(robots).not.toMatch(/noindex/)
      })

      it('all images have alt and below-fold ones are lazy', async () => {
        const html = await fetchHtml(path)
        const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/)?.[1] ?? ''
        const imgs = [...body.matchAll(/<img\s+([^>]+)\/?>/g)].map((m) => m[1])
        const noAlt = imgs.filter((x) => !/alt="[^"]*"/.test(x))
        expect(noAlt.length, `${noAlt.length} images without alt`).toBe(0)
        // At least one lazy if there are many images
        if (imgs.length > 5) {
          const lazy = imgs.filter((x) => /loading="lazy"/.test(x))
          expect(lazy.length).toBeGreaterThan(0)
        }
      })

      it('has at least one JSON-LD block with @context schema.org', async () => {
        const html = await fetchHtml(path)
        const blocks = jsonLdBlocks(html)
        expect(blocks.length).toBeGreaterThan(0)
        for (const b of blocks) {
          expect(b['@context']).toBe('https://schema.org')
        }
      })
    })
  }
})

describe('Page-specific structured data', () => {
  it('home has WebSite schema with SearchAction', async () => {
    const html = await fetchHtml('/')
    const blocks = jsonLdBlocks(html)
    const ws = blocks.find((b) => b['@type'] === 'WebSite')
    expect(ws).toBeTruthy()
    expect(ws.potentialAction?.['@type']).toBe('SearchAction')
  })

  it('activity detail has Event schema', async () => {
    const html = await fetchHtml('/actividades/te-de-primavera')
    const blocks = jsonLdBlocks(html)
    expect(blocks.some((b) => b['@type'] === 'Event')).toBe(true)
    expect(blocks.some((b) => b['@type'] === 'BreadcrumbList')).toBe(true)
  })

  it('news detail has NewsArticle schema', async () => {
    const html = await fetchHtml('/noticias/rabietas-y-sobreestimulacion-de-pantallas')
    const blocks = jsonLdBlocks(html)
    expect(blocks.some((b) => b['@type'] === 'NewsArticle')).toBe(true)
    expect(blocks.some((b) => b['@type'] === 'BreadcrumbList')).toBe(true)
  })

  it('contacto has FAQPage schema', async () => {
    const html = await fetchHtml('/contacto')
    const blocks = jsonLdBlocks(html)
    const faq = blocks.find((b) => b['@type'] === 'FAQPage')
    expect(faq, 'FAQPage missing').toBeTruthy()
    expect(faq.mainEntity.length).toBeGreaterThanOrEqual(3)
  })

  it('quienes-somos has FAQPage + Breadcrumb', async () => {
    const html = await fetchHtml('/quienes-somos')
    const blocks = jsonLdBlocks(html)
    expect(blocks.some((b) => b['@type'] === 'FAQPage')).toBe(true)
    expect(blocks.some((b) => b['@type'] === 'BreadcrumbList')).toBe(true)
  })

  it('NGO schema has E.164 phone + geo + openingHours + DonateAction', async () => {
    const html = await fetchHtml('/')
    const blocks = jsonLdBlocks(html)
    const ngo = blocks.find((b) => b['@type'] === 'NGO')
    expect(ngo).toBeTruthy()
    expect(ngo.telephone).toMatch(/^\+1-/)
    expect(ngo.geo?.['@type']).toBe('GeoCoordinates')
    expect(typeof ngo.geo?.latitude).toBe('number')
    expect(ngo.openingHoursSpecification?.length).toBeGreaterThan(0)
    expect(ngo.potentialAction?.['@type']).toBe('DonateAction')
  })
})

describe('Discoverability assets', () => {
  it('robots.txt allows AI bots explicitly', async () => {
    const r = await fetch(BASE + '/robots.txt')
    const txt = await r.text()
    for (const bot of ['Googlebot', 'GPTBot', 'ClaudeBot', 'PerplexityBot', 'Bingbot']) {
      expect(txt, `${bot} missing from robots.txt`).toContain(`User-Agent: ${bot}`)
    }
    expect(txt).toContain('Sitemap: https://fundaciongrandmothershouse.com/sitemap.xml')
  })

  it('llms.txt exists and lists key URLs', async () => {
    const r = await fetch(BASE + '/llms.txt')
    expect(r.status).toBe(200)
    const txt = await r.text()
    expect(txt).toMatch(/Grandmother/)
    expect(txt).toContain('/actividades/')
    expect(txt).toContain('/noticias/')
  })

  it('sitemap.xml has image entries for activities and news', async () => {
    const r = await fetch(BASE + '/sitemap.xml')
    const xml = await r.text()
    const imageCount = (xml.match(/<image:image>/g) || []).length
    expect(imageCount, 'sitemap should include image entries').toBeGreaterThan(10)
  })
})
