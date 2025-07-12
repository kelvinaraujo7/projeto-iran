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

  // ✅ LOG PRINCIPAL - SEMPRE APARECE PRIMEIRO
  console.log(`\n🚀 ===== MIDDLEWARE EXECUTADO =====`)
  console.log(`📍 Rota acessada: ${request.method} ${pathname}`)
  console.log(`🌐 URL completa: ${request.url}`)
  console.log(`🕐 Timestamp: ${new Date().toISOString()}`)

  // NOVA LÓGICA: Tratar rota raiz "/"
  if (pathname === '/') {
    console.log('🏠 Rota raiz acessada - reescrevendo para /auth')

    const token = MiddlewareAuth.extractToken(request)
    if (token && JwtUtils.isValid(token)) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    } else {
        return NextResponse.redirect(new URL('/auth', request.url))
    }
  }

  // Verificar se é uma rota conhecida
  const isRouteKnown = isKnownRoute(pathname)
  console.log(`📍 Rota conhecida: ${isRouteKnown}`)

  // Se a rota não é conhecida, tratar como 404
  if (!isRouteKnown) {
    console.log(`❓ Rota não encontrada: ${pathname}`)
    
    const token = MiddlewareAuth.extractToken(request)
    const decodedToken = token ? JwtUtils.isValid(token) : null
    
    if (decodedToken) {
      console.log(`✅ Usuário autenticado - redirecionando para /not-found`)
      return NextResponse.redirect(new URL('/not-found', request.url))
    } else {
      console.log(`❌ Usuário não autenticado - redirecionando para /auth`)
      const returnUrl = encodeURIComponent(pathname + request.nextUrl.search)
      return NextResponse.redirect(
        new URL(`/auth?returnUrl=${returnUrl}`, request.url)
      )
    }
  }

  // Encontrar configuração específica da rota
  const routeConfig = findRouteConfig(pathname)
  console.log(`📋 Configuração encontrada para ${pathname}:`, JSON.stringify(routeConfig, null, 2))

  const config = routeConfig || { allowPublic: false }
  console.log(`🔒 Configuração final:`, JSON.stringify(config, null, 2))

  // ✅ EXTRAIR TOKEN E DECODIFICAR ANTES DA VALIDAÇÃO
  const token = MiddlewareAuth.extractToken(request)
  const decodedToken = token ? JwtUtils.isValid(token) : null
  
  console.log(`🔑 Token encontrado: ${!!token}`)
  console.log(`👤 Token válido: ${!!decodedToken}`)
  
  if (decodedToken) {
    console.log(`👤 Usuário: ${decodedToken.preferred_username || decodedToken.email}`)
    console.log(`🎭 Realm Roles: ${JSON.stringify(decodedToken.realm_access?.roles || [])}`)
    console.log(`🏢 Client Roles: ${JSON.stringify(decodedToken.resource_access?.agendamentos_backend?.roles || [])}`)
  }

  // ✅ VERIFICAÇÃO MANUAL DE PERMISSÕES PARA /tables
  if (pathname === '/tables') {
    console.log(`\n🔍 ===== VERIFICAÇÃO ESPECÍFICA PARA /tables =====`)
    
    const requiredRealmRoles = ['admin', 'manager', 'operator']
    const requiredClientRoles = ['HEAD_OFFICE_ADMIN']
    const userRealmRoles = decodedToken?.realm_access?.roles || []
    const userClientRoles = decodedToken?.resource_access?.agendamentos_backend?.roles || []
    
    console.log(`🎯 Roles necessárias (realm): ${JSON.stringify(requiredRealmRoles)}`)
    console.log(`🎯 Roles necessárias (client): ${JSON.stringify(requiredClientRoles)}`)
    console.log(`👤 Roles do usuário (realm): ${JSON.stringify(userRealmRoles)}`)
    console.log(`👤 Roles do usuário (client): ${JSON.stringify(userClientRoles)}`)
    
    // Verificar se tem alguma role realm necessária
    const hasRealmRole = requiredRealmRoles.some(role => userRealmRoles.includes(role))
    console.log(`✅ Tem role realm necessária: ${hasRealmRole}`)
    
    // Verificar se tem alguma role client necessária
    const hasClientRole = requiredClientRoles.some(role => userClientRoles.includes(role))
    console.log(`✅ Tem role client necessária: ${hasClientRole}`)
    
    // Com requireAllRoles: false, precisa de pelo menos uma
    const hasPermission = hasRealmRole || hasClientRole
    console.log(`✅ Tem permissão final: ${hasPermission}`)
    console.log(`===============================================\n`)
    
    if (!hasPermission) {
      console.log(`❌ ACESSO NEGADO A /tables - Redirecionando para /unauthorized`)
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  // Validar autenticação e autorização
  const authResult = MiddlewareAuth.validateAuth(request, config)
  console.log(`✅ Resultado da autenticação:`, JSON.stringify(authResult, null, 2))

  // ✅ LOG DETALHADO DE REDIRECIONAMENTO
  if (!authResult.isValid || !authResult.hasPermission) {
    const redirectUrl = authResult.redirectUrl || '/auth'
    
    console.log(`\n❌ ===== ACESSO NEGADO =====`)
    console.log(`📍 Rota original: ${pathname}`)
    console.log(`🚫 isValid: ${authResult.isValid}`)
    console.log(`🚫 hasPermission: ${authResult.hasPermission}`)
    console.log(`🚫 Motivo: ${authResult.reason || 'Não especificado'}`)
    console.log(`➡️ Redirecionando para: ${redirectUrl}`)
    console.log(`===========================\n`)
    
    if (redirectUrl === '/auth' && !isPublicRoute(pathname)) {
      const returnUrl = encodeURIComponent(pathname + request.nextUrl.search)
      return NextResponse.redirect(
        new URL(`${redirectUrl}?returnUrl=${returnUrl}`, request.url)
      )
    }
    
    return NextResponse.redirect(new URL(redirectUrl, request.url))
  }

  console.log(`\n✅ ===== ACESSO PERMITIDO =====`)
  console.log(`📍 Rota: ${pathname}`)
  console.log(`👤 Usuário: ${decodedToken?.preferred_username || 'Anônimo'}`)
  console.log(`==============================\n`)
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}