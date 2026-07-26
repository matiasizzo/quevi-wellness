'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PackSVG from '@/components/PackSVG'
import { supabase } from '@/lib/supabase'
import { TREATMENTS } from '@/content'
import { useCart } from '@/lib/cartContext'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
}
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

// ── Fallback product data (Dall'O Skin seed products) ──
const FALLBACK_PRODUCTS = [
  { id: 'longevity-mousse',  slug: 'd-longevity-mousse',  name: 'D-LONGEVITY Mousse',   vol: '150 ml', price: 0,   was: null, badge: null,   stripe: '#83a886', tipo: 'limpiador', code: 'D-LON-150',  image_url: null },
  { id: 'purifying-mousse',  slug: 'd-purifying-mousse',  name: 'D-PURIFYING Mousse',   vol: '150 ml', price: 0,   was: null, badge: null,   stripe: '#83a886', tipo: 'limpiador', code: 'D-PUR-150',  image_url: null },
  { id: 'senolytic-serum',   slug: 'd-senolytic-serum',   name: 'D-Senolytic Serum',    vol: '20 ml',  price: 0,   was: null, badge: 'best', stripe: '#c4876a', tipo: 'serum',    code: 'D-SEN-20',   image_url: null },
  { id: 'purifying-serum',   slug: 'd-purifying-serum',   name: 'D-Purifying Serum',    vol: '20 ml',  price: 0,   was: null, badge: null,   stripe: '#c4876a', tipo: 'serum',    code: 'D-PSER-20',  image_url: null },
  { id: 'evenglow-serum',    slug: 'd-evenglow-serum',    name: 'D-EVENGLOW Serum',     vol: '20 ml',  price: 0,   was: null, badge: 'new',  stripe: '#d49070', tipo: 'serum',    code: 'D-EVG-20',   image_url: null },
  { id: 'rescue-serum',      slug: 'd-rescue-serum',      name: 'D-RESCUE Serum',       vol: '20 ml',  price: 0,   was: null, badge: null,   stripe: '#c4876a', tipo: 'serum',    code: 'D-RES-20',   image_url: null },
  { id: 'aox-oil',           slug: 'd-aox-oil',           name: 'D-AOX Oil',            vol: '20 ml',  price: 0,   was: null, badge: 'lim',  stripe: '#2c472f', tipo: 'aceite',   code: 'D-AOX-20',   image_url: null },
]

type ShopProduct = {
  id: string
  slug: string
  name: string
  vol: string
  price: number
  was: number | null
  badge: string | null
  stripe: string
  tipo: string
  code: string
  image_url: string | null
}

const TIPO_LABELS: Record<string, string> = {
  serum: 'Sérum', limpiador: 'Limpiador', aceite: 'Aceite',
  crema: 'Crema', protector: 'Protector solar', tonico: 'Tónico',
  ampollas: 'Ampollas', balsamo: 'Bálsamo',
}

const BADGE_LABELS: Record<string, string> = {
  new: 'Nuevo', best: 'Best-seller', lim: 'Edición limitada',
}
const BADGE_CLASSES: Record<string, string> = {
  new: 'bg-brand-600 text-cream-100',
  best: 'bg-terra-500 text-white',
  lim: 'bg-carbon-900 text-cream-100',
}

const STRIPE_BY_TIPO: Record<string, string> = {
  limpiador: '#83a886',
  serum: '#c4876a',
  aceite: '#2c472f',
  crema: '#d49070',
  tonico: '#d49070',
  protector: '#5d8a52',
  ampollas: '#c4876a',
  balsamo: '#2c472f',
}

function priceFmt(n: number) {
  if (n === 0) return 'Consultar'
  return n.toFixed(2).replace('.', ',').replace(/,00$/, '')
}

// ── Suplementos tab ──
type Supplement = {
  id: string
  slug: string
  name: string
  tagline: string | null
  price: number
  stock: number
  image_url: string | null
}

