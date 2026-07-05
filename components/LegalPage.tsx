import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string
  updated: string
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream-200">
        <div className="max-w-[760px] mx-auto px-4 sm:px-6 pt-14 pb-24">
          <h1
            className="font-serif font-normal leading-[1.05] tracking-[-0.015em] m-0 mb-2 text-carbon-900"
            style={{ fontSize: 'clamp(30px, 4.4vw, 46px)' }}
          >
            {title}
          </h1>
          <p className="text-[12px] text-carbon-400 mb-10">Última actualización: {updated}</p>
          <div className="legal-prose flex flex-col gap-4 text-[14px] text-carbon-700 leading-[1.75] [&_h2]:font-serif [&_h2]:text-[22px] [&_h2]:font-medium [&_h2]:text-carbon-900 [&_h2]:mt-6 [&_h2]:mb-0 [&_ul]:pl-5 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5 [&_a]:text-brand-600 [&_a]:underline [&_a]:underline-offset-2 [&_strong]:text-carbon-900">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
