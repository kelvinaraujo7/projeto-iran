import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { findRouteConfig, isPublicRoute, isKnownRoute } from '@/lib/auth/route-config'
import { MiddlewareAuth } from '@/lib/auth/middleware-auth'
import { JwtUtils } from '@/lib/auth/jwt-utils'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Ignorar arquivos estáticos e APIs do Next.js
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }



  // NOVA LÓGICA: Tratar rota raiz "/"
  if (pathname === '/') {

    const token = MiddlewareAuth.extractToken(request)
    if (token && JwtUtils.isValid(token)) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    } else {
        return NextResponse.redirect(new URL('/auth', request.url))
    }
  }

  // Verificar se é uma rota conhecida
  const isRouteKnown = isKnownRoute(pathname)

  if (!isRouteKnown) {
   
    const token = MiddlewareAuth.extractToken(request)
    const decodedToken = token ? JwtUtils.isValid(token) : null
    
    if (decodedToken) {
      return NextResponse.redirect(new URL('/not-found', request.url))
    } else {
      const returnUrl = encodeURIComponent(pathname + request.nextUrl.search)
      return NextResponse.redirect(
        new URL(`/auth?returnUrl=${returnUrl}`, request.url)
      )
    }
  }

  const routeConfig = findRouteConfig(pathname)

  const config = routeConfig || { allowPublic: false }

  const token = MiddlewareAuth.extractToken(request)
  const decodedToken = token ? JwtUtils.isValid(token) : null

  if (pathname === '/tables') {

    const requiredRealmRoles = ['admin', 'manager', 'operator']
    const requiredClientRoles = ['HEAD_OFFICE_ADMIN']
    const userRealmRoles = decodedToken?.realm_access?.roles || []
    const userClientRoles = decodedToken?.resource_access?.agendamentos_backend?.roles || []
    
    const hasRealmRole = requiredRealmRoles.some(role => userRealmRoles.includes(role))
    
    const hasClientRole = requiredClientRoles.some(role => userClientRoles.includes(role))
    
    const hasPermission = hasRealmRole || hasClientRole
    
    if (!hasPermission) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  const authResult = MiddlewareAuth.validateAuth(request, config)

  if (!authResult.isValid || !authResult.hasPermission) {
    const redirectUrl = authResult.redirectUrl || '/auth'
    
    if (redirectUrl === '/auth' && !isPublicRoute(pathname)) {
      const returnUrl = encodeURIComponent(pathname + request.nextUrl.search)
      return NextResponse.redirect(
        new URL(`${redirectUrl}?returnUrl=${returnUrl}`, request.url)
      )
    }
    
    return NextResponse.redirect(new URL(redirectUrl, request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}