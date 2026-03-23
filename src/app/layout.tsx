import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: "Fundación Grandmother's House | Cuidado Infantil y Educación en RD",
    template: "%s | Fundación Grandmother's House",
  },
  description: 'Fundación Grandmother\'s House se dedica a proporcionar un entorno seguro, estimulante y cariñoso donde cada niño pueda desarrollarse plenamente. Únete a nuestra causa y sé voluntario. Ubicados en Juan Dolio, San Pedro de Macorís, República Dominicana.',
  keywords: ['fundación', 'grandmother house', 'cuidado infantil', 'educación', 'Juan Dolio', 'República Dominicana', 'voluntariado', 'donaciones', 'niños', 'daycare'],
  authors: [{ name: "Fundación Grandmother's House" }],
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'es_DO',
    alternateLocale: 'en_US',
    siteName: "Fundación Grandmother's House",
    title: "Fundación Grandmother's House | Únete y Sé Voluntario",
    description: 'Proporcionamos un entorno seguro y cariñoso donde cada niño puede crecer. Más de 2,100 niños impactados. Únete a nuestra causa en Juan Dolio, RD.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: "Fundación Grandmother's House - Únete y Sé Voluntario",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Fundación Grandmother's House",
    description: 'Cuidado infantil, educación y apoyo comunitario en República Dominicana. Únete y sé voluntario.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL('https://fundaciongrandmothershouse.com'),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-5EW6E83DF9" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-5EW6E83DF9');
          `}
        </Script>
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
