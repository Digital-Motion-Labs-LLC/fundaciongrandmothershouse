'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'

export function TestimonialSlider({ data }: { data: any }) {
  if (!data) return null

  return (
    <section className="testimonial" style={{ backgroundImage: 'url(/assets/images/bg-one.png)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-xl-7">
            <div className="section__header text-center" data-aos="fade-up" data-aos-duration="1000">
              {data.subtitle && (
                <span className="sub-title"><i className="icon-donation"></i>{data.subtitle}</span>
              )}
              {data.title && <h2 className="title-animation" dangerouslySetInnerHTML={{ __html: data.title }} />}
            </div>
          </div>
        </div>
      </div>
      <div className="testimonial__inner">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="testimonial__slider">
                <Swiper
                  modules={[Navigation, Autoplay]}
                  navigation={{ prevEl: '.prev-testimonial', nextEl: '.next-testimonial' }}
                  slidesPerView={3}
                  spaceBetween={30}
                  loop={true}
                  autoplay={{ delay: 5000 }}
                  breakpoints={{
                    0: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1200: { slidesPerView: 3 },
                  }}
                >
                  {data.testimonials?.map((t: any, i: number) => (
                    <SwiperSlide key={i}>
                      <div className="testimonial__slider-single">
                        <div className="review">
                          {Array.from({ length: t.rating || 5 }).map((_, j) => (
                            <i key={j} className="icon-star"></i>
                          ))}
                        </div>
                        <div className="content">
                          <blockquote>
                            <q>{t.quote}</q>
                          </blockquote>
                        </div>
                        <div className="author-info">
                          <div className="author-thumb">
                            <img src={t.authorImage?.url || '/assets/images/author.png'} alt={t.authorName} />
                          </div>
                          <div className="author-content">
                            <h6>{t.authorName}</h6>
                            <p>{t.authorTitle}</p>
                          </div>
                        </div>
                        <div className="quote">
                          <img src="/assets/images/quote.png" alt="Image" />
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
          <div className="slider-navigation">
            <button type="button" aria-label="prev slide" title="prev slide" className="prev-testimonial slider-btn">
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <button type="button" aria-label="next slide" title="next slide" className="next-testimonial slider-btn slider-btn-next">
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
      <div className="shape" data-aos="fade-right" data-aos-duration="1000" data-aos-delay="200">
        <img src="/assets/images/community/shape.png" alt="Image" className="base-img" />
      </div>
    </section>
  )
}
