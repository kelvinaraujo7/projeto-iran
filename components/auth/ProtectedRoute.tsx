"use client"
import { useAuth } from '@/context/AuthContext'
import { useRoles } from '@/hooks/useRoles'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRealmRoles?: string[]
  requiredClientRoles?: string[]
  requireAllRoles?: boolean
  fallbackPath?: string
  showError?: boolean
}

export default function ProtectedRoute({
  children,
  requiredRealmRoles = [],
  requiredClientRoles = [],
  requireAllRoles = false,
  fallbackPath = '/auth',
  showError = true
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const { hasAnyRealmRole, hasAnyClientRole, hasAllRealmRoles, hasAllClientRoles } = useRoles()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(fallbackPath)
    }
  }, [isAuthenticated, isLoading, router, fallbackPath])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const hasPermission = () => {
    let hasRealmPermission = true
    let hasClientPermission = true

    if (requiredRealmRoles.length > 0) {
      hasRealmPermission = requireAllRoles 
        ? hasAllRealmRoles(requiredRealmRoles)
        : hasAnyRealmRole(requiredRealmRoles)
    }

    if (requiredClientRoles.length > 0) {
      hasClientPermission = requireAllRoles
        ? hasAllClientRoles(requiredClientRoles)
        : hasAnyClientRole(requiredClientRoles)
    }

    return hasRealmPermission && hasClientPermission
  }

  if (!hasPermission()) {
    if (showError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Você não tem permissão para acessar esta página.
                <br />
                <span className="text-sm text-gray-600">
                  Roles necessárias: {[...requiredRealmRoles, ...requiredClientRoles].join(', ')}
                </span>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )
    }
    
    router.push('/unauthorized')
    return null
  }

  return <>{children}</>
}