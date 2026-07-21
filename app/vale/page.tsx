'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

type CheckResult = {
  valid: boolean
  error?: string
  itemName?: string
  totalSessions?: number
  sessionsUsed?: number
  sessionsLeft?: number
  status?: string
  expiresAt?: string | null
  usable?: boolean
}

const STATUS_LABELS: Record<string, string> = {
  active: 'Activo',
  redeemed: 'Ya canjeado',
  cancelled: 'Cancelado',
  expired: 'Caducado',
}

export default function ValePage() {
  const [code, setCode] = useState('')
  const [result, setResult] = useState<CheckResult | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleCheck(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/gift-cards/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      setResult(await res.json())
    } catch {
      setResult({ valid: false, error: 'Error de conexión' })
    } finally {
      setLoading(false)
    }
  }

  function fmtDate(iso?: string | null) {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream-200 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <span className="text-[11px] tracking-[0.28em] uppercase text-carbon-400 block mb-2">Vale regalo</span>
            <h1 className="font-serif text-[34px] font-normal text-carbon-900 m-0 mb-2">Comprueba tu vale</h1>
            <p className="text-[14px] text-carbon-500 leading-[1.6]">
              Introduce el código de tu tarjeta regalo para ver su estado y las sesiones disponibles.
            </p>
          </div>

          <form onSubmit={handleCheck} className="flex flex-col gap-3 bg-cream-50 border border-cream-400 rounded-2xl p-6 shadow-sm">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="QUEVI-XXXX-XXXX"
              className="w-full border border-cream-400 bg-cream-100 rounded-lg px-4 py-3 text-center font-mono tracking-[0.2em] text-carbon-900 placeholder:text-carbon-400 placeholder:tracking-normal outline-none focus:border-brand-600 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="w-full rounded-full bg-brand-600 text-cream-50 text-[12px] tracking-[0.15em] uppercase py-3.5 hover:bg-brand-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Comprobando…' : 'Comprobar vale'}
            </button>
          </form>

          {result && (
            <div className="mt-5 bg-cream-50 border border-cream-400 rounded-2xl p-6">
              {!result.valid ? (
                <p className="text-[14px] text-red-600 text-center">{result.error ?? 'Código no válido'}</p>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] tracking-[0.14em] uppercase text-carbon-400">Estado</span>
                    <span
                      className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium"
                      style={result.usable
                        ? { background: 'rgba(53,85,57,0.14)', color: '#355539' }
                        : { background: 'rgba(30,30,30,0.08)', color: '#666' }}
                    >
                      {STATUS_LABELS[result.status ?? 'active'] ?? result.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-cream-300 pt-3">
                    <span className="text-[13px] text-carbon-500">Experiencia</span>
                    <span className="text-[14px] text-carbon-900 font-medium text-right">{result.itemName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-carbon-500">Sesiones disponibles</span>
                    <span className="text-[14px] text-carbon-900 font-medium">
                      {result.sessionsLeft} / {result.totalSessions}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-carbon-500">Válido hasta</span>
                    <span className="text-[14px] text-carbon-900">{fmtDate(result.expiresAt)}</span>
                  </div>

                  {result.usable ? (
                    <a
                      href="https://wa.me/34683462705?text=Hola%2C%20quiero%20canjear%20mi%20vale%20regalo."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-brand-600 text-cream-50 text-[13px] font-medium hover:bg-brand-700 transition-colors"
                    >
                      Agendar por WhatsApp
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                      </svg>
                    </a>
                  ) : (
                    <p className="text-[12px] text-carbon-400 text-center mt-1">
                      Este vale no se puede canjear en este momento. Contáctanos si crees que es un error.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
