import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { BLOG_POSTS } from '@/lib/blogPosts'

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = BLOG_POSTS.find((p) => p.slug === slug)
  if (!post) return { title: 'Artículo no encontrado' }
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.dateISO,
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = BLOG_POSTS.find((p) => p.slug === slug)
  if (!post) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.dateISO,
    author: { '@type': 'Organization', name: 'QUEVI Wellness Clinic' },
    publisher: { '@type': 'Organization', name: 'QUEVI Wellness Clinic' },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main className="min-h-screen bg-cream-200">
        <article className="max-w-[720px] mx-auto px-4 sm:px-6 pt-14 pb-24">
          <Link
            href="/blog"
            className="text-[10px] tracking-[0.2em] uppercase text-carbon-400 hover:text-carbon-900 transition-colors"
          >
            ← Journal
          </Link>

          <div className="flex items-center gap-3 mt-6 mb-4">
            <span className="px-3 py-1 rounded-full bg-brand-100 text-brand-700 font-medium text-xs">
              {post.category}
            </span>
            <span className="text-[12px] text-carbon-400">{post.date}</span>
          </div>

          <h1
            className="font-serif font-normal leading-[1.08] tracking-[-0.015em] m-0 mb-8 text-carbon-900"
            style={{ fontSize: 'clamp(30px, 4.4vw, 48px)' }}
          >
            {post.title}
          </h1>

          <div className="flex flex-col gap-5">
            {post.body.map((paragraph, i) => (
              <p key={i} className="text-[16px] text-carbon-700 leading-[1.8] m-0">
                {paragraph}
              </p>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 p-8 rounded-3xl bg-brand-600 text-center">
            <h2 className="font-serif text-[24px] font-normal text-cream-50 m-0 mb-3">
              ¿Quieres saber qué necesita <em className="italic">tu</em> piel?
            </h2>
            <p className="text-[14px] text-brand-100 m-0 mb-6">
              Empieza por el diagnóstico SKIN-SCAN Multiespectral — la primera consulta es gratuita.
            </p>
            <Link
              href="/#booking"
              className="inline-flex items-center gap-2 px-7 py-3 bg-cream-100 text-brand-700 rounded-full font-medium text-[13px] transition-all duration-200 hover:-translate-y-0.5"
            >
              Reservar diagnóstico
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
