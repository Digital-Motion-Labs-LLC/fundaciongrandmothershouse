import Link from 'next/link'
import { placeholderImages } from '@/lib/placeholder-images'

export function BlogPreview({ data, news, locale = 'es', linkBase = '/noticias' }: { data: any; news: any[]; locale?: string; linkBase?: string }) {
  if (!news?.length) return null

  const isActivities = linkBase === '/actividades'

  return (
    <section className="blog">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-xl-7">
            <div className="section__header text-center" data-aos="fade-up" data-aos-duration="1000">
              {data?.subtitle && <span className="sub-title"><i className="icon-donation"></i>{data.subtitle}</span>}
              <h2 className="title-animation" dangerouslySetInnerHTML={{ __html: data?.title || 'Our Latest <span>News</span> & Articles' }} />
            </div>
          </div>
        </div>
        <div className="row gutter-40">
          {news.map((item: any, i: number) => {
            const imageUrl = item.image?.url || item.featuredImage?.url || (isActivities ? placeholderImages.events(i) : placeholderImages.blog(i))
            const title = item.title || item.name
            const date = item.date ? new Date(item.date).toLocaleDateString() : ''
            return (
              <div key={item.id} className="col-12 col-lg-6 col-xl-4" data-aos="fade-up" data-aos-duration="1000" data-aos-delay={String(i * 300)}>
                <div className="blog__single-wrapper">
                  <div className="blog__single">
                    <div className="blog__single-thumb">
                      <Link href={`${linkBase}/${item.slug}`}>
                        <img src={imageUrl} alt={title} />
                      </Link>
                    </div>
                    <div className="blog__single-inner">
                      <div className="blog__single-meta">
                        {date && <p><i className="fa-solid fa-calendar-days"></i>{date}</p>}
                        {isActivities && item.location && <p><i className="fa-solid fa-location-dot"></i>{item.location}</p>}
                      </div>
                      <div className="blog__single-content">
                        <h5><Link href={`${linkBase}/${item.slug}`}>{title}</Link></h5>
                      </div>
                      <div className="blog__single-cta">
                        <Link href={`${linkBase}/${item.slug}`}>{locale === 'es' ? 'Ver Más' : 'Read More'}<i className="fa-solid fa-circle-arrow-right"></i></Link>
                      </div>
                    </div>
                    <img src="/assets/images/blog/spade.png" alt="Image" className="spade-two" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="row">
          <div className="col-12">
            <div className="section__cta cta text-center">
              <Link href={linkBase} className="btn--primary">{locale === 'es' ? 'Ver Todo' : 'View All'} <i className="fa-solid fa-arrow-right"></i></Link>
            </div>
          </div>
        </div>
      </div>
      <div className="blog-bg">
        <img src="/assets/images/blog/blog-bg.png" alt="Image" />
      </div>
      <div className="spade">
        <img src="/assets/images/blog/spade-base.png" alt="Image" className="base-img" />
      </div>
    </section>
  )
}
