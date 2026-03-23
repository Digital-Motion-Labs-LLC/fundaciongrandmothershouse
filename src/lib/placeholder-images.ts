/**
 * Local placeholder images used as fallbacks when no image is configured in the CMS.
 * Uses real event photos from the redesign-photos directory.
 */

const PHOTOS_BASE = '/redesign-photos'

const hero = [
  `${PHOTOS_BASE}/evento-juguetes-7.jpeg`,
  `${PHOTOS_BASE}/evento-juguetes-12.jpeg`,
]

const blog = [
  `${PHOTOS_BASE}/evento-juguetes-1.jpeg`,
  `${PHOTOS_BASE}/evento-juguetes-2.jpeg`,
  `${PHOTOS_BASE}/evento-juguetes-3.jpeg`,
]

const events = [
  `${PHOTOS_BASE}/evento-juguetes-4.jpeg`,
  `${PHOTOS_BASE}/evento-juguetes-5.jpeg`,
  `${PHOTOS_BASE}/evento-juguetes-6.jpeg`,
]

const about = [
  `${PHOTOS_BASE}/evento-juguetes-10.jpeg`,
  `${PHOTOS_BASE}/evento-juguetes-11.jpeg`,
]

const authors = [
  `${PHOTOS_BASE}/evento-juguetes-8.jpeg`,
  `${PHOTOS_BASE}/evento-juguetes-9.jpeg`,
  `${PHOTOS_BASE}/evento-juguetes-13.jpeg`,
  `${PHOTOS_BASE}/evento-juguetes-14.jpeg`,
]

// Help section: 3 images (top small, main large, bottom small)
const help = {
  thumbTop: `${PHOTOS_BASE}/evento-juguetes-15.jpeg`,
  thumbLg: `${PHOTOS_BASE}/evento-juguetes-10.jpeg`,
  thumbBottom: `${PHOTOS_BASE}/evento-juguetes-16.jpeg`,
}

export const placeholderImages = {
  hero: (index: number) => hero[index % hero.length],
  blog: (index: number) => blog[index % blog.length],
  events: (index: number) => events[index % events.length],
  about: (index: number) => about[index % about.length],
  authors: (index: number) => authors[index % authors.length],
  help,
}
