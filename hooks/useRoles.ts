import { useAuth } from '@/context/AuthContext'

export const useRoles = () => {
  const { user } = useAuth()

  const hasRealmRole = (role: string): boolean => {
    return user?.realm_access?.roles?.includes(role) || false
  }

  const hasClientRole = (role: string, clientId?: string): boolean => {
    const client = clientId || process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'agendamentos_backend'
    return user?.resource_access?.[client]?.roles?.includes(role) || false
  }

  const hasAnyRealmRole = (roles: string[]): boolean => {
    return roles.some(role => hasRealmRole(role))
  }

  const hasAnyClientRole = (roles: string[], clientId?: string): boolean => {
    return roles.some(role => hasClientRole(role, clientId))
  }

  const hasAllRealmRoles = (roles: string[]): boolean => {
    return roles.every(role => hasRealmRole(role))
  }

  const hasAllClientRoles = (roles: string[], clientId?: string): boolean => {
    return roles.every(role => hasClientRole(role, clientId))
  }

  const getUserRoles = () => {
    const realmRoles = user?.realm_access?.roles || []
    const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'agendamentos_backend'
    const clientRoles = user?.resource_access?.[clientId]?.roles || []
    
    return {
      realmRoles,
      clientRoles,
      allRoles: [...realmRoles, ...clientRoles]
    }
  }

  return {
    hasRealmRole,
    hasClientRole,
    hasAnyRealmRole,
    hasAnyClientRole,
    hasAllRealmRoles,
    hasAllClientRoles,
    getUserRoles,
    user
  }
}