import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  Activity,
  NewsArticle,
  Page,
  Header,
  Footer,
  SiteSettings,
  DonationSettings,
} from '../src/content/schema'

const SNAPSHOT_DIR = join(__dirname, '..', '.snapshot')

const loadSnapshot = (file: string) =>
  JSON.parse(readFileSync(join(SNAPSHOT_DIR, file), 'utf-8'))

describe('Zod schemas validate the prod snapshot (TDD ground truth)', () => {
  describe('Activity schema', () => {
    const { docs } = loadSnapshot('activities.json')

    it('parses every activity', () => {
      for (const doc of docs) {
        const result = Activity.safeParse(doc)
        if (!result.success) {
          throw new Error(
            `Activity ${doc.slug} failed:\n${JSON.stringify(result.error.issues, null, 2)}`,
          )
        }
      }
      expect(docs.length).toBeGreaterThan(0)
    })
  })

  describe('NewsArticle schema', () => {
    const { docs } = loadSnapshot('news.json')

    it('parses every news article', () => {
      for (const doc of docs) {
        const result = NewsArticle.safeParse(doc)
        if (!result.success) {
          throw new Error(
            `News ${doc.slug} failed:\n${JSON.stringify(result.error.issues, null, 2)}`,
          )
        }
      }
      expect(docs.length).toBeGreaterThan(0)
    })
  })

  describe('Page schema', () => {
    const { docs } = loadSnapshot('pages.json')

    it('parses every page', () => {
      for (const doc of docs) {
        const result = Page.safeParse(doc)
        if (!result.success) {
          throw new Error(
            `Page ${doc.slug} failed:\n${JSON.stringify(result.error.issues, null, 2)}`,
          )
        }
      }
      expect(docs.length).toBe(5)
    })

    it('contains all required slugs', () => {
      const slugs = docs.map((d: { slug: string }) => d.slug).sort()
      expect(slugs).toEqual(['about', 'home', 'mission', 'terms', 'vision'])
    })
  })

  describe('Header global', () => {
    const data = loadSnapshot('globals_header.json')
    it('parses', () => {
      const result = Header.safeParse(data)
      if (!result.success) {
        throw new Error(
          `Header failed:\n${JSON.stringify(result.error.issues, null, 2)}`,
        )
      }
    })
  })

  describe('Footer global', () => {
    const data = loadSnapshot('globals_footer.json')
    it('parses', () => {
      const result = Footer.safeParse(data)
      if (!result.success) {
        throw new Error(
          `Footer failed:\n${JSON.stringify(result.error.issues, null, 2)}`,
        )
      }
    })
  })

  describe('SiteSettings global', () => {
    const data = loadSnapshot('globals_site-settings.json')
    it('parses', () => {
      const result = SiteSettings.safeParse(data)
      if (!result.success) {
        throw new Error(
          `SiteSettings failed:\n${JSON.stringify(result.error.issues, null, 2)}`,
        )
      }
    })
  })

  describe('DonationSettings global', () => {
    const data = loadSnapshot('globals_donation-settings.json')
    it('parses', () => {
      const result = DonationSettings.safeParse(data)
      if (!result.success) {
        throw new Error(
          `DonationSettings failed:\n${JSON.stringify(result.error.issues, null, 2)}`,
        )
      }
    })
  })
})
