'use client'

import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="text-[12px] tracking-[0.1em] uppercase text-carbon-400 hover:text-carbon-900 transition-colors underline underline-offset-4"
    >
      Cerrar sesión
    </button>
  )
}
