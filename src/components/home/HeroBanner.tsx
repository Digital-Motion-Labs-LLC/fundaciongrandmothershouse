'use client'
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'
import Link from 'next/link'
import { placeholderImages } from '@/lib/placeholder-images'

function renderTitle(html: string): React.ReactNode {
  const nodes: React.ReactNode[] = []
  let key = 0
  const lines = html.split(/<br\s*\/?>/i)
  lines.forEach((line, li) => {
    let remaining = line
    while (remaining.length > 0) {
      const m = remaining.match(/<span>([\s\S]*?)<\/span>/)
      if (m && typeof m.index === 'number') {
        const before = remaining.slice(0, m.index)
        if (before) nodes.push(<React.Fragment key={key++}>{before}</React.Fragment>)
        nodes.push(<span key={key++}>{m[1]}</span>)
        remaining = remaining.slice(m.index + m[0].length)
      } else {
        if (remaining) nodes.push(<React.Fragment key={key++}>{remaining}</React.Fragment>)
        remaining = ''
      }
    }
    if (li < lines.length - 1) nodes.push(<br key={key++} />)
  })
  return nodes
}

export function HeroBanner({ data }: { data: any }) {
  if (!data?.slides?.length) return null

  return (
    <section className="banner-two">
      <div className="banner-two__slider swiper">
        <Swiper
          modules={[Navigation, Autoplay, EffectFade]}
          navigation={{ prevEl: '.prev-banner', nextEl: '.next-banner' }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          effect="fade"
        >
          {data.slides.map((slide: any, i: number) => {
            const img = slide.image
            const bgUrl = img?.url || placeholderImages.hero(i)
            const isPortrait = !!(img?.width && img?.height && img.height > img.width)
            const titleNode = slide.title ? <h1>{renderTitle(slide.title)}</h1> : null
            const primaryHref = slide.ctaPrimaryLink && slide.ctaPrimaryLink !== '#' ? slide.ctaPrimaryLink : null
            return (
              <SwiperSlide key={i}>
                <div className="banner-two__slider-single">
                  <div
                    className="banner-two__slider-bg"
                    style={{
                      backgroundImage: `url(${bgUrl})`,
                      ...(isPortrait ? { filter: 'blur(18px) brightness(0.7)', transform: 'scale(1.1)' } : {}),
                    }}
                  ></div>
                  {isPortrait && (
                    <div
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 100%)',
                        pointerEvents: 'none',
                      }}
                    />
                  )}
                  <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <div className="row align-items-center">
                      <div className={isPortrait ? 'col-12 col-lg-7' : 'col-12 col-md-9 col-lg-7 col-xxl-6'}>
                        <div className="banner-two__slider-content">
                          {slide.subtitle && (
                            <span className="sub-title">
                              <i className="icon-donation"></i>{slide.subtitle}
                            </span>
                          )}
                          {titleNode && (
                            primaryHref ? (
                              <Link href={primaryHref} style={{ textDecoration: 'none', color: 'inherit' }}>
                                {titleNode}
                              </Link>
                            ) : titleNode
                          )}
                          <div className="banner__content-cta cta">
                            {slide.ctaPrimaryText && (
                              <Link href={slide.ctaPrimaryLink || '#'} aria-label={slide.ctaPrimaryText} className="btn--tertiary">
                                {slide.ctaPrimaryText} <i className="fa-solid fa-arrow-right"></i>
                              </Link>
                            )}
                            {slide.ctaSecondaryText && (() => {
                              const href = slide.ctaSecondaryLink || ''
                              const isDonate = !href || href === '#' || /donat|donar/i.test(href)
                              if (isDonate) {
                                return (
                                  <button type="button" className="btn--primary donate-trigger" data-donate-trigger="true">
                                    {slide.ctaSecondaryText} <i className="fa-solid fa-arrow-right"></i>
                                  </button>
                                )
                              }
                              return (
                                <Link href={href} aria-label={slide.ctaSecondaryText} className="btn--primary">
                                  {slide.ctaSecondaryText} <i className="fa-solid fa-arrow-right"></i>
                                </Link>
                              )
                            })()}
                          </div>
                        </div>
                      </div>
                      {isPortrait && (
                        <div className="col-12 col-lg-5 hero-portrait-col" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          {primaryHref ? (
                            <Link href={primaryHref} aria-label={slide.ctaPrimaryText || 'View details'}>
                              <img
                                src={bgUrl}
                                alt={img?.alt || ''}
                                className="hero-portrait-poster"
                                style={{
                                  maxHeight: '520px',
                                  width: 'auto',
                                  borderRadius: '16px',
                                  boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
                                  cursor: 'pointer',
                                }}
                              />
                            </Link>
                          ) : (
                            <img
                              src={bgUrl}
                              alt={img?.alt || ''}
                              style={{ maxHeight: '520px', width: 'auto', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.35)' }}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
      <div className="slider-navigation d-none d-md-flex">
        <button type="button" aria-label="prev slide" title="prev slide" className="prev-banner slider-btn">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <button type="button" aria-label="next slide" title="next slide" className="next-banner slider-btn slider-btn-next">
          <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>
      <div className="shape">
        <img src="/assets/images/shape.png" alt="Image" />
      </div>
      <div className="shape-left" data-aos="fade-right" data-aos-duration="1000" data-aos-delay="300">
        <img src="/assets/images/banner/banner-two-shape.png" alt="Image" />
      </div>
      <div className="sprade-shape">
        <img src="/assets/images/sprade-base.png" alt="Image" className="base-img" data-aos="zoom-in" data-aos-duration="1000" />
      </div>
      <div className="unity">
        <img src="/assets/images/unity.png" alt="Image" />
      </div>
    </section>
  )
}
