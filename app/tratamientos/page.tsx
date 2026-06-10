import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Treatments from '@/components/Treatments'
import Booking from '@/components/Booking'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Tratamientos',
  description:
    'Tratamientos médico-estéticos de precisión en QUEVI Wellness Clinic: bio-protección, regeneración, optimización y equilibrio. Reserva tu cita con diagnóstico médico.',
}

export default function TratamientosPage() {
  return (
    <>
      <Navbar />
      <main>
        <Treatments />
        <Booking />
      </main>
      <Footer />
    </>
  )
}
