import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Rituales from '@/components/Rituales'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Rituales de Firma',
  description:
    'Rituales de firma QUEVI: experiencias de 60 a 90 minutos que combinan cosmética clínica Dall\'O Skin con tecnologías de entrega transdérmica. Cómpralos online y canjéalos en clínica.',
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
