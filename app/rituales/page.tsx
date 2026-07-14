import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Rituales from '@/components/Rituales'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Rituales de Firma',
  description:
    'Rituales de Firma Dall\'O Selfcare aplicados en QUEVI: experiencias de 60 minutos en suite privada con Home Care incluido. Cómpralos online o resérvalos con seña de 50 €.',
}

export default function RitualesPage() {
  return (
    <>
      <Navbar />
      <main>
        <Rituales />
      </main>
      <Footer />
    </>
  )
}
