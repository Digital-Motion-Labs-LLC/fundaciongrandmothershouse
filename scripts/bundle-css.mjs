import fs from "node:fs"
import path from "node:path"

const ROOT = "public/assets/css"
const ASSETS_ROOT = "public/assets"

// Resolve a CSS @import url relative to current file's dir, return contents or null
const resolveImport = (importUrl, fromFile) => {
  // external URLs stay external
  if (/^https?:\/\//.test(importUrl)) return null
  const fromDir = path.dirname(fromFile)
  const absPath = path.resolve(fromDir, importUrl)
  if (!fs.existsSync(absPath)) {
    console.error(`  WARN: import not found: ${importUrl} (resolved to ${absPath})`)
    return null
  }
  return absPath
}

const seen = new Set()

const inline = (file) => {
  if (seen.has(file)) return ""
  seen.add(file)
  let s = fs.readFileSync(file, "utf-8")
  // Match @import url("..."); or @import "...";
  return s.replace(/@import\s+url\(["']?([^"')]+)["']?\)\s*;?|@import\s+["']([^"']+)["']\s*;?/g, (m, urlA, urlB) => {
    const url = urlA ?? urlB
    const resolved = resolveImport(url, file)
    if (resolved === null) {
      // external — keep as-is. But CSS @imports MUST come first, so we can't keep mid-file.
      // Strategy: collect external imports separately to emit at top.
      externalImports.add(m)
      return ""
    }
    return `\n/* inlined: ${url} */\n` + inline(resolved) + `\n`
  })
}

const externalImports = new Set()

let bundled = inline(path.join(ROOT, "main.css"))
const responsiveContent = fs.readFileSync(path.join(ROOT, "responsive.css"), "utf-8")
const defaultThemeContent = fs.readFileSync(path.join(ROOT, "default-theme.css"), "utf-8")
const stickyHeader = fs.readFileSync(path.join(ROOT, "sticky-header.css"), "utf-8")

bundled = [...externalImports].join("\n") + "\n" + bundled + "\n" + responsiveContent + "\n" + defaultThemeContent + "\n" + stickyHeader

const out = path.join(ROOT, "template.bundle.css")
fs.writeFileSync(out, bundled, "utf-8")
console.log(`✓ Bundled: ${bundled.length} bytes → ${out}`)
console.log(`  External @imports preserved at top: ${externalImports.size}`)
