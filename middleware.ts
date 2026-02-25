import { NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { createServerClient } from '@supabase/ssr'

const intlMiddleware = createMiddleware({
  locales: ['en', 'zh'],
  defaultLocale: 'en',
})

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Run intl middleware first
  const intlResponse = intlMiddleware(request)

  // Check auth for dashboard routes
  const isDashboard = /^\/(en|zh)(\/|$)(?!login)/.test(pathname)
  const isLoginPage = /^\/(en|zh)\/login/.test(pathname)
  const isRoot = pathname === '/'

  if (isRoot) {
    return NextResponse.redirect(new URL('/en', request.url))
  }

  if (!isDashboard && !isLoginPage) {
    return intlResponse
  }

  // Create supabase client to check session
  let response = intlResponse || NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options as Parameters<typeof response.cookies.set>[2])
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const locale = pathname.split('/')[1] || 'en'

  if (!user && isDashboard) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
  }

  if (user && isLoginPage) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icon.svg).*)'],
}
