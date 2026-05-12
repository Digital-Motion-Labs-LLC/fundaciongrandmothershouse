/* SEO audit — fetches pages, validates SEO signals, outputs markdown report.
   Usage:
     npm run audit            -> audits http://localhost:3000
     npm run audit -- prod    -> audits prod
*/
import { writeFileSync } from 'node:fs'

const PROD = 'https://fundaciongrandmothershouse.vercel.app'
const LOCAL = 'http://localhost:3000'
const target = process.argv[2] === 'prod' ? PROD : LOCAL

const ROUTES = [
  '/',
  '/quienes-somos',
  '/quienes-somos/mision',
  '/quienes-somos/vision',
  '/actividades',
  '/actividades/te-de-primavera',
  '/actividades/jornada-bienestar-infantil-los-guayacanes-2026',
  '/actividades/entrega-juguetes-reyes-2026',
  '/noticias',
  '/noticias/rabietas-y-sobreestimulacion-de-pantallas',
  '/noticias/hantavirus-sintomas-y-prevencion',
  '/contacto',
  '/terminos-y-condiciones',
] as const

type Issue = { severity: 'fail' | 'warn' | 'pass'; check: string; detail?: string }
type RouteReport = { path: string; status: number; issues: Issue[] }

const decode = (s: string) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')

