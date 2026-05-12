import type { Locale } from './schema'

export type FAQ = { question: { es: string; en: string }; answer: { es: string; en: string } }

export const contactFAQs: FAQ[] = [
  {
    question: {
      es: '¿Dónde está ubicada la fundación?',
      en: 'Where is the foundation located?',
    },
    answer: {
      es: 'En Vía Boulevard Juan Dolio, John Hazim Subero, Calle el Tanque, Juan Dolio, San Pedro de Macorís, República Dominicana.',
      en: 'Vía Boulevard Juan Dolio, John Hazim Subero, Calle el Tanque, Juan Dolio, San Pedro de Macorís, Dominican Republic.',
    },
  },
  {
    question: { es: '¿Cómo puedo donar?', en: 'How can I donate?' },
    answer: {
      es: 'Vía PayPal en https://www.paypal.me/fgrandmothershouse o por transferencia bancaria local. Hacé clic en "Donar ahora" en el header para ver todas las opciones.',
      en: 'Via PayPal at https://www.paypal.me/fgrandmothershouse or by local bank transfer. Click "Donate now" in the header for all options.',
    },
  },
  {
    question: { es: '¿Reciben voluntarios?', en: 'Do you accept volunteers?' },
    answer: {
      es: 'Sí. Contactanos por email a grandmothershousedaycare@gmail.com o por teléfono al +1-809-655-0290 para coordinar tu participación.',
      en: 'Yes. Contact us at grandmothershousedaycare@gmail.com or call +1-809-655-0290 to coordinate your participation.',
    },
  },
  {
    question: {
      es: '¿Qué edades de niños atienden?',
      en: 'What age range of children do you serve?',
    },
    answer: {
      es: 'Brindamos cuidado y programas educativos para niños y niñas en edad temprana y escolar, principalmente en comunidades de Los Guayacanes, Honduras, Hoyo del Toro y Juan Dolio.',
      en: 'We provide care and educational programs for early-childhood and school-age children, primarily in the Los Guayacanes, Honduras, Hoyo del Toro, and Juan Dolio communities.',
    },
  },
  {
    question: {
      es: '¿Cómo se enteran las familias de los eventos?',
      en: 'How do families learn about events?',
    },
    answer: {
      es: 'Anunciamos eventos en /actividades, en nuestro Instagram @fundaciongrandmothershouse y vía la comunidad parroquial e iglesias locales aliadas.',
      en: 'Events are announced on /actividades, on Instagram @fundaciongrandmothershouse, and through the parish community and partner local churches.',
    },
  },
]

export const aboutFAQs: FAQ[] = [
  {
    question: {
      es: '¿Cuándo fue fundada la fundación?',
      en: 'When was the foundation established?',
    },
    answer: {
      es: 'La Fundación Grandmother’s House fue establecida en 1920, con más de un siglo de servicio al desarrollo integral de niños en la República Dominicana.',
      en: 'Fundación Grandmother’s House was established in 1920, with over a century of service to children’s integral development in the Dominican Republic.',
    },
  },
  {
    question: { es: '¿Cuál es su misión?', en: 'What is your mission?' },
    answer: {
      es: 'Proporcionar un entorno seguro, estimulante y cariñoso donde cada niño pueda desarrollarse plenamente, a través de educación, juego creativo y apoyo comunitario.',
      en: 'To provide a safe, stimulating, and loving environment where every child can develop fully, through education, creative play, and community support.',
    },
  },
  {
    question: {
      es: '¿Qué impacto han tenido?',
      en: 'What impact have you had?',
    },
    answer: {
      es: 'Más de 2,100 niños impactados en nuestra última jornada de entrega de juguetes; programas educativos continuos en cuatro comunidades; talleres de valores, autocuidado y crecimiento personal.',
      en: 'Over 2,100 children impacted in our latest toy drive; ongoing educational programs across four communities; workshops on values, self-care, and personal growth.',
    },
  },
]

export const faqJsonLd = (faqs: FAQ[], locale: Locale = 'es') => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.question[locale],
    acceptedAnswer: {
      '@type': 'Answer',
      text: f.answer[locale],
    },
  })),
})
