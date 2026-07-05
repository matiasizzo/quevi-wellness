import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] bg-cream-200 flex items-center justify-center px-6 py-20">
        <div className="max-w-md text-center">
          <span className="font-serif italic text-brand-300 block mb-2" style={{ fontSize: 'clamp(80px, 14vw, 140px)', lineHeight: 1 }}>
            404
          </span>
          <h1 className="font-serif font-normal text-[30px] text-carbon-900 m-0 mb-3">
            Esta página no <em className="italic text-brand-600">existe</em>.
          </h1>
          <p className="text-[14px] text-carbon-500 leading-[1.65] mb-8">
            Puede que el enlace haya cambiado o que la página se haya movido.
            Te dejamos algunos caminos de vuelta:
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-brand-600 text-cream-50 rounded-full font-medium text-[13px] transition-all duration-200 hover:bg-brand-700 hover:-translate-y-0.5"
            >
              Volver al inicio
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 text-carbon-900 rounded-full font-medium text-[13px] border border-carbon-300 transition-all duration-200 hover:bg-cream-300 hover:-translate-y-0.5"
            >
              Ir a la tienda
            </Link>
          </div>
          <p className="text-[12px] text-carbon-400 mt-6">
            ¿Buscabas algo concreto?{' '}
            <a href="https://wa.me/34683462705" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-brand-600 hover:text-brand-700">
              Escríbenos por WhatsApp
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
