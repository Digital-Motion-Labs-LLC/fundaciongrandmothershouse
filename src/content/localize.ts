import type { Locale } from './schema'

/* eslint-disable @typescript-eslint/no-explicit-any */

const isLocalizedShape = (v: any): boolean => {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return false
  const keys = Object.keys(v)
  if (keys.length === 0) return false
  for (const k of keys) if (k !== 'es' && k !== 'en') return false
  return 'es' in v || 'en' in v
}

const pickFromLocalized = (v: any, locale: Locale, fallback: Locale): any => {
  const primary = v[locale]
  if (primary !== null && primary !== undefined && primary !== '') return primary
  const fb = v[fallback]
  if (fb !== null && fb !== undefined && fb !== '') return fb
  return primary ?? fb ?? null
}

export const localize = <T>(input: T, locale: Locale, fallback: Locale = 'es'): any => {
  if (input == null) return input
  if (Array.isArray(input)) return input.map((x) => localize(x, locale, fallback))
  if (typeof input !== 'object') return input

  if (isLocalizedShape(input)) {
    return localize(pickFromLocalized(input, locale, fallback), locale, fallback)
  }

  const out: Record<string, any> = {}
  for (const [k, v] of Object.entries(input as Record<string, any>)) {
    out[k] = localize(v, locale, fallback)
  }
  return out
}

export const pickLocale = <T>(
  field: { es?: T | null; en?: T | null } | null | undefined,
  locale: Locale,
  fallback: Locale = 'es',
): T | null => {
  if (!field) return null
  const primary = field[locale]
  if (primary !== null && primary !== undefined && primary !== ('' as unknown as T)) return primary
  const fb = field[fallback]
  if (fb !== null && fb !== undefined && fb !== ('' as unknown as T)) return fb
  return null
}
