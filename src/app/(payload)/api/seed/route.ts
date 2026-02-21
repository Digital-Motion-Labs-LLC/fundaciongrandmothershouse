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
    // First set EN with the full structure
    await payload.updateGlobal({
      slug: 'header',
      data: {
        email: 'info@grandmothershouse.org',
        phone: '+1 (809) 555-0123',
        donateButtonText: 'Donate Now',
        socialLinks: [
          { platform: 'facebook', url: 'https://facebook.com/grandmothershouse', label: 'Facebook' },
          { platform: 'instagram', url: 'https://instagram.com/grandmothershouse', label: 'Instagram' },
        ],
        navigation: [
          { label: 'Home', link: '/' },
          {
            label: 'About Us',
            link: '/quienes-somos',
            children: [
              { label: 'Mission', link: '/quienes-somos/mision' },
              { label: 'Vision', link: '/quienes-somos/vision' },
            ],
          },
          { label: 'Activities', link: '/actividades' },
          { label: 'News', link: '/noticias' },
          { label: 'Contact', link: '/contacto' },
        ],
      },
      locale: 'en',
    })

    // Now fetch the saved header to get array item IDs
    const savedHeader = await payload.findGlobal({ slug: 'header', locale: 'en' })
    const navItems = savedHeader.navigation as any[]

    // Update ES locale using the same IDs so we don't replace the array
    if (navItems?.length === 5) {
      const esLabels = ['Inicio', 'Quiénes Somos', 'Actividades', 'Noticias', 'Contacto']
      const esChildLabels = [[], ['Misión', 'Visión'], [], [], []]

      const esNav = navItems.map((item: any, i: number) => {
        const updated: any = { id: item.id, label: esLabels[i], link: item.link }
        if (item.children?.length) {
          updated.children = item.children.map((child: any, j: number) => ({
            id: child.id,
            label: esChildLabels[i][j] || child.label,
            link: child.link,
          }))
        } else {
          updated.children = []
        }
        return updated
      })

      await payload.updateGlobal({
        slug: 'header',
        data: {
          donateButtonText: 'Donar Ahora',
          navigation: esNav,
        },
        locale: 'es',
      })
    }
    results.push('Header seeded (EN + ES).')

    // ─── 3. Footer global (EN first, then ES labels) ──────────────────────────
    await payload.updateGlobal({
      slug: 'footer',
      data: {
        description: "Fundación Grandmother's House is dedicated to making a difference in the lives of those who need it most through education, nutrition, and community support.",
        socialLinks: [
          { platform: 'facebook', url: 'https://facebook.com/grandmothershouse', label: 'Facebook' },
          { platform: 'instagram', url: 'https://instagram.com/grandmothershouse', label: 'Instagram' },
        ],
        quickLinks: [
          { label: 'About Us', link: '/quienes-somos' },
          { label: 'Our News', link: '/noticias' },
          { label: 'Activities', link: '/actividades' },
          { label: 'Contact', link: '/contacto' },
          { label: 'Donate', link: '#' },
        ],
        services: [
          { label: 'Education Support', link: '/actividades' },
          { label: 'Nutrition Programs', link: '/actividades' },
          { label: 'Healthcare Access', link: '/actividades' },
          { label: 'Community Programs', link: '/actividades' },
          { label: 'Volunteer', link: '/contacto' },
        ],
        contactInfo: {
          address: 'Santo Domingo, Dominican Republic',
          addressLink: 'https://maps.google.com',
          phone: '+1 (809) 555-0123',
          email: 'info@grandmothershouse.org',
        },
        copyrightText: "Copyright © 2025 Fundación Grandmother's House. All rights reserved.",
        legalLinks: [
          { label: 'Terms & Conditions', link: '#' },
          { label: 'Privacy Policy', link: '#' },
        ],
      },
      locale: 'en',
    })

    // Fetch saved footer to get array item IDs, then update ES labels
    const savedFooter = await payload.findGlobal({ slug: 'footer', locale: 'en' })
    const qlItems = savedFooter.quickLinks as any[]
    const svcItems = savedFooter.services as any[]
    const llItems = savedFooter.legalLinks as any[]

    const esQL = ['Quiénes Somos', 'Noticias', 'Actividades', 'Contacto', 'Donar']
    const esSvc = ['Apoyo Educativo', 'Programas de Nutrición', 'Acceso a Salud', 'Programas Comunitarios', 'Voluntariado']
    const esLL = ['Términos y Condiciones', 'Política de Privacidad']

    await payload.updateGlobal({
      slug: 'footer',
      data: {
        description: 'La Fundación Grandmother\'s House se dedica a hacer una diferencia en la vida de quienes más lo necesitan a través de educación, nutrición y apoyo comunitario.',
        quickLinks: qlItems?.map((item: any, i: number) => ({ id: item.id, label: esQL[i], link: item.link })),
        services: svcItems?.map((item: any, i: number) => ({ id: item.id, label: esSvc[i], link: item.link })),
        contactInfo: { address: 'Santo Domingo, República Dominicana' },
        copyrightText: "Copyright © 2025 Fundación Grandmother's House. Todos los derechos reservados.",
        legalLinks: llItems?.map((item: any, i: number) => ({ id: item.id, label: esLL[i], link: item.link })),
      },
      locale: 'es',
    })
    results.push('Footer seeded (EN + ES).')

    // ─── 4. Donation Settings (EN + ES) ──────────────────────
    await payload.updateGlobal({
      slug: 'donation-settings',
      data: {
        modalTitle: 'Make a Donation',
        modalDescription: 'Choose your preferred donation method below. Every contribution makes a difference in the lives of those who need it most.',
        paypal: { enabled: true, link: 'https://paypal.me/grandmothershouse' },
        bankTransfer: {
          enabled: true,
          bankName: 'Banco Popular Dominicano',
          accountNumber: '123-456789-0',
          accountType: 'Savings',
        },
        zelle: { enabled: true, emailOrPhone: 'donate@grandmothershouse.org' },
      },
      locale: 'en',
    })
    await payload.updateGlobal({
      slug: 'donation-settings',
      data: {
        modalTitle: 'Hacer una Donación',
        modalDescription: 'Elige tu método de donación preferido. Cada contribución marca la diferencia en la vida de quienes más lo necesitan.',
      },
      locale: 'es',
    })
    results.push('Donation Settings seeded (EN + ES).')

    // ─── 5. Site Settings ─────────────────────────────────────
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

    // ─── 6. Home page with blocks ─────────────────────────────
    // Delete existing home page first
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
                subtitle: 'Welcome To Our Foundation',
                title: 'Giving Help <br>To Those Who <span>Need</span> It.',
                ctaPrimaryText: 'Discover More',
                ctaPrimaryLink: '/quienes-somos',
                ctaSecondaryText: 'Contact Us',
                ctaSecondaryLink: '/contacto',
              },
              {
                subtitle: 'Making A Difference',
                title: 'Together We Can <br>Change <span>Lives</span> Forever.',
                ctaPrimaryText: 'Our Activities',
                ctaPrimaryLink: '/actividades',
                ctaSecondaryText: 'Donate Now',
                ctaSecondaryLink: '#',
              },
            ],
          },
          {
            blockType: 'difference',
            subtitle: 'Our Programs',
            title: 'Charity With Difference',
            description: 'We provide education, nutrition, and healthcare programs to those who need it most. Join our mission to create lasting change.',
            items: [
              {
                icon: 'icon-education',
                title: 'Education Support',
                description: 'Providing quality education and school supplies to children in underserved communities.',
              },
              {
                icon: 'icon-food',
                title: 'Nutrition Programs',
                description: 'Ensuring families have access to healthy meals and nutritional education.',
              },
              {
                icon: 'icon-health',
                title: 'Healthcare Access',
                description: 'Connecting communities with medical services, preventive care, and health education.',
              },
            ],
          },
          {
            blockType: 'help',
            subtitle: 'About Us',
            title: 'Helping Each Other Can Make <span>World</span> Better',
            description: 'We believe that by working together, we can create opportunities for growth and build stronger communities. Our programs focus on education, nutrition, and healthcare.',
            features: [
              {
                icon: 'icon-make-donation',
                title: 'Start Helping Today',
                description: 'Join our cause and help us raise awareness about the needs in our communities.',
              },
              {
                icon: 'icon-support-heart',
                title: 'Make Donations',
                description: 'Your generous contributions support our programs and change lives.',
              },
            ],
            checkmarks: [
              { text: 'Community-driven programs for education and growth' },
              { text: 'We give children the gift of education and hope' },
              { text: 'Empowering families through sustainable support' },
            ],
            ctaText: 'More About Us',
            ctaLink: '/quienes-somos',
            phone: '+1 (809) 555-0123',
          },
          {
            blockType: 'testimonial',
            subtitle: 'Testimonials',
            title: 'What People <span>Say</span> About Us',
            testimonials: [
              {
                rating: 5,
                quote: 'This foundation has truly changed lives in our community. Their dedication to education and helping families is remarkable and inspiring.',
                authorName: 'María García',
                authorTitle: 'Community Member',
              },
              {
                rating: 5,
                quote: 'The programs they offer are making a real difference for children and families. I am proud to be part of this incredible organization.',
                authorName: 'Juan Pérez',
                authorTitle: 'Volunteer',
              },
              {
                rating: 5,
                quote: 'I am grateful for the support and opportunities this organization has provided to my family. They truly care about every person they serve.',
                authorName: 'Ana Rodríguez',
                authorTitle: 'Beneficiary',
              },
              {
                rating: 5,
                quote: 'Their commitment to transparency and impact is what sets them apart. Every dollar donated goes directly to making a difference.',
                authorName: 'Carlos Martínez',
                authorTitle: 'Donor',
              },
            ],
          },
          {
            blockType: 'blogPreview',
            subtitle: 'Latest Updates',
            title: 'Our Latest <span>News</span> & Articles',
          },
        ],
      },
    })
    // Now update home page with ES translations
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

      // Hero ES
      if (heroBlock) {
        esLayout.push({
          id: heroBlock.id,
          blockType: 'heroSlider',
          slides: heroBlock.slides?.map((s: any, i: number) => ({
            id: s.id,
            subtitle: ['Bienvenidos A Nuestra Fundación', 'Haciendo La Diferencia'][i],
            title: ['Brindando Ayuda <br>A Quienes Más Lo <span>Necesitan</span>.', 'Juntos Podemos <br>Cambiar <span>Vidas</span> Para Siempre.'][i],
            ctaPrimaryText: ['Descubre Más', 'Nuestras Actividades'][i],
            ctaPrimaryLink: s.ctaPrimaryLink,
            ctaSecondaryText: ['Contáctanos', 'Donar Ahora'][i],
            ctaSecondaryLink: s.ctaSecondaryLink,
          })),
        })
      }

      // Difference ES
      if (diffBlock) {
        const esDiffItems = ['Apoyo Educativo', 'Programas de Nutrición', 'Acceso a Salud']
        const esDiffDescs = [
          'Brindando educación de calidad y útiles escolares a niños en comunidades vulnerables.',
          'Asegurando que las familias tengan acceso a comidas saludables y educación nutricional.',
          'Conectando comunidades con servicios médicos, cuidado preventivo y educación en salud.',
        ]
        esLayout.push({
          id: diffBlock.id,
          blockType: 'difference',
          subtitle: 'Nuestros Programas',
          title: 'Caridad Con Diferencia',
          description: 'Ofrecemos programas de educación, nutrición y salud para quienes más lo necesitan. Únete a nuestra misión para crear un cambio duradero.',
          items: diffBlock.items?.map((item: any, i: number) => ({
            id: item.id,
            icon: item.icon,
            title: esDiffItems[i],
            description: esDiffDescs[i],
          })),
        })
      }

      // Help ES
      if (helpBlock) {
        esLayout.push({
          id: helpBlock.id,
          blockType: 'help',
          subtitle: 'Sobre Nosotros',
          title: 'Ayudarnos Mutuamente Puede Hacer El <span>Mundo</span> Mejor',
          description: 'Creemos que trabajando juntos podemos crear oportunidades de crecimiento y construir comunidades más fuertes. Nuestros programas se enfocan en educación, nutrición y salud.',
          features: helpBlock.features?.map((f: any, i: number) => ({
            id: f.id,
            icon: f.icon,
            title: ['Comienza a Ayudar Hoy', 'Haz una Donación'][i],
            description: [
              'Únete a nuestra causa y ayúdanos a concientizar sobre las necesidades en nuestras comunidades.',
              'Tus generosas contribuciones apoyan nuestros programas y cambian vidas.',
            ][i],
          })),
          checkmarks: helpBlock.checkmarks?.map((c: any, i: number) => ({
            id: c.id,
            text: [
              'Programas comunitarios para educación y crecimiento',
              'Damos a los niños el regalo de la educación y la esperanza',
              'Empoderando familias a través de apoyo sostenible',
            ][i],
          })),
          ctaText: 'Más Sobre Nosotros',
          ctaLink: helpBlock.ctaLink,
          phone: helpBlock.phone,
        })
      }

      // Testimonial ES
      if (testBlock) {
        const esQuotes = [
          'Esta fundación ha cambiado verdaderamente vidas en nuestra comunidad. Su dedicación a la educación y ayuda a las familias es notable e inspiradora.',
          'Los programas que ofrecen están haciendo una diferencia real para niños y familias. Me enorgullece ser parte de esta increíble organización.',
          'Estoy agradecida por el apoyo y las oportunidades que esta organización ha brindado a mi familia. Realmente se preocupan por cada persona que atienden.',
          'Su compromiso con la transparencia y el impacto es lo que los distingue. Cada dólar donado va directamente a hacer la diferencia.',
        ]
        const esTitles = ['Miembro de la Comunidad', 'Voluntario', 'Beneficiaria', 'Donante']
        esLayout.push({
          id: testBlock.id,
          blockType: 'testimonial',
          subtitle: 'Testimonios',
          title: 'Lo Que La Gente <span>Dice</span> Sobre Nosotros',
          testimonials: testBlock.testimonials?.map((t: any, i: number) => ({
            id: t.id,
            rating: t.rating,
            quote: esQuotes[i],
            authorName: t.authorName,
            authorTitle: esTitles[i],
          })),
        })
      }

      // BlogPreview ES
      if (blogBlock) {
        esLayout.push({
          id: blogBlock.id,
          blockType: 'blogPreview',
          subtitle: 'Últimas Actualizaciones',
          title: 'Nuestras Últimas <span>Noticias</span> y Artículos',
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

    // ─── 7. News articles (EN + ES) ─────────────────────────────
    // Delete existing news first for clean re-seed
    const existingNews = await payload.find({ collection: 'news', limit: 10 })
    for (const doc of existingNews.docs) {
      await payload.delete({ collection: 'news', id: doc.id })
    }

    const newsEN = [
      {
        title: 'Education Program Reaches 500 Children This Year',
        slug: 'education-program-500-children',
        date: '2025-01-15',
        excerpt: 'Our education support program has reached a milestone of 500 children enrolled this year, providing them with school supplies, tutoring, and mentorship.',
        published: true,
      },
      {
        title: 'Community Health Fair a Great Success',
        slug: 'community-health-fair-success',
        date: '2025-01-08',
        excerpt: 'Over 200 families attended our annual Community Health Fair, receiving free health screenings, nutrition counseling, and wellness resources.',
        published: true,
      },
      {
        title: 'New Partnership with Local Schools Announced',
        slug: 'partnership-local-schools',
        date: '2024-12-20',
        excerpt: 'We are excited to announce new partnerships with three local schools to expand our after-school tutoring and mentorship programs.',
        published: true,
      },
    ]
    const newsES = [
      { title: 'Programa Educativo Alcanza 500 Niños Este Año', excerpt: 'Nuestro programa de apoyo educativo ha alcanzado la meta de 500 niños inscritos este año, brindándoles útiles escolares, tutorías y mentoría.' },
      { title: 'Feria de Salud Comunitaria un Gran Éxito', excerpt: 'Más de 200 familias asistieron a nuestra Feria de Salud Comunitaria anual, recibiendo exámenes de salud gratuitos, asesoría nutricional y recursos de bienestar.' },
      { title: 'Anuncian Nueva Alianza con Escuelas Locales', excerpt: 'Estamos emocionados de anunciar nuevas alianzas con tres escuelas locales para expandir nuestros programas de tutoría y mentoría después de clases.' },
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

    // ─── 8. Activities (EN + ES) ────────────────────────────────
    const existingActivities = await payload.find({ collection: 'activities', limit: 10 })
    for (const doc of existingActivities.docs) {
      await payload.delete({ collection: 'activities', id: doc.id })
    }

    const activitiesEN = [
      { name: 'After-School Tutoring Program', slug: 'after-school-tutoring', date: '2025-02-01', location: 'Santo Domingo Community Center', published: true },
      { name: 'Monthly Nutrition Workshop', slug: 'monthly-nutrition-workshop', date: '2025-02-15', location: "Grandmother's House Main Hall", published: true },
      { name: 'Annual Fundraising Gala', slug: 'annual-fundraising-gala', date: '2025-03-20', location: 'Hotel Santo Domingo', published: true },
    ]
    const activitiesES = [
      { name: 'Programa de Tutoría Después de Clases' },
      { name: 'Taller de Nutrición Mensual' },
      { name: 'Gala Anual de Recaudación de Fondos' },
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

    // ─── 9. About, Mission, Vision pages ─────────────────────
    const innerPages = [
      {
        slug: 'about',
        enTitle: 'About Us',
        esTitle: 'Quiénes Somos',
        enBlocks: [
          {
            blockType: 'textSection',
            subtitle: 'Who We Are',
            heading: "About Fundación <span>Grandmother's House</span>",
            body: "Fundación Grandmother's House is a non-profit organization dedicated to making a lasting difference in the lives of those who need it most. Founded with the vision of building stronger communities, we focus on three core pillars: education, nutrition, and healthcare.\n\nOur programs serve hundreds of families across the Dominican Republic, providing children with school supplies and tutoring, families with access to nutritious meals, and communities with preventive healthcare services.\n\nWe believe that every person deserves the opportunity to thrive, and we work tirelessly to create that opportunity through compassion, dedication, and community-driven programs.",
            imagePosition: 'left',
            ctaText: 'Contact Us',
            ctaLink: '/contacto',
          },
          {
            blockType: 'ctaBanner',
            title: 'Together We Can Make A <span>Difference</span>',
            description: 'Join us in our mission to empower communities and transform lives. Whether through donations, volunteering, or spreading awareness, every action counts.',
            primaryButtonText: 'Discover More',
            primaryButtonLink: '/actividades',
            secondaryButtonText: 'Contact Us',
            secondaryButtonLink: '/contacto',
          },
        ],
        esBlocks: [
          {
            blockType: 'textSection',
            subtitle: 'Quiénes Somos',
            heading: 'Sobre Fundación <span>Grandmother\'s House</span>',
            body: "La Fundación Grandmother's House es una organización sin fines de lucro dedicada a hacer una diferencia duradera en la vida de quienes más lo necesitan. Fundada con la visión de construir comunidades más fuertes, nos enfocamos en tres pilares fundamentales: educación, nutrición y salud.\n\nNuestros programas atienden a cientos de familias en toda la República Dominicana, brindando a los niños útiles escolares y tutorías, a las familias acceso a comidas nutritivas, y a las comunidades servicios de salud preventiva.\n\nCreemos que cada persona merece la oportunidad de prosperar, y trabajamos incansablemente para crear esa oportunidad a través de la compasión, la dedicación y los programas comunitarios.",
            imagePosition: 'left',
            ctaText: 'Contáctanos',
            ctaLink: '/contacto',
          },
          {
            blockType: 'ctaBanner',
            title: 'Juntos Podemos Hacer La <span>Diferencia</span>',
            description: 'Únete a nuestra misión de empoderar comunidades y transformar vidas. Ya sea a través de donaciones, voluntariado o concientización, cada acción cuenta.',
            primaryButtonText: 'Descubre Más',
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
            subtitle: 'Our Mission',
            heading: 'Our <span>Mission</span>',
            body: "Our mission is to empower underserved communities in the Dominican Republic by providing access to quality education, proper nutrition, and essential healthcare services.\n\nWe are committed to creating sustainable programs that address the root causes of poverty and inequality, giving every individual the tools they need to build a better future for themselves and their families.\n\nThrough collaboration with local leaders, schools, and healthcare providers, we ensure our programs are deeply rooted in the communities we serve and responsive to their unique needs.",
            imagePosition: 'none',
          },
        ],
        esBlocks: [
          {
            blockType: 'textSection',
            subtitle: 'Nuestra Misión',
            heading: 'Nuestra <span>Misión</span>',
            body: "Nuestra misión es empoderar a las comunidades vulnerables de la República Dominicana brindando acceso a educación de calidad, nutrición adecuada y servicios de salud esenciales.\n\nEstamos comprometidos con la creación de programas sostenibles que aborden las causas fundamentales de la pobreza y la desigualdad, dando a cada individuo las herramientas que necesita para construir un mejor futuro para sí mismo y su familia.\n\nA través de la colaboración con líderes locales, escuelas y proveedores de salud, nos aseguramos de que nuestros programas estén profundamente arraigados en las comunidades que servimos y respondan a sus necesidades únicas.",
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
            subtitle: 'Our Vision',
            heading: 'Our <span>Vision</span>',
            body: "We envision a world where every child has access to quality education, every family can put nutritious food on the table, and every community has the healthcare resources it needs to thrive.\n\nFundación Grandmother's House aspires to be a catalyst for lasting social change in the Dominican Republic and beyond, building bridges between those who want to help and those who need support.\n\nOur vision is a future where compassion drives action, where communities are self-sustaining, and where the cycle of poverty is broken through education, health, and empowerment.",
            imagePosition: 'none',
          },
        ],
        esBlocks: [
          {
            blockType: 'textSection',
            subtitle: 'Nuestra Visión',
            heading: 'Nuestra <span>Visión</span>',
            body: "Visualizamos un mundo donde cada niño tenga acceso a educación de calidad, cada familia pueda poner comida nutritiva en la mesa, y cada comunidad cuente con los recursos de salud que necesita para prosperar.\n\nLa Fundación Grandmother's House aspira a ser un catalizador de cambio social duradero en la República Dominicana y más allá, construyendo puentes entre quienes quieren ayudar y quienes necesitan apoyo.\n\nNuestra visión es un futuro donde la compasión impulse la acción, donde las comunidades sean autosuficientes y donde el ciclo de la pobreza se rompa a través de la educación, la salud y el empoderamiento.",
            imagePosition: 'none',
          },
        ],
      },
    ]

    for (const pg of innerPages) {
      // Delete if exists
      const existing = await payload.find({
        collection: 'pages',
        where: { slug: { equals: pg.slug } },
        limit: 1,
      })
      if (existing.docs.length > 0) {
        await payload.delete({ collection: 'pages', id: existing.docs[0].id })
      }

      // Create EN
      const created = await payload.create({
        collection: 'pages',
        locale: 'en',
        data: {
          title: pg.enTitle,
          slug: pg.slug,
          layout: pg.enBlocks,
        },
      })

      // Fetch to get block IDs
      const saved = await payload.findByID({
        collection: 'pages',
        id: created.id,
        locale: 'en',
      })
      const savedBlocks = (saved.layout as any[]) || []

      // Build ES layout with same IDs
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
    results.push('About, Mission, Vision pages seeded (EN + ES).')

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
