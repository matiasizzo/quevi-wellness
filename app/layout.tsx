import type { Metadata } from 'next'
import { Inter, Playfair_Display, Cormorant_Garamond } from 'next/font/google'
import { CartProvider } from '@/lib/cartContext'
import CartDrawer from '@/components/CartDrawer'
import CookieBanner from '@/components/CookieBanner'
import PromoModal from '@/components/PromoModal'
import ClarityAnalytics from '@/components/ClarityAnalytics'
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
    'Medicina estética de precisión en Estepona, Málaga. Diagnóstico SKIN-SCAN Multiespectral, terapias ProAging y tecnologías High-Tech. Primera consulta gratuita.',
  keywords: [
    'medicina estética Málaga',
    'clínica estética Estepona',
    'diagnóstico piel Málaga',
    'tratamientos faciales Estepona',
    'SKIN-SCAN',
    'terapias proaging',
    'medicina estética de precisión',
    'QUEVI wellness',
  ],
  authors: [{ name: 'QUEVI Wellness Clinic' }],
  metadataBase: new URL('https://www.queviwellnessclinic.es'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'QUEVI Wellness Clinic — Estepona, Málaga',
    description:
      'Medicina estética de precisión. Diagnóstico 360° y protocolos personalizados para tu mejor versión.',
    url: 'https://www.queviwellnessclinic.es',
    siteName: 'QUEVI Wellness Clinic',
    locale: 'es_ES',
    type: 'website',
    images: [
      {
        url: '/images/about.png',
        width: 1408,
        height: 768,
        alt: 'QUEVI Wellness Clinic — Estepona, Málaga',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/about.png'],
    title: 'QUEVI Wellness Clinic — Estepona, Málaga',
    description:
      'Medicina estética de precisión. Diagnóstico 360° y protocolos personalizados para tu mejor versión.',
  },
  verification: {
    google: 'Qcb4HhgHzVHTpjojQs8aBpiKM0bDLnXxqE9UfzbYd5A',
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
  url: 'https://www.queviwellnessclinic.es',
  telephone: '+34 683 462 705',
  email: 'info@queviwellnessclinic.es',
  legalName: 'QUEVI WELLNESS CLINIC SL',
  taxID: 'B88657044',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Calle Gibraltar 2, Local Bajo',
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
    'Medicina estética de precisión en Estepona, Málaga. Diagnóstico SKIN-SCAN Multiespectral, terapias ProAging y tecnologías High-Tech.',
  image: 'https://www.queviwellnessclinic.es/images/about.png',
  logo: 'https://www.queviwellnessclinic.es/images/logo.jpeg',
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
          <ClarityAnalytics />
          <PromoModal />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  )
}
