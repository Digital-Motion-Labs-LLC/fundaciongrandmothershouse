'use client'

export default function Error() {
  return (
    <div style={{
      minHeight: '60vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      padding: '40px 20px', fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>
        <i className="fa-solid fa-heart" style={{ color: '#E8447A' }}></i>
      </div>
      <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1E293B', marginBottom: '12px' }}>
        Estamos preparando todo para ti
      </h1>
      <p style={{ fontSize: '16px', color: '#64748B', maxWidth: '500px', lineHeight: 1.6 }}>
        Nuestro sitio se está actualizando en este momento. Por favor intenta de nuevo en unos segundos.
      </p>
      <button
        onClick={() => window.location.reload()}
        style={{
          marginTop: '24px', padding: '12px 32px',
          background: '#14B8A6', color: '#fff', border: 'none',
          borderRadius: '30px', fontSize: '15px', fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Reintentar
      </button>
    </div>
  )
}
