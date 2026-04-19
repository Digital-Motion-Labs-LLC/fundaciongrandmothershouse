import Link from 'next/link'
import { placeholderImages } from '@/lib/placeholder-images'

export function BlogCard({ article, index = 0, locale }: { article: any; index?: number; locale: string }) {
  const imageUrl = article.image?.url || placeholderImages.blog(index)
  const date = article.date ? new Date(article.date).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''

  return (
    <div className="blog__single-wrapper" data-aos="fade-up" data-aos-duration="1000">
      <Link
        href={`/noticias/${article.slug}`}
        className="blog__single card-link"
        style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}
      >
        <div className="blog__single-thumb" style={{ width: '100%', aspectRatio: '16 / 10', overflow: 'hidden' }}>
          <img
            src={imageUrl}
            alt={article.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
          />
        </div>
        <div className="blog__single-inner">
          <div className="blog__single-meta">
            {date && <p><i className="fa-solid fa-calendar-days"></i>{date}</p>}
          </div>
          <div className="blog__single-content">
            <h5>{article.title}</h5>
            {article.excerpt && <p>{article.excerpt}</p>}
          </div>
          <div className="blog__single-cta">
            <span>
              {locale === 'es' ? 'Leer Más' : 'Read More'}<i className="fa-solid fa-circle-arrow-right"></i>
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}
