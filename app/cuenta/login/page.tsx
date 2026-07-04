'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import SocialLogin from '@/components/SocialLogin'
import QueviLogo from '@/components/QueviLogo'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/cuenta'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const supabase = createSupabaseBrowserClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError('Email o contraseña incorrectos.'); setLoading(false); return }
    router.push(redirect)
    router.refresh()
  }

  return (
    <div className="w-full max-w-sm bg-cream-50 rounded-2xl border border-cream-400 shadow-sm px-8 py-10">
      <div className="flex justify-center mb-8">
        <QueviLogo variant="dark" width={130} height={46} />
      </div>

      <div className="text-center mb-8">
        <h1 className="font-serif text-[30px] font-normal text-carbon-900 mb-1">Iniciar sesión</h1>
        <p className="text-[12px] text-carbon-400">Inicia sesión o crea una cuenta</p>
      </div>

      <SocialLogin redirectTo={redirect} />

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-cream-400" />
        <span className="text-[10px] tracking-[0.15em] uppercase text-carbon-400">o</span>
        <div className="flex-1 h-px bg-cream-400" />
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-cream-400 bg-cream-100 rounded-lg px-4 py-3 text-sm text-carbon-900 placeholder:text-carbon-400 focus:outline-none focus:border-brand-600 transition-colors"
          placeholder="Correo electrónico"
        />

        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-cream-400 bg-cream-100 rounded-lg px-4 py-3 text-sm text-carbon-900 placeholder:text-carbon-400 focus:outline-none focus:border-brand-600 transition-colors"
          placeholder="Contraseña"
        />

        {error && <p className="text-[12px] text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-brand-600 text-cream-50 text-[12px] tracking-[0.15em] uppercase py-3.5 hover:bg-brand-700 transition-colors disabled:opacity-60"
        >
          {loading ? 'Entrando...' : 'Continuar'}
        </button>
      </form>

      <div className="mt-6 flex flex-col items-center gap-3 text-[11px] text-carbon-400">
        <Link href="/cuenta/registro" className="hover:text-carbon-900 transition-colors">
          ¿No tienes cuenta? <span className="underline underline-offset-2">Regístrate</span>
        </Link>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-cream-200 flex items-center justify-center px-4 py-16">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  )
}