function SuplementosTab() {
  const [items, setItems] = useState<Supplement[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    async function fetchSupplements() {
      if (!supabase) { setLoading(false); return }
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: cats } = await (supabase as any)
          .from('categories').select('id, slug').in('slug', ['nutri', 'suplementos'])
        if (!cats?.length) { setLoading(false); return }
        const catIds = (cats as Array<{ id: string }>).map((c) => c.id)

        const { data } = await supabase
          .from('products')
          .select(`
            id, name, slug, tagline, image_url,
            product_variants (price_cents, is_default, active, stock_quantity)
          `)
          .eq('active', true)
          .in('category_id', catIds)
          .order('name', { ascending: true })

        if (!data) { setLoading(false); return }

        const mapped = (data as Array<{
          id: string; name: string; slug: string; tagline: string | null; image_url: string | null
          product_variants: Array<{ price_cents: number; is_default: boolean; active: boolean; stock_quantity: number }>
        }>).map((p) => {
          const v = p.product_variants?.find((x) => x.is_default && x.active) ?? p.product_variants?.find((x) => x.active)
          return {
            id: p.id, slug: p.slug, name: p.name, tagline: p.tagline,
            price: v ? v.price_cents / 100 : 0,
            stock: v?.stock_quantity ?? 0,
            image_url: p.image_url ?? null,
          }
        })
        setItems(mapped)
      } finally {
        setLoading(false)
      }
    }
    fetchSupplements()
  }, [])

  if (loading) {
    return (
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-9 pt-10 pb-20">
        <div className="flex items-center justify-center py-20">
          <span className="text-[14px] text-carbon-400 tracking-[0.06em]">Cargando suplementos…</span>
        </div>
      </section>
    )
  }

  return (
    <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-9 pt-10 pb-20">
      <div className="mb-8 max-w-[620px]">
        <span className="text-[10px] tracking-[0.22em] uppercase text-carbon-400 block mb-2">
          Nutrición Avanzada · Dall&apos;O Selfcare
        </span>
        <h2 className="font-serif font-normal text-[28px] sm:text-[34px] text-carbon-900 m-0 mb-3 leading-[1.15]">
          Suplementos de alta pureza biológica
        </h2>
        <p className="text-[14px] text-carbon-500 leading-[1.7] m-0">
          Fórmulas que nutren la vitalidad desde el interior del organismo y ayudan al equilibrio
          metabólico que se refleja en el exterior. Recomendamos valoración médica previa para
          ajustar la pauta a tu diagnóstico.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="text-[14px] text-carbon-500">No hay suplementos disponibles en este momento.</p>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid gap-[14px] grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
        >
          {items.map((p) => (
            <motion.article
              key={p.id}
              variants={fadeUp}
              className="group/card flex flex-col rounded-3xl overflow-hidden border border-cream-400 bg-cream-100 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-100/40 transition-[border-color,box-shadow,transform] duration-200"
            >
              <div
                className="relative overflow-hidden flex items-center justify-center rounded-t-3xl"
                style={{ aspectRatio: '1/1', background: '#ede9e0' }}
              >
                {p.image_url ? (
                  <Image src={p.image_url} alt={p.name} fill className="object-contain p-6" sizes="(max-width: 768px) 50vw, 25vw" />
                ) : (
                  <PackSVG id={p.id} vol="" stripe="#5d8a52" name={p.name} code={p.slug.toUpperCase().slice(0, 10)} />
                )}
                {p.stock === 0 && (
                  <span className="absolute top-[14px] left-[14px] px-[11px] py-[5px] rounded-full text-[10px] tracking-[0.12em] uppercase font-semibold bg-carbon-900 text-cream-100">
                    Agotado
                  </span>
                )}
                {p.price > 0 && p.stock > 0 && (
                  <button
                    onClick={() => addItem({ id: p.id, slug: p.slug, name: p.name, price: p.price, vol: '', image_url: p.image_url, stripe: '#5d8a52' })}
                    className="absolute bottom-4 left-4 right-4 bg-cream-100 text-carbon-900 border border-cream-400 rounded-full py-3 px-[18px] text-[12px] font-medium tracking-[0.04em] flex items-center justify-center gap-2 opacity-100 translate-y-0 lg:opacity-0 lg:translate-y-[10px] lg:group-hover/card:opacity-100 lg:group-hover/card:translate-y-0 transition-all duration-[350ms] hover:bg-brand-600 hover:text-cream-100 hover:border-brand-600"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14" /><path d="M5 12h14" />
                    </svg>
                    Añadir al carrito
                  </button>
                )}
              </div>
              <div className="pt-4 pb-4 px-6 flex flex-col gap-1">
                <span className="text-[10px] tracking-[0.18em] uppercase text-carbon-400 font-medium">
                  Suplemento
                  <span className="font-serif italic text-brand-700 tracking-[0.04em] font-normal text-[12px] ml-1 normal-case">· Dall&apos;O Selfcare</span>
                </span>
                <h3 className="font-serif font-medium text-[17px] tracking-tight text-carbon-900 m-0 leading-[1.2]">
                  {p.name}
                </h3>
                {p.tagline && <p className="text-[12px] text-carbon-500 leading-[1.5] m-0 mt-0.5">{p.tagline}</p>}
                <div className="flex items-baseline justify-between mt-1.5">
                  <span className="font-serif font-medium text-[16px] text-carbon-900">
                    {p.price > 0 ? `${priceFmt(p.price)} €` : 'Consultar precio'}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      )}

      <div className="mt-12 rounded-3xl border border-cream-400 bg-cream-200 p-7 sm:p-9 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <p className="text-[14px] text-carbon-500 leading-[1.65] m-0 flex-1">
          ¿No sabes qué suplemento necesitas? El diagnóstico SKIN-SCAN incluye un mapa mineral
          (OligoCheck) que permite ajustar la pauta a tu organismo.
        </p>
        <a
          href="https://wa.me/34683462705?text=Hola%2C%20me%20gustar%C3%ADa%20informaci%C3%B3n%20sobre%20los%20suplementos%20nutricionales."
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full border border-brand-600 text-brand-600 text-[13px] font-medium transition-all duration-200 hover:bg-brand-600 hover:text-cream-50 whitespace-nowrap"
        >
          Consultar en clínica
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
          </svg>
        </a>
      </div>
    </section>
  )
}

