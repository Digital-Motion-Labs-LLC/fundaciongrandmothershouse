import * as dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

// Load .env before anything else
dotenv.config({ path: path.resolve(__dirname, '../.env') })

import { getPayload } from 'payload'
import config from './payload.config'

async function uploadImage(payload: any, filePath: string, alt: string, altEs?: string) {
  const absolutePath = path.resolve(__dirname, filePath)
  if (!fs.existsSync(absolutePath)) {
    console.log(`⚠️  Image not found: ${absolutePath}`)
    return null
  }
  const data = fs.readFileSync(absolutePath)
  const fileName = path.basename(absolutePath)
  const media = await payload.create({
    collection: 'media',
    data: { alt },
    locale: 'en',
    file: {
      data,
      mimetype: 'image/jpeg',
      name: fileName,
      size: data.length,
    },
  })
  if (altEs) {
    await payload.update({
      collection: 'media',
      id: media.id,
      locale: 'es',
      data: { alt: altEs },
    })
  }
  return media
}

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

  // ─── 2. Upload images to R2 ────────────────────────────────
  console.log('📸 Uploading images to R2...')
  const eventPhotos: any[] = []
  for (let i = 1; i <= 18; i++) {
    const photo = await uploadImage(
      payload,
      `../public/redesign-photos/evento-juguetes-${i}.jpeg`,
      `Toy delivery event - Photo ${i}`,
      `Entrega de juguetes - Foto ${i}`,
    )
    if (photo) eventPhotos.push(photo)
  }
  console.log(`✅ ${eventPhotos.length} event photos uploaded.`)

  // Use first few photos for hero, about, etc.
  const heroImage1 = eventPhotos[6] || null  // Group photo
  const heroImage2 = eventPhotos[11] || null // Another good one
  const aboutImage = eventPhotos[9] || null
  const featuredEventImage = eventPhotos[0] || null

  // ─── 3. Header global (EN + ES) ──────────────────────────
  console.log('📝 Seeding Header...')
  await payload.updateGlobal({
    slug: 'header',
    data: {
      email: 'grandmothershousedaycare@gmail.com',
      phone: '809-655-0290',
      donateButtonText: 'Donate Now',
      socialLinks: [
        { platform: 'instagram', url: 'https://www.instagram.com/fundaciongrandmothershouse', label: 'Instagram' },
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

  // ─── 4. Footer global (EN + ES) ──────────────────────────
  console.log('📝 Seeding Footer...')
  await payload.updateGlobal({
    slug: 'footer',
    data: {
      description: "Fundación Grandmother's House is dedicated to providing a safe, stimulating, and loving environment where every child can develop fully. Through education, play, and community support, we strive to be the light for those in darkness.",
      socialLinks: [
        { platform: 'instagram', url: 'https://www.instagram.com/fundaciongrandmothershouse', label: 'Instagram' },
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
        { label: 'Child Care', link: '/actividades' },
        { label: 'Community Programs', link: '/actividades' },
        { label: 'Toy Drives', link: '/actividades' },
        { label: 'Volunteer Opportunities', link: '/contacto' },
      ],
      contactInfo: {
        address: 'Vía Boulevard Juan Dolio, John Hazim Subero, Calle el Tanque, SPM, RD',
        addressLink: 'https://maps.google.com/?q=Juan+Dolio+San+Pedro+de+Macoris+RD',
        phone: '809-655-0290',
        email: 'grandmothershousedaycare@gmail.com',
      },
      copyrightText: "Copyright © 2026 Fundación Grandmother's House. All rights reserved. RNC: 430-43228-8",
      legalLinks: [
        { label: 'Terms & Conditions', link: '/terminos-y-condiciones' },
        { label: 'Privacy Policy', link: '#' },
      ],
    },
    locale: 'en',
  })
  await payload.updateGlobal({
    slug: 'footer',
    data: {
      description: 'La Fundación Grandmother\'s House se dedica a proporcionar un entorno seguro, estimulante y cariñoso donde cada niño pueda desarrollarse plenamente. A través de educación, juego y apoyo comunitario, nos esforzamos por ser la luz para aquellos que están en la oscuridad.',
      quickLinks: [
        { label: 'Quiénes Somos', link: '/quienes-somos' },
        { label: 'Noticias', link: '/noticias' },
        { label: 'Actividades', link: '/actividades' },
        { label: 'Contacto', link: '/contacto' },
        { label: 'Donar', link: '#' },
      ],
      services: [
        { label: 'Apoyo Educativo', link: '/actividades' },
        { label: 'Cuidado Infantil', link: '/actividades' },
        { label: 'Programas Comunitarios', link: '/actividades' },
        { label: 'Entrega de Juguetes', link: '/actividades' },
        { label: 'Oportunidades de Voluntariado', link: '/contacto' },
      ],
      contactInfo: {
        address: 'Vía Boulevard Juan Dolio, John Hazim Subero, Calle el Tanque, SPM, RD',
      },
      copyrightText: "Copyright © 2026 Fundación Grandmother's House. Todos los derechos reservados. RNC: 430-43228-8",
      legalLinks: [
        { label: 'Términos y Condiciones', link: '/terminos-y-condiciones' },
        { label: 'Política de Privacidad', link: '#' },
      ],
    },
    locale: 'es',
  })
  console.log('✅ Footer seeded.')

  // ─── 5. Donation Settings (EN + ES) ──────────────────────
  console.log('📝 Seeding Donation Settings...')
  await payload.updateGlobal({
    slug: 'donation-settings',
    data: {
      modalTitle: 'Make a Donation',
      modalDescription: 'Choose your preferred donation method below. Every contribution makes a difference in the lives of those who need it most.',
      paypal: { enabled: true, link: 'https://paypal.me/grandmothershouse' },
      bankTransfer: {
        enabled: true,
        bankName: 'Banreservas',
        accountNumber: '9609143691',
        accountType: 'Checking',
        accountHolder: 'Elizabeth González Hilario - Céd. 023-0140481-6',
      },
      zelle: { enabled: true, email: 'grandmothershousedaycare@gmail.com' },
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

  // ─── 6. Site Settings ─────────────────────────────────────
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

  // ─── 7. Home page with blocks ─────────────────────────────
  console.log('📝 Seeding Home page...')

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
              subtitle: 'Fundación Grandmother\'s House',
              title: 'A Safe Place <br>Where Children <span>Grow</span>',
              ctaPrimaryText: 'Discover More',
              ctaPrimaryLink: '/quienes-somos',
              ctaSecondaryText: 'Contact Us',
              ctaSecondaryLink: '/contacto',
              ...(heroImage1 ? { image: heroImage1.id } : {}),
            },
            {
              subtitle: 'Making a difference',
              title: 'Bringing Joy <br>To Over <span>2,100</span> Children',
              ctaPrimaryText: 'Our Activities',
              ctaPrimaryLink: '/actividades',
              ctaSecondaryText: 'Donate Now',
              ctaSecondaryLink: '#',
              ...(heroImage2 ? { image: heroImage2.id } : {}),
            },
          ],
        },
        {
          blockType: 'difference',
          subtitle: 'Our Programs',
          title: 'Making a Real Difference',
          description: 'We provide education, child care, and community programs that impact families across multiple communities including Los Guayacanes, Honduras, Hoyo del Toro, and Juan Dolio.',
          items: [
            {
              icon: 'icon-education',
              title: 'Education & Development',
              description: 'Enriching educational programs and creative play that inspire children to explore, learn, and grow.',
            },
            {
              icon: 'icon-food',
              title: 'Community Events',
              description: 'Joyful events like toy drives, educational talks, and celebrations that bring communities together.',
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
              title: 'Start Helping Today',
              description: 'Join our cause and help us bring joy to children across communities in the Dominican Republic.',
            },
            {
              icon: 'icon-support-heart',
              title: 'Make Donations',
              description: 'Your generous contributions support our programs, toy drives, and educational initiatives.',
            },
          ],
          checkmarks: [
            { text: 'Over 2,100 children impacted in our latest toy drive' },
            { text: 'Educational talks on values, self-care, and personal growth' },
            { text: 'Serving communities across Los Guayacanes, Honduras, and Juan Dolio' },
          ],
          ctaText: 'More About Us',
          ctaLink: '/quienes-somos',
          phone: '809-655-0290',
          ...(aboutImage ? { image: aboutImage.id } : {}),
        },
        {
          blockType: 'testimonial',
          subtitle: 'Testimonials',
          title: 'What People <span>Say</span> About Us',
          testimonials: [
            {
              rating: 5,
              quote: 'This foundation has truly changed lives in our community. Their dedication to children and families is remarkable and inspiring.',
              authorName: 'María García',
              authorTitle: 'Community Member',
            },
            {
              rating: 5,
              quote: 'The toy drive brought so much joy to our children. Seeing over 2,100 kids receive gifts was a truly moving experience.',
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
              quote: 'Their educational programs and community events are making a real difference. Every contribution goes directly to the children who need it most.',
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

  // ES version of home page
  const homePageEs = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
  })
  if (homePageEs.docs[0]) {
    await payload.update({
      collection: 'pages',
      id: homePageEs.docs[0].id,
      locale: 'es',
      data: {
        title: 'Inicio',
        layout: [
          {
            blockType: 'heroSlider',
            slides: [
              {
                subtitle: 'Fundación Grandmother\'s House',
                title: 'Un Lugar Seguro <br>Donde los Niños <span>Crecen</span>',
                ctaPrimaryText: 'Descubre Más',
                ctaPrimaryLink: '/quienes-somos',
                ctaSecondaryText: 'Contáctanos',
                ctaSecondaryLink: '/contacto',
                ...(heroImage1 ? { image: heroImage1.id } : {}),
              },
              {
                subtitle: 'Haciendo la diferencia',
                title: 'Llevando Alegría <br>A Más de <span>2,100</span> Niños',
                ctaPrimaryText: 'Nuestras Actividades',
                ctaPrimaryLink: '/actividades',
                ctaSecondaryText: 'Donar Ahora',
                ctaSecondaryLink: '#',
                ...(heroImage2 ? { image: heroImage2.id } : {}),
              },
            ],
          },
          {
            blockType: 'difference',
            subtitle: 'Nuestros Programas',
            title: 'Haciendo una Diferencia Real',
            description: 'Ofrecemos educación, cuidado infantil y programas comunitarios que impactan familias en múltiples comunidades incluyendo Los Guayacanes, Honduras, Hoyo del Toro y Juan Dolio.',
            items: [
              {
                icon: 'icon-education',
                title: 'Educación y Desarrollo',
                description: 'Programas educativos enriquecedores y juego creativo que inspiran a los niños a explorar, aprender y crecer.',
              },
              {
                icon: 'icon-food',
                title: 'Eventos Comunitarios',
                description: 'Eventos llenos de alegría como entrega de juguetes, charlas educativas y celebraciones que unen a las comunidades.',
              },
              {
                icon: 'icon-health',
                title: 'Cuidado Infantil',
                description: 'Un entorno seguro, estimulante y cariñoso donde cada niño puede desarrollarse plenamente — física y cognitivamente.',
              },
            ],
          },
          {
            blockType: 'help',
            subtitle: 'Sobre nosotros',
            title: 'Ser la Luz para Aquellos <br>en la <span>Oscuridad</span>',
            description: 'Nuestra misión es proporcionar un entorno seguro, estimulante y cariñoso donde cada niño pueda desarrollarse completamente. Nos comprometemos a ofrecer programas educativos enriquecedores y juego creativo, inspirando a los niños a explorar, aprender y crecer.',
            features: [
              {
                icon: 'icon-make-donation',
                title: 'Empieza a Ayudar Hoy',
                description: 'Únete a nuestra causa y ayúdanos a llevar alegría a niños de comunidades en República Dominicana.',
              },
              {
                icon: 'icon-support-heart',
                title: 'Haz una Donación',
                description: 'Tus generosas contribuciones apoyan nuestros programas, entregas de juguetes e iniciativas educativas.',
              },
            ],
            checkmarks: [
              { text: 'Más de 2,100 niños impactados en nuestra última entrega de juguetes' },
              { text: 'Charlas educativas sobre valores, autocuidado y crecimiento personal' },
              { text: 'Sirviendo comunidades en Los Guayacanes, Honduras y Juan Dolio' },
            ],
            ctaText: 'Más Sobre Nosotros',
            ctaLink: '/quienes-somos',
            phone: '809-655-0290',
            ...(aboutImage ? { image: aboutImage.id } : {}),
          },
          {
            blockType: 'testimonial',
            subtitle: 'Testimonios',
            title: 'Lo Que la Gente <span>Dice</span> de Nosotros',
            testimonials: [
              {
                rating: 5,
                quote: 'Esta fundación ha cambiado vidas en nuestra comunidad. Su dedicación a los niños y las familias es notable e inspiradora.',
                authorName: 'María García',
                authorTitle: 'Miembro de la Comunidad',
              },
              {
                rating: 5,
                quote: 'La entrega de juguetes trajo tanta alegría a nuestros niños. Ver a más de 2,100 niños recibir regalos fue una experiencia realmente conmovedora.',
                authorName: 'Juan Pérez',
                authorTitle: 'Voluntario',
              },
              {
                rating: 5,
                quote: 'Estoy agradecida por el apoyo y las oportunidades que esta organización ha brindado a mi familia. Realmente se preocupan por cada persona que atienden.',
                authorName: 'Ana Rodríguez',
                authorTitle: 'Beneficiaria',
              },
              {
                rating: 5,
                quote: 'Sus programas educativos y eventos comunitarios están haciendo una diferencia real. Cada contribución va directamente a los niños que más lo necesitan.',
                authorName: 'Carlos Martínez',
                authorTitle: 'Donante',
              },
            ],
          },
          {
            blockType: 'blogPreview',
            subtitle: 'Últimas Noticias',
            title: 'Nuestras Últimas <span>Noticias</span> y Artículos',
          },
        ],
      },
    })
  }
  console.log('✅ Home page seeded (EN + ES).')

  // ─── 8. Mission page ─────────────────────────────────────
  console.log('📝 Seeding Mission page...')
  const existingMission = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'mission' } },
    limit: 1,
  })
  if (existingMission.docs.length > 0) {
    await payload.delete({ collection: 'pages', id: existingMission.docs[0].id })
  }

  const missionPage = await payload.create({
    collection: 'pages',
    locale: 'en',
    data: {
      title: 'Mission',
      slug: 'mission',
      layout: [
        {
          blockType: 'textSection',
          subtitle: 'Our Mission',
          heading: 'What Drives Us',
          body: 'Our mission is to provide a safe, stimulating, and loving environment where every child can develop fully — both physically and cognitively. We are committed to offering enriching educational programs and creative play, inspiring children to explore, learn, and grow. We strive to be the light for those who are in darkness.',
          imagePosition: 'right',
          ...(eventPhotos[9] ? { image: eventPhotos[9].id } : {}),
        },
        {
          blockType: 'textSection',
          subtitle: 'Our Values',
          heading: 'The Principles That Guide Us',
          body: 'Love — We act with genuine care for every child and family we serve.\n\nRespect — We treat everyone with dignity and value their unique qualities.\n\nIntegrity — We are transparent and honest in everything we do.\n\nTrust — We build relationships based on reliability and accountability.\n\nResponsibility — We take ownership of our mission and our impact on the community.\n\nSafety — We ensure a secure environment where children can thrive without worry.',
          imagePosition: 'none',
        },
      ],
    },
  })
  await payload.update({
    collection: 'pages',
    id: missionPage.id,
    locale: 'es',
    data: {
      title: 'Misión',
      layout: [
        {
          blockType: 'textSection',
          subtitle: 'Nuestra Misión',
          heading: 'Lo Que Nos Impulsa',
          body: 'Nuestra misión es proporcionar un entorno seguro, estimulante y cariñoso donde cada niño pueda desarrollarse completamente sano y cognitivamente. Nos comprometemos a ofrecer programas educativos enriquecedores y juego creativo, inspirando a los niños a explorar, aprender y crecer. Nos esforzamos por ser la luz para aquellos que están en la oscuridad.',
          imagePosition: 'right',
          ...(eventPhotos[9] ? { image: eventPhotos[9].id } : {}),
        },
        {
          blockType: 'textSection',
          subtitle: 'Nuestros Valores',
          heading: 'Los Principios Que Nos Guían',
          body: 'Amor — Actuamos con cariño genuino por cada niño y familia que servimos.\n\nRespeto — Tratamos a todos con dignidad y valoramos sus cualidades únicas.\n\nIntegridad — Somos transparentes y honestos en todo lo que hacemos.\n\nConfianza — Construimos relaciones basadas en la confiabilidad y la responsabilidad.\n\nResponsabilidad — Asumimos nuestra misión y nuestro impacto en la comunidad.\n\nSeguridad — Garantizamos un entorno seguro donde los niños pueden prosperar sin preocupaciones.',
          imagePosition: 'none',
        },
      ],
    },
  })
  console.log('✅ Mission page seeded (EN + ES).')

  // ─── 9. Vision page ──────────────────────────────────────
  console.log('📝 Seeding Vision page...')
  const existingVision = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'vision' } },
    limit: 1,
  })
  if (existingVision.docs.length > 0) {
    await payload.delete({ collection: 'pages', id: existingVision.docs[0].id })
  }

  const visionPage = await payload.create({
    collection: 'pages',
    locale: 'en',
    data: {
      title: 'Vision',
      slug: 'vision',
      layout: [
        {
          blockType: 'textSection',
          subtitle: 'Our Vision',
          heading: 'Where We\'re Headed',
          body: 'Our vision is to be leaders in child care, offering an inspiring environment where every child can flourish and reach their full potential. We are committed to being a model of excellence and compassion, providing innovative and high-quality programs that promote the holistic development of every child. We aspire to be recognized for our dedication and excellence in early childhood education, becoming a role model in the community.',
          imagePosition: 'left',
          ...(eventPhotos[5] ? { image: eventPhotos[5].id } : {}),
        },
      ],
    },
  })
  await payload.update({
    collection: 'pages',
    id: visionPage.id,
    locale: 'es',
    data: {
      title: 'Visión',
      layout: [
        {
          blockType: 'textSection',
          subtitle: 'Nuestra Visión',
          heading: 'Hacia Dónde Vamos',
          body: 'Nuestra visión es ser líderes en el cuidado infantil, ofreciendo un ambiente inspirador donde cada niño pueda florecer y alcanzar su máximo potencial. Nos comprometemos a ser un modelo de excelencia y compasión, proporcionando programas innovadores y de alta calidad que promueven el desarrollo integral de cada niño. Aspiramos a ser reconocidos por nuestra dedicación y excelencia en la educación infantil, siendo un modelo a seguir en la comunidad.',
          imagePosition: 'left',
          ...(eventPhotos[5] ? { image: eventPhotos[5].id } : {}),
        },
      ],
    },
  })
  console.log('✅ Vision page seeded (EN + ES).')

  // ─── 10. News articles ─────────────────────────────────────
  console.log('📝 Seeding News articles...')
  const existingNews = await payload.find({ collection: 'news', limit: 1 })
  if (existingNews.docs.length === 0) {
    // Main news article about the toy drive
    const toyDriveNews = await payload.create({
      collection: 'news',
      locale: 'en',
      data: {
        title: 'Grandmother\'s House Foundation Delivers Toys to Over 2,100 Children',
        slug: 'toy-delivery-2100-children',
        date: '2026-01-06',
        excerpt: 'The Grandmother\'s House Foundation carried out a major social event benefiting childhood, impacting over 2,100 children from different communities.',
        published: true,
        ...(featuredEventImage ? { image: featuredEventImage.id } : {}),
      } as any,
    })
    await payload.update({
      collection: 'news',
      id: toyDriveNews.id,
      locale: 'es',
      data: {
        title: 'Fundación Grandmother House entrega juguetes a más de 2,100 niños de diversas comunidades',
        excerpt: 'La Fundación Grandmother House llevó a cabo una gran jornada social en beneficio de la niñez, logrando impactar a más de 2,100 niños de distintas comunidades.',
      },
    })

    const newsData = [
      {
        en: {
          title: 'Educational Talks on Values and Personal Growth',
          slug: 'educational-talks-values',
          date: '2026-01-06',
          excerpt: 'As part of our commitment to education, children participated in talks focused on values, behavior, self-care, and personal growth.',
          published: true,
        },
        es: {
          title: 'Charlas Educativas sobre Valores y Crecimiento Personal',
          excerpt: 'Como parte del compromiso formativo de la fundación, los niños participaron en charlas educativas enfocadas en valores, comportamiento, autocuidado y crecimiento personal.',
        },
      },
      {
        en: {
          title: 'Community Celebration Brings Joy to Multiple Neighborhoods',
          slug: 'community-celebration-joy',
          date: '2026-01-06',
          excerpt: 'Children enjoyed entertainment with clowns, fun activities, games, and face painting stations, creating an atmosphere of celebration and smiles.',
          published: true,
        },
        es: {
          title: 'Celebración Comunitaria Lleva Alegría a Múltiples Barrios',
          excerpt: 'Los niños disfrutaron de la animación de payasos, dinámicas divertidas, juegos y estaciones de pinta caritas, contribuyendo a crear un entorno de celebración y sonrisas.',
        },
      },
    ]

    for (const article of newsData) {
      const created = await payload.create({
        collection: 'news',
        locale: 'en',
        data: article.en as any,
      })
      await payload.update({
        collection: 'news',
        id: created.id,
        locale: 'es',
        data: article.es,
      })
    }
    console.log('✅ News articles seeded (3 articles, EN + ES).')
  } else {
    console.log('⏭️  News articles already exist.')
  }

  // ─── 11. Activities ────────────────────────────────────────
  console.log('📝 Seeding Activities...')
  const existingActivities = await payload.find({ collection: 'activities', limit: 1 })
  if (existingActivities.docs.length === 0) {
    // Main activity: Toy delivery
    const toyDrive = await payload.create({
      collection: 'activities',
      locale: 'en',
      data: {
        name: 'Three Kings Day Toy Delivery',
        slug: 'entrega-juguetes-reyes-2026',
        date: '2026-01-06',
        location: 'Los Guayacanes, Honduras, Hoyo del Toro, Juan Dolio',
        published: true,
        ...(featuredEventImage ? { featuredImage: featuredEventImage.id } : {}),
        gallery: eventPhotos.map((photo) => ({ image: photo.id })),
      } as any,
    })
    await payload.update({
      collection: 'activities',
      id: toyDrive.id,
      locale: 'es',
      data: {
        name: 'Entrega de Juguetes del Día de Reyes',
        location: 'Los Guayacanes, Honduras, Hoyo del Toro, Juan Dolio',
      },
    })

    // Additional activities
    const additionalActivities = [
      {
        en: {
          name: 'After-School Educational Program',
          slug: 'programa-educativo',
          date: '2026-02-01',
          location: 'Vía Boulevard Juan Dolio, Calle el Tanque, SPM',
          published: true,
        },
        es: {
          name: 'Programa Educativo Después de Clases',
          location: 'Vía Boulevard Juan Dolio, Calle el Tanque, SPM',
        },
      },
      {
        en: {
          name: 'Community Values Workshop',
          slug: 'taller-valores-comunitarios',
          date: '2026-03-15',
          location: 'Santo Domingo Community Center',
          published: true,
        },
        es: {
          name: 'Taller de Valores Comunitarios',
          location: 'Centro Comunitario de Santo Domingo',
        },
      },
    ]

    for (const activity of additionalActivities) {
      const created = await payload.create({
        collection: 'activities',
        locale: 'en',
        data: activity.en as any,
      })
      await payload.update({
        collection: 'activities',
        id: created.id,
        locale: 'es',
        data: activity.es,
      })
    }
    console.log('✅ Activities seeded (3 activities, EN + ES).')
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
