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
    await payload.updateGlobal({
      slug: 'header',
      data: {
        email: 'info@grandmothershouse.org',
        phone: '+1 (809) 555-0123',
        donateButtonText: 'Donate now',
        socialLinks: [
          { platform: 'facebook', url: 'https://facebook.com/grandmothershouse', label: 'Facebook' },
          { platform: 'instagram', url: 'https://instagram.com/grandmothershouse', label: 'Instagram' },
        ],
        navigation: [
          { label: 'Home', link: '/' },
          {
            label: 'About us',
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
      const esLabels = ['Inicio', 'Quiénes somos', 'Actividades', 'Noticias', 'Contacto']
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
          donateButtonText: 'Donar ahora',
          navigation: esNav,
        },
        locale: 'es',
      })
    }
    results.push('Header seeded (EN + ES).')

    // ─── 4. Footer global (EN first, then ES labels) ──────────────────────────
    await payload.updateGlobal({
      slug: 'footer',
      data: {
        quickLinksTitle: 'Quick links',
        servicesTitle: 'Our services',
        contactTitle: 'Get in touch',
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Fundación Grandmother's House se dedica a crear un impacto positivo.",
        socialLinks: [
          { platform: 'facebook', url: 'https://facebook.com/grandmothershouse', label: 'Facebook' },
          { platform: 'instagram', url: 'https://instagram.com/grandmothershouse', label: 'Instagram' },
        ],
        quickLinks: [
          { label: 'About us', link: '/quienes-somos' },
          { label: 'Our news', link: '/noticias' },
          { label: 'Activities', link: '/actividades' },
          { label: 'Contact', link: '/contacto' },
          { label: 'Donate', link: '#' },
        ],
        services: [
          { label: 'Education support', link: '/actividades' },
          { label: 'Nutrition programs', link: '/actividades' },
          { label: 'Healthcare access', link: '/actividades' },
          { label: 'Community programs', link: '/actividades' },
          { label: 'Volunteer', link: '/contacto' },
        ],
        contactInfo: {
          address: 'Santo Domingo, Dominican Republic',
          addressLink: 'https://maps.google.com',
          phone: '+1 (809) 555-0123',
          email: 'info@grandmothershouse.org',
        },
        copyrightText: "Copyright © 2026 Fundación Grandmother's House. All rights reserved.",
        legalLinks: [
          { label: 'Terms and conditions', link: '/terminos-y-condiciones' },
          { label: 'Privacy policy', link: '/terminos-y-condiciones' },
        ],
      },
      locale: 'en',
    })

    // Fetch saved footer to get array item IDs, then update ES labels
    const savedFooter = await payload.findGlobal({ slug: 'footer', locale: 'en' })
    const qlItems = savedFooter.quickLinks as any[]
    const svcItems = savedFooter.services as any[]
    const llItems = savedFooter.legalLinks as any[]

    const esQL = ['Quiénes somos', 'Noticias', 'Actividades', 'Contacto', 'Donar']
    const esSvc = ['Apoyo educativo', 'Programas de nutrición', 'Acceso a salud', 'Programas comunitarios', 'Voluntariado']
    const esLL = ['Términos y condiciones', 'Política de privacidad']

    await payload.updateGlobal({
      slug: 'footer',
      data: {
        quickLinksTitle: 'Enlaces rápidos',
        servicesTitle: 'Nuestros servicios',
        contactTitle: 'Contáctanos',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Fundación Grandmother\'s House se dedica a crear un impacto positivo.',
        quickLinks: qlItems?.map((item: any, i: number) => ({ id: item.id, label: esQL[i], link: item.link })),
        services: svcItems?.map((item: any, i: number) => ({ id: item.id, label: esSvc[i], link: item.link })),
        contactInfo: { address: 'Santo Domingo, República Dominicana' },
        copyrightText: "Copyright © 2026 Fundación Grandmother's House. Todos los derechos reservados.",
        legalLinks: llItems?.map((item: any, i: number) => ({ id: item.id, label: esLL[i], link: item.link })),
      },
      locale: 'es',
    })
    results.push('Footer seeded (EN + ES).')

    // ─── 5. Donation Settings (EN + ES) ──────────────────────
    await payload.updateGlobal({
      slug: 'donation-settings',
      data: {
        modalTitle: 'Make a donation',
        modalDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Choose your preferred donation method below. Every contribution makes a difference.',
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
        modalTitle: 'Hacer una donación',
        modalDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Elige tu método de donación preferido. Cada contribución marca la diferencia.',
      },
      locale: 'es',
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
                subtitle: 'Welcome to our foundation',
                title: 'Giving help <br>to those who <span>need</span> it.',
                ctaPrimaryText: 'Discover more',
                ctaPrimaryLink: '/quienes-somos',
                ctaSecondaryText: 'Contact us',
                ctaSecondaryLink: '/contacto',
              },
              {
                subtitle: 'Making a difference',
                title: 'Together we can <br>change <span>lives</span> forever.',
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
            title: 'Charity with difference',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
            items: [
              {
                icon: 'icon-education',
                title: 'Education support',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
              },
              {
                icon: 'icon-food',
                title: 'Nutrition programs',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.',
              },
              {
                icon: 'icon-health',
                title: 'Healthcare access',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.',
              },
            ],
          },
          {
            blockType: 'help',
            subtitle: 'About us',
            title: 'Helping each other can make <span>world</span> better',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
            features: [
              {
                icon: 'icon-make-donation',
                title: 'Start helping today',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.',
              },
              {
                icon: 'icon-support-heart',
                title: 'Make donations',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit.',
              },
            ],
            checkmarks: [
              { text: 'Community-driven programs for education and growth' },
              { text: 'We give children the gift of education and hope' },
              { text: 'Empowering families through sustainable support' },
            ],
            ctaText: 'More about us',
            ctaLink: '/quienes-somos',
            phone: '+1 (809) 555-0123',
          },
          {
            blockType: 'testimonial',
            subtitle: 'Testimonials',
            title: 'What people <span>say</span> about us',
            testimonials: [
              {
                rating: 5,
                quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
                authorName: 'María García',
                authorTitle: 'Community member',
              },
              {
                rating: 5,
                quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla.',
                authorName: 'Juan Pérez',
                authorTitle: 'Volunteer',
              },
              {
                rating: 5,
                quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.',
                authorName: 'Ana Rodríguez',
                authorTitle: 'Beneficiary',
              },
              {
                rating: 5,
                quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.',
                authorName: 'Carlos Martínez',
                authorTitle: 'Donor',
              },
            ],
          },
          {
            blockType: 'blogPreview',
            subtitle: 'Latest updates',
            title: 'Our latest <span>news</span> & articles',
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
            subtitle: ['Bienvenidos a nuestra fundación', 'Haciendo la diferencia'][i],
            title: ['Brindando ayuda <br>a quienes más lo <span>necesitan</span>.', 'Juntos podemos <br>cambiar <span>vidas</span> para siempre.'][i],
            ctaPrimaryText: ['Descubre más', 'Nuestras actividades'][i],
            ctaPrimaryLink: s.ctaPrimaryLink,
            ctaSecondaryText: ['Contáctanos', 'Donar ahora'][i],
            ctaSecondaryLink: s.ctaSecondaryLink,
          })),
        })
      }

      // Difference ES
      if (diffBlock) {
        const esDiffItems = ['Apoyo educativo', 'Programas de nutrición', 'Acceso a salud']
        const esDiffDescs = [
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.',
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.',
        ]
        esLayout.push({
          id: diffBlock.id,
          blockType: 'difference',
          subtitle: 'Nuestros programas',
          title: 'Caridad con diferencia',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
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
          subtitle: 'Sobre nosotros',
          title: 'Ayudarnos mutuamente puede hacer el <span>mundo</span> mejor',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
          features: helpBlock.features?.map((f: any, i: number) => ({
            id: f.id,
            icon: f.icon,
            title: ['Comienza a ayudar hoy', 'Haz una donación'][i],
            description: [
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.',
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit.',
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
          ctaText: 'Más sobre nosotros',
          ctaLink: helpBlock.ctaLink,
          phone: helpBlock.phone,
        })
      }

      // Testimonial ES
      if (testBlock) {
        const esQuotes = [
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla.',
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.',
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.',
        ]
        const esTitles = ['Miembro de la comunidad', 'Voluntario', 'Beneficiaria', 'Donante']
        esLayout.push({
          id: testBlock.id,
          blockType: 'testimonial',
          subtitle: 'Testimonios',
          title: 'Lo que la gente <span>dice</span> sobre nosotros',
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
          subtitle: 'Últimas actualizaciones',
          title: 'Nuestras últimas <span>noticias</span> y artículos',
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
    // Delete existing news first for clean re-seed
    const existingNews = await payload.find({ collection: 'news', limit: 10 })
    for (const doc of existingNews.docs) {
      await payload.delete({ collection: 'news', id: doc.id })
    }

    const newsEN = [
      {
        title: 'Education program reaches 500 children this year',
        slug: 'education-program-500-children',
        date: '2025-01-15',
        excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
        published: true,
      },
      {
        title: 'Community health fair a great success',
        slug: 'community-health-fair-success',
        date: '2025-01-08',
        excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        published: true,
      },
      {
        title: 'New partnership with local schools announced',
        slug: 'partnership-local-schools',
        date: '2024-12-20',
        excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        published: true,
      },
    ]
    const newsES = [
      { title: 'Programa educativo alcanza 500 niños este año', excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.' },
      { title: 'Feria de salud comunitaria un gran éxito', excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' },
      { title: 'Anuncian nueva alianza con escuelas locales', excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
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
      { name: 'After-school tutoring program', slug: 'after-school-tutoring', date: '2025-02-01', location: 'Santo Domingo Community Center', published: true },
      { name: 'Monthly nutrition workshop', slug: 'monthly-nutrition-workshop', date: '2025-02-15', location: "Grandmother's House Main Hall", published: true },
      { name: 'Annual fundraising gala', slug: 'annual-fundraising-gala', date: '2025-03-20', location: 'Hotel Santo Domingo', published: true },
    ]
    const activitiesES = [
      { name: 'Programa de tutoría después de clases' },
      { name: 'Taller de nutrición mensual' },
      { name: 'Gala anual de recaudación de fondos' },
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

    // ─── 10. About, Mission, Vision pages ─────────────────────
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
            body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
            imagePosition: 'left',
            ctaText: 'Contact us',
            ctaLink: '/contacto',
          },
          {
            blockType: 'ctaBanner',
            title: 'Together we can make a <span>difference</span>',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
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
            body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
            imagePosition: 'left',
            ctaText: 'Contáctanos',
            ctaLink: '/contacto',
          },
          {
            blockType: 'ctaBanner',
            title: 'Juntos podemos hacer la <span>diferencia</span>',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
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
            heading: 'Our <span>mission</span>',
            body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nNemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
            imagePosition: 'none',
          },
        ],
        esBlocks: [
          {
            blockType: 'textSection',
            subtitle: 'Nuestra misión',
            heading: 'Nuestra <span>misión</span>',
            body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nNemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
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
            heading: 'Our <span>vision</span>',
            body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nAt vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi.",
            imagePosition: 'none',
          },
        ],
        esBlocks: [
          {
            blockType: 'textSection',
            subtitle: 'Nuestra visión',
            heading: 'Nuestra <span>visión</span>',
            body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nAt vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi.",
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
            heading: 'Terms and <span>conditions</span>',
            body: "1. General information\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\n2. Use of the website\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\n3. Intellectual property\n\nSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.\n\n4. Donations and payments\n\nNemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.\n\n5. Privacy and data protection\n\nAt vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.\n\n6. Limitation of liability\n\nSimilique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.\n\n7. Modifications\n\nFundación Grandmother's House reserves the right to modify these terms and conditions at any time. Changes will be effective upon publication on this website.\n\n8. Contact\n\nFor questions about these terms, please contact us at info@grandmothershouse.org.",
            imagePosition: 'none',
          },
        ],
        esBlocks: [
          {
            blockType: 'textSection',
            subtitle: 'Legal',
            heading: 'Términos y <span>condiciones</span>',
            body: "1. Información general\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\n2. Uso del sitio web\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\n3. Propiedad intelectual\n\nSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.\n\n4. Donaciones y pagos\n\nNemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.\n\n5. Privacidad y protección de datos\n\nAt vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.\n\n6. Limitación de responsabilidad\n\nSimilique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.\n\n7. Modificaciones\n\nFundación Grandmother's House se reserva el derecho de modificar estos términos y condiciones en cualquier momento. Los cambios serán efectivos al momento de su publicación en este sitio web.\n\n8. Contacto\n\nPara preguntas sobre estos términos, contáctanos en info@grandmothershouse.org.",
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
