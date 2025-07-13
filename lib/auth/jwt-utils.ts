import { DecodedToken } from '@/types/auth'

export class JwtUtils {
 
  static decode(token: string): DecodedToken | null {
    try {
      const cleanToken = token.replace(/^Bearer\s+/i, '')
      
      const parts = cleanToken.split('.')
      if (parts.length !== 3) {
        return null
      }

      const payload = parts[1]
      
      const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4)
      
      const decodedPayload = atob(paddedPayload)
      return JSON.parse(decodedPayload) as DecodedToken
    } catch (error) {
      return null
    }
  }

  static isExpired(token: DecodedToken): boolean {
    if (!token.exp) return true
    return token.exp * 1000 <= Date.now()
  }

  static isValid(tokenString: string): DecodedToken | null {
    const decoded = this.decode(tokenString)
    if (!decoded) return null
    
    if (this.isExpired(decoded)) {
      return null
    }
    
    return decoded
  }

  static getRealmRoles(token: DecodedToken): string[] {
    return token.realm_access?.roles || []
  }

  static getClientRoles(token: DecodedToken, clientId: string): string[] {
    return token.resource_access?.[clientId]?.roles || []
  }

  static hasAnyRealmRole(token: DecodedToken, roles: string[]): boolean {
    const userRoles = this.getRealmRoles(token)
    return roles.some(role => userRoles.includes(role))
  }

  static hasAllRealmRoles(token: DecodedToken, roles: string[]): boolean {
    const userRoles = this.getRealmRoles(token)
    return roles.every(role => userRoles.includes(role))
  }

  static hasAnyClientRole(token: DecodedToken, roles: string[], clientId: string): boolean {
    const userRoles = this.getClientRoles(token, clientId)
    return roles.some(role => userRoles.includes(role))
  }

  static hasAllClientRoles(token: DecodedToken, roles: string[], clientId: string): boolean {
    const userRoles = this.getClientRoles(token, clientId)
    return roles.every(role => userRoles.includes(role))
  }
}