/* Generate AVIF + WebP variants for /public/redesign-photos/*.jpeg|png.
   Idempotent: skips already-built outputs. Run via `npm run build:images`. */
import fs from "node:fs"
import path from "node:path"
import sharp from "sharp"

const dirs = ["public/redesign-photos"]

for (const dir of dirs) {
  if (!fs.existsSync(dir)) continue
  const files = fs.readdirSync(dir).filter((f) => /\.(jpe?g|png)$/i.test(f))
  for (const f of files) {
    const src = path.join(dir, f)
    const base = f.replace(/\.(jpe?g|png)$/i, "")
    const outAvif = path.join(dir, `${base}.avif`)
    const outWebp = path.join(dir, `${base}.webp`)
    if (!fs.existsSync(outAvif)) {
      await sharp(src).rotate().avif({ quality: 60, effort: 5 }).toFile(outAvif)
      console.log(`✓ AVIF ${outAvif}`)
    }
    if (!fs.existsSync(outWebp)) {
      await sharp(src).rotate().webp({ quality: 80 }).toFile(outWebp)
      console.log(`✓ WebP ${outWebp}`)
    }
  }
}
console.log("done")
