import Link from 'next/link'
import { placeholderImages } from '@/lib/placeholder-images'

export function HelpSection({ data }: { data: any }) {
  if (!data) return null

  const imageUrl = data.image?.url || placeholderImages.help.thumbLg
  const thumbTopUrl = data.imageTop?.url || placeholderImages.help.thumbTop
  const thumbBottomUrl = data.imageBottom?.url || placeholderImages.help.thumbBottom

  return (
    <section className="help">
      <div className="container">
        <div className="row align-items-center gutter-40">
          <div className="col-12 col-lg-5 col-xxl-6 d-none d-lg-block">
            <div className="help__thumb">
              <div className="help__thumb-inner">
                <div className="thumb-top thumb">
                  <img src={thumbTopUrl} alt="Image" />
                </div>
                <div className="thumb-lg thumb" data-aos="fade-left" data-aos-duration="1000">
                  <img src={imageUrl} alt="Image" />
                  {data.videoUrl && (
                    <div className="video-btn-wrapper">
                      <a href={data.videoUrl} target="_blank" title="video Player" className="open-video-popup" rel="noopener noreferrer">
                        <i className="icon-play"></i>
                      </a>
                    </div>
                  )}
                </div>
                <div className="thumb thumb-bottom">
                  <img src={thumbBottomUrl} alt="Image" />
                </div>
                <div className="line">
                  <img src="/assets/images/help/line.png" alt="Image" />
                </div>
                <div className="grid-line">
                  <img src="/assets/images/help/grid.png" alt="Image" className="base-img" />
                </div>
                <div className="vertical-text">
                  <h5>We Give <span>Donations</span> to Poor People</h5>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-7 col-xxl-6">
            <div className="help__content">
              {data.subtitle && (
                <span className="sub-title"><i className="icon-donation"></i>{data.subtitle}</span>
              )}
              {data.title && <h2 className="title-animation" dangerouslySetInnerHTML={{ __html: data.title }} />}
              {data.description && <p>{data.description}</p>}
              {data.features?.length > 0 && (
                <div className="help__content-icon-group">
                  {data.features.map((feature: any, i: number) => (
                    <div key={i} className="help__content-icon">
                      <div className="thumb">
                        <i className={feature.icon || 'icon-make-donation'}></i>
                      </div>
                      <div className="content">
                        <h6>{feature.title}</h6>
                        <p>{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {data.checkmarks?.length > 0 && (
                <div className="help__content-list">
                  <ul>
                    {data.checkmarks.map((item: any, i: number) => (
                      <li key={i}>
                        <i className="fa-solid fa-circle-check"></i> {item.text}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="help__content-cta cta">
                {data.ctaText && (
                  <Link href={data.ctaLink || '/quienes-somos'} aria-label="more about us" title="about us" className="btn--primary">
                    {data.ctaText}
                  </Link>
                )}
                {data.phone && (
                  <div className="contact-btn">
                    <div className="contact-icon">
                      <i className="icon-phone"></i>
                    </div>
                    <div className="contact-content">
                      <p>Phone</p>
                      <a href={`tel:${data.phone}`}>{data.phone}</a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hand">
        <img src="/assets/images/help/hand.png" alt="Image" />
      </div>
      <div className="parasuit">
        <img src="/assets/images/parasuit.png" alt="Image" />
      </div>
      <div className="spade">
        <img src="/assets/images/help/spade.png" alt="Image" />
      </div>
    </section>
  )
}
