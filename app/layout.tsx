import type { Metadata } from 'next'
import { Inter, Playfair_Display, Cormorant_Garamond } from 'next/font/google'
import { CartProvider } from '@/lib/cartContext'
import CartDrawer from '@/components/CartDrawer'
import CookieBanner from '@/components/CookieBanner'
import PromoModal from '@/components/PromoModal'
import ClarityAnalytics from '@/components/ClarityAnalytics'
import GoogleTags from '@/components/GoogleTags'
import TrackingProvider from '@/components/TrackingProvider'
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
    default: 'Medicina Estética en Estepona | QUEVI Wellness Clinic',
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
    title: 'Medicina Estética en Estepona | QUEVI Wellness Clinic',
    description:
      'Medicina estética de precisión. Diagnóstico 360° y protocolos personalizados para tu mejor versión.',
    url: 'https://www.queviwellnessclinic.es',
    siteName: 'QUEVI Wellness Clinic',
    locale: 'es_ES',
    type: 'website',
    images: [
      {
        url: '/images/og-quevi.jpg',
        width: 1200,
        height: 630,
        alt: 'QUEVI Wellness Clinic — Estepona, Málaga',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/og-quevi.jpg'],
    title: 'Medicina Estética en Estepona | QUEVI Wellness Clinic',
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
  image: 'https://www.queviwellnessclinic.es/images/og-quevi.jpg',
  logo: 'https://www.queviwellnessclinic.es/images/logo.jpeg',
  priceRange: '€€€',
  medicalSpecialty: 'Dermatology',
  openingHours: 'Mo-Fr 09:00-20:00',
  // Perfiles que identifican de forma inequívoca a la clínica. El enlace de
  // Google es el permalink de la ficha de Business Profile (entidad
  // /g/11z117dvqw en el Knowledge Graph), y ata la web a las reseñas y al
  // resultado de Maps.
  sameAs: [
    'https://www.instagram.com/queviwellness/',
    'https://share.google/kZ80Cy1QmRgB6QK6M',
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
        {/* Debe ir en el <head>: fija el consentimiento por defecto antes de gtag.js */}
        <GoogleTags />
      </head>
      <body>
        <CartProvider>
          {children}
          <CartDrawer />
          <CookieBanner />
          <ClarityAnalytics />
          <TrackingProvider />
          <PromoModal />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  )
}
