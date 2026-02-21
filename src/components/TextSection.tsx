import Link from 'next/link'
import { placeholderImages } from '@/lib/placeholder-images'

export function TextSection({ data, index = 0 }: { data: any; index?: number }) {
  if (!data) return null

  const imageUrl = data.image?.url || (data.imagePosition !== 'none' ? placeholderImages.about(index) : null)
  const pos = data.imagePosition || 'left'

  return (
    <section className="help" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
      <div className="container">
        <div className={`row align-items-center gutter-40 ${pos === 'right' ? 'flex-row-reverse' : ''}`}>
          {pos !== 'none' && imageUrl && (
            <div className="col-12 col-lg-5 col-xxl-6">
              <div className="help__thumb" data-aos="fade-up" data-aos-duration="1000">
                <img src={imageUrl} alt={data.heading || 'Image'} style={{ borderRadius: '12px', width: '100%' }} />
              </div>
            </div>
          )}
          <div className={pos !== 'none' && imageUrl ? 'col-12 col-lg-7 col-xxl-6' : 'col-12'}>
            <div className="help__content">
              {data.subtitle && (
                <span className="sub-title"><i className="icon-donation"></i>{data.subtitle}</span>
              )}
              {data.heading && <h2 className="title-animation" dangerouslySetInnerHTML={{ __html: data.heading }} />}
              {data.body && (
                <div style={{ marginTop: '20px' }}>
                  {data.body.split('\n').map((p: string, i: number) => (
                    p.trim() ? <p key={i} style={{ marginBottom: '16px' }}>{p}</p> : null
                  ))}
                </div>
              )}
              {data.ctaText && (
                <div className="help__content-cta cta" style={{ marginTop: '30px' }}>
                  <Link href={data.ctaLink || '#'} className="btn--primary">
                    {data.ctaText} <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
