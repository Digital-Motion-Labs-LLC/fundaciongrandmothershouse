import Link from 'next/link'

export function EventCard({ activity, locale }: { activity: any; locale: string }) {
  const imageUrl = activity.featuredImage?.url || '/assets/images/event/one.png'
  const date = activity.date ? new Date(activity.date).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''

  return (
    <div className="col-12 col-lg-6">
      <div className="event__single-wrapper" data-aos="fade-up" data-aos-duration="1000">
        <div className="event__single">
          <div className="event__single-thumb">
            <img src={imageUrl} alt={activity.name} />
          </div>
          <div className="event__content">
            {date && <span>{date}</span>}
            <h4><Link href={`/actividades/${activity.slug}`}>{activity.name}</Link></h4>
            {activity.location && <p><i className="fa-solid fa-location-dot"></i> {activity.location}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
