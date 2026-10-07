import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isMaintenanceBlocked, MAINTENANCE_HTML } from '@/lib/maintenance'

export async function middleware(request: NextRequest) {
  // Modo mantenimiento (lib/maintenance.ts): la página se sirve en la propia
  // URL, sin redirigir, para que cada una quede como "temporalmente cerrada"
  if (isMaintenanceBlocked(request.nextUrl.pathname)) {
    return new NextResponse(MAINTENANCE_HTML, {
      status: 503,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Retry-After': '86400',
        // Sin caché en la CDN: al reabrir la web, el cambio es inmediato
        'Cache-Control': 'no-store',
      },
    })
  }

  if (!request.nextUrl.pathname.startsWith('/cuenta')) {
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isAuthRoute = request.nextUrl.pathname.startsWith('/cuenta/login') ||
    request.nextUrl.pathname.startsWith('/cuenta/registro')

  const isProtectedRoute = request.nextUrl.pathname.startsWith('/cuenta') && !isAuthRoute

  // Redirige usuarios sin sesión fuera de rutas protegidas
  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/cuenta/login'
    url.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Redirige usuarios con sesión fuera de login/registro
  if (isAuthRoute && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/cuenta'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  // Todo menos los recursos que necesitan las páginas que siguen abiertas
  matcher: ['/((?!_next/static|_next/image|images/|favicon.ico).*)'],
}
