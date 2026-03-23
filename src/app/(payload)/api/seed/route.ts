import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })
    const results: string[] = []

    // ─── 1. Admin user ────────────────────────────────────────
    const existingUsers = await payload.find({ collection: 'users', limit: 1 })
    if (existingUsers.docs.length === 0) {
      await payload.create({
        collection: 'users',
        data: {
          email: 'admin@grandmothershouse.org',
          password: 'Admin123!',
          role: 'admin',
          name: 'Admin',
        },
      })
      results.push('Admin user created: admin@grandmothershouse.org / Admin123!')
    } else {
      results.push('Admin user already exists.')
    }

    // ─── 2. Header global (EN first, then ES labels) ──────────────────────────
    // Use REST API for header to avoid Payload updateGlobal bug with localized arrays
    const loginRes = await fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@grandmothershouse.org', password: 'Admin123!' }),
    })
    const { token } = await loginRes.json()

    await fetch('http://localhost:3000/api/globals/header', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `JWT ${token}` },
      body: JSON.stringify({
        email: 'grandmothershousedaycare@gmail.com',
        phone: '809-655-0290',
        donateButtonText: 'Donar ahora',
        socialLinks: [{ platform: 'instagram', url: 'https://www.instagram.com/fundaciongrandmothershouse', label: 'Instagram' }],
        navigation: [
          { label: 'Inicio', link: '/' },
          { label: 'Quiénes Somos', link: '/quienes-somos', children: [{ label: 'Misión', link: '/quienes-somos/mision' }, { label: 'Visión', link: '/quienes-somos/vision' }] },
          { label: 'Actividades', link: '/actividades' },
          { label: 'Contacto', link: '/contacto' },
        ],
      }),
    })

    // EN localized labels
    const headerRes = await fetch('http://localhost:3000/api/globals/header', { headers: { 'Authorization': `JWT ${token}` } })
    const headerData = await headerRes.json()
    const navItems = headerData.navigation || []

    if (navItems.length > 0) {
      const enLabels = ['Home', 'About Us', 'Activities', 'Contact']
      const enChildren = [[], ['Mission', 'Vision'], [], []]
      const enNav = navItems.map((item: any, i: number) => {
        const n: any = { id: item.id, label: enLabels[i], link: item.link }
        if (item.children?.length) {
          n.children = item.children.map((c: any, j: number) => ({ id: c.id, label: enChildren[i][j] || c.label, link: c.link }))
        } else { n.children = [] }
        return n
      })
      await fetch('http://localhost:3000/api/globals/header?locale=en', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `JWT ${token}` },
        body: JSON.stringify({ donateButtonText: 'Donate now', navigation: enNav }),
      })
    }
    results.push('Header seeded (EN + ES).')

    // ─── 4. Footer global (ES first = default, then EN localized labels) ──────
    await payload.updateGlobal({
      slug: 'footer',
      data: {
        quickLinksTitle: 'Enlaces rápidos',
        servicesTitle: 'Nuestros servicios',
        contactTitle: 'Contáctanos',
        description: 'La Fundación Grandmother\'s House se dedica a proporcionar un entorno seguro, estimulante y cariñoso donde cada niño pueda desarrollarse plenamente. A través de educación, juego creativo y apoyo comunitario, nos esforzamos por ser la luz para aquellos que están en la oscuridad.',
        socialLinks: [
          { platform: 'instagram', url: 'https://www.instagram.com/fundaciongrandmothershouse', label: 'Instagram' },
        ],
        quickLinks: [
          { label: 'Quiénes Somos', link: '/quienes-somos' },
          { label: 'Actividades', link: '/actividades' },
          { label: 'Contacto', link: '/contacto' },
          { label: 'Donar', link: '#' },
        ],
        services: [
          { label: 'Apoyo educativo', link: '/actividades' },
          { label: 'Cuidado infantil', link: '/actividades' },
          { label: 'Eventos comunitarios', link: '/actividades' },
          { label: 'Entrega de juguetes', link: '/actividades' },
          { label: 'Voluntariado', link: '/contacto' },
        ],
        contactInfo: {
          address: 'Vía Boulevard Juan Dolio, John Hazim Subero, Calle el Tanque, SPM, RD',
          addressLink: 'https://maps.google.com/?q=Juan+Dolio+San+Pedro+de+Macoris+RD',
          phone: '809-655-0290',
          email: 'grandmothershousedaycare@gmail.com',
        },
        copyrightText: "Copyright © 2026 Fundación Grandmother's House. Todos los derechos reservados. RNC: 430-43228-8",
        legalLinks: [
          { label: 'Términos y condiciones', link: '/terminos-y-condiciones' },
          { label: 'Política de privacidad', link: '/terminos-y-condiciones' },
        ],
      },
    })

    // EN localized labels
    const savedFooter = await payload.findGlobal({ slug: 'footer' })
    const qlItems = savedFooter.quickLinks as any[]
    const svcItems = savedFooter.services as any[]
    const llItems = savedFooter.legalLinks as any[]

    const enQL = ['About Us', 'Activities', 'Contact', 'Donate']
    const enSvc = ['Education support', 'Child care', 'Community events', 'Toy drives', 'Volunteer']
    const enLL = ['Terms and conditions', 'Privacy policy']

    await payload.updateGlobal({
      slug: 'footer',
      data: {
        quickLinksTitle: 'Quick links',
        servicesTitle: 'Our services',
        contactTitle: 'Get in touch',
        description: "Fundación Grandmother's House is dedicated to providing a safe, stimulating, and loving environment where every child can develop fully. Through education, creative play, and community support, we strive to be the light for those in darkness.",
        quickLinks: qlItems?.map((item: any, i: number) => ({ id: item.id, label: enQL[i], link: item.link })),
        services: svcItems?.map((item: any, i: number) => ({ id: item.id, label: enSvc[i], link: item.link })),
        copyrightText: "Copyright © 2026 Fundación Grandmother's House. All rights reserved. RNC: 430-43228-8",
        legalLinks: llItems?.map((item: any, i: number) => ({ id: item.id, label: enLL[i], link: item.link })),
      },
      locale: 'en',
    })
    results.push('Footer seeded (EN + ES).')

    // ─── 5. Donation Settings (EN + ES) ──────────────────────
    await payload.updateGlobal({
      slug: 'donation-settings',
      data: {
        modalTitle: 'Hacer una donación',
        modalDescription: 'Elige tu método de donación preferido. Cada contribución nos ayuda a brindar educación, cuidado infantil y programas comunitarios a quienes más lo necesitan.',
        paypal: { enabled: false },
        bankTransfer: {
          enabled: true,
          bankName: 'Banreservas',
          accountNumber: '9609143691',
          accountType: 'Checking',
          accountHolder: 'Elizabeth González Hilario - Céd. 023-0140481-6',
        },
        zelle: { enabled: false },
      },
    })
    await payload.updateGlobal({
      slug: 'donation-settings',
      data: {
        modalTitle: 'Make a donation',
        modalDescription: 'Choose your preferred donation method below. Every contribution helps us provide education, child care, and community programs to those who need it most.',
      },
      locale: 'en',
    })
    results.push('Donation Settings seeded (EN + ES).')

    // ─── 6. Site Settings ─────────────────────────────────────
    await payload.updateGlobal({
      slug: 'site-settings',
      data: {
        showHeroBanner: true,
        showDifference: true,
        showHelp: true,
        showTestimonial: true,
        showBlogPreview: true,
        siteName: "Fundación Grandmother's House",
      },
    })
    results.push('Site Settings seeded.')

    // ─── 7. Home page with blocks ─────────────────────────────
    const existingHome = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'home' } },
      limit: 1,
    })
    if (existingHome.docs.length > 0) {
      await payload.delete({ collection: 'pages', id: existingHome.docs[0].id })
    }

    await payload.create({
      collection: 'pages',
      locale: 'en',
      data: {
        title: 'Home',
        slug: 'home',
        layout: [
          {
            blockType: 'heroSlider',
            slides: [
              {
                subtitle: 'Welcome to our foundation',
                title: 'A Safe Place <br>Where Children <span>Grow</span>',
                ctaPrimaryText: 'Discover more',
                ctaPrimaryLink: '/quienes-somos',
                ctaSecondaryText: 'Contact us',
                ctaSecondaryLink: '/contacto',
              },
              {
                subtitle: 'Making a difference',
                title: 'Bringing Joy <br>To Over <span>2,100</span> Children',
                ctaPrimaryText: 'Our activities',
                ctaPrimaryLink: '/actividades',
                ctaSecondaryText: 'Donate now',
                ctaSecondaryLink: '#',
              },
            ],
          },
          {
            blockType: 'difference',
            subtitle: 'Our programs',
            title: 'Making a Real Difference',
            description: 'We provide education, child care, and community programs that impact families across multiple communities including Los Guayacanes, Honduras, Hoyo del Toro, and Juan Dolio.',
            items: [
              {
                icon: 'icon-education',
                title: 'Education & Development',
                description: 'Enriching educational programs and creative play that inspire children to explore, learn, and grow to their full potential.',
              },
              {
                icon: 'icon-food',
                title: 'Community Events',
                description: 'Joyful events like toy drives, educational talks on values and self-care, and celebrations that bring communities together.',
              },
              {
                icon: 'icon-health',
                title: 'Child Care',
                description: 'A safe, stimulating, and loving environment where every child can develop fully — physically and cognitively.',
              },
            ],
          },
          {
            blockType: 'help',
            subtitle: 'About us',
            title: 'Be the Light for Those <br>in <span>Darkness</span>',
            description: 'Our mission is to provide a safe, stimulating, and loving environment where every child can develop fully. We are committed to offering enriching educational programs and creative play, inspiring children to explore, learn, and grow.',
            features: [
              {
                icon: 'icon-make-donation',
                title: 'Start helping today',
                description: 'Join our cause and help us bring joy to children across communities in the Dominican Republic.',
              },
              {
                icon: 'icon-support-heart',
                title: 'Make donations',
                description: 'Your generous contributions support our programs, toy drives, and educational initiatives.',
              },
            ],
            checkmarks: [
              { text: 'Over 2,100 children impacted in our latest toy drive' },
              { text: 'Educational talks on values, self-care, and personal growth' },
              { text: 'Serving communities across Los Guayacanes, Honduras, and Juan Dolio' },
            ],
            ctaText: 'More about us',
            ctaLink: '/quienes-somos',
            phone: '809-655-0290',
          },
          {
            blockType: 'testimonial',
            subtitle: 'Testimonials',
            title: 'What People <span>Say</span> About Us',
            testimonials: [
              {
                rating: 5,
                quote: 'This foundation has truly changed lives in our community. Their dedication to children and families is remarkable and inspiring. Every event they organize brings hope.',
                authorName: 'María García',
                authorTitle: 'Community member',
              },
              {
                rating: 5,
                quote: 'The toy drive brought so much joy to our children. Seeing over 2,100 kids receive gifts during Three Kings Day was a truly moving experience I will never forget.',
                authorName: 'Juan Pérez',
                authorTitle: 'Volunteer',
              },
              {
                rating: 5,
                quote: 'I am grateful for the support and opportunities this organization has provided to my family. They truly care about every person they serve and go above and beyond.',
                authorName: 'Ana Rodríguez',
                authorTitle: 'Beneficiary',
              },
              {
                rating: 5,
                quote: 'Their educational programs and community events are making a real difference. The values talks and activities for children show their deep commitment to holistic development.',
                authorName: 'Carlos Martínez',
                authorTitle: 'Donor',
              },
            ],
          },
          {
            blockType: 'blogPreview',
            subtitle: 'Our work',
            title: 'Our Latest <span>Activities</span>',
          },
        ],
      },
    })

    const savedHome = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'home' } },
      locale: 'en',
      limit: 1,
    })
    const homeDoc = savedHome.docs[0]
    if (homeDoc) {
      const blocks = homeDoc.layout as any[]
      const heroBlock = blocks?.find((b: any) => b.blockType === 'heroSlider')
      const diffBlock = blocks?.find((b: any) => b.blockType === 'difference')
      const helpBlock = blocks?.find((b: any) => b.blockType === 'help')
      const testBlock = blocks?.find((b: any) => b.blockType === 'testimonial')
      const blogBlock = blocks?.find((b: any) => b.blockType === 'blogPreview')

      const esLayout: any[] = []

      if (heroBlock) {
        esLayout.push({
          id: heroBlock.id,
          blockType: 'heroSlider',
          slides: heroBlock.slides?.map((s: any, i: number) => ({
            id: s.id,
            subtitle: ['Bienvenidos a nuestra fundación', 'Haciendo la diferencia'][i],
            title: ['Un Lugar Seguro <br>Donde los Niños <span>Crecen</span>', 'Llevando Alegría <br>A Más de <span>2,100</span> Niños'][i],
            ctaPrimaryText: ['Descubre más', 'Nuestras actividades'][i],
            ctaPrimaryLink: s.ctaPrimaryLink,
            ctaSecondaryText: ['Contáctanos', 'Donar ahora'][i],
            ctaSecondaryLink: s.ctaSecondaryLink,
          })),
        })
      }

      if (diffBlock) {
        esLayout.push({
          id: diffBlock.id,
          blockType: 'difference',
          subtitle: 'Nuestros programas',
          title: 'Haciendo una Diferencia Real',
          description: 'Ofrecemos educación, cuidado infantil y programas comunitarios que impactan familias en múltiples comunidades incluyendo Los Guayacanes, Honduras, Hoyo del Toro y Juan Dolio.',
          items: diffBlock.items?.map((item: any, i: number) => ({
            id: item.id,
            icon: item.icon,
            title: ['Educación y Desarrollo', 'Eventos Comunitarios', 'Cuidado Infantil'][i],
            description: [
              'Programas educativos enriquecedores y juego creativo que inspiran a los niños a explorar, aprender y crecer a su máximo potencial.',
              'Eventos llenos de alegría como entrega de juguetes, charlas educativas sobre valores y autocuidado, y celebraciones que unen a las comunidades.',
              'Un entorno seguro, estimulante y cariñoso donde cada niño puede desarrollarse plenamente — física y cognitivamente.',
            ][i],
          })),
        })
      }

      if (helpBlock) {
        esLayout.push({
          id: helpBlock.id,
          blockType: 'help',
          subtitle: 'Sobre nosotros',
          title: 'Ser la Luz para Aquellos <br>en la <span>Oscuridad</span>',
          description: 'Nuestra misión es proporcionar un entorno seguro, estimulante y cariñoso donde cada niño pueda desarrollarse completamente. Nos comprometemos a ofrecer programas educativos enriquecedores y juego creativo, inspirando a los niños a explorar, aprender y crecer.',
          features: helpBlock.features?.map((f: any, i: number) => ({
            id: f.id,
            icon: f.icon,
            title: ['Empieza a ayudar hoy', 'Haz una donación'][i],
            description: [
              'Únete a nuestra causa y ayúdanos a llevar alegría a niños de comunidades en República Dominicana.',
              'Tus generosas contribuciones apoyan nuestros programas, entregas de juguetes e iniciativas educativas.',
            ][i],
          })),
          checkmarks: helpBlock.checkmarks?.map((c: any, i: number) => ({
            id: c.id,
            text: [
              'Más de 2,100 niños impactados en nuestra última entrega de juguetes',
              'Charlas educativas sobre valores, autocuidado y crecimiento personal',
              'Sirviendo comunidades en Los Guayacanes, Honduras y Juan Dolio',
            ][i],
          })),
          ctaText: 'Más sobre nosotros',
          ctaLink: helpBlock.ctaLink,
          phone: helpBlock.phone,
        })
      }

      if (testBlock) {
        const esQuotes = [
          'Esta fundación ha cambiado vidas en nuestra comunidad. Su dedicación a los niños y las familias es notable e inspiradora. Cada evento que organizan trae esperanza.',
          'La entrega de juguetes trajo tanta alegría a nuestros niños. Ver a más de 2,100 niños recibir regalos en el Día de Reyes fue una experiencia realmente conmovedora que nunca olvidaré.',
          'Estoy agradecida por el apoyo y las oportunidades que esta organización ha brindado a mi familia. Realmente se preocupan por cada persona que atienden y van más allá.',
          'Sus programas educativos y eventos comunitarios están haciendo una diferencia real. Las charlas de valores y actividades para niños muestran su profundo compromiso con el desarrollo integral.',
        ]
        const esTitles = ['Miembro de la comunidad', 'Voluntario', 'Beneficiaria', 'Donante']
        esLayout.push({
          id: testBlock.id,
          blockType: 'testimonial',
          subtitle: 'Testimonios',
          title: 'Lo Que la Gente <span>Dice</span> de Nosotros',
          testimonials: testBlock.testimonials?.map((t: any, i: number) => ({
            id: t.id,
            rating: t.rating,
            quote: esQuotes[i],
            authorName: t.authorName,
            authorTitle: esTitles[i],
          })),
        })
      }

      if (blogBlock) {
        esLayout.push({
          id: blogBlock.id,
          blockType: 'blogPreview',
          subtitle: 'Nuestro trabajo',
          title: 'Nuestras Últimas <span>Actividades</span>',
        })
      }

      await payload.update({
        collection: 'pages',
        id: homeDoc.id,
        locale: 'es',
        data: {
          title: 'Inicio',
          layout: esLayout,
        },
      })
    }
    results.push('Home page seeded with all blocks (EN + ES).')

    // ─── 8. News articles (EN + ES) ─────────────────────────────
    const existingNews = await payload.find({ collection: 'news', limit: 10 })
    for (const doc of existingNews.docs) {
      await payload.delete({ collection: 'news', id: doc.id })
    }

    const newsEN = [
      {
        title: 'Grandmother\'s House Foundation Delivers Toys to Over 2,100 Children',
        slug: 'toy-delivery-2100-children',
        date: '2026-01-06',
        excerpt: 'The Grandmother\'s House Foundation carried out a major social event benefiting childhood, impacting over 2,100 children from communities including Los Guayacanes, Honduras, Hoyo del Toro, and Juan Dolio.',
        published: true,
      },
      {
        title: 'Educational Talks on Values and Personal Growth',
        slug: 'educational-talks-values',
        date: '2026-01-06',
        excerpt: 'As part of our commitment to education, children participated in talks focused on values, behavior, self-care, and personal growth designed to guide their holistic development.',
        published: true,
      },
      {
        title: 'Community Celebration Brings Joy to Multiple Neighborhoods',
        slug: 'community-celebration-joy',
        date: '2026-01-06',
        excerpt: 'Children enjoyed entertainment with clowns, fun activities, games, and face painting stations, creating an atmosphere of celebration and smiles across our served communities.',
        published: true,
      },
    ]
    const newsES = [
      { title: 'Fundación Grandmother House entrega juguetes a más de 2,100 niños', excerpt: 'La Fundación Grandmother House llevó a cabo una gran jornada social en beneficio de la niñez, logrando impactar a más de 2,100 niños de comunidades como Los Guayacanes, Honduras, Hoyo del Toro y Juan Dolio.' },
      { title: 'Charlas Educativas sobre Valores y Crecimiento Personal', excerpt: 'Como parte del compromiso formativo de la fundación, los niños participaron en charlas educativas enfocadas en valores, comportamiento, autocuidado y crecimiento personal.' },
      { title: 'Celebración Comunitaria Lleva Alegría a Múltiples Barrios', excerpt: 'Los niños disfrutaron de la animación de payasos, dinámicas divertidas, juegos y estaciones de pinta caritas, contribuyendo a crear un entorno de celebración y sonrisas.' },
    ]

    for (let i = 0; i < newsEN.length; i++) {
      const created = await payload.create({ collection: 'news', locale: 'en', data: newsEN[i] as any })
      await payload.update({
        collection: 'news',
        id: created.id,
        locale: 'es',
        data: { title: newsES[i].title, excerpt: newsES[i].excerpt } as any,
      })
    }
    results.push('3 news articles seeded (EN + ES).')

    // ─── 9. Activities (EN + ES) ────────────────────────────────
    const existingActivities = await payload.find({ collection: 'activities', limit: 10 })
    for (const doc of existingActivities.docs) {
      await payload.delete({ collection: 'activities', id: doc.id })
    }

    const activitiesEN = [
      { name: 'Three Kings Day Toy Delivery', slug: 'entrega-juguetes-reyes-2026', date: '2026-01-06', location: 'Los Guayacanes, Honduras, Hoyo del Toro, Juan Dolio', published: true },
    ]
    const activitiesES = [
      { name: 'Entrega de Juguetes del Día de Reyes' },
    ]

    for (let i = 0; i < activitiesEN.length; i++) {
      const created = await payload.create({ collection: 'activities', locale: 'en', data: activitiesEN[i] as any })
      await payload.update({
        collection: 'activities',
        id: created.id,
        locale: 'es',
        data: { name: activitiesES[i].name } as any,
      })
    }
    results.push('3 activities seeded (EN + ES).')

    // ─── 10. About, Mission, Vision, Terms pages ─────────────────────
    const innerPages = [
      {
        slug: 'about',
        enTitle: 'About us',
        esTitle: 'Quiénes somos',
        enBlocks: [
          {
            blockType: 'textSection',
            subtitle: 'Who we are',
            heading: "About Fundación <span>Grandmother's House</span>",
            body: "Fundación Grandmother's House is a nonprofit organization established in 1920, dedicated to the comprehensive development of children in the Dominican Republic. For over a century, we have provided a safe, stimulating, and loving environment where every child can grow — physically, cognitively, and emotionally.\n\nOur programs span education, creative play, community events, and social support. We serve multiple communities including Los Guayacanes, Honduras, Hoyo del Toro, and the tourist destination of Juan Dolio in San Pedro de Macorís.\n\nWe believe that by working together, we can create opportunities for growth and build stronger communities. Our values — Love, Respect, Integrity, Trust, Responsibility, and Safety — guide everything we do.",
            imagePosition: 'left',
            ctaText: 'Contact us',
            ctaLink: '/contacto',
          },
          {
            blockType: 'ctaBanner',
            title: 'Together we can make a <span>difference</span>',
            description: 'Join us in our mission to be the light for those in darkness. Every contribution helps us provide education, child care, and community programs to families who need it most.',
            primaryButtonText: 'Discover more',
            primaryButtonLink: '/actividades',
            secondaryButtonText: 'Contact us',
            secondaryButtonLink: '/contacto',
          },
        ],
        esBlocks: [
          {
            blockType: 'textSection',
            subtitle: 'Quiénes somos',
            heading: 'Sobre Fundación <span>Grandmother\'s House</span>',
            body: "La Fundación Grandmother's House es una organización sin fines de lucro establecida en 1920, dedicada al desarrollo integral de los niños en la República Dominicana. Por más de un siglo, hemos proporcionado un entorno seguro, estimulante y cariñoso donde cada niño puede crecer — física, cognitiva y emocionalmente.\n\nNuestros programas abarcan educación, juego creativo, eventos comunitarios y apoyo social. Servimos a múltiples comunidades incluyendo Los Guayacanes, Honduras, Hoyo del Toro y el destino turístico de Juan Dolio en San Pedro de Macorís.\n\nCreemos que trabajando juntos podemos crear oportunidades de crecimiento y construir comunidades más fuertes. Nuestros valores — Amor, Respeto, Integridad, Confianza, Responsabilidad y Seguridad — guían todo lo que hacemos.",
            imagePosition: 'left',
            ctaText: 'Contáctanos',
            ctaLink: '/contacto',
          },
          {
            blockType: 'ctaBanner',
            title: 'Juntos podemos hacer la <span>diferencia</span>',
            description: 'Únete a nuestra misión de ser la luz para aquellos en la oscuridad. Cada contribución nos ayuda a brindar educación, cuidado infantil y programas comunitarios a las familias que más lo necesitan.',
            primaryButtonText: 'Descubre más',
            primaryButtonLink: '/actividades',
            secondaryButtonText: 'Contáctanos',
            secondaryButtonLink: '/contacto',
          },
        ],
      },
      {
        slug: 'mission',
        enTitle: 'Mission',
        esTitle: 'Misión',
        enBlocks: [
          {
            blockType: 'textSection',
            subtitle: 'Our mission',
            heading: 'What <span>Drives</span> Us',
            body: "Our mission is to provide a safe, stimulating, and loving environment where every child can develop fully — both physically and cognitively. We are committed to offering enriching educational programs and creative play, inspiring children to explore, learn, and grow. We strive to be the light for those who are in darkness.\n\nOur Values:\n\n• Love — We act with genuine care for every child and family we serve.\n• Respect — We treat everyone with dignity and value their unique qualities.\n• Integrity — We are transparent and honest in everything we do.\n• Trust — We build relationships based on reliability and accountability.\n• Responsibility — We take ownership of our mission and our impact on the community.\n• Safety — We ensure a secure environment where children can thrive without worry.",
            imagePosition: 'none',
          },
        ],
        esBlocks: [
          {
            blockType: 'textSection',
            subtitle: 'Nuestra misión',
            heading: 'Lo Que Nos <span>Impulsa</span>',
            body: "Nuestra misión es proporcionar un entorno seguro, estimulante y cariñoso donde cada niño pueda desarrollarse completamente sano y cognitivamente. Nos comprometemos a ofrecer programas educativos enriquecedores y juego creativo, inspirando a los niños a explorar, aprender y crecer. Nos esforzamos por ser la luz para aquellos que están en la oscuridad.\n\nNuestros Valores:\n\n• Amor — Actuamos con cariño genuino por cada niño y familia que servimos.\n• Respeto — Tratamos a todos con dignidad y valoramos sus cualidades únicas.\n• Integridad — Somos transparentes y honestos en todo lo que hacemos.\n• Confianza — Construimos relaciones basadas en la confiabilidad y la responsabilidad.\n• Responsabilidad — Asumimos nuestra misión y nuestro impacto en la comunidad.\n• Seguridad — Garantizamos un entorno seguro donde los niños pueden prosperar sin preocupaciones.",
            imagePosition: 'none',
          },
        ],
      },
      {
        slug: 'vision',
        enTitle: 'Vision',
        esTitle: 'Visión',
        enBlocks: [
          {
            blockType: 'textSection',
            subtitle: 'Our vision',
            heading: 'Where We\'re <span>Headed</span>',
            body: "Our vision is to be leaders in child care, offering an inspiring environment where every child can flourish and reach their full potential. We are committed to being a model of excellence and compassion, providing innovative and high-quality programs that promote the holistic development of every child.\n\nWe aspire to be recognized for our dedication and excellence in early childhood education, becoming a role model in the community. Through our work in Los Guayacanes, Honduras, Hoyo del Toro, Juan Dolio, and beyond, we aim to expand our reach and deepen our impact on the next generations.",
            imagePosition: 'none',
          },
        ],
        esBlocks: [
          {
            blockType: 'textSection',
            subtitle: 'Nuestra visión',
            heading: 'Hacia Dónde <span>Vamos</span>',
            body: "Nuestra visión es ser líderes en el cuidado infantil, ofreciendo un ambiente inspirador donde cada niño pueda florecer y alcanzar su máximo potencial. Nos comprometemos a ser un modelo de excelencia y compasión, proporcionando programas innovadores y de alta calidad que promueven el desarrollo integral de cada niño.\n\nAspiramos a ser reconocidos por nuestra dedicación y excelencia en la educación infantil, siendo un modelo a seguir en la comunidad. A través de nuestro trabajo en Los Guayacanes, Honduras, Hoyo del Toro, Juan Dolio y más allá, buscamos expandir nuestro alcance y profundizar nuestro impacto en las nuevas generaciones.",
            imagePosition: 'none',
          },
        ],
      },
      {
        slug: 'terms',
        enTitle: 'Terms and conditions',
        esTitle: 'Términos y condiciones',
        enBlocks: [
          {
            blockType: 'textSection',
            subtitle: 'Legal',
            heading: 'Terms and <span>Conditions</span>',
            body: "1. General Information\n\nThis website is operated by Fundación Grandmother's House (RNC: 430-43228-8), a nonprofit organization located at Vía Boulevard Juan Dolio, John Hazim Subero, Calle el Tanque, San Pedro de Macorís, Dominican Republic. By accessing and using this website, you agree to these terms and conditions.\n\n2. Use of the Website\n\nThis website is provided for informational purposes about our foundation, programs, and activities. Users may browse content, make donations, and submit contact inquiries. Any misuse of the website is prohibited.\n\n3. Intellectual Property\n\nAll content on this website, including text, images, logos, and design elements, is the property of Fundación Grandmother's House and is protected by intellectual property laws. Reproduction without authorization is prohibited.\n\n4. Donations and Payments\n\nDonations made through this website are voluntary and non-refundable. We offer multiple payment methods including PayPal, bank transfer, and Zelle. All donations are used exclusively to fund our programs and activities.\n\n5. Privacy and Data Protection\n\nWe collect personal information only when voluntarily provided through contact forms or donations. We do not sell or share personal information with third parties. Data is used solely to respond to inquiries and process donations.\n\n6. Limitation of Liability\n\nFundación Grandmother's House is not liable for any damages arising from the use of this website. We make reasonable efforts to ensure information accuracy but do not guarantee completeness.\n\n7. Modifications\n\nFundación Grandmother's House reserves the right to modify these terms at any time. Changes are effective upon publication on this website.\n\n8. Contact\n\nFor questions about these terms, contact us at grandmothershousedaycare@gmail.com or call 809-655-0290.",
            imagePosition: 'none',
          },
        ],
        esBlocks: [
          {
            blockType: 'textSection',
            subtitle: 'Legal',
            heading: 'Términos y <span>Condiciones</span>',
            body: "1. Información General\n\nEste sitio web es operado por la Fundación Grandmother's House (RNC: 430-43228-8), una organización sin fines de lucro ubicada en Vía Boulevard Juan Dolio, John Hazim Subero, Calle el Tanque, San Pedro de Macorís, República Dominicana. Al acceder y utilizar este sitio web, usted acepta estos términos y condiciones.\n\n2. Uso del Sitio Web\n\nEste sitio web se proporciona con fines informativos sobre nuestra fundación, programas y actividades. Los usuarios pueden navegar el contenido, realizar donaciones y enviar consultas de contacto. Cualquier uso indebido del sitio web está prohibido.\n\n3. Propiedad Intelectual\n\nTodo el contenido de este sitio web, incluyendo textos, imágenes, logotipos y elementos de diseño, es propiedad de la Fundación Grandmother's House y está protegido por las leyes de propiedad intelectual. La reproducción sin autorización está prohibida.\n\n4. Donaciones y Pagos\n\nLas donaciones realizadas a través de este sitio web son voluntarias y no reembolsables. Ofrecemos múltiples métodos de pago incluyendo PayPal, transferencia bancaria y Zelle. Todas las donaciones se utilizan exclusivamente para financiar nuestros programas y actividades.\n\n5. Privacidad y Protección de Datos\n\nRecopilamos información personal solo cuando se proporciona voluntariamente a través de formularios de contacto o donaciones. No vendemos ni compartimos información personal con terceros. Los datos se utilizan únicamente para responder consultas y procesar donaciones.\n\n6. Limitación de Responsabilidad\n\nLa Fundación Grandmother's House no es responsable de ningún daño derivado del uso de este sitio web. Hacemos esfuerzos razonables para garantizar la exactitud de la información pero no garantizamos su completitud.\n\n7. Modificaciones\n\nLa Fundación Grandmother's House se reserva el derecho de modificar estos términos en cualquier momento. Los cambios serán efectivos al momento de su publicación en este sitio web.\n\n8. Contacto\n\nPara preguntas sobre estos términos, contáctenos en grandmothershousedaycare@gmail.com o llame al 809-655-0290.",
            imagePosition: 'none',
          },
        ],
      },
    ]

    for (const pg of innerPages) {
      const existing = await payload.find({
        collection: 'pages',
        where: { slug: { equals: pg.slug } },
        limit: 1,
      })
      if (existing.docs.length > 0) {
        await payload.delete({ collection: 'pages', id: existing.docs[0].id })
      }

      const created = await payload.create({
        collection: 'pages',
        locale: 'en',
        data: {
          title: pg.enTitle,
          slug: pg.slug,
          layout: pg.enBlocks,
        },
      })

      const saved = await payload.findByID({
        collection: 'pages',
        id: created.id,
        locale: 'en',
      })
      const savedBlocks = (saved.layout as any[]) || []

      const esLayoutBlocks = pg.esBlocks.map((esBlock: any, idx: number) => ({
        ...esBlock,
        id: savedBlocks[idx]?.id,
      }))

      await payload.update({
        collection: 'pages',
        id: created.id,
        locale: 'es',
        data: {
          title: pg.esTitle,
          layout: esLayoutBlocks,
        },
      })
    }
    results.push('About, Mission, Vision, Terms pages seeded (EN + ES).')

    return NextResponse.json({
      success: true,
      results,
      credentials: {
        email: 'admin@grandmothershouse.org',
        password: 'Admin123!',
      },
    })
  } catch (error: any) {
    console.error('Seed failed:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