// ── Servicios tab ──
function ServiciosTab() {
  const allItems = TREATMENTS.flatMap(cat => cat.items)

  return (
    <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-9 pt-10 pb-20">
      <div className="grid gap-[14px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {allItems.map((item) => (
          <div
            key={item.name}
            className="flex flex-col gap-3 p-6 rounded-3xl border border-cream-400 bg-cream-100 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-100/40 transition-[border-color,box-shadow] duration-200"
          >
            <h3 className="font-serif font-medium text-[20px] text-carbon-900 m-0 leading-[1.2]">
              {item.name}
            </h3>
            <p className="text-[14px] text-carbon-500 leading-[1.6] m-0 flex-1">
              {item.desc}
            </p>
            <div className="flex items-center justify-between mt-2 pt-4" style={{ borderTop: '1px solid #ddd8cc' }}>
              <span className="font-serif text-[15px] text-carbon-700 font-medium">
                Consultar precio
              </span>
              <a
                href="/#booking"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-brand-600 text-cream-50 text-[12px] font-medium tracking-[0.02em] transition-all duration-200 hover:bg-brand-700 hover:-translate-y-0.5"
                style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
              >
                Reservar
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Productos tab ──
function ProductosTab() {
  const [products, setProducts] = useState<ShopProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFormat, setActiveFormat] = useState<string>('')
  const [activeSort, setActiveSort] = useState<string>('featured')
  const { addItem } = useCart()

  useEffect(() => {
    async function fetchProducts() {
      if (!supabase) {
        setProducts(FALLBACK_PRODUCTS)
        setLoading(false)
        return
      }
      try {
        // Step 1: get category IDs for skin lines
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: cats, error: catsErr } = await (supabase as any)
          .from('categories')
          .select('id, slug')
          .in('slug', ['limpiadores', 'serums', 'aceites'])

        if (catsErr || !cats || cats.length === 0) {
          setProducts(FALLBACK_PRODUCTS)
          setLoading(false)
          return
        }

        const catIds = (cats as Array<{ id: string; slug: string }>).map((c) => c.id)

        // Step 2: fetch products in those categories with their default variant
        const { data, error } = await supabase
          .from('products')
          .select(`
            id, name, slug, volume_ml, image_url,
            product_variants (price_cents, compare_at_cents, is_default, active)
          `)
          .eq('active', true)
          .in('category_id', catIds)
          .order('featured', { ascending: false })

        if (error || !data) {
          setProducts(FALLBACK_PRODUCTS)
          setLoading(false)
          return
        }

        const mapped: ShopProduct[] = (data as Array<{
          id: string
          name: string
          slug: string
          volume_ml: number | null
          image_url: string | null
          product_variants: Array<{ price_cents: number; compare_at_cents: number | null; is_default: boolean; active: boolean }>
        }>).map((p) => {
          const defaultVariant = p.product_variants?.find((v) => v.is_default && v.active)
            ?? p.product_variants?.find((v) => v.active)
          const price = defaultVariant ? defaultVariant.price_cents / 100 : 0
          const was = defaultVariant?.compare_at_cents ? defaultVariant.compare_at_cents / 100 : null
          const tipo = p.slug.includes('mousse') || p.slug.includes('limpi') ? 'limpiador'
            : p.slug.includes('oil') || p.slug.includes('aceite') || p.slug.includes('relief') ? 'aceite'
            : 'serum'
          return {
            id: p.id,
            slug: p.slug,
            name: p.name,
            vol: p.volume_ml ? `${p.volume_ml} ml` : '—',
            price,
            was,
            badge: null,
            stripe: STRIPE_BY_TIPO[tipo] ?? '#83a886',
            tipo,
            code: p.slug.toUpperCase().slice(0, 10),
            image_url: p.image_url ?? null,
          }
        })

        setProducts(mapped.length > 0 ? mapped : FALLBACK_PRODUCTS)
      } catch {
        setProducts(FALLBACK_PRODUCTS)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    let list = products.filter(p => {
      if (activeFormat && p.tipo !== activeFormat) return false
      return true
    })
    if (activeSort === 'price-asc')  list = [...list].sort((a, b) => a.price - b.price)
    if (activeSort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
    if (activeSort === 'name')       list = [...list].sort((a, b) => a.name.localeCompare(b.name))
    return list
  }, [products, activeFormat, activeSort])

  if (loading) {
    return (
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-9 pt-10 pb-20">
        <div className="flex items-center justify-center py-20">
          <span className="text-[14px] text-carbon-400 tracking-[0.06em]">Cargando productos…</span>
        </div>
      </section>
    )
  }

  return (
    <>
      {/* Sticky filter bar */}
      <div
        className="sticky z-20 backdrop-blur-[10px] mt-8"
        style={{
          top: '73px',
          background: 'rgba(245,242,236,0.94)',
          borderTop: '1px solid #ddd8cc',
          borderBottom: '1px solid #ddd8cc',
        }}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-9 py-[14px] sm:py-[18px] flex items-center gap-3 sm:gap-6 flex-wrap">
          <div className="flex gap-2 flex-wrap flex-1 min-w-0">
            {[
              { filter: '', label: 'Todos' },
              { filter: 'limpiador', label: 'Limpiadores', dot: '#83a886' },
              { filter: 'serum',     label: 'Sérums',      dot: '#c4876a' },
              { filter: 'aceite',    label: 'Aceites',     dot: '#2c472f' },
            ].map((chip) => {
              const isOn = activeFormat === chip.filter
              return (
                <button
                  key={chip.filter}
                  onClick={() => setActiveFormat(chip.filter)}
                  className="inline-flex items-center py-[9px] px-[18px] text-[13px] font-medium rounded-full cursor-pointer transition-all duration-200 whitespace-nowrap tracking-[0.01em]"
                  style={{
                    color: isOn ? '#f9f7f3' : '#1e1e1e',
                    background: isOn ? '#1e1e1e' : 'transparent',
                    border: `1px solid ${isOn ? '#1e1e1e' : '#ddd8cc'}`,
                  }}
                >
                  {'dot' in chip && chip.dot && (
                    <span
                      className="w-2 h-2 rounded-full mr-2 inline-block"
                      style={{ background: isOn ? '#f9f7f3' : chip.dot }}
                    />
                  )}
                  {chip.label}
                  <span className="ml-1.5 opacity-65">· {products.filter(p => !chip.filter || p.tipo === chip.filter).length}</span>
                </button>
              )
            })}
          </div>

          <div className="flex gap-2.5 items-center">
            <select
              value={activeSort}
              onChange={(e) => setActiveSort(e.target.value)}
              className="appearance-none bg-transparent rounded-full py-[9px] text-[13px] font-sans text-carbon-900 cursor-pointer transition-colors duration-200 focus:outline-none"
              style={{
                border: '1px solid #ddd8cc',
                padding: '9px 36px 9px 18px',
                backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none' stroke='%231e1e1e' stroke-width='1.4'><path d='m1 1.5 5 5 5-5'/></svg>")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 14px center',
              }}
            >
              <option value="featured">Destacados</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
              <option value="name">Nombre A — Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product grid */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-9 pt-10 pb-20">
        <div className="flex justify-between items-center mb-6 pb-4" style={{ borderBottom: '1px solid #ddd8cc' }}>
          <span className="text-[13px] text-carbon-500">
            <strong className="text-carbon-900 font-semibold">{filteredProducts.length}</strong> productos
          </span>
          {activeFormat && (
            <button
              onClick={() => setActiveFormat('')}
              className="inline-flex items-center gap-1.5 text-[12px] tracking-[0.04em] text-carbon-900 pb-px border-b border-carbon-900 cursor-pointer hover:text-brand-700 hover:border-brand-700 transition-colors"
            >
              Limpiar filtros
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          )}
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid gap-[14px] grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
        >
          {filteredProducts.map((p) => (
            <motion.article
              key={p.id}
              variants={fadeUp}
              className="group/card flex flex-col cursor-pointer rounded-3xl overflow-hidden border border-cream-400 bg-cream-100 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-100/40 transition-[border-color,box-shadow,transform] duration-200 will-change-transform"
              style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
              whileHover={{ y: -4, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] as const } }}
            >
              <div
                className="relative overflow-hidden flex items-center justify-center transition-colors duration-300 group-hover/card:bg-cream-300 rounded-t-3xl"
                style={{ aspectRatio: '1/1', background: '#ede9e0' }}
              >
                {p.badge && (
                  <span className={`absolute top-[14px] left-[14px] z-[2] px-[11px] py-[5px] rounded-full text-[10px] tracking-[0.12em] uppercase font-semibold ${BADGE_CLASSES[p.badge]}`}>
                    {BADGE_LABELS[p.badge]}
                  </span>
                )}
                <Link href={`/shop/${p.slug}`} aria-label={`Ver ${p.name}`} className="group-hover/card:-translate-y-1.5 transition-transform duration-500 will-change-transform w-full h-full absolute inset-0 flex items-center justify-center" style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}>
                  {p.image_url ? (
                    <Image
                      src={p.image_url}
                      alt={p.name}
                      fill
                      className="object-contain p-6"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  ) : (
                    <PackSVG id={p.id} vol={p.vol} stripe={p.stripe} name={p.name} code={p.code} />
                  )}
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    addItem({ id: p.id, slug: p.slug, name: p.name, price: p.price, vol: p.vol, image_url: p.image_url, stripe: p.stripe })
                  }}
                  className="absolute bottom-4 left-4 right-4 bg-cream-100 text-carbon-900 border border-cream-400 rounded-full py-3 px-[18px] text-[12px] font-medium tracking-[0.04em] flex items-center justify-center gap-2 opacity-100 translate-y-0 lg:opacity-0 lg:translate-y-[10px] lg:group-hover/card:opacity-100 lg:group-hover/card:translate-y-0 transition-all duration-[350ms] hover:bg-brand-600 hover:text-cream-100 hover:border-brand-600 will-change-transform"
                  style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14" /><path d="M5 12h14" />
                  </svg>
                  Añadir al carrito
                </button>
              </div>
              <div className="pt-4 pb-4 px-6 flex flex-col gap-1">
                <span className="text-[10px] tracking-[0.18em] uppercase text-carbon-400 font-medium">
                  {TIPO_LABELS[p.tipo] ?? p.tipo}
                  <span className="font-serif italic text-brand-700 tracking-[0.04em] font-normal text-[12px] ml-1 normal-case">· Dall&apos;O Skin</span>
                </span>
                <h3 className="font-serif font-medium text-[17px] tracking-tight text-carbon-900 m-0 leading-[1.2]">
                  <Link href={`/shop/${p.slug}`} className="hover:text-brand-700 transition-colors">
                    {p.name}
                  </Link>
                </h3>
                <div className="flex items-baseline justify-between mt-1.5">
                  <span className="font-serif font-medium text-[16px] text-carbon-900">
                    {p.price > 0 ? `${priceFmt(p.price)} €` : 'Consultar precio'}
                    {p.was && p.price > 0 && <span className="font-sans text-[12px] text-carbon-400 line-through ml-1.5">{priceFmt(p.was)} €</span>}
                  </span>
                  <span className="text-[11px] text-carbon-400 tracking-[0.04em]">{p.vol}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

      </section>
    </>
  )
}

export default function ShopPage() {
  const [activeTab, setActiveTab] = useState<'productos' | 'suplementos' | 'servicios'>('productos')

  return (
    <>
      <Navbar />

      {/* Collection Hero */}
      <section
        className="relative overflow-hidden border-b border-cream-400 px-4 sm:px-6 lg:px-9 py-12 sm:py-16 lg:py-20"
        style={{ background: '#ede9e0' }}
      >
        {/* Radial glows */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(600px 400px at 85% 10%, rgba(213, 226, 214, 0.45), transparent 60%),
              radial-gradient(500px 400px at 10% 90%, rgba(245, 228, 219, 0.45), transparent 60%)
            `,
          }}
        />
        <div className="max-w-[1600px] mx-auto relative z-[2]">
          {/* Breadcrumb */}
          <nav className="flex gap-[10px] items-center text-[12px] tracking-[0.04em] text-carbon-500 mb-6">
            <Link href="/" className="text-carbon-500 border-b border-transparent hover:border-carbon-500 transition-colors">Inicio</Link>
            <span className="text-carbon-400">/</span>
            <Link href="/shop" className="text-carbon-500 border-b border-transparent hover:border-carbon-500 transition-colors">Tienda</Link>
          </nav>

          <h1
            className="font-serif font-normal leading-[0.98] tracking-[-0.022em] m-0 mb-4 text-carbon-900 text-balance"
            style={{ fontSize: 'clamp(44px, 6vw, 84px)', maxWidth: '14ch' }}
          >
            Tienda
          </h1>
          <p className="text-[16px] sm:text-[17px] text-carbon-500 max-w-[560px] m-0 mb-7 leading-[1.65]">
            Cosmética clínica <em className="font-serif italic text-brand-700 not-italic">Dall&apos;O Skin</em>,
            seleccionada y aplicada bajo criterio médico en QUEVI.
          </p>

          <div className="flex flex-wrap gap-2">
            {[
              'Distribución oficial autorizada',
              'Fórmulas magistrales',
              'Formulación de grado clínico',
            ].map((chip) => (
              <span
                key={chip}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] tracking-[0.1em] uppercase text-brand-700"
                style={{ border: '1px solid rgba(53,85,57,0.25)', background: 'rgba(213,226,214,0.35)' }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {chip}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Tab switcher */}
      <div
        className="sticky z-20 backdrop-blur-[10px]"
        style={{
          top: '73px',
          background: 'rgba(245,242,236,0.94)',
          borderBottom: '1px solid #ddd8cc',
        }}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-9 py-[14px] flex items-center gap-2">
          {(['productos', 'suplementos', 'servicios'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="inline-flex items-center py-[9px] px-[22px] text-[13px] font-medium rounded-full cursor-pointer transition-all duration-200 capitalize tracking-[0.01em]"
              style={{
                color: activeTab === tab ? '#f9f7f3' : '#1e1e1e',
                background: activeTab === tab ? '#1e1e1e' : 'transparent',
                border: `1px solid ${activeTab === tab ? '#1e1e1e' : '#ddd8cc'}`,
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'productos' && <ProductosTab />}
      {activeTab === 'suplementos' && <SuplementosTab />}
      {activeTab === 'servicios' && <ServiciosTab />}

      {/* CTA strip */}
      <section
        id="diagnostico"
        className="relative overflow-hidden text-center px-4 sm:px-6 lg:px-9 py-16 sm:py-20 lg:py-24"
        style={{ background: '#355539', color: '#f9f7f3' }}
      >
        <div className="absolute pointer-events-none" style={{ top: '-120px', left: '-120px', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(213,226,214,0.10)', filter: 'blur(80px)' }} />
        <div className="absolute pointer-events-none" style={{ bottom: '-120px', right: '-120px', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(196,135,106,0.18)', filter: 'blur(80px)' }} />

        <div className="max-w-[720px] mx-auto relative z-[2]">
          <span
            className="inline-block px-4 py-1.5 rounded-full text-[11px] tracking-[0.2em] uppercase text-cream-100 mb-[22px]"
            style={{ background: 'rgba(245,242,236,0.12)', border: '1px solid rgba(245,242,236,0.22)' }}
          >
            SKIN-SCAN Multiespectral
          </span>
          <h3
            className="font-serif font-normal leading-[1.05] tracking-[-0.015em] m-0 mb-[18px] text-cream-100 text-balance"
            style={{ fontSize: 'clamp(32px, 4vw, 52px)' }}
          >
            ¿No sabes por dónde <em className="italic text-brand-300">empezar</em>?
          </h3>
          <p className="text-[16px] text-brand-200 m-0 mx-auto mb-8 max-w-[520px] leading-[1.6]">
            Reserva un diagnóstico médico gratuito en clínica QUEVI. Cruzamos tu ADN, tu mapa mineral y tu lectura facial 3D — y diseñamos un protocolo hecho a la medida de tu historia.
          </p>
          <div className="inline-flex gap-3 flex-wrap justify-center">
            <Link
              href="/#booking"
              className="inline-flex items-center gap-2.5 px-7 py-[14px] text-[13px] tracking-[0.02em] font-medium rounded-full bg-cream-100 text-brand-700 border border-cream-100 transition-all duration-300 hover:bg-transparent hover:text-cream-100 hover:-translate-y-0.5"
            >
              Reservar diagnóstico — gratis
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/#booking"
              className="inline-flex items-center gap-2.5 px-7 py-[14px] text-[13px] tracking-[0.02em] font-medium rounded-full text-cream-100 transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: 'transparent', border: '1px solid rgba(245,242,236,0.32)' }}
            >
              Hablar con un médico
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
