'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2, MapPin, Clock, Phone, ArrowRight, Star } from 'lucide-react'
import { SITE } from '@/content'
import { getAttribution } from '@/lib/attribution'
import { trackLead } from '@/lib/gtag'
import type { LandingCopy } from '@/lib/landingCopy'

/**
 * Landing de campaña. Su único trabajo es que alguien deje el teléfono.
 *
 * Decisiones que importan y conviene no deshacer sin pensarlo:
 *  · El formulario se ve sin hacer scroll. Todo lo demás está por debajo.
 *  · No hay menú de navegación: cada enlace de salida es una visita pagada
 *    que se escapa.
 *  · No se cobra nada aquí. El flujo con seña de 50 € sigue existiendo en la
 *    home para quien ya conoce la clínica, pero para tráfico frío mata la
 *    conversión.
 *  · La conversión se dispara en el estado de éxito en línea, sin redirección:
 *    una navegación puede cancelar el envío de la etiqueta.
 */

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '34683462705'

const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${SITE.name} ${SITE.address}`
)}`

export default function LeadLanding({ copy }: { copy: LandingCopy }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', interest: '' })
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    copy.locale === 'es'
      ? 'Hola, quiero pedir cita para el diagnóstico de piel.'
      : 'Hello, I would like to book the skin diagnosis.'
  )}`

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          service: form.interest || copy.form.interestOptions[0],
          locale: copy.locale,
          source: copy.source,
          ...getAttribution(),
        }),
      })
      if (!res.ok) throw new Error('request failed')

      // Conversión principal de toda la cuenta de Google Ads
      trackLead({
        email: form.email,
        phone: form.phone,
        service: form.interest,
        language: copy.locale,
      })
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    // El layout raíz declara lang="es"; la versión inglesa lo corrige aquí
    <main className="bg-cream-200 min-h-screen" lang={copy.locale}>
      {/* ─── Cabecera mínima: logo, idioma y teléfono ─────────────────────── */}
      <header className="border-b border-cream-400 bg-cream-100">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5" aria-label={SITE.name}>
            <Image
              src="/images/logo.jpeg"
              alt=""
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="font-serif text-[15px] tracking-[0.08em] text-carbon-900">QUEVI</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href={copy.altHref}
              className="text-[12px] tracking-[0.08em] uppercase text-carbon-400 hover:text-brand-600 transition-colors"
            >
              {copy.altLabel}
            </Link>
            <a
              href={`tel:${SITE.phone.replace(/\s/g, '')}`}
              className="inline-flex items-center gap-2 text-[13px] font-medium text-brand-700 hover:text-brand-600 transition-colors"
            >
              <Phone size={15} strokeWidth={1.6} />
              <span className="hidden sm:inline">{SITE.phone}</span>
            </a>
          </div>
        </div>
      </header>

      {/* ─── Oferta + formulario, sin scroll ──────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-16">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-16 items-start">
          {/* Argumento */}
          <div>
            <p className="text-[11px] tracking-[0.16em] uppercase text-brand-600 mb-5">
              {copy.eyebrow}
            </p>
            <h1 className="font-serif text-[34px] sm:text-[46px] leading-[1.06] font-normal text-carbon-900 text-balance mb-5">
              {copy.headline}{' '}
              <em className="italic text-brand-600">{copy.headlineEm}</em>
            </h1>
            <p className="text-[15px] sm:text-[16px] leading-[1.7] text-carbon-500 max-w-[54ch] mb-7">
              {copy.subheadline}
            </p>

            {/* La oferta, en números */}
            <div className="inline-flex items-baseline gap-3 px-5 py-3 rounded-full bg-brand-600 text-cream-50 mb-8">
              <span className="text-[15px] line-through opacity-60">{copy.offer.was}</span>
              <span className="font-serif text-[22px]">{copy.offer.now}</span>
              <span className="text-[12px] opacity-80 hidden sm:inline">· {copy.offer.note}</span>
            </div>

            <ul className="flex flex-col gap-3 mb-9">
              {copy.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <CheckCircle2
                    size={17}
                    strokeWidth={1.6}
                    className="text-brand-500 flex-shrink-0 mt-[3px]"
                  />
                  <span className="text-[14px] leading-[1.6] text-carbon-700">{b}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-8 pt-7 border-t border-cream-400">
              {copy.stats.map((s) => (
                <div key={s.label}>
                  <p className="font-serif text-[26px] text-brand-600 leading-none mb-1.5">
                    {s.value}
                  </p>
                  <p className="text-[11px] tracking-[0.1em] uppercase text-carbon-400">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Formulario */}
          <div id="form" className="lg:sticky lg:top-8 scroll-mt-24">
            <div className="bg-cream-100 border border-cream-400 rounded-2xl p-6 sm:p-8 shadow-brand">
              {status === 'sent' ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 size={26} strokeWidth={1.5} className="text-brand-600" />
                  </div>
                  <h2 className="font-serif text-[26px] text-carbon-900 mb-3">
                    {copy.form.successTitle}
                  </h2>
                  <p className="text-[14px] leading-[1.7] text-carbon-500 mb-7">
                    {copy.form.successBody}
                  </p>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-600 text-cream-50 text-[13px] font-medium hover:bg-brand-700 transition-colors"
                  >
                    {copy.form.whatsapp}
                    <ArrowRight size={15} strokeWidth={1.8} />
                  </a>
                </div>
              ) : (
                <>
                  <h2 className="font-serif text-[26px] font-normal text-carbon-900 mb-1.5">
                    {copy.form.title}
                  </h2>
                  <p className="text-[13px] text-carbon-400 mb-6">{copy.form.subtitle}</p>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                    <Field
                      label={copy.form.name}
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      autoComplete="name"
                      required
                    />
                    <Field
                      label={copy.form.phone}
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      autoComplete="tel"
                      required
                    />
                    <Field
                      label={copy.form.email}
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      autoComplete="email"
                      required
                    />

                    <label className="flex flex-col gap-1.5">
                      <span className="text-[12px] tracking-[0.04em] text-carbon-500">
                        {copy.form.interest}
                      </span>
                      <select
                        name="interest"
                        value={form.interest}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-cream-400 bg-cream-50 text-[14px] text-carbon-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-colors"
                      >
                        <option value="">—</option>
                        {copy.form.interestOptions.map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </label>

                    <label className="flex items-start gap-2.5 mt-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        required
                        className="mt-[3px] w-4 h-4 accent-brand-600 cursor-pointer flex-shrink-0"
                      />
                      <span className="text-[12px] leading-[1.55] text-carbon-400">
                        {copy.form.consent}{' '}
                        <Link
                          href="/privacidad"
                          className="underline underline-offset-2 hover:text-brand-600 transition-colors"
                        >
                          {copy.form.consentLink}
                        </Link>
                        .
                      </span>
                    </label>

                    {status === 'error' && (
                      <p className="text-[13px] text-terra-600 bg-terra-50 border border-terra-200 rounded-xl px-4 py-3">
                        {copy.form.error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="mt-1 w-full py-4 rounded-full bg-brand-600 text-cream-50 text-[13px] tracking-[0.06em] font-medium transition-all duration-200 hover:bg-brand-700 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 disabled:hover:translate-y-0"
                    >
                      {status === 'sending' ? copy.form.sending : copy.form.submit}
                    </button>

                    <p className="text-[11px] leading-[1.5] text-carbon-300 text-center mt-1">
                      {copy.form.disclaimer}
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Qué incluye ──────────────────────────────────────────────────── */}
      <section className="bg-cream-100 border-y border-cream-400">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
          <h2 className="font-serif text-[28px] sm:text-[34px] font-normal text-carbon-900 mb-10">
            {copy.includes.title}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {copy.includes.items.map((item) => (
              <div key={item.n}>
                <p className="font-serif text-[13px] text-brand-400 mb-3">{item.n}</p>
                <h3 className="text-[15px] font-medium text-carbon-900 mb-2.5 leading-[1.35]">
                  {item.title}
                </h3>
                <p className="text-[13.5px] leading-[1.65] text-carbon-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Prueba social ────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
        <h2 className="font-serif text-[28px] sm:text-[34px] font-normal text-carbon-900 mb-10">
          {copy.testimonialsTitle}
        </h2>
        <div className="grid sm:grid-cols-3 gap-5">
          {copy.testimonials.map((t) => (
            <figure
              key={t.name}
              className="bg-cream-100 border border-cream-400 rounded-2xl p-6 m-0"
            >
              <div className="flex gap-0.5 mb-4" aria-label="5/5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} className="fill-brand-400 text-brand-400" />
                ))}
              </div>
              <blockquote className="text-[14px] leading-[1.7] text-carbon-700 m-0 mb-4">
                “{t.text}”
              </blockquote>
              <figcaption className="text-[12px] tracking-[0.06em] uppercase text-carbon-400">
                {t.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ─── Dónde estamos ────────────────────────────────────────────────── */}
      <section className="bg-brand-700 text-cream-100">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-18">
          <div className="grid sm:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="font-serif text-[28px] sm:text-[34px] font-normal mb-7">
                {copy.location.title}
              </h2>
              <div className="flex flex-col gap-5">
                <InfoRow icon={<MapPin size={17} strokeWidth={1.6} />} value={SITE.address} />
                <InfoRow
                  icon={<Clock size={17} strokeWidth={1.6} />}
                  label={copy.location.hoursLabel}
                  value={copy.location.hours}
                />
                <InfoRow
                  icon={<Phone size={17} strokeWidth={1.6} />}
                  value={SITE.phone}
                  href={`tel:${SITE.phone.replace(/\s/g, '')}`}
                />
              </div>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full border border-cream-100/40 text-[13px] font-medium hover:bg-cream-100 hover:text-brand-700 transition-colors"
              >
                {copy.location.directions}
                <ArrowRight size={15} strokeWidth={1.8} />
              </a>
            </div>

            {/* FAQ */}
            <div>
              <h2 className="font-serif text-[24px] font-normal mb-6">{copy.faqTitle}</h2>
              <div className="flex flex-col gap-5">
                {copy.faq.map((f) => (
                  <div key={f.q} className="border-b border-cream-100/15 pb-5 last:border-0">
                    <p className="text-[14px] font-medium mb-1.5">{f.q}</p>
                    <p className="text-[13.5px] leading-[1.65] text-cream-100/70 m-0">{f.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Barra fija en móvil ──────────────────────────────────────────── */}
      {status !== 'sent' && (
        <div className="lg:hidden sticky bottom-0 z-40 p-3 bg-cream-100/95 border-t border-cream-400 backdrop-blur">
          <a
            href="#form"
            className="block w-full text-center py-3.5 rounded-full bg-brand-600 text-cream-50 text-[13px] tracking-[0.06em] font-medium"
          >
            {copy.stickyCta}
          </a>
        </div>
      )}

      <footer className="max-w-6xl mx-auto px-5 sm:px-8 py-8 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-carbon-300">
        <span>© {new Date().getFullYear()} {SITE.name}</span>
        <Link href="/aviso-legal" className="hover:text-carbon-500 transition-colors">Aviso legal</Link>
        <Link href="/privacidad" className="hover:text-carbon-500 transition-colors">Privacidad</Link>
        <Link href="/politica-cookies" className="hover:text-carbon-500 transition-colors">Cookies</Link>
      </footer>
    </main>
  )
}

// ─── Piezas ──────────────────────────────────────────────────────────────────

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12px] tracking-[0.04em] text-carbon-500">{label}</span>
      <input
        {...props}
        className="w-full px-4 py-3 rounded-xl border border-cream-400 bg-cream-50 text-[14px] text-carbon-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-colors"
      />
    </label>
  )
}

function InfoRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode
  label?: string
  value: string
  href?: string
}) {
  const content = (
    <div className="flex items-start gap-3">
      <span className="text-cream-100/60 mt-0.5 flex-shrink-0">{icon}</span>
      <span>
        {label && <span className="block text-[11px] tracking-[0.1em] uppercase text-cream-100/50 mb-0.5">{label}</span>}
        <span className="text-[14px] leading-[1.5]">{value}</span>
      </span>
    </div>
  )
  return href ? (
    <a href={href} className="hover:text-cream-50 transition-colors">{content}</a>
  ) : (
    content
  )
}
