import { NextRequest } from 'next/server'
import { DecodedToken, MiddlewareAuthResult, RouteConfig } from '@/types/auth'
import { JwtUtils } from './jwt-utils'

export class MiddlewareAuth {
  private static readonly CLIENT_ID = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'agendamentos_backend'

  /**
   * Extrai o token da requisição (múltiplas fontes)
   */
  static extractToken(request: NextRequest): string | null {
    // 1. Tentar pegar do header Authorization
    const authHeader = request.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.substring(7)
    }

    // 2. Tentar pegar dos cookies
    const cookieToken = request.cookies.get('access_token')?.value
    if (cookieToken) {
      return cookieToken
    }

    // 3. Tentar pegar do header personalizado
    const customHeader = request.headers.get('x-auth-token')
    if (customHeader) {
      return customHeader
    }

    return null
  }

  /**
   * Função principal: valida autenticação e autorização
   */
  // Em lib/auth/middleware-auth.ts
static validateAuth(request: NextRequest, config: RouteConfig): MiddlewareAuthResult {
  console.log(`\n🔐 ===== VALIDANDO AUTENTICAÇÃO =====`)
  console.log(`📋 Configuração recebida:`, JSON.stringify(config, null, 2))
  
  // Se a rota é pública, permitir acesso
  if (config.allowPublic) {
    console.log(`🌍 Rota pública - acesso permitido`)
    return {
      isValid: true,
      hasPermission: true
    }
  }

  // Extrair e validar token
  const token = this.extractToken(request)
  if (!token) {
    console.log(`❌ Token não encontrado`)
    return {
      isValid: false,
      hasPermission: false,
      redirectUrl: '/auth',
      reason: 'Token não encontrado'
    }
  }

  const decodedToken = JwtUtils.isValid(token)
  if (!decodedToken) {
    console.log(`❌ Token inválido ou expirado`)
    return {
      isValid: false,
      hasPermission: false,
      redirectUrl: '/auth',
      reason: 'Token inválido ou expirado'
    }
  }

  console.log(`✅ Token válido para usuário: ${decodedToken.preferred_username}`)

  // Se não há requisitos de roles, permitir acesso para usuário autenticado
  if (!config.realmRoles && !config.clientRoles) {
    console.log(`✅ Sem requisitos de roles - acesso permitido`)
    return {
      isValid: true,
      hasPermission: true
    }
  }

  // Verificar permissões baseadas em roles
  const hasPermission = this.checkPermissions(decodedToken, config)
  console.log(`🔍 Resultado da verificação de roles: ${hasPermission}`)
  
  if (!hasPermission) {
    console.log(`❌ Usuário não tem permissões necessárias`)
    return {
      isValid: true,
      hasPermission: false,
      redirectUrl: '/unauthorized',
      reason: 'Permissões insuficientes'
    }
  }

  console.log(`✅ Validação completa - acesso permitido`)
  console.log(`=====================================\n`)
  
  return {
    isValid: true,
    hasPermission: true
  }
}

/**
 * Verifica se o token tem as permissões necessárias
 */
private static checkPermissions(token: DecodedToken, config: RouteConfig): boolean {
  console.log(`\n🔍 ===== VERIFICANDO PERMISSÕES =====`)
  console.log(`📋 Configuração:`, JSON.stringify(config, null, 2))
  
  let realmCheck = true
  let clientCheck = true

  // Verificar realm roles se especificadas
  if (config.realmRoles?.length) {
    console.log(`🎭 Verificando realm roles: ${JSON.stringify(config.realmRoles)}`)
    const userRealmRoles = JwtUtils.getRealmRoles(token)
    console.log(`👤 Roles do usuário (realm): ${JSON.stringify(userRealmRoles)}`)
    
    if (config.requireAllRoles) {
      realmCheck = JwtUtils.hasAllRealmRoles(token, config.realmRoles)
      console.log(`🔍 Precisa de TODAS as realm roles: ${realmCheck}`)
    } else {
      realmCheck = JwtUtils.hasAnyRealmRole(token, config.realmRoles)
      console.log(`🔍 Precisa de PELO MENOS UMA realm role: ${realmCheck}`)
    }
  } else {
    console.log(`🎭 Nenhuma realm role requerida`)
  }

  // Verificar client roles se especificadas
  if (config.clientRoles?.length) {
    console.log(`🏢 Verificando client roles: ${JSON.stringify(config.clientRoles)}`)
    const userClientRoles = JwtUtils.getClientRoles(token, this.CLIENT_ID)
    console.log(`👤 Roles do usuário (client): ${JSON.stringify(userClientRoles)}`)
    
    if (config.requireAllRoles) {
      clientCheck = JwtUtils.hasAllClientRoles(token, config.clientRoles, this.CLIENT_ID)
      console.log(`🔍 Precisa de TODAS as client roles: ${clientCheck}`)
    } else {
      clientCheck = JwtUtils.hasAnyClientRole(token, config.clientRoles, this.CLIENT_ID)
      console.log(`🔍 Precisa de PELO MENOS UMA client role: ${clientCheck}`)
    }
  } else {
    console.log(`🏢 Nenhuma client role requerida`)
  }

  const finalResult = realmCheck && clientCheck
  console.log(`✅ Resultado final: realmCheck(${realmCheck}) && clientCheck(${clientCheck}) = ${finalResult}`)
  console.log(`=====================================\n`)

  return finalResult
}

  /**
   * Log de auditoria para debug
   */
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