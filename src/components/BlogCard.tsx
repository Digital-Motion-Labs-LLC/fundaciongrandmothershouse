import Link from 'next/link'

export function BlogCard({ article, locale }: { article: any; locale: string }) {
  const imageUrl = article.image?.url || '/assets/images/blog/one.png'
  const date = article.date ? new Date(article.date).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''

  return (
    <div className="blog__single-wrapper" data-aos="fade-up" data-aos-duration="1000">
      <div className="blog__single">
        <div className="blog__single-thumb">
          <Link href={`/noticias/${article.slug}`}>
            <img src={imageUrl} alt={article.title} />
          </Link>
        </div>
        <div className="blog__single-inner">
          <div className="blog__single-meta">
            {date && <p><i className="fa-solid fa-calendar-days"></i>{date}</p>}
          </div>
          <div className="blog__single-content">
            <h5><Link href={`/noticias/${article.slug}`}>{article.title}</Link></h5>
            {article.excerpt && <p>{article.excerpt}</p>}
          </div>
          <div className="blog__single-cta">
            <Link href={`/noticias/${article.slug}`}>
              {locale === 'es' ? 'Leer Más' : 'Read More'}<i className="fa-solid fa-circle-arrow-right"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
