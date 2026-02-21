export function PageBanner({ title }: { title: string }) {
  return (
    <section className="banner-inner" style={{ backgroundImage: 'url(/assets/images/banner/banner-inner-bg.png)' }}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="banner-inner__content text-center">
              <h2>{title}</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="shape"><img src="/assets/images/shape.png" alt="" /></div>
    </section>
  )
}
