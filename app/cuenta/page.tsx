import { redirect } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import LogoutButton from './LogoutButton'

export const metadata = {
  title: 'Mi cuenta',
}

export default async function AccountPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/cuenta/login')

  const name = user.user_metadata?.full_name as string | undefined
  const email = user.email ?? ''

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream-200">
        <div className="max-w-[1000px] mx-auto px-6 py-16">
          <div className="max-w-2xl">
            <h1 className="font-serif text-[44px] font-normal text-carbon-900 mb-2">
              {name ? `Hola, ${name.split(' ')[0]}` : 'Mi cuenta'}
            </h1>
            <p className="text-[14px] text-carbon-400 mb-12">{email}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
              <Link
                href="/cuenta/pedidos"
                className="border border-cream-400 bg-cream-100 rounded-2xl p-6 hover:border-brand-400 transition-colors group"
              >
                <p className="font-serif text-[20px] font-normal text-carbon-900 mb-1 group-hover:text-brand-600 transition-colors">
                  Mis pedidos
                </p>
                <p className="text-[12px] text-carbon-400">Historial y estado de envíos</p>
              </Link>

              <Link
                href="/cuenta/perfil"
                className="border border-cream-400 bg-cream-100 rounded-2xl p-6 hover:border-brand-400 transition-colors group"
              >
                <p className="font-serif text-[20px] font-normal text-carbon-900 mb-1 group-hover:text-brand-600 transition-colors">
                  Perfil
                </p>
                <p className="text-[12px] text-carbon-400">Nombre, email y contraseña</p>
              </Link>

              <Link
                href="/shop"
                className="border border-cream-400 bg-cream-100 rounded-2xl p-6 hover:border-brand-400 transition-colors group"
              >
                <p className="font-serif text-[20px] font-normal text-carbon-900 mb-1 group-hover:text-brand-600 transition-colors">
                  Seguir comprando
                </p>
                <p className="text-[12px] text-carbon-400">Ver todos los productos</p>
              </Link>

              <Link
                href="/#booking"
                className="border border-cream-400 bg-cream-100 rounded-2xl p-6 hover:border-brand-400 transition-colors group"
              >
                <p className="font-serif text-[20px] font-normal text-carbon-900 mb-1 group-hover:text-brand-600 transition-colors">
                  Reservar cita
                </p>
                <p className="text-[12px] text-carbon-400">Diagnóstico y tratamientos</p>
              </Link>
            </div>

            <LogoutButton />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
