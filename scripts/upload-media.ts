import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { readFileSync } from 'node:fs'
import { basename, extname } from 'node:path'

const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
  },
  forcePathStyle: true,
})

const BUCKET = process.env.R2_BUCKET ?? ''

const mimeFor = (name: string): string => {
  switch (extname(name).toLowerCase()) {
    case '.jpg':
    case '.jpeg': return 'image/jpeg'
    case '.png': return 'image/png'
    case '.gif': return 'image/gif'
    case '.webp': return 'image/webp'
    case '.avif': return 'image/avif'
    case '.svg': return 'image/svg+xml'
    case '.mp4': return 'video/mp4'
    case '.pdf': return 'application/pdf'
    default: return 'application/octet-stream'
  }
}

const main = async () => {
  const args = process.argv.slice(2)
  if (args.length < 1) {
    console.error('Usage: tsx scripts/upload-media.ts <local-path> [r2-key]')
    process.exit(1)
  }
  if (!BUCKET || !process.env.R2_ENDPOINT) {
    console.error('Missing R2_BUCKET or R2_ENDPOINT env vars')
    process.exit(1)
  }

  const localPath = args[0]
  const key = args[1] ?? basename(localPath)
  const body = readFileSync(localPath)
  const contentType = mimeFor(key)

  await r2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  )

  const url = `/api/media/file/${encodeURIComponent(key)}`
  console.log(`✓ Uploaded ${localPath} → R2 key "${key}" (${body.length} bytes, ${contentType})`)
  console.log(`  Public URL: ${url}`)
}

main().catch((e) => { console.error(e); process.exit(1) })
