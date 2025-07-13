import { NextRequest } from 'next/server'
import { DecodedToken, MiddlewareAuthResult, RouteConfig } from '@/types/auth'
import { JwtUtils } from './jwt-utils'

export class MiddlewareAuth {
  private static readonly CLIENT_ID = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'agendamentos_backend'

  static extractToken(request: NextRequest): string | null {

    const authHeader = request.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.substring(7)
    }

    const cookieToken = request.cookies.get('access_token')?.value
    if (cookieToken) {
      return cookieToken
    }

    const customHeader = request.headers.get('x-auth-token')
    if (customHeader) {
      return customHeader
    }

    return null
  }

static validateAuth(request: NextRequest, config: RouteConfig): MiddlewareAuthResult {
  
  if (config.allowPublic) {
    console.log(`🌍 Rota pública - acesso permitido`)
    return {
      isValid: true,
      hasPermission: true
    }
  }

  const token = this.extractToken(request)
  if (!token) {
    return {
      isValid: false,
      hasPermission: false,
      redirectUrl: '/auth',
      reason: 'Token não encontrado'
    }
  }

  const decodedToken = JwtUtils.isValid(token)
  if (!decodedToken) {
    return {
      isValid: false,
      hasPermission: false,
      redirectUrl: '/auth',
      reason: 'Token inválido ou expirado'
    }
  }

  if (!config.realmRoles && !config.clientRoles) {
    console.log(`✅ Sem requisitos de roles - acesso permitido`)
    return {
      isValid: true,
      hasPermission: true
    }
  }

  const hasPermission = this.checkPermissions(decodedToken, config)
  
  if (!hasPermission) {
    return {
      isValid: true,
      hasPermission: false,
      redirectUrl: '/unauthorized',
      reason: 'Permissões insuficientes'
    }
  }
  
  return {
    isValid: true,
    hasPermission: true
  }
}

private static checkPermissions(token: DecodedToken, config: RouteConfig): boolean {
  
  let realmCheck = true
  let clientCheck = true

  if (config.realmRoles?.length) {
    const userRealmRoles = JwtUtils.getRealmRoles(token)
    
    if (config.requireAllRoles) {
      realmCheck = JwtUtils.hasAllRealmRoles(token, config.realmRoles)
    } else {
      realmCheck = JwtUtils.hasAnyRealmRole(token, config.realmRoles)
    }
  } else {
    console.log(`🎭 No realm role required`)
  }

  if (config.clientRoles?.length) {
    const userClientRoles = JwtUtils.getClientRoles(token, this.CLIENT_ID)
    
    if (config.requireAllRoles) {
      clientCheck = JwtUtils.hasAllClientRoles(token, config.clientRoles, this.CLIENT_ID)
    } else {
      clientCheck = JwtUtils.hasAnyClientRole(token, config.clientRoles, this.CLIENT_ID)
    }
  } else {
    console.log(`🏢 No client role required`)
  }

  const finalResult = realmCheck && clientCheck

  return finalResult
}

  static logAccess(request: NextRequest, result: MiddlewareAuthResult, token?: DecodedToken): void {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔒 Middleware Auth:', {
        path: request.nextUrl.pathname,
        method: request.method,
        user: token?.preferred_username || 'anonymous',
        userRoles: token ? {
          realm: JwtUtils.getRealmRoles(token),
          client: JwtUtils.getClientRoles(token, this.CLIENT_ID)
        } : null,
        isValid: result.isValid,
        hasPermission: result.hasPermission,
        reason: result.reason,
        timestamp: new Date().toISOString()
      })
    }
  }
}