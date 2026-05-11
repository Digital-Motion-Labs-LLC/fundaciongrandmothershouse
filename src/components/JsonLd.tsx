const ESCAPE_MAP: Record<string, string> = { '<': '\\u003c', '>': '\\u003e', '&': '\\u0026' }
const safeStringify = (data: unknown) =>
  JSON.stringify(data).replace(/[<>&]/g, (c) => ESCAPE_MAP[c] ?? c)

export function JsonLd({ data }: { data: unknown }) {
  const html = safeStringify(data)
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      // eslint-disable-next-line react/no-danger
      {...{ dangerouslySetInnerHTML: { __html: html } }}
    />
  )
}
