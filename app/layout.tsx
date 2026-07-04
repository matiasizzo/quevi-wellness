import type { Metadata } from 'next'
import { Inter, Playfair_Display, Cormorant_Garamond } from 'next/font/google'
import { CartProvider } from '@/lib/cartContext'
import CartDrawer from '@/components/CartDrawer'
import CookieBanner from '@/components/CookieBanner'
import WhatsAppButton from '@/components/WhatsAppButton'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'QUEVI Wellness Clinic — Estepona, Málaga',
    template: '%s | QUEVI Wellness Clinic',
  },
  description:
    'Medicina estética de precisión en Estepona, Málaga. Diagnóstico BIO-SCAN 360°, terapias ProAging y tecnologías High-Tech. Primera consulta gratuita.',
  keywords: [
    'medicina estética Málaga',
    'clínica estética Estepona',
    'diagnóstico piel Málaga',
    'tratamientos faciales Estepona',
    'BIO-SCAN skin',
    'terapias proaging',
    'medicina estética de precisión',
    'QUEVI wellness',
  ],
  authors: [{ name: 'QUEVI Wellness Clinic' }],
  metadataBase: new URL('https://queviwellnessclinic.es'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'QUEVI Wellness Clinic — Estepona, Málaga',
    description:
      'Medicina estética de precisión. Diagnóstico 360° y protocolos personalizados para tu mejor versión.',
    url: 'https://queviwellnessclinic.es',
    siteName: 'QUEVI Wellness Clinic',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QUEVI Wellness Clinic — Estepona, Málaga',
    description:
      'Medicina estética de precisión. Diagnóstico 360° y protocolos personalizados para tu mejor versión.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MedicalBusiness',
  name: 'QUEVI Wellness Clinic',
  url: 'https://queviwellnessclinic.es',
  telephone: '+34 900 000 000',
  email: 'info@quevi.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Calle Gibraltar 2',
    addressLocality: 'Estepona',
    addressRegion: 'Málaga',
    postalCode: '29680',
    addressCountry: 'ES',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '36.4267',
    longitude: '-5.1470',
  },
  description:
    'Medicina estética de precisión en Estepona, Málaga. Diagnóstico BIO-SCAN 360°, terapias ProAging y tecnologías High-Tech.',
  priceRange: '€€€',
  medicalSpecialty: 'Dermatology',
  openingHours: 'Mo-Fr 09:00-20:00',
  sameAs: [
    'https://www.instagram.com/queviwellness',
    'https://www.facebook.com/queviwellness',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable} ${cormorant.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <CartProvider>
          {children}
          <CartDrawer />
          <CookieBanner />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  )
}
