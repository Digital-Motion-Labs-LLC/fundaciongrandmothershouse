'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'

export function DifferenceSlider({ data }: { data: any }) {
  if (!data) return null

  const styleClasses = ['difference__single-first', 'difference__single-second', 'difference__single-third']
  const defaultBgs = ['/assets/images/difference/bg-one.png', '/assets/images/difference/bg-two.png', '/assets/images/difference/bg-three.png']

  return (
    <section className="difference">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-8">
            <div className="section__header text-center" data-aos="fade-up" data-aos-duration="1000">
              {data.subtitle && (
                <span className="sub-title"><i className="icon-donation"></i>{data.subtitle}</span>
              )}
              {data.title && <h2 className="title-animation">{data.title}</h2>}
              {data.description && <p>{data.description}</p>}
            </div>
          </div>
        </div>
      </div>
      <div className="difference__inner">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="difference__slider">
                <Swiper
                  modules={[Navigation, Autoplay]}
                  navigation={{ prevEl: '.prev-difference', nextEl: '.next-difference' }}
                  slidesPerView={3}
                  spaceBetween={30}
                  loop={true}
                  autoplay={{ delay: 4000 }}
                  breakpoints={{
                    0: { slidesPerView: 1 },
                    576: { slidesPerView: 2 },
                    992: { slidesPerView: 3 },
                  }}
                >
                  {data.items?.map((item: any, i: number) => {
                    const bgUrl = item.backgroundImage?.url || defaultBgs[i % 3]
                    return (
                      <SwiperSlide key={i}>
                        <div className="difference__single-wrapper">
                          <div
                            className={`difference__single ${styleClasses[i % 3]}`}
                            style={{ backgroundImage: `url(${bgUrl})` }}
                          >
                            <div className="difference__single-thumb">
                              <i className={item.icon || 'icon-education'}></i>
                            </div>
                            <div className="difference__single-content">
                              <h5>{item.link ? <a href={item.link}>{item.title}</a> : item.title}</h5>
                              <p>{item.description}</p>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    )
                  })}
                </Swiper>
              </div>
            </div>
          </div>
        </div>
        <div className="slider-navigation">
          <button type="button" aria-label="prev slide" title="prev slide" className="prev-difference slider-btn">
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <button type="button" aria-label="next slide" title="next slide" className="next-difference slider-btn slider-btn-next">
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
      <div className="shape-hand" data-aos="fade-right" data-aos-duration="1000" data-aos-delay="300">
        <img src="/assets/images/difference/shape-hand.png" alt="Image" />
      </div>
    </section>
  )
}
