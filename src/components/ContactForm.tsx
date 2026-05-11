'use client'

const CONTACT_EMAIL = 'grandmothershousedaycare@gmail.com'

const buildMailto = (form: HTMLFormElement, locale: string) => {
  const fd = new FormData(form)
  const name = String(fd.get('full-name') ?? '').trim()
  const email = String(fd.get('c-email') ?? '').trim()
  const phone = String(fd.get('phone-number') ?? '').trim()
  const message = String(fd.get('contact-message') ?? '').trim()

  const subject =
    locale === 'es'
      ? `Contacto desde el sitio — ${name}`
      : `Website contact — ${name}`

  const lines =
    locale === 'es'
      ? [`Nombre: ${name}`, `Email: ${email}`, `Teléfono: ${phone}`, '', 'Mensaje:', message]
      : [`Name: ${name}`, `Email: ${email}`, `Phone: ${phone}`, '', 'Message:', message]

  const body = lines.join('\n')
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export function ContactForm({ locale }: { locale: string }) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    window.location.href = buildMailto(e.currentTarget, locale)
  }

  return (
    <div className="contact__form volunteer__form checkout__form" data-aos="fade-up" data-aos-duration="1000">
      <div className="volunteer__form-content">
        <h4>{locale === 'es' ? 'Llena el Formulario' : 'Fill Up The Form'}</h4>
        <p>{locale === 'es' ? 'Los campos marcados con * son obligatorios' : 'Required fields are marked *'}</p>
      </div>

      <form onSubmit={handleSubmit} className="cta">
        <div className="input-single">
          <input type="text" name="full-name" placeholder={locale === 'es' ? 'Tu Nombre' : 'Enter Name'} required />
          <i className="fa-solid fa-user"></i>
        </div>
        <div className="input-single">
          <input type="email" name="c-email" placeholder={locale === 'es' ? 'Tu Email' : 'Enter Email'} required />
          <i className="fa-solid fa-envelope"></i>
        </div>
        <div className="input-single">
          <input type="text" name="phone-number" placeholder={locale === 'es' ? 'Numero de Telefono' : 'Phone Number'} required />
          <i className="fa-solid fa-phone"></i>
        </div>
        <div className="input-single alter-input">
          <textarea name="contact-message" placeholder={locale === 'es' ? 'Tu Mensaje...' : 'Your Message...'}></textarea>
          <i className="fa-solid fa-comments"></i>
        </div>
        <div className="form-cta">
          <button type="submit" className="btn--primary">
            {locale === 'es' ? 'Enviar Mensaje' : 'Send Message'}
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </form>
    </div>
  )
}
