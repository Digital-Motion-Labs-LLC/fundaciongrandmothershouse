'use client'
import { useState } from 'react'
import { placeholderImages } from '@/lib/placeholder-images'

function extractTextFromLexical(node: any): string[] {
  if (!node) return []
  if (node.type === 'text') return [node.text || '']
  if (node.type === 'paragraph' || node.type === 'heading') {
    const text = (node.children || []).map((c: any) => extractTextFromLexical(c).join('')).join('')
    return text ? [text] : []
  }
  if (node.children) {
    return node.children.flatMap((c: any) => extractTextFromLexical(c))
  }
  return []
}

function Lightbox({ images, startIndex, onClose }: { images: string[]; startIndex: number; onClose: () => void }) {
  const [index, setIndex] = useState(startIndex)
  const prev = () => setIndex((index - 1 + images.length) % images.length)
  const next = () => setIndex((index + 1) % images.length)

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={onClose}
    >
      <button onClick={(e) => { e.stopPropagation(); onClose() }} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#fff', fontSize: '32px', cursor: 'pointer', zIndex: 10 }}>
        <i className="fa-solid fa-xmark"></i>
      </button>
      <button onClick={(e) => { e.stopPropagation(); prev() }} style={{ position: 'absolute', left: '20px', background: 'none', border: 'none', color: '#fff', fontSize: '36px', cursor: 'pointer', zIndex: 10 }}>
        <i className="fa-solid fa-chevron-left"></i>
      </button>
      <img
        src={images[index]}
        alt=""
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '85vh', maxWidth: '90vw', objectFit: 'contain', borderRadius: '8px' }}
      />
      <button onClick={(e) => { e.stopPropagation(); next() }} style={{ position: 'absolute', right: '20px', background: 'none', border: 'none', color: '#fff', fontSize: '36px', cursor: 'pointer', zIndex: 10 }}>
        <i className="fa-solid fa-chevron-right"></i>
      </button>
      <div style={{ position: 'absolute', bottom: '20px', color: '#fff', fontSize: '14px' }}>
        {index + 1} / {images.length}
      </div>
    </div>
  )
}

export function EventDetail({ activity }: { activity: any }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const imageUrl = activity.featuredImage?.url || placeholderImages.events(0)
  const date = activity.date ? new Date(activity.date).toLocaleDateString() : ''

  const description = activity.description
  let paragraphs: string[] = []
  if (description) {
    if (typeof description === 'string') {
      paragraphs = [description]
    } else {
      const root = description?.root
      if (root?.children) {
        paragraphs = extractTextFromLexical(root)
      }
    }
  }

  const galleryImages = (activity.gallery || []).map((item: any, i: number) =>
    item.image?.url || placeholderImages.events(i)
  )

  return (
    <div style={{ padding: '60px 0' }}>
      <div className="container">
        <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '40px', maxHeight: '500px' }}>
          <img src={imageUrl} alt={activity.name} style={{ width: '100%', height: '500px', objectFit: 'cover' }} />
        </div>

        <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', flexWrap: 'wrap' }}>
          {date && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '15px' }}>
              <i className="fa-solid fa-calendar-days" style={{ color: '#14B8A6' }}></i>{date}
            </span>
          )}
          {activity.location && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '15px' }}>
              <i className="fa-solid fa-location-dot" style={{ color: '#E8447A' }}></i>{activity.location}
            </span>
          )}
        </div>

        <div style={{ maxWidth: '800px' }}>
          <h3 style={{ fontSize: '28px', fontWeight: 800, color: '#1E293B', marginBottom: '24px' }}>{activity.name}</h3>
          {paragraphs.map((text, i) => (
            <p key={i} style={{ marginBottom: '20px', lineHeight: '1.8', fontSize: '16px', color: '#475569' }}>{text}</p>
          ))}
        </div>

        {galleryImages.length > 0 && (
          <>
            <h4 style={{ fontSize: '22px', fontWeight: 700, color: '#1E293B', marginTop: '48px', marginBottom: '24px' }}>
              <i className="fa-solid fa-images" style={{ color: '#14B8A6', marginRight: '8px' }}></i>
              Galería ({galleryImages.length} fotos)
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {galleryImages.map((url: string, i: number) => (
                <div
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  style={{ borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer', position: 'relative' }}
                >
                  <img src={url} alt="" style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {lightboxIndex !== null && (
        <Lightbox images={galleryImages} startIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </div>
  )
}
