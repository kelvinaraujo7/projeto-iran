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

    console.log('🔍 AuthContext - checkAuthState iniciado')
    console.log('🔍 AuthContext - setIsLoading(true)')
    setIsLoading(true)

    const token = localStorage.getItem('access_token')
    console.log('🔑 Token no localStorage:', !!token)

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        console.log('👤 Payload do token:', payload.preferred_username)
        console.log('⏰ Token expira em:', new Date(payload.exp * 1000))
        console.log('⏰ Agora:', new Date())
        
        if (payload.exp * 1000 > Date.now()) {
          console.log('✅ Token válido - setando usuário')
          console.log('✅ AuthContext - setUser(payload)')
          setUser(payload)
          document.cookie = `access_token=${token}; path=/; max-age=${payload.exp - Math.floor(Date.now() / 1000)}`
          // Opcional: definir cookie para o middleware
          
        } else {
          console.log('❌ Token expirado - removendo')
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
          console.log('❌ AuthContext - setUser(null)')
          setUser(null)
        }
      } catch (error) {
        console.error('❌ Erro ao verificar token:', error)
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
        setUser(null)
      }
    }else {
      console.log('❌ Nenhum token encontrado')
      console.log('❌ AuthContext - setUser(null) - sem token')
      setUser(null)
    }
  
    console.log('✅ AuthContext - checkAuthState finalizado')
    console.log('✅ AuthContext - setIsLoading(false)')
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

      // Definir cookie para o middleware
      document.cookie = `access_token=${data.access_token}; path=/; max-age=${payload.exp - Math.floor(Date.now() / 1000)}`

      return true
    } catch (error) {
      console.error('Erro no login:', error)
      return false
    }
  }

  // ✅ NOVA FUNÇÃO DE LOGOUT COM KEYCLOAK
  const logout = async (): Promise<void> => {
    try {
      console.log('🚪 Iniciando logout...')
      
      // Pegar tokens antes de limpar
      const accessToken = localStorage.getItem('access_token')
      const refreshToken = localStorage.getItem('refresh_token')
      
      if (refreshToken) {
        console.log('🔐 Fazendo logout no Keycloak...')
        
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
                // Opcional: incluir token no header
                ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
              },
              body: new URLSearchParams({
                client_id: clientId!,
                client_secret: clientSecret!,
                refresh_token: refreshToken
              })
            }
          )

          if (logoutResponse.ok) {
            console.log('✅ Logout no Keycloak realizado com sucesso')
          } else {
            console.warn('⚠️ Resposta não OK do Keycloak:', logoutResponse.status, logoutResponse.statusText)
            // Continuar com logout local mesmo se falhar no Keycloak
          }
        } catch (keycloakError) {
          console.warn('⚠️ Erro ao fazer logout no Keycloak:', keycloakError)
          // Continuar com logout local mesmo se falhar no Keycloak
        }
      } else {
        console.log('ℹ️ Nenhum refresh token encontrado - fazendo apenas logout local')
      }
    } catch (error) {
      console.warn('⚠️ Erro durante processo de logout:', error)
    } finally {
      // ✅ SEMPRE LIMPAR DADOS LOCAIS (mesmo se logout no Keycloak falhar)
      console.log('🧹 Limpando dados locais...')
      
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
      
      setUser(null)
      
      console.log('✅ Logout concluído - redirecionando para /auth')
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
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}