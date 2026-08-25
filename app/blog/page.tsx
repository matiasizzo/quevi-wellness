import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { BLOG_POSTS } from '@/lib/blogPosts'

export const metadata: Metadata = {
  alternates: { canonical: '/blog' },
  title: 'Journal — Ciencia de la piel',
  description:
    'Artículos sobre medicina estética de precisión, diagnóstico genético, fotobiomodulación, cortisol y regeneración cutánea. Por el equipo médico de QUEVI Wellness Clinic.',
}

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream-200">
        {/* Header */}
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 pt-16 pb-10 text-center">
          <span className="text-[11px] tracking-[0.32em] uppercase text-carbon-400 block mb-4">
            — Journal QUEVI
          </span>
          <h1
            className="font-serif font-normal leading-[1.02] tracking-[-0.018em] m-0 mb-4 text-carbon-900"
            style={{ fontSize: 'clamp(38px, 5vw, 64px)' }}
          >
            Ciencia que se <em className="italic text-brand-600">entiende</em>.
          </h1>
          <p className="text-[16px] text-carbon-500 max-w-[540px] mx-auto leading-[1.65]">
            Sin humo y sin promesas vacías: lo que la evidencia dice sobre tu piel,
            explicado por nuestro equipo médico.
          </p>
        </div>

        {/* Posts */}
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 pb-24">
          <div className="grid gap-5 sm:grid-cols-2">
            {BLOG_POSTS.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col gap-3 p-7 rounded-3xl border border-cream-400 bg-cream-100 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-100/40 hover:-translate-y-1 transition-all duration-200"
                style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
              >
                <div className="flex items-center gap-3 text-[11px] tracking-[0.14em] uppercase">
                  <span className="px-3 py-1 rounded-full bg-brand-100 text-brand-700 font-medium normal-case tracking-normal text-xs">
                    {post.category}
                  </span>
                  <span className="text-carbon-400">{post.date}</span>
                </div>
                <h2 className="font-serif font-medium text-[22px] leading-[1.25] text-carbon-900 m-0 group-hover:text-brand-700 transition-colors">
                  {post.title}
                </h2>
                <p className="text-[14px] text-carbon-500 leading-[1.65] m-0 flex-1">
                  {post.excerpt}
                </p>
                <span className="inline-flex items-center gap-2 text-[12px] tracking-[0.14em] uppercase text-brand-600 font-medium mt-2 group-hover:gap-3 transition-all">
                  Leer artículo
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
