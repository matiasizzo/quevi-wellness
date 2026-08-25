import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: '/shop' },
  title: 'Tienda — Cosmética médica Dall\'O Skin',
  description:
    'Cosmética médica Dall\'O Skin formulada bajo demanda: limpiadores, sérums senolíticos, aceites y suplementos. Envío a toda España desde Estepona, Málaga.',
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children
}
