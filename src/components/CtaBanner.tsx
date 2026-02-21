import Link from 'next/link'

export function CtaBanner({ data }: { data: any }) {
  if (!data) return null

  const bgUrl = data.backgroundImage?.url || '/assets/images/cta/cta-two-bg.png'

  return (
    <section className="cta-two" style={{ backgroundImage: `url(${bgUrl})` }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xxl-8">
            <div className="cta-two__content text-center" data-aos="fade-up" data-aos-duration="1000">
              {data.title && <h2 className="title-animation" dangerouslySetInnerHTML={{ __html: data.title }} />}
              {data.description && <p>{data.description}</p>}
              <div className="cta" style={{ marginTop: '30px', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {data.primaryButtonText && (
                  <Link href={data.primaryButtonLink || '#'} className="btn--primary">
                    {data.primaryButtonText} <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                )}
                {data.secondaryButtonText && (
                  <Link href={data.secondaryButtonLink || '#'} className="btn--secondary">
                    {data.secondaryButtonText} <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="shape" data-aos="fade-right" data-aos-duration="1000">
        <img src="/assets/images/cta/shape.png" alt="Image" className="base-img" />
      </div>
    </section>
  )
}
