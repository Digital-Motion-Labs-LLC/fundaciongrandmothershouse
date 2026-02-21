export function EventDetail({ activity }: { activity: any }) {
  const imageUrl = activity.featuredImage?.url || '/assets/images/event/poster.png'
  const date = activity.date ? new Date(activity.date).toLocaleDateString() : ''

  return (
    <div className="cm-details">
      <div className="container">
        <div className="row gutter-60">
          <div className="col-12 col-xl-8">
            <div className="cm-details__content">
              <div className="cm-details__poster" data-aos="fade-up" data-aos-duration="1000">
                <img src={imageUrl} alt={activity.name} />
              </div>
              <div className="cm-details-meta">
                {date && <p><i className="fa-solid fa-calendar-days"></i>{date}</p>}
                {activity.location && <p><i className="fa-solid fa-location-dot"></i>{activity.location}</p>}
              </div>
              <div className="cm-group cta">
                <h3>{activity.name}</h3>
                {activity.description_html ? (
                  <div dangerouslySetInnerHTML={{ __html: activity.description_html }} />
                ) : (
                  <p>{activity.description}</p>
                )}
              </div>
              {activity.gallery?.length > 0 && (
                <div className="cm-img-group cta">
                  {activity.gallery.map((item: any, i: number) => (
                    <div key={i} className="cm-img-single">
                      <img src={item.image?.url || ''} alt="" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
