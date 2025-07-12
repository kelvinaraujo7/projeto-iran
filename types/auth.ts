export interface RouteConfig {
  realmRoles?: string[]           // Roles do realm Keycloak
  clientRoles?: string[]          // Roles do client específico
  requireAllRoles?: boolean       // true = precisa de TODAS, false = precisa de PELO MENOS UMA
  allowPublic?: boolean    
  redirectToAuth?: boolean       // true = rota pública, não precisa de auth
}

export interface DecodedToken {
  sub: string                     // ID do usuário
  exp: number                     // Timestamp de expiração
  iat: number                     // Timestamp de criação
  realm_access?: {
    roles: string[]               // Roles do realm
  }
  resource_access?: {
    [clientId: string]: {
      roles: string[]             // Roles do client
    }
  }
  preferred_username?: string     // Username
  email?: string                  // Email
  name?: string                   // Nome completo
}

export interface MiddlewareAuthResult {
  isValid: boolean               // Token é válido?
  hasPermission: boolean         // Tem permissão para a rota?
  reason?: string               // Motivo da negação
  redirectUrl?: string          // Para onde redirecionar se negado
}