import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Nunito, Nunito_Sans, Caveat } from 'next/font/google'
import { Topbar } from '@/components/layout/Topbar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { DonationModal } from '@/components/DonationModal'
import { AosInit } from '@/components/AosInit'
import { cookies } from 'next/headers'

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
})

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-nunito-sans',
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
})

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  weight: ['400', '500', '600', '700'],
})

const fallbackHeader = {
  email: 'grandmothershousedaycare@gmail.com',
  phone: '809-655-0290',
  donateButtonText: 'Donar Ahora',
  socialLinks: [{ platform: 'instagram', url: 'https://www.instagram.com/fundaciongrandmothershouse', label: 'Instagram' }],
  navigation: [
    { label: 'Inicio', link: '/' },
    { label: 'Quiénes Somos', link: '/quienes-somos', children: [{ label: 'Misión', link: '/quienes-somos/mision' }, { label: 'Visión', link: '/quienes-somos/vision' }] },
    { label: 'Actividades', link: '/actividades' },
    { label: 'Contacto', link: '/contacto' },
  ],
}

const fallbackFooter = {
  description: "Fundación Grandmother's House se dedica a proporcionar un entorno seguro donde cada niño pueda desarrollarse plenamente.",
  socialLinks: [{ platform: 'instagram', url: 'https://www.instagram.com/fundaciongrandmothershouse', label: 'Instagram' }],
  quickLinks: [{ label: 'Quiénes Somos', link: '/quienes-somos' }, { label: 'Actividades', link: '/actividades' }, { label: 'Contacto', link: '/contacto' }],
  services: [],
  contactInfo: { address: 'Vía Boulevard Juan Dolio, John Hazim Subero, Calle el Tanque, SPM, RD', phone: '809-655-0290', email: 'grandmothershousedaycare@gmail.com' },
  copyrightText: "Copyright © 2026 Fundación Grandmother's House. RNC: 430-43228-8",
  legalLinks: [],
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const locale = (cookieStore.get('locale')?.value || 'es') as 'en' | 'es'

  let header: any = fallbackHeader
  let footer: any = fallbackFooter
  let donationSettings: any = {}

  try {
    const payload = await getPayload({ config: configPromise })
    header = await payload.findGlobal({ slug: 'header', locale })
    footer = await payload.findGlobal({ slug: 'footer', locale })
    donationSettings = await payload.findGlobal({ slug: 'donation-settings', locale })
  } catch {
    // DB unavailable — use fallback data
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: "Fundación Grandmother's House",
    description: 'Proporcionamos un entorno seguro, estimulante y cariñoso donde cada niño pueda desarrollarse plenamente.',
    url: 'https://fundaciongrandmothershouse.com',
    logo: 'https://fundaciongrandmothershouse.com/og-image.png',
    email: 'grandmothershousedaycare@gmail.com',
    telephone: '809-655-0290',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Vía Boulevard Juan Dolio, John Hazim Subero, Calle el Tanque',
      addressLocality: 'Juan Dolio',
      addressRegion: 'San Pedro de Macorís',
      addressCountry: 'DO',
    },
    sameAs: ['https://www.instagram.com/fundaciongrandmothershouse'],
    foundingDate: '1920',
    taxID: '430-43228-8',
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <link rel="stylesheet" href="/assets/css/main.css" />
      <link rel="stylesheet" href="/assets/css/responsive.css" />
      <link rel="stylesheet" href="/assets/css/default-theme.css" />
      <link rel="stylesheet" href="/assets/css/sticky-header.css" />
      <div className={`page-wrapper ${nunito.variable} ${nunitoSans.variable} ${caveat.variable}`}>
        <Topbar header={header} locale={locale} />
        <Header header={header} locale={locale} />
        <MobileMenu header={header} locale={locale} />
        {children}
        <Footer footer={footer} locale={locale} />
        <DonationModal settings={donationSettings} locale={locale} />
        <AosInit />
      </div>
    </>
  )
}
