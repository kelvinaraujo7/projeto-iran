"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  sub: string
  email: string
  name: string
  preferred_username: string
  unitId?: string
  realm_access?: {
    roles: string[]
  }
  resource_access?: {
    [key: string]: {
      roles: string[]
    }
  }
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  getToken: () => string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuthState()
  }, [])

  const checkAuthState = async () => {
    setIsLoading(true)

    const token = localStorage.getItem('access_token')

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        
        if (payload.exp * 1000 > Date.now()) {
          setUser(payload)
          document.cookie = `access_token=${token}; path=/; max-age=${payload.exp - Math.floor(Date.now() / 1000)}`
          
        } else {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
          setUser(null)
        }
      } catch (error) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
        setUser(null)
      }
    }else {
      setUser(null)
    }
  
    setIsLoading(false)
  }

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const keycloakUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL
      const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM
      const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID
      const clientSecret = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET

      const response = await fetch(`${keycloakUrl}/realms/${realm}/protocol/openid-connect/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId!,
          client_secret: clientSecret!,
          grant_type: 'password',
          username,
          password,
          scope: 'openid profile email roles'
        })
      })

      if (!response.ok) {
        throw new Error('Credenciais inválidas')
      }

      const data = await response.json()
      
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('refresh_token', data.refresh_token)

      const payload = JSON.parse(atob(data.access_token.split('.')[1]))
      setUser(payload)

      document.cookie = `access_token=${data.access_token}; path=/; max-age=${payload.exp - Math.floor(Date.now() / 1000)}`

      return true
    } catch (error) {
      return false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      const accessToken = localStorage.getItem('access_token')
      const refreshToken = localStorage.getItem('refresh_token')
      
      if (refreshToken) {       
        const keycloakUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL
        const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM
        const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID
        const clientSecret = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET

        try {
          const logoutResponse = await fetch(
            `${keycloakUrl}/realms/${realm}/protocol/openid-connect/logout`, 
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                // Optional: include token in header
                ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
              },
              body: new URLSearchParams({
                client_id: clientId!,
                client_secret: clientSecret!,
                refresh_token: refreshToken
              })
            }
          )

        } catch (keycloakError) {
          // console.warn('⚠️ Error logging out of Keycloak:', keycloakError)
    
        }
      } else {
        // console.log('ℹ️ No refresh token found - just logging out locally')
      }
    } catch (error) {
      // console.warn('⚠️ Error during logout process:', error)
    } finally {      
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
      
      setUser(null)
    
      router.push('/auth')
    }
  }

  const getToken = () => {
    return localStorage.getItem('access_token')
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      getToken
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used inside an AuthProvider')
  }
  return context
}