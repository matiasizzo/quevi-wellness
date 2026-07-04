'use client'

import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

interface Props {
  name: string
  email: string
}

export default function ProfileForm({ name: initialName, email }: Props) {
  const [name, setName] = useState(initialName)
  const [nameLoading, setNameLoading] = useState(false)
  const [nameMsg, setNameMsg] = useState<{ ok: boolean; text: string } | null>(null)

  const [resetLoading, setResetLoading] = useState(false)
  const [resetMsg, setResetMsg] = useState<{ ok: boolean; text: string } | null>(null)

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault()
    setNameLoading(true)
    setNameMsg(null)
    const supabase = createSupabaseBrowserClient()
    const { error } = await supabase.auth.updateUser({ data: { full_name: name.trim() } })
    setNameMsg(error
      ? { ok: false, text: 'No se pudo guardar. Inténtalo de nuevo.' }
      : { ok: true, text: 'Nombre actualizado.' }
    )
    setNameLoading(false)
  }

  async function handlePasswordReset() {
    setResetLoading(true)
    setResetMsg(null)
    const supabase = createSupabaseBrowserClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/cuenta/perfil`,
    })
    setResetMsg(error
      ? { ok: false, text: 'No se pudo enviar el email. Inténtalo de nuevo.' }
      : { ok: true, text: `Email enviado a ${email}. Revisa tu bandeja de entrada.` }
    )
    setResetLoading(false)
  }

  return (
    <div className="space-y-10 max-w-md">

      <section>
        <h2 className="font-serif text-[22px] font-normal text-carbon-900 mb-6">Nombre</h2>
        <form onSubmit={handleSaveName} className="space-y-4">
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-carbon-400 mb-2">
              Nombre completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-cream-400 bg-cream-100 rounded-lg px-4 py-3 text-sm text-carbon-900 placeholder:text-carbon-400 focus:outline-none focus:border-brand-600 transition-colors"
            />
          </div>
          {nameMsg && (
            <p className={`text-[12px] ${nameMsg.ok ? 'text-brand-600' : 'text-red-600'}`}>
              {nameMsg.text}
            </p>
          )}
          <button
            type="submit"
            disabled={nameLoading}
            className="border border-brand-600 text-brand-600 text-[10px] tracking-[0.2em] uppercase px-8 py-3 rounded-full hover:bg-brand-600 hover:text-cream-50 transition-colors disabled:opacity-50"
          >
            {nameLoading ? 'Guardando...' : 'Guardar'}
          </button>
        </form>
      </section>

      <div className="border-t border-cream-400" />

      <section>
        <h2 className="font-serif text-[22px] font-normal text-carbon-900 mb-6">Email</h2>
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase text-carbon-400 mb-2">
            Correo electrónico
          </label>
          <p className="text-sm text-carbon-900 py-3 border-b border-cream-400">{email}</p>
        </div>
      </section>

      <div className="border-t border-cream-400" />

      <section>
        <h2 className="font-serif text-[22px] font-normal text-carbon-900 mb-2">Contraseña</h2>
        <p className="text-[12px] text-carbon-400 mb-6">
          Te enviaremos un email para que puedas establecer una nueva contraseña.
        </p>
        {resetMsg && (
          <p className={`text-[12px] mb-4 ${resetMsg.ok ? 'text-brand-600' : 'text-red-600'}`}>
            {resetMsg.text}
          </p>
        )}
        <button
          onClick={handlePasswordReset}
          disabled={resetLoading || resetMsg?.ok === true}
          className="border border-brand-600 text-brand-600 text-[10px] tracking-[0.2em] uppercase px-8 py-3 rounded-full hover:bg-brand-600 hover:text-cream-50 transition-colors disabled:opacity-50"
        >
          {resetLoading ? 'Enviando...' : 'Enviar email de cambio'}
        </button>
      </section>

    </div>
  )
}
