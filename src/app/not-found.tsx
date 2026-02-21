import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px' }}>
      <h1 style={{ fontSize: '72px', color: 'var(--secondary)' }}>404</h1>
      <p style={{ fontSize: '18px' }}>Page not found</p>
      <Link href="/" className="btn--primary">
        Go Home <i className="fa-solid fa-arrow-right"></i>
      </Link>
    </div>
  )
}
