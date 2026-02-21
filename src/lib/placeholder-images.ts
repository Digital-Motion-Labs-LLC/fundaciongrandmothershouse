/**
 * Pexels placeholder images used as fallbacks when no image is configured in the CMS.
 * All images are served directly from Pexels CDN (no download needed).
 */

const PEXELS_BASE = 'https://images.pexels.com/photos'

const hero = [
  `${PEXELS_BASE}/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1`,
  `${PEXELS_BASE}/6994982/pexels-photo-6994982.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1`,
]

const blog = [
  `${PEXELS_BASE}/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1`,
  `${PEXELS_BASE}/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1`,
  `${PEXELS_BASE}/5214958/pexels-photo-5214958.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1`,
]

const events = [
  `${PEXELS_BASE}/8363104/pexels-photo-8363104.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1`,
  `${PEXELS_BASE}/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1`,
  `${PEXELS_BASE}/3184396/pexels-photo-3184396.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1`,
]

const about = [
  `${PEXELS_BASE}/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&dpr=1`,
  `${PEXELS_BASE}/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&dpr=1`,
]

const authors = [
  `${PEXELS_BASE}/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1`,
  `${PEXELS_BASE}/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1`,
  `${PEXELS_BASE}/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1`,
  `${PEXELS_BASE}/3778603/pexels-photo-3778603.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1`,
]

// Help section: 3 images (top small, main large, bottom small)
const help = {
  thumbTop: `${PEXELS_BASE}/1250346/pexels-photo-1250346.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1`,
  thumbLg: `${PEXELS_BASE}/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=600&h=700&dpr=1`,
  thumbBottom: `${PEXELS_BASE}/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1`,
}

export const placeholderImages = {
  hero: (index: number) => hero[index % hero.length],
  blog: (index: number) => blog[index % blog.length],
  events: (index: number) => events[index % events.length],
  about: (index: number) => about[index % about.length],
  authors: (index: number) => authors[index % authors.length],
  help,
}
