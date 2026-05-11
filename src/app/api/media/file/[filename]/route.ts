import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import type { NextRequest } from 'next/server'

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

const guessMime = (name: string): string => {
  const ext = name.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'jpg':
    case 'jpeg': return 'image/jpeg'
    case 'png': return 'image/png'
    case 'gif': return 'image/gif'
    case 'webp': return 'image/webp'
    case 'avif': return 'image/avif'
    case 'svg': return 'image/svg+xml'
    case 'mp4': return 'video/mp4'
    case 'webm': return 'video/webm'
    case 'pdf': return 'application/pdf'
    default: return 'application/octet-stream'
  }
}

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ filename: string }> },
) {
  const { filename: encoded } = await ctx.params
  const filename = decodeURIComponent(encoded)

  if (!BUCKET || !process.env.R2_ENDPOINT) {
    return new Response('R2 not configured', { status: 500 })
  }

  try {
    const result = await r2.send(
      new GetObjectCommand({ Bucket: BUCKET, Key: filename }),
    )

    if (!result.Body) {
      return new Response('Not found', { status: 404 })
    }

    const headers = new Headers()
    headers.set('Content-Type', result.ContentType ?? guessMime(filename))
    if (result.ContentLength) headers.set('Content-Length', String(result.ContentLength))
    if (result.ETag) headers.set('ETag', result.ETag)
    if (result.LastModified) headers.set('Last-Modified', result.LastModified.toUTCString())
    headers.set('Cache-Control', 'public, max-age=31536000, immutable')

    return new Response(result.Body.transformToWebStream(), { status: 200, headers })
  } catch (err) {
    const code = (err as { name?: string })?.name
    if (code === 'NoSuchKey' || code === 'NotFound') {
      return new Response('Not found', { status: 404 })
    }
    return new Response('Internal error', { status: 500 })
  }
}
