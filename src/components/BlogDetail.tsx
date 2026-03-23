import { placeholderImages } from '@/lib/placeholder-images'

export function BlogDetail({ article }: { article: any }) {
  const imageUrl = article.image?.url || placeholderImages.blog(0)
  const date = article.date ? new Date(article.date).toLocaleDateString() : ''

  return (
    <div className="cm-details">
      <div className="container">
        <div className="row gutter-60">
          <div className="col-12 col-xl-8">
            <div className="cm-details__content">
              <div className="cm-details__poster" data-aos="fade-up" data-aos-duration="1000">
                <img src={imageUrl} alt={article.title} />
              </div>
              <div className="cm-details-meta">
                {date && <p><i className="fa-solid fa-calendar-days"></i>{date}</p>}
              </div>
              <div className="cm-group cta">
                <h1>{article.title}</h1>
                {article.content_html ? (
                  <div dangerouslySetInnerHTML={{ __html: article.content_html }} />
                ) : article.excerpt ? (
                  <p>{article.excerpt}</p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
