// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicRoutes = ['/', '/login', '/signup', '/share', '/privacy', '/terms']
const authRoutes = ['/login', '/signup']
const protectedRoutes = ['/inbox', '/analytics', '/settings']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('__session')?.value

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith('/share/')
  )
  
  // Check if route requires auth
  const isAuthRoute = authRoutes.includes(pathname)
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )

  // Redirect logic
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/inbox', request.url))
  }

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}