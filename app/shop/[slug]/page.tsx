'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PackSVG from '@/components/PackSVG'
import { supabase } from '@/lib/supabase'
import { useCart } from '@/lib/cartContext'
import { PRODUCT_RITUAL } from '@/content'

type ProductDetail = {
  id: string
  slug: string
  name: string
  tagline: string | null
  description: string | null
  ingredients: string | null
  usage_instructions: string | null
  dosage: string | null
  frequency: string | null
  storage: string | null
  precautions: string | null
  nutrition_facts: string | null
  skin_type: string[] | null
  volume_ml: number | null
  variant_name: string | null
  image_url: string | null
  price: number
  was: number | null
}

const STRIPE_BY_SLUG = (slug: string) =>
  slug.includes('mousse') || slug.includes('limpi') ? '#83a886'
    : slug.includes('oil') || slug.includes('aceite') ? '#2c472f'
    : '#c4876a'

function priceFmt(n: number) {
  if (n === 0) return 'Consultar precio'
  return n.toFixed(2).replace('.', ',').replace(/,00$/, '') + ' €'
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const { addItem } = useCart()

  useEffect(() => {
    async function fetchProduct() {
      if (!supabase) { setLoading(false); return }
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            product_variants (name, price_cents, compare_at_cents, is_default, active)
          `)
          .eq('slug', slug)
          .eq('active', true)
          .maybeSingle()

        if (error || !data) { setLoading(false); return }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const p = data as any
        const variant = p.product_variants?.find((v: { is_default: boolean; active: boolean }) => v.is_default && v.active)
          ?? p.product_variants?.find((v: { active: boolean }) => v.active)

        setProduct({
          id: p.id,
          slug: p.slug,
          name: p.name,
          tagline: p.tagline,
          description: p.description,
          ingredients: p.ingredients,
          usage_instructions: p.usage_instructions,
          dosage: p.dosage,
          frequency: p.frequency,
          storage: p.storage,
          precautions: p.precautions ?? null,
          nutrition_facts: p.nutrition_facts ?? null,
          skin_type: p.skin_type,
          volume_ml: p.volume_ml,
          variant_name: variant?.name ?? null,
          image_url: p.image_url,
          price: variant ? variant.price_cents / 100 : 0,
          was: variant?.compare_at_cents ? variant.compare_at_cents / 100 : null,
        })
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [slug])

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-[60vh] bg-cream-100 flex items-center justify-center">
          <span className="text-[14px] text-carbon-400 tracking-[0.06em]">Cargando producto…</span>
        </main>
        <Footer />
      </>
    )
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="min-h-[60vh] bg-cream-100 flex flex-col items-center justify-center gap-4 px-6 text-center">
          <h1 className="font-serif text-[28px] font-normal text-carbon-900 m-0">Producto no encontrado</h1>
          <p className="text-[14px] text-carbon-500 m-0">Puede que ya no esté disponible o que el enlace haya cambiado.</p>
          <Link href="/shop" className="inline-flex items-center gap-2 px-7 py-3 bg-brand-600 text-cream-50 rounded-full font-medium text-[13px] transition-all hover:bg-brand-700 mt-2">
            Volver a la tienda
          </Link>
        </main>
        <Footer />
      </>
    )
  }

  // Cosmética: volumen en ml. Suplementos: formato de la variante (ej. "30 cápsulas").
  const vol = product.volume_ml
    ? `${product.volume_ml} ml`
    : (product.variant_name && product.variant_name.toLowerCase() !== 'default' ? product.variant_name : '')
  const stripe = STRIPE_BY_SLUG(product.slug)

  const detailSections = [
    { title: 'Modo de uso', content: product.usage_instructions },
    { title: 'Dosis y frecuencia', content: [product.dosage, product.frequency].filter(Boolean).join(' · ') || null },
    { title: 'Información nutricional', content: product.nutrition_facts },
    { title: 'Ingredientes', content: product.ingredients },
    { title: 'Conservación', content: product.storage },
    { title: 'Precauciones', content: product.precautions },
  ].filter((s) => s.content)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream-100">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-9 pt-8 pb-20">
          {/* Breadcrumb */}
          <nav className="flex gap-[10px] items-center text-[12px] tracking-[0.04em] text-carbon-500 mb-8">
            <Link href="/" className="border-b border-transparent hover:border-carbon-500 transition-colors">Inicio</Link>
            <span className="text-carbon-400">/</span>
            <Link href="/shop" className="border-b border-transparent hover:border-carbon-500 transition-colors">Tienda</Link>
            <span className="text-carbon-400">/</span>
            <span className="text-carbon-900">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
            {/* Image */}
            <div
              className="relative rounded-3xl overflow-hidden flex items-center justify-center"
              style={{ aspectRatio: '1/1', background: '#ede9e0' }}
            >
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-contain p-10"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <PackSVG id={product.id} vol={vol} stripe={stripe} name={product.name} code={product.slug.toUpperCase().slice(0, 10)} />
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-5">
              <div>
                <span className="text-[11px] tracking-[0.18em] uppercase text-carbon-400 font-medium">
                  {product.volume_ml
                    ? "Dall'O Skin · Cosmética clínica"
                    : "Dall'O Selfcare · Nutrición avanzada"}
                </span>
                <h1 className="font-serif font-medium text-[32px] sm:text-[40px] leading-[1.1] tracking-tight text-carbon-900 m-0 mt-2">
                  {product.name}
                </h1>
                {product.tagline && (
                  <p className="text-[15px] text-brand-600 italic font-serif m-0 mt-2">{product.tagline}</p>
                )}
              </div>

              <div className="flex items-baseline gap-3">
                <span className="font-serif font-medium text-[26px] text-carbon-900">
                  {priceFmt(product.price)}
                </span>
                {product.was && product.price > 0 && (
                  <span className="text-[15px] text-carbon-400 line-through">{priceFmt(product.was)}</span>
                )}
                <span className="text-[13px] text-carbon-400 ml-auto">{vol}</span>
              </div>

              {product.description && (
                <p className="text-[15px] text-carbon-600 leading-[1.75] m-0">{product.description}</p>
              )}

              {product.skin_type && product.skin_type.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.skin_type.map((t) => (
                    <span key={t} className="px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-[12px] font-medium capitalize">
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {/* Add to cart */}
              <div className="flex gap-3 items-stretch pt-2">
                <div className="inline-flex items-center rounded-full border border-cream-500 overflow-hidden">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-11 h-full flex items-center justify-center text-carbon-500 hover:bg-cream-300 transition-colors text-[18px]"
                    aria-label="Menos"
                  >
                    −
                  </button>
                  <span className="w-9 text-center text-[15px] font-medium text-carbon-900">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-11 h-full flex items-center justify-center text-carbon-500 hover:bg-cream-300 transition-colors text-[18px]"
                    aria-label="Más"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => {
                    for (let i = 0; i < qty; i++) {
                      addItem({
                        id: product.id,
                        slug: product.slug,
                        name: product.name,
                        price: product.price,
                        vol,
                        image_url: product.image_url,
                        stripe,
                      })
                    }
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-4 rounded-full bg-brand-600 text-cream-50 font-medium text-[14px] tracking-[0.02em] transition-all hover:bg-brand-700 hover:-translate-y-0.5 active:scale-[0.98]"
                  style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
                >
                  Añadir al carrito
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 7h12l-1 13H7L6 7z" /><path d="M9 7a3 3 0 0 1 6 0" />
                  </svg>
                </button>
              </div>

              <p className="text-[12px] text-carbon-400 m-0">
                Envío gratuito a partir de 50 € · Devoluciones en 14 días (producto precintado)
              </p>

              {/* Ritual en el que se recomienda este producto */}
              {PRODUCT_RITUAL[product.slug] && (
                <Link
                  href={`/rituales#ritual-${PRODUCT_RITUAL[product.slug].ritualId}`}
                  className="group flex items-center justify-between gap-4 p-4 rounded-2xl border border-brand-300 bg-brand-100/60 transition-all duration-200 hover:border-brand-600 hover:bg-brand-100"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex-shrink-0 w-9 h-9 rounded-full bg-brand-600 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f9f7f3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 3v2M12 19v2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M3 12h2M19 12h2M5.6 18.4 7 17M17 7l1.4-1.4" />
                        <circle cx="12" cy="12" r="4" />
                      </svg>
                    </span>
                    <div className="min-w-0">
                      <span className="block text-[10px] tracking-[0.16em] uppercase text-brand-700 font-medium">
                        Incluido en el ritual
                      </span>
                      <span className="block text-[14px] font-serif font-medium text-carbon-900 truncate">
                        {PRODUCT_RITUAL[product.slug].ritualName}
                      </span>
                    </div>
                  </div>
                  <span className="flex-shrink-0 inline-flex items-center gap-1.5 text-[12px] font-medium text-brand-700 group-hover:translate-x-0.5 transition-transform">
                    Ver ritual
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                    </svg>
                  </span>
                </Link>
              )}

              {/* Detail accordion sections */}
              {detailSections.length > 0 && (
                <div className="flex flex-col divide-y divide-cream-400 border-t border-cream-400 mt-2">
                  {detailSections.map((s) => (
                    <details key={s.title} className="group py-4">
                      <summary className="flex items-center justify-between cursor-pointer list-none text-[13px] tracking-[0.1em] uppercase font-medium text-carbon-900">
                        {s.title}
                        <svg className="w-4 h-4 text-carbon-400 transition-transform group-open:rotate-45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </summary>
                      <p className="text-[14px] text-carbon-600 leading-[1.7] mt-3 mb-0">{s.content}</p>
                    </details>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
