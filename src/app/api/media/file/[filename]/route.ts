import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import type { NextRequest } from 'next/server'
import sharp from 'sharp'

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

const TRANSFORMABLE = new Set(['image/jpeg', 'image/png'])

const pickFormat = (
  accept: string | null,
  override: string | null,
  sourceMime: string,
): 'avif' | 'webp' | null => {
  if (!TRANSFORMABLE.has(sourceMime)) return null
  if (override === 'avif' || override === 'webp') return override
  if (!accept) return null
  if (accept.includes('image/avif')) return 'avif'
  if (accept.includes('image/webp')) return 'webp'
  return null
}

const streamToBuffer = async (stream: ReadableStream<Uint8Array>): Promise<Buffer> => {
  const chunks: Uint8Array[] = []
  const reader = stream.getReader()
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    if (value) chunks.push(value)
  }
  return Buffer.concat(chunks)
}

export async function GET(
  req: NextRequest,
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

    if (!result.Body) return new Response('Not found', { status: 404 })

    const sourceMime = result.ContentType ?? guessMime(filename)
    const formatOverride = req.nextUrl.searchParams.get('format')
    const targetFormat = pickFormat(req.headers.get('accept'), formatOverride, sourceMime)

    const baseHeaders = new Headers()
    if (result.ETag) baseHeaders.set('ETag', result.ETag)
    if (result.LastModified) baseHeaders.set('Last-Modified', result.LastModified.toUTCString())
    baseHeaders.set('Cache-Control', 'public, max-age=31536000, immutable')
    baseHeaders.set('Vary', 'Accept')

    // No transform requested or possible — stream original
    if (!targetFormat) {
      baseHeaders.set('Content-Type', sourceMime)
      if (result.ContentLength) baseHeaders.set('Content-Length', String(result.ContentLength))
      return new Response(result.Body.transformToWebStream(), { status: 200, headers: baseHeaders })
    }

    // Transform via sharp. On ANY failure, fall back to the original to never break delivery.
    try {
      const inputBuffer = await streamToBuffer(result.Body.transformToWebStream())
      const pipeline = sharp(inputBuffer, { failOn: 'none' }).rotate()
      const transformed =
        targetFormat === 'avif'
          ? await pipeline.avif({ quality: 65, effort: 4 }).toBuffer()
          : await pipeline.webp({ quality: 80 }).toBuffer()

      baseHeaders.set('Content-Type', `image/${targetFormat}`)
      baseHeaders.set('Content-Length', String(transformed.length))
      baseHeaders.set('X-Image-Transform', `${sourceMime}->${targetFormat}`)
      return new Response(new Uint8Array(transformed), { status: 200, headers: baseHeaders })
    } catch (transformErr) {
      // Sharp failed — serve original
      // eslint-disable-next-line no-console
      console.error('Sharp transform failed, serving original:', transformErr)
      const fallback = await r2.send(new GetObjectCommand({ Bucket: BUCKET, Key: filename }))
      if (!fallback.Body) return new Response('Not found', { status: 404 })
      baseHeaders.set('Content-Type', sourceMime)
      if (fallback.ContentLength) baseHeaders.set('Content-Length', String(fallback.ContentLength))
      baseHeaders.set('X-Image-Transform', 'failed-fallback')
      return new Response(fallback.Body.transformToWebStream(), { status: 200, headers: baseHeaders })
    }
  } catch (err) {
    const code = (err as { name?: string })?.name
    if (code === 'NoSuchKey' || code === 'NotFound') {
      return new Response('Not found', { status: 404 })
    }
    return new Response('Internal error', { status: 500 })
  }
}
