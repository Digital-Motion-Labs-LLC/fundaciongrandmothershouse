import fs from "node:fs"
import path from "node:path"

const PUBLIC_DIR = path.resolve("public")
const ROOT = path.resolve(PUBLIC_DIR, "assets/css")

const rewriteUrls = (cssText, fromFile) => {
  const fromDir = path.dirname(fromFile)
  return cssText.replace(
    /url\(\s*(['"]?)([^'")]+)\1\s*\)/g,
    (full, quote, urlPath) => {
      // Leave data:, absolute URLs, and already-absolute web paths
      if (/^(data:|https?:|\/\/|\/)/.test(urlPath)) return full
      // Resolve relative to source file, convert to public-relative path
      const absFsPath = path.resolve(fromDir, urlPath)
      if (!absFsPath.startsWith(PUBLIC_DIR)) return full
      const webPath = absFsPath.slice(PUBLIC_DIR.length)
      return `url("${webPath}")`
    },
  )
}

const seen = new Set()
const externalImports = new Set()

const inline = (file) => {
  if (seen.has(file)) return ""
  seen.add(file)
  let s = fs.readFileSync(file, "utf-8")
  s = s.replace(
    /@import\s+url\(["']?([^"')]+)["']?\)\s*;?|@import\s+["']([^"']+)["']\s*;?/g,
    (m, urlA, urlB) => {
      const url = urlA ?? urlB
      if (/^https?:\/\//.test(url)) {
        externalImports.add(m)
        return ""
      }
      const resolved = path.resolve(path.dirname(file), url)
      if (!fs.existsSync(resolved)) {
        console.error(`  WARN: import not found: ${url}`)
        return ""
      }
      return `\n/* inlined: ${url} */\n` + inline(resolved) + `\n`
    },
  )
  return rewriteUrls(s, file)
}

let bundled = inline(path.join(ROOT, "main.css"))
const responsive = rewriteUrls(
  fs.readFileSync(path.join(ROOT, "responsive.css"), "utf-8"),
  path.join(ROOT, "responsive.css"),
)
const defaultTheme = rewriteUrls(
  fs.readFileSync(path.join(ROOT, "default-theme.css"), "utf-8"),
  path.join(ROOT, "default-theme.css"),
)
const sticky = rewriteUrls(
  fs.readFileSync(path.join(ROOT, "sticky-header.css"), "utf-8"),
  path.join(ROOT, "sticky-header.css"),
)

bundled =
  [...externalImports].join("\n") + "\n" +
  bundled + "\n" + responsive + "\n" + defaultTheme + "\n" + sticky

const out = path.join(ROOT, "template.bundle.css")
fs.writeFileSync(out, bundled, "utf-8")
console.log(`✓ Bundled: ${bundled.length} bytes → ${out}`)
console.log(`  External @imports preserved at top: ${externalImports.size}`)
