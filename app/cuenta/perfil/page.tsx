import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import ProfileForm from './ProfileForm'

export const metadata: Metadata = {
  title: 'Perfil',
}

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/cuenta/login')

  const name = (user.user_metadata?.full_name as string | undefined) ?? ''
  const email = user.email ?? ''

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream-200">
        <div className="max-w-[1000px] mx-auto px-6 pt-14 pb-6 border-b border-cream-400">
          <Link
            href="/cuenta"
            className="text-[10px] tracking-[0.2em] uppercase text-carbon-400 hover:text-carbon-900 transition-colors"
          >
            ← Mi cuenta
          </Link>
          <h1 className="font-serif text-[44px] font-normal text-carbon-900 mt-4 mb-2">
            Perfil
          </h1>
        </div>

        <div className="max-w-[1000px] mx-auto px-6 py-14">
          <ProfileForm name={name} email={email} />
        </div>
      </main>
      <Footer />
    </>
  )
}
