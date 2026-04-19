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

function renderCtas(slide: any) {
  return (
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
  )
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
            const primaryHref = slide.ctaPrimaryLink && slide.ctaPrimaryLink !== '#' ? slide.ctaPrimaryLink : null

            return (
              <SwiperSlide key={i}>
                <div className={`banner-two__slider-single${isPortrait ? ' is-portrait' : ''}`}>
                  <div
                    className="banner-two__slider-bg"
                    style={{
                      backgroundImage: `url(${bgUrl})`,
                      ...(isPortrait ? { filter: 'blur(22px) brightness(0.55)', transform: 'scale(1.15)' } : {}),
                    }}
                  ></div>
                  {isPortrait && (
                    <div
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.65) 100%)',
                        pointerEvents: 'none',
                      }}
                    />
                  )}

                  {isPortrait ? (
                    /* Portrait / event-flyer layout: poster is the hero, no duplicate title */
                    <div className="container hero-portrait-layout" style={{ position: 'relative', zIndex: 2 }}>
                      <div className="row align-items-center justify-content-center">
                        <div className="col-12 col-lg-5 order-2 order-lg-1 text-center text-lg-start hero-portrait-text">
                          {slide.subtitle && (
                            <span className="sub-title" style={{ display: 'inline-flex' }}>
                              <i className="icon-donation"></i>{slide.subtitle}
                            </span>
                          )}
                          {renderCtas(slide)}
                        </div>
                        <div className="col-12 col-lg-6 order-1 order-lg-2 hero-portrait-col" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          {primaryHref ? (
                            <Link href={primaryHref} aria-label={slide.ctaPrimaryText || slide.title || 'View details'}>
                              <img
                                src={bgUrl}
                                alt={img?.alt || slide.title || ''}
                                className="hero-portrait-poster"
                                style={{
                                  width: 'auto',
                                  borderRadius: '18px',
                                  boxShadow: '0 24px 70px rgba(0,0,0,0.45)',
                                  cursor: 'pointer',
                                }}
                              />
                            </Link>
                          ) : (
                            <img
                              src={bgUrl}
                              alt={img?.alt || slide.title || ''}
                              className="hero-portrait-poster"
                              style={{ width: 'auto', borderRadius: '18px', boxShadow: '0 24px 70px rgba(0,0,0,0.45)' }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Default landscape layout */
                    <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                      <div className="row">
                        <div className="col-12 col-md-9 col-lg-7 col-xxl-6">
                          <div className="banner-two__slider-content">
                            {slide.subtitle && (
                              <span className="sub-title">
                                <i className="icon-donation"></i>{slide.subtitle}
                              </span>
                            )}
                            {slide.title && (
                              primaryHref ? (
                                <Link href={primaryHref} style={{ textDecoration: 'none', color: 'inherit' }}>
                                  <h1>{renderTitle(slide.title)}</h1>
                                </Link>
                              ) : (
                                <h1>{renderTitle(slide.title)}</h1>
                              )
                            )}
                            {renderCtas(slide)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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
