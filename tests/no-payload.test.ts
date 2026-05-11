import { describe, it, expect } from 'vitest'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = join(__dirname, '..')
const SRC = join(ROOT, 'src')

const walk = (dir: string, out: string[] = []): string[] => {
  if (!existsSync(dir)) return out
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) walk(full, out)
    else if (/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(entry)) out.push(full)
  }
  return out
}

const filesContainingPattern = (pattern: RegExp): string[] => {
  const matches: string[] = []
  for (const file of walk(SRC)) {
    const content = readFileSync(file, 'utf-8')
    if (pattern.test(content)) matches.push(file.replace(`${ROOT}/`, ''))
  }
  return matches
}

describe('Payload removal: no DB or admin coupling remains', () => {
  it('no file imports getPayload', () => {
    const hits = filesContainingPattern(/\bgetPayload\b/)
    expect(hits, `Found Payload imports in:\n${hits.join('\n')}`).toEqual([])
  })

  it('no file imports @payload-config', () => {
    const hits = filesContainingPattern(/['"]@payload-config['"]/)
    expect(hits, `Found @payload-config imports in:\n${hits.join('\n')}`).toEqual([])
  })

  it('no file imports from @payloadcms/*', () => {
    const hits = filesContainingPattern(/['"]@payloadcms\//)
    expect(hits, `Found @payloadcms imports in:\n${hits.join('\n')}`).toEqual([])
  })

  it('no file imports from "payload" package', () => {
    const hits = filesContainingPattern(/from ['"]payload['"]/)
    expect(hits, `Found payload imports in:\n${hits.join('\n')}`).toEqual([])
  })

  it('payload.config.ts does not exist', () => {
    expect(existsSync(join(SRC, 'payload.config.ts'))).toBe(false)
  })

  it('no admin route under app/(payload)', () => {
    expect(existsSync(join(SRC, 'app', '(payload)'))).toBe(false)
  })

  it('no collections/ or globals/ directories', () => {
    expect(existsSync(join(SRC, 'collections'))).toBe(false)
    expect(existsSync(join(SRC, 'globals'))).toBe(false)
  })

  it('no seed.ts', () => {
    expect(existsSync(join(SRC, 'seed.ts'))).toBe(false)
  })
})

describe('Static content layer is in place', () => {
  it('all required content files exist', () => {
    const content = join(SRC, 'content')
    for (const f of ['schema.ts', 'activities.ts', 'news.ts', 'pages.ts', 'queries.ts', 'localize.ts', 'index.ts']) {
      expect(existsSync(join(content, f)), `Missing ${f}`).toBe(true)
    }
    for (const f of ['header.ts', 'footer.ts', 'site-settings.ts', 'donation-settings.ts']) {
      expect(existsSync(join(content, 'globals', f)), `Missing globals/${f}`).toBe(true)
    }
  })

  it('R2 media proxy route exists', () => {
    expect(existsSync(join(SRC, 'app', 'api', 'media', 'file', '[filename]', 'route.ts'))).toBe(true)
  })

  it('JsonLd helper exists', () => {
    expect(existsSync(join(SRC, 'components', 'JsonLd.tsx'))).toBe(true)
  })
})
