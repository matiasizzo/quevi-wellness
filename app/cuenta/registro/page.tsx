'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import SocialLogin from '@/components/SocialLogin'
import QueviLogo from '@/components/QueviLogo'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (password !== confirm) { setError('Las contraseñas no coinciden.'); return }
    if (password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres.'); return }
    setLoading(true)
    const supabase = createSupabaseBrowserClient()
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name }, emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) { setError(error.message); setLoading(false); return }
    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <main className="min-h-screen bg-cream-200 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm bg-cream-50 rounded-2xl border border-cream-400 shadow-sm px-8 py-10 text-center">
          <div className="flex justify-center mb-8">
            <QueviLogo variant="dark" width={130} height={46} />
          </div>
          <h2 className="font-serif text-[30px] font-normal text-carbon-900 mb-4">Revisa tu email</h2>
          <p className="text-[14px] text-carbon-500 mb-8 leading-relaxed">
            Te hemos enviado un enlace de confirmación a <strong className="text-carbon-900">{email}</strong>.
          </p>
          <Link href="/" className="text-[11px] underline underline-offset-2 text-carbon-400 hover:text-carbon-900">
            Volver al inicio
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-cream-200 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm bg-cream-50 rounded-2xl border border-cream-400 shadow-sm px-8 py-10">
        <div className="flex justify-center mb-8">
          <QueviLogo variant="dark" width={130} height={46} />
        </div>

        <div className="text-center mb-8">
          <h1 className="font-serif text-[30px] font-normal text-carbon-900 mb-1">Crear cuenta</h1>
          <p className="text-[12px] text-carbon-400">Únete a la comunidad QUEVI</p>
        </div>

        <SocialLogin />

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-cream-400" />
          <span className="text-[10px] tracking-[0.15em] uppercase text-carbon-400">o</span>
          <div className="flex-1 h-px bg-cream-400" />
        </div>

        <form onSubmit={handleRegister} className="space-y-3">
          {[
            { placeholder: 'Nombre completo', value: name, onChange: setName, type: 'text', required: true },
            { placeholder: 'Correo electrónico', value: email, onChange: setEmail, type: 'email', required: true },
            { placeholder: 'Contraseña (mínimo 8 caracteres)', value: password, onChange: setPassword, type: 'password', required: true },
            { placeholder: 'Confirmar contraseña', value: confirm, onChange: setConfirm, type: 'password', required: true },
          ].map((f) => (
            <input
              key={f.placeholder}
              type={f.type}
              required={f.required}
              value={f.value}
              onChange={(e) => f.onChange(e.target.value)}
              placeholder={f.placeholder}
              className="w-full border border-cream-400 bg-cream-100 rounded-lg px-4 py-3 text-sm text-carbon-900 placeholder:text-carbon-400 focus:outline-none focus:border-brand-600 transition-colors"
            />
          ))}

          {error && <p className="text-[12px] text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-brand-600 text-cream-50 text-[12px] tracking-[0.15em] uppercase py-3.5 hover:bg-brand-700 transition-colors disabled:opacity-60 !mt-5"
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] text-carbon-400">
          ¿Ya tienes cuenta?{' '}
          <Link href="/cuenta/login" className="underline underline-offset-2 hover:text-carbon-900">
            Inicia sesión
          </Link>
        </p>
      </div>
    </main>
  )
}
