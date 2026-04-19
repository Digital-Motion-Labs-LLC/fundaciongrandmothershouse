import Link from 'next/link'
import { placeholderImages } from '@/lib/placeholder-images'

export function EventCard({ activity, index = 0, locale }: { activity: any; index?: number; locale: string }) {
  const imageUrl = activity.featuredImage?.url || placeholderImages.events(index)
  const date = activity.date ? new Date(activity.date).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''

  return (
    <div className="col-12 col-lg-6">
      <div className="event__single-wrapper" data-aos="fade-up" data-aos-duration="1000">
        <Link
          href={`/actividades/${activity.slug}`}
          className="event__single card-link"
          style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}
        >
          <div className="event__single-thumb" style={{ width: '100%', aspectRatio: '16 / 10', overflow: 'hidden' }}>
            <img
              src={imageUrl}
              alt={activity.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
            />
          </div>
          <div className="event__content">
            {date && <span>{date}</span>}
            <h4>{activity.name}</h4>
            {activity.location && <p><i className="fa-solid fa-location-dot"></i> {activity.location}</p>}
          </div>
        </Link>
      </div>
    </div>
  )
}
