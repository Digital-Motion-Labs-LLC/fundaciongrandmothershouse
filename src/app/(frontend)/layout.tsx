import { Nunito, Nunito_Sans, Caveat } from 'next/font/google'
import { cookies } from 'next/headers'
import { Topbar } from '@/components/layout/Topbar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { DonationModal } from '@/components/DonationModal'
import { AosInit } from '@/components/AosInit'
import {
  header as staticHeader,
  footer as staticFooter,
  donationSettings as staticDonationSettings,
} from '@/content'
import { localize } from '@/content/localize'
import { readLocaleFromCookie } from '@/content/schema'

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

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const locale = readLocaleFromCookie(cookieStore.get('locale')?.value)

  const header = localize(staticHeader, locale)
  const footer = localize(staticFooter, locale)
  const donationSettings = localize(staticDonationSettings, locale)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: "Fundación Grandmother's House",
    alternateName: "Grandmother's House Foundation",
    description:
      'Proporcionamos un entorno seguro, estimulante y cariñoso donde cada niño pueda desarrollarse plenamente.',
    url: 'https://fundaciongrandmothershouse.com',
    logo: 'https://fundaciongrandmothershouse.com/og-image.png',
    image: 'https://fundaciongrandmothershouse.com/og-image.png',
    email: 'grandmothershousedaycare@gmail.com',
    telephone: '+1-809-655-0290',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+1-809-655-0290',
        contactType: 'customer support',
        email: 'grandmothershousedaycare@gmail.com',
        availableLanguage: ['Spanish', 'English'],
        areaServed: 'DO',
      },
    ],
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 18.4296,
      longitude: -69.4147,
    },
    hasMap: 'https://maps.google.com/?q=Juan+Dolio+San+Pedro+de+Macoris+RD',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '07:30',
        closes: '17:00',
      },
    ],
    potentialAction: {
      '@type': 'DonateAction',
      target: 'https://fundaciongrandmothershouse.com/',
      name: 'Donar a Fundación Grandmother\'s House',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Vía Boulevard Juan Dolio, John Hazim Subero, Calle el Tanque',
      addressLocality: 'Juan Dolio',
      addressRegion: 'San Pedro de Macorís',
      addressCountry: 'DO',
    },
    areaServed: [
      { '@type': 'Place', name: 'San Pedro de Macorís' },
      { '@type': 'Place', name: 'Juan Dolio' },
      { '@type': 'Place', name: 'Los Guayacanes' },
      { '@type': 'Place', name: 'Honduras (RD)' },
      { '@type': 'Place', name: 'Hoyo del Toro' },
    ],
    knowsLanguage: ['es', 'en'],
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
