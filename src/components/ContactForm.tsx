'use client'
import { useState } from 'react'

export function ContactForm({ locale }: { locale: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')

    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      const res = await fetch('/api/contact-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('full-name'),
          email: formData.get('c-email'),
          phone: formData.get('phone-number'),
          message: formData.get('contact-message'),
        }),
      })

      if (res.ok) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="contact__form volunteer__form checkout__form" data-aos="fade-up" data-aos-duration="1000">
      <div className="volunteer__form-content">
        <h4>{locale === 'es' ? 'Llena el Formulario' : 'Fill Up The Form'}</h4>
        <p>{locale === 'es' ? 'Los campos marcados con * son obligatorios' : 'Required fields are marked *'}</p>
      </div>

      {status === 'success' && (
        <div style={{ padding: '12px', background: '#d4edda', borderRadius: '8px', marginBottom: '16px', color: '#155724' }}>
          {locale === 'es' ? 'Mensaje enviado exitosamente.' : 'Message sent successfully.'}
        </div>
      )}
      {status === 'error' && (
        <div style={{ padding: '12px', background: '#f8d7da', borderRadius: '8px', marginBottom: '16px', color: '#721c24' }}>
          {locale === 'es' ? 'Error al enviar. Intenta de nuevo.' : 'Error sending. Please try again.'}
        </div>
      )}

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
          <button type="submit" className="btn--primary" disabled={status === 'loading'}>
            {status === 'loading'
              ? (locale === 'es' ? 'Enviando...' : 'Sending...')
              : (locale === 'es' ? 'Enviar Mensaje' : 'Send Message')}
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </form>
    </div>
  )
}
