export function PageBanner({ title }: { title: string }) {
  return (
    <>
      <div className="d-none d-xl-block" style={{ height: '80px' }} />
      <div className="banner-inner">
        <div className="container">
          <div className="banner-inner__content text-center">
            <h1>{title}</h1>
          </div>
        </div>
      </div>
    </>
  )
}
