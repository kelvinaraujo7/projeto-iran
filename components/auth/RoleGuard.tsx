"use client"
import { useRoles } from '@/hooks/useRoles'

interface RoleGuardProps {
  children: React.ReactNode
  realmRoles?: string[]
  clientRoles?: string[]
  requireAll?: boolean
  fallback?: React.ReactNode
}

export default function RoleGuard({
  children,
  realmRoles = [],
  clientRoles = [],
  requireAll = false,
  fallback = null
}: RoleGuardProps) {
  const { hasAnyRealmRole, hasAnyClientRole, hasAllRealmRoles, hasAllClientRoles } = useRoles()

  const hasPermission = () => {
    let hasRealmPermission = true
    let hasClientPermission = true

    if (realmRoles.length > 0) {
      hasRealmPermission = requireAll 
        ? hasAllRealmRoles(realmRoles)
        : hasAnyRealmRole(realmRoles)
    }

    if (clientRoles.length > 0) {
      hasClientPermission = requireAll
        ? hasAllClientRoles(clientRoles)
        : hasAnyClientRole(clientRoles)
    }

    return hasRealmPermission && hasClientPermission
  }

  if (!hasPermission()) {
    return <>{fallback}</>
  }

  return <>{children}</>
}