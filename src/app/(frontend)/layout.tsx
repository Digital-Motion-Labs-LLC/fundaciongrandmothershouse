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

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const locale = (cookieStore.get('locale')?.value || 'es') as 'en' | 'es'

  const payload = await getPayload({ config: configPromise })

  const header = await payload.findGlobal({ slug: 'header', locale })
  const footer = await payload.findGlobal({ slug: 'footer', locale })
  const donationSettings = await payload.findGlobal({ slug: 'donation-settings', locale })

  return (
    <>
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
        <DonationModal settings={donationSettings} />
        <AosInit />
      </div>
    </>
  )
}
