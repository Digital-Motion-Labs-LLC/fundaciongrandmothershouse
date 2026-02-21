'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'
import Link from 'next/link'
import { placeholderImages } from '@/lib/placeholder-images'

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
            const bgUrl = slide.image?.url || placeholderImages.hero(i)
            return (
              <SwiperSlide key={i}>
                <div className="banner-two__slider-single">
                  <div className="banner-two__slider-bg" style={{ backgroundImage: `url(${bgUrl})` }}></div>
                  <div className="container">
                    <div className="row">
                      <div className="col-12 col-md-9 col-lg-7 col-xxl-6">
                        <div className="banner-two__slider-content">
                          {slide.subtitle && (
                            <span className="sub-title">
                              <i className="icon-donation"></i>{slide.subtitle}
                            </span>
                          )}
                          {slide.title && <h1 dangerouslySetInnerHTML={{ __html: slide.title }} />}
                          <div className="banner__content-cta cta">
                            {slide.ctaPrimaryText && (
                              <Link href={slide.ctaPrimaryLink || '#'} aria-label="discover more" title="discover more" className="btn--tertiary">
                                {slide.ctaPrimaryText} <i className="fa-solid fa-arrow-right"></i>
                              </Link>
                            )}
                            {slide.ctaSecondaryText && (
                              <Link href={slide.ctaSecondaryLink || '#'} aria-label="contact us" title="contact us" className="btn--primary">
                                {slide.ctaSecondaryText} <i className="fa-solid fa-arrow-right"></i>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
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
