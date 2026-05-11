import { describe, it, expect } from 'vitest'
import { activities, news, pages, header, footer } from '../src/content'
import {
  Activity,
  NewsArticle,
  Page,
  Header,
  Footer,
  PAGE_SLUGS,
} from '../src/content/schema'

describe('Content shape: every TS-authored item validates against schema', () => {
  it('every activity validates', () => {
    for (const a of activities) Activity.parse(a)
    expect(activities.length).toBeGreaterThan(0)
  })

  it('every news article validates', () => {
    for (const n of news) NewsArticle.parse(n)
    expect(news.length).toBeGreaterThan(0)
  })

  it('every page validates and all required slugs exist', () => {
    for (const slug of PAGE_SLUGS) {
      const page = pages[slug]
      expect(page, `Missing page for slug: ${slug}`).toBeDefined()
      Page.parse(page)
    }
  })

  it('header global validates', () => {
    Header.parse(header)
  })

  it('footer global validates', () => {
    Footer.parse(footer)
  })
})

describe('Content uniqueness: slugs', () => {
  it('activity slugs are unique', () => {
    const seen = new Set<string>()
    for (const a of activities) {
      expect(seen.has(a.slug), `Duplicate activity slug: ${a.slug}`).toBe(false)
      seen.add(a.slug)
    }
  })

  it('news slugs are unique', () => {
    const seen = new Set<string>()
    for (const n of news) {
      expect(seen.has(n.slug), `Duplicate news slug: ${n.slug}`).toBe(false)
      seen.add(n.slug)
    }
  })

  it('every slug is URL-safe (lowercase, hyphens, no spaces)', () => {
    const URL_SAFE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    for (const a of activities) {
      expect(URL_SAFE.test(a.slug), `Invalid activity slug: ${a.slug}`).toBe(true)
    }
    for (const n of news) {
      expect(URL_SAFE.test(n.slug), `Invalid news slug: ${n.slug}`).toBe(true)
    }
  })
})

const STATIC_ROUTES = new Set([
  '/',
  '/actividades',
  '/noticias',
  '/contacto',
  '/quienes-somos',
  '/quienes-somos/mision',
  '/quienes-somos/vision',
  '/terminos-y-condiciones',
])

const isInternalLink = (link: string) =>
  link.startsWith('/') && !link.startsWith('//')

const isAnchorOrSpecial = (link: string) =>
  link.startsWith('#') || link.startsWith('mailto:') || link.startsWith('tel:') || link === ''

const isAbsoluteUrl = (link: string) => /^https?:\/\//.test(link)

const resolvesInternally = (link: string) => {
  if (STATIC_ROUTES.has(link)) return true
  // /actividades/<slug>
  const actMatch = link.match(/^\/actividades\/([^/?#]+)$/)
  if (actMatch) return activities.some((a) => a.slug === actMatch[1])
  // /noticias/<slug>
  const newsMatch = link.match(/^\/noticias\/([^/?#]+)$/)
  if (newsMatch) return news.some((n) => n.slug === newsMatch[1])
  return false
}

const collectLinks = (): Array<{ link: string; where: string }> => {
  const out: Array<{ link: string; where: string }> = []

  for (const item of header.navigation) {
    if (item.link) out.push({ link: item.link, where: `header.navigation[${item.label.es ?? item.label.en}]` })
    for (const child of item.children ?? []) {
      if (child.link)
        out.push({
          link: child.link,
          where: `header.navigation[${item.label.es}].children[${child.label.es ?? child.label.en}]`,
        })
    }
  }

  for (const link of footer.quickLinks ?? []) {
    if (link.link) out.push({ link: link.link, where: `footer.quickLinks[${link.label.es ?? link.label.en}]` })
  }
  for (const link of footer.services ?? []) {
    if (link.link) out.push({ link: link.link, where: `footer.services[${link.label.es ?? link.label.en}]` })
  }
  for (const link of footer.legalLinks ?? []) {
    if (link.link) out.push({ link: link.link, where: `footer.legalLinks[${link.label.es ?? link.label.en}]` })
  }

  for (const slug of PAGE_SLUGS) {
    const page = pages[slug]
    page.layout.forEach((block, i) => {
      const where = `page[${slug}].layout[${i}:${block.blockType}]`
      switch (block.blockType) {
        case 'heroSlider':
          block.slides.forEach((s, j) => {
            if (s.ctaPrimaryLink) out.push({ link: s.ctaPrimaryLink, where: `${where}.slides[${j}].ctaPrimaryLink` })
            if (s.ctaSecondaryLink) out.push({ link: s.ctaSecondaryLink, where: `${where}.slides[${j}].ctaSecondaryLink` })
          })
          break
        case 'difference':
          block.items.forEach((it, j) => {
            if (it.link) out.push({ link: it.link, where: `${where}.items[${j}].link` })
          })
          break
        case 'help':
          if (block.ctaLink) out.push({ link: block.ctaLink, where: `${where}.ctaLink` })
          break
        case 'textSection':
          if (block.ctaLink) out.push({ link: block.ctaLink, where: `${where}.ctaLink` })
          break
        case 'ctaBanner':
          if (block.primaryButtonLink) out.push({ link: block.primaryButtonLink, where: `${where}.primaryButtonLink` })
          if (block.secondaryButtonLink) out.push({ link: block.secondaryButtonLink, where: `${where}.secondaryButtonLink` })
          break
      }
    })
  }

  return out
}

describe('Internal link resolution: every internal href must point to a real route', () => {
  const links = collectLinks()

  it('emits links for testing', () => {
    expect(links.length).toBeGreaterThan(0)
  })

  for (const { link, where } of collectLinks()) {
    if (isAnchorOrSpecial(link) || isAbsoluteUrl(link)) continue
    if (!isInternalLink(link)) continue

    it(`resolves: ${link} (${where})`, () => {
      expect(resolvesInternally(link), `Broken internal link "${link}" at ${where}`).toBe(true)
    })
  }
})

describe('Page → required block coverage', () => {
  it('home has heroSlider, difference, help, testimonial, blogPreview', () => {
    const types = pages.home.layout.map((b) => b.blockType)
    for (const required of ['heroSlider', 'difference', 'help', 'testimonial', 'blogPreview']) {
      expect(types, `Missing required block on home: ${required}`).toContain(required)
    }
  })

  it('about has at least one textSection', () => {
    const types = pages.about.layout.map((b) => b.blockType)
    expect(types).toContain('textSection')
  })

  it('mission has at least one textSection', () => {
    const types = pages.mission.layout.map((b) => b.blockType)
    expect(types).toContain('textSection')
  })

  it('vision has at least one textSection', () => {
    const types = pages.vision.layout.map((b) => b.blockType)
    expect(types).toContain('textSection')
  })

  it('terms has at least one textSection', () => {
    const types = pages.terms.layout.map((b) => b.blockType)
    expect(types).toContain('textSection')
  })
})

describe('Featured image presence', () => {
  it('every published activity with a gallery has a featuredImage with url', () => {
    for (const a of activities) {
      if (!a.published) continue
      if ((a.gallery?.length ?? 0) > 0) {
        expect(a.featuredImage?.url, `Activity ${a.slug} has gallery but no featuredImage.url`).toBeTruthy()
      }
    }
  })
})
