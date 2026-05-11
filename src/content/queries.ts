import type { Activity, NewsArticle, Page, PageSlug } from './schema'
import { activities } from './activities'
import { news } from './news'
import { pages } from './pages'

export const findActivityBySlug = (slug: string): Activity | undefined =>
  activities.find((a) => a.slug === slug && a.published)

export const findNewsBySlug = (slug: string): NewsArticle | undefined =>
  news.find((n) => n.slug === slug && n.published)

export const getPage = (slug: PageSlug): Page => pages[slug]

type ListOpts = {
  page?: number
  limit?: number
  query?: string
  searchField?: 'name' | 'title'
}

const byDateDesc = <T extends { date: string }>(a: T, b: T) =>
  new Date(b.date).getTime() - new Date(a.date).getTime()

const matchesQuery = (
  haystack: { es?: string | null; en?: string | null } | undefined,
  needle: string,
) => {
  if (!needle) return true
  const q = needle.toLowerCase()
  const es = (haystack?.es ?? '').toLowerCase()
  const en = (haystack?.en ?? '').toLowerCase()
  return es.includes(q) || en.includes(q)
}

export const listActivities = ({
  page = 1,
  limit = 6,
  query = '',
}: ListOpts = {}) => {
  const filtered = activities
    .filter((a) => a.published)
    .filter((a) => matchesQuery(a.name, query))
    .sort(byDateDesc)
  const totalDocs = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalDocs / limit))
  const docs = filtered.slice((page - 1) * limit, page * limit)
  return {
    docs,
    totalDocs,
    totalPages,
    page,
    limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }
}

export const listNews = ({ page = 1, limit = 6, query = '' }: ListOpts = {}) => {
  const filtered = news
    .filter((n) => n.published)
    .filter((n) => matchesQuery(n.title, query))
    .sort(byDateDesc)
  const totalDocs = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalDocs / limit))
  const docs = filtered.slice((page - 1) * limit, page * limit)
  return {
    docs,
    totalDocs,
    totalPages,
    page,
    limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }
}

export const topActivities = (n = 3): Activity[] =>
  [...activities].filter((a) => a.published).sort(byDateDesc).slice(0, n)

export const topNews = (n = 3): NewsArticle[] =>
  [...news].filter((a) => a.published).sort(byDateDesc).slice(0, n)