const auditRoute = async (path: string): Promise<RouteReport> => {
  const res = await fetch(target + path)
  const html = await res.text()
  const issues: Issue[] = []
  const ok = (check: string, detail?: string) => issues.push({ severity: 'pass', check, detail })
  const warn = (check: string, detail?: string) => issues.push({ severity: 'warn', check, detail })
  const fail = (check: string, detail?: string) => issues.push({ severity: 'fail', check, detail })

  // Title
  const title = decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1] ?? '')
  if (!title) fail('title-missing')
  else if (title.length > 60) warn('title-too-long', `${title.length} chars (>60)`)
  else ok('title', `${title.length} chars`)

  // Description
  const desc = decode(html.match(/<meta\s+name="description"\s+content="([^"]*)"/)?.[1] ?? '')
  if (!desc) fail('description-missing')
  else if (desc.length < 50) warn('description-too-short', `${desc.length} chars (<50)`)
  else if (desc.length > 160) warn('description-too-long', `${desc.length} chars (>160)`)
  else ok('description', `${desc.length} chars`)

  // Canonical
  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/)?.[1]
  if (!canonical) fail('canonical-missing')
  else ok('canonical', canonical)

  // OG image
  const ogImage = html.match(/<meta\s+property="og:image"\s+content="([^"]*)"/)?.[1]
  if (!ogImage) fail('og-image-missing', 'social shares will have no preview image')
  else ok('og-image', ogImage)

  // OG title/description/type/locale
  const ogType = html.match(/<meta\s+property="og:type"\s+content="([^"]*)"/)?.[1]
  const ogLocale = html.match(/<meta\s+property="og:locale"\s+content="([^"]*)"/)?.[1]
  const ogLocaleAlt = html.match(/<meta\s+property="og:locale:alternate"\s+content="([^"]*)"/)?.[1]
  if (!ogType) fail('og-type-missing')
  else ok('og-type', ogType)
  if (!ogLocale) warn('og-locale-missing')
  else ok('og-locale', ogLocale)
  if (!ogLocaleAlt) warn('og-locale-alternate-missing', 'EN audience signal missing')
  else ok('og-locale-alternate', ogLocaleAlt)

  // Twitter
  const twCard = html.match(/<meta\s+name="twitter:card"\s+content="([^"]*)"/)?.[1]
  if (!twCard) warn('twitter-card-missing')
  else ok('twitter-card', twCard)

  // Hreflang (case-insensitive — React renders hrefLang camelCase)
  const hreflangs = [...html.matchAll(/<link\s+[^>]*?\bhref[Ll]ang=["']([^"']+)["'][^>]*>/g)]
  if (hreflangs.length === 0) fail('hreflang-missing', 'no bilingual signals to search engines')
  else ok('hreflang', `${hreflangs.length} variants`)

  // Robots
  const robots = html.match(/<meta\s+name="robots"\s+content="([^"]*)"/)?.[1]
  if (!robots) ok('robots-default', 'default (index,follow)')
  else if (/noindex/.test(robots)) fail('robots-noindex', robots)
  else ok('robots', robots)

  // Body-level checks
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/)?.[1] ?? ''

  // Heading hierarchy
  const h1s = [...body.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => m[1].replace(/<[^>]+>/g, '').trim())
  if (h1s.length === 0) fail('h1-missing')
  else if (h1s.length > 1) fail('h1-multiple', `${h1s.length} h1 tags: ${h1s.slice(0, 3).join(' | ').slice(0, 120)}`)
  else ok('h1-single', h1s[0].slice(0, 80))

  const h2s = [...body.matchAll(/<h2[^>]*>/g)].length
  if (h2s === 0) warn('h2-missing', 'no section structure')
  else ok('h2-count', String(h2s))

  // Images
  const imgs = [...body.matchAll(/<img\s+([^>]+)\/?>/g)].map((m) => m[1])
  const noAlt = imgs.filter((x) => !/alt="[^"]+"/.test(x)).length
  const noLazy = imgs.filter((x) => !/loading="(lazy|eager)"/.test(x)).length
  if (noAlt > 0) fail('img-no-alt', `${noAlt}/${imgs.length} images without alt`)
  else if (imgs.length > 0) ok('img-alt', `${imgs.length} images all with alt`)
  if (imgs.length > 5 && noLazy === imgs.length) warn('img-no-lazy', `${imgs.length} images, none lazy-loaded`)
  else if (imgs.length > 0) ok('img-lazy', `${imgs.length - noLazy}/${imgs.length} lazy`)

  // JSON-LD blocks
  const jsonldBlocks = [...html.matchAll(/<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .map((m) => {
      try {
        return JSON.parse(m[1].replace(/\\u003c/g, '<').replace(/\\u003e/g, '>').replace(/\\u0026/g, '&'))
      } catch {
        return null
      }
    })
    .filter(Boolean) as Array<{ '@type': string | string[]; name?: string; headline?: string }>
  if (jsonldBlocks.length === 0) fail('jsonld-missing')
  else {
    const types = jsonldBlocks.map((j) => (Array.isArray(j['@type']) ? j['@type'].join('+') : j['@type']))
    ok('jsonld', types.join(', '))
  }

  // Schema.org expectations per route
  const types = jsonldBlocks.map((j) => (Array.isArray(j['@type']) ? j['@type'][0] : j['@type']))
  if (!types.includes('NGO') && !types.includes('NonprofitOrganization') && !types.includes('Organization')) {
    fail('jsonld-no-organization')
  }
  if (path.startsWith('/actividades/') && path !== '/actividades' && !types.includes('Event')) {
    fail('jsonld-no-event')
  }
  if (path.startsWith('/noticias/') && path !== '/noticias' && !types.includes('NewsArticle') && !types.includes('Article')) {
    fail('jsonld-no-newsarticle')
  }
  if (path.includes('/quienes-somos') && !types.some((t) => t === 'BreadcrumbList')) {
    warn('jsonld-no-breadcrumbs')
  }

  // Semantic article wrapper
  const articleCount = (body.match(/<article\b/g) || []).length
  if ((path.startsWith('/actividades/') || path.startsWith('/noticias/')) && path !== '/actividades' && path !== '/noticias') {
    if (articleCount === 0) warn('semantic-no-article', 'detail page lacks <article> wrapper')
    else ok('semantic-article', `${articleCount} <article>`)
  }

  return { path, status: res.status, issues }
}

const render = (reports: RouteReport[]) => {
  const lines: string[] = []
  let totalFail = 0
  let totalWarn = 0
  let totalPass = 0
  for (const r of reports) {
    const f = r.issues.filter((i) => i.severity === 'fail').length
    const w = r.issues.filter((i) => i.severity === 'warn').length
    const p = r.issues.filter((i) => i.severity === 'pass').length
    totalFail += f
    totalWarn += w
    totalPass += p
    const tag = f > 0 ? '🔴' : w > 0 ? '🟡' : '🟢'
    lines.push(`\n## ${tag} ${r.path} (HTTP ${r.status}) — ${p} pass · ${w} warn · ${f} fail`)
    for (const issue of r.issues) {
      const icon = issue.severity === 'fail' ? '❌' : issue.severity === 'warn' ? '⚠️ ' : '✅'
      lines.push(`- ${icon} \`${issue.check}\`${issue.detail ? `: ${issue.detail}` : ''}`)
    }
  }
  const summary = `# SEO Audit — ${target}\n\n**Totals**: ✅ ${totalPass} pass · ⚠️ ${totalWarn} warn · ❌ ${totalFail} fail · across ${reports.length} routes\n`
  return summary + lines.join('\n') + '\n'
}

const main = async () => {
  const reports: RouteReport[] = []
  for (const path of ROUTES) {
    reports.push(await auditRoute(path))
  }
  const md = render(reports)
  writeFileSync('seo-audit-report.md', md, 'utf-8')
  // eslint-disable-next-line no-console
  console.log(md)
  const fails = reports.flatMap((r) => r.issues).filter((i) => i.severity === 'fail').length
  process.exit(fails > 0 ? 1 : 0)
}

main()
