import * as dotenv from 'dotenv'
import path from 'path'

// Load .env before anything else
dotenv.config({ path: path.resolve(__dirname, '../.env') })

import { getPayload } from 'payload'
import config from './payload.config'

async function seed() {
  const payload = await getPayload({ config })

  console.log('🌱 Starting seed...\n')

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
    console.log('✅ Admin user created: admin@grandmothershouse.org / Admin123!')
  } else {
    console.log('⏭️  Admin user already exists.')
  }

  // ─── 2. Header global (EN + ES) ──────────────────────────
  console.log('📝 Seeding Header...')
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
  await payload.updateGlobal({
    slug: 'header',
    data: {
      donateButtonText: 'Donar Ahora',
      navigation: [
        { label: 'Inicio', link: '/' },
        {
          label: 'Quiénes Somos',
          link: '/quienes-somos',
          children: [
            { label: 'Misión', link: '/quienes-somos/mision' },
            { label: 'Visión', link: '/quienes-somos/vision' },
          ],
        },
        { label: 'Actividades', link: '/actividades' },
        { label: 'Noticias', link: '/noticias' },
        { label: 'Contacto', link: '/contacto' },
      ],
    },
    locale: 'es',
  })
  console.log('✅ Header seeded.')

  // ─── 3. Footer global (EN + ES) ──────────────────────────
  console.log('📝 Seeding Footer...')
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
        { label: 'Volunteer Opportunities', link: '/contacto' },
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
  await payload.updateGlobal({
    slug: 'footer',
    data: {
      description: 'La Fundación Grandmother\'s House se dedica a hacer una diferencia en la vida de quienes más lo necesitan a través de educación, nutrición y apoyo comunitario.',
      quickLinks: [
        { label: 'Quiénes Somos', link: '/quienes-somos' },
        { label: 'Noticias', link: '/noticias' },
        { label: 'Actividades', link: '/actividades' },
        { label: 'Contacto', link: '/contacto' },
        { label: 'Donar', link: '#' },
      ],
      services: [
        { label: 'Apoyo Educativo', link: '/actividades' },
        { label: 'Programas de Nutrición', link: '/actividades' },
        { label: 'Acceso a Salud', link: '/actividades' },
        { label: 'Programas Comunitarios', link: '/actividades' },
        { label: 'Oportunidades de Voluntariado', link: '/contacto' },
      ],
      contactInfo: {
        address: 'Santo Domingo, República Dominicana',
      },
      copyrightText: "Copyright © 2025 Fundación Grandmother's House. Todos los derechos reservados.",
      legalLinks: [
        { label: 'Términos y Condiciones', link: '#' },
        { label: 'Política de Privacidad', link: '#' },
      ],
    },
    locale: 'es',
  })
  console.log('✅ Footer seeded.')

  // ─── 4. Donation Settings (EN + ES) ──────────────────────
  console.log('📝 Seeding Donation Settings...')
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
      zelle: { enabled: true, email: 'donate@grandmothershouse.org' },
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
  console.log('✅ Donation Settings seeded.')

  // ─── 5. Site Settings ─────────────────────────────────────
  console.log('📝 Seeding Site Settings...')
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
  console.log('✅ Site Settings seeded.')

  // ─── 6. Home page with blocks ─────────────────────────────
  console.log('📝 Seeding Home page...')

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
              subtitle: 'Welcome to our Foundation',
              title: 'Giving Help <br>To Those Who <span>Need</span> It.',
              ctaPrimaryText: 'Discover More',
              ctaPrimaryLink: '/quienes-somos',
              ctaSecondaryText: 'Contact Us',
              ctaSecondaryLink: '/contacto',
            },
            {
              subtitle: 'Making a difference',
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
          subtitle: 'About us',
          title: 'Helping Each Other Can Make <span>World</span> Better',
          description: 'We believe that by working together, we can create opportunities for growth and build stronger communities. Our programs focus on education, nutrition, and healthcare to make a lasting impact.',
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
  console.log('✅ Home page seeded.')

  // ─── 7. News articles ─────────────────────────────────────
  console.log('📝 Seeding News articles...')
  const existingNews = await payload.find({ collection: 'news', limit: 1 })
  if (existingNews.docs.length === 0) {
    const newsData = [
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

    for (const article of newsData) {
      await payload.create({
        collection: 'news',
        locale: 'en',
        data: article as any,
      })
    }
    console.log('✅ News articles seeded (3 articles).')
  } else {
    console.log('⏭️  News articles already exist.')
  }

  // ─── 8. Activities ────────────────────────────────────────
  console.log('📝 Seeding Activities...')
  const existingActivities = await payload.find({ collection: 'activities', limit: 1 })
  if (existingActivities.docs.length === 0) {
    const activities = [
      {
        name: 'After-School Tutoring Program',
        slug: 'after-school-tutoring',
        date: '2025-02-01',
        location: 'Santo Domingo Community Center',
        published: true,
      },
      {
        name: 'Monthly Nutrition Workshop',
        slug: 'monthly-nutrition-workshop',
        date: '2025-02-15',
        location: 'Grandmother\'s House Main Hall',
        published: true,
      },
      {
        name: 'Annual Fundraising Gala',
        slug: 'annual-fundraising-gala',
        date: '2025-03-20',
        location: 'Hotel Santo Domingo',
        published: true,
      },
    ]

    for (const activity of activities) {
      await payload.create({
        collection: 'activities',
        locale: 'en',
        data: activity as any,
      })
    }
    console.log('✅ Activities seeded (3 activities).')
  } else {
    console.log('⏭️  Activities already exist.')
  }

  console.log('\n🎉 Seed complete! Your site is ready.')
  console.log('📋 Admin login: admin@grandmothershouse.org / Admin123!')
  console.log('🌐 Visit http://localhost:3000 to see the site')
  console.log('🔧 Visit http://localhost:3000/admin to manage content\n')

  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
