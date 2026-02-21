import Link from 'next/link'

export function Pagination({ currentPage, totalPages, basePath }: { currentPage: number; totalPages: number; basePath: string }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="row">
      <div className="col-12">
        <div className="pagination-wrapper" data-aos="fade-up" data-aos-duration="1000">
          <ul className="pagination main-pagination">
            {currentPage > 1 && (
              <li><Link href={`${basePath}?page=${currentPage - 1}`}><i className="fa-solid fa-angles-left"></i></Link></li>
            )}
            {pages.map(p => (
              <li key={p}>
                <Link href={`${basePath}?page=${p}`} className={p === currentPage ? 'active' : ''}>{p}</Link>
              </li>
            ))}
            {currentPage < totalPages && (
              <li><Link href={`${basePath}?page=${currentPage + 1}`}><i className="fa-solid fa-angles-right"></i></Link></li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
