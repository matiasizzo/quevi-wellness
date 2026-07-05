import Navbar          from '@/components/Navbar'
import Hero            from '@/components/Hero'
import Services        from '@/components/Services'
import Treatments      from '@/components/Treatments'
import ProductsPreview from '@/components/ProductsPreview'
import RitualesTeaser  from '@/components/RitualesTeaser'
import FAQ             from '@/components/FAQ'
import Booking         from '@/components/Booking'
import Footer          from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Treatments />
        <ProductsPreview />
        <RitualesTeaser />
        <FAQ limit={4} />
        <Booking />
      </main>
      <Footer />
    </>
  )
}
