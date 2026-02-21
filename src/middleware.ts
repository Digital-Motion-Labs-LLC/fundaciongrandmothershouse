import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Set locale cookie if not present
  if (!request.cookies.get('locale')) {
    const acceptLanguage = request.headers.get('accept-language') || ''
    const locale = acceptLanguage.startsWith('en') ? 'en' : 'es'
    response.cookies.set('locale', locale, { path: '/', maxAge: 31536000 })
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|assets|logos|favicon.ico|admin).*)'],
}
