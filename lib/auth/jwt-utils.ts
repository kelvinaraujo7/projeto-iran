import { DecodedToken } from '@/types/auth'

export class JwtUtils {
  /**
   * Decodifica um JWT token
   */
  static decode(token: string): DecodedToken | null {
    try {
      // Remover 'Bearer ' se presente
      const cleanToken = token.replace(/^Bearer\s+/i, '')
      
      // Verificar formato do token (deve ter 3 partes)
      const parts = cleanToken.split('.')
      if (parts.length !== 3) {
        console.error('Token inválido: formato incorreto')
        return null
      }

      // Decodificar payload (parte do meio)
      const payload = parts[1]
      
      // Adicionar padding para base64 se necessário
      const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4)
      
      const decodedPayload = atob(paddedPayload)
      return JSON.parse(decodedPayload) as DecodedToken
    } catch (error) {
      console.error('Erro ao decodificar token:', error)
      return null
    }
  }

  /**
   * Verifica se o token expirou
   */
  static isExpired(token: DecodedToken): boolean {
    if (!token.exp) return true
    return token.exp * 1000 <= Date.now()
  }

  /**
   * Verifica se o token é válido (decodifica e verifica expiração)
   */
  static isValid(tokenString: string): DecodedToken | null {
    const decoded = this.decode(tokenString)
    if (!decoded) return null
    
    if (this.isExpired(decoded)) {
      console.log('Token expirado')
      return null
    }
    
    return decoded
  }

  /**
   * Extrai roles do realm
   */
  static getRealmRoles(token: DecodedToken): string[] {
    return token.realm_access?.roles || []
  }

  /**
   * Extrai roles do client específico
   */
  static getClientRoles(token: DecodedToken, clientId: string): string[] {
    return token.resource_access?.[clientId]?.roles || []
  }

  /**
   * Verifica se tem pelo menos uma role do realm
   */
  static hasAnyRealmRole(token: DecodedToken, roles: string[]): boolean {
    const userRoles = this.getRealmRoles(token)
    return roles.some(role => userRoles.includes(role))
  }

  /**
   * Verifica se tem todas as roles do realm
   */
  static hasAllRealmRoles(token: DecodedToken, roles: string[]): boolean {
    const userRoles = this.getRealmRoles(token)
    return roles.every(role => userRoles.includes(role))
  }

  /**
   * Verifica se tem pelo menos uma role do client
   */
  static hasAnyClientRole(token: DecodedToken, roles: string[], clientId: string): boolean {
    const userRoles = this.getClientRoles(token, clientId)
    return roles.some(role => userRoles.includes(role))
  }

  /**
   * Verifica se tem todas as roles do client
   */
  static hasAllClientRoles(token: DecodedToken, roles: string[], clientId: string): boolean {
    const userRoles = this.getClientRoles(token, clientId)
    return roles.every(role => userRoles.includes(role))
  }
}