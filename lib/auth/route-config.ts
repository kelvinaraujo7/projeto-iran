import { RouteConfig } from '@/types/auth'

/**
 * Configuração de proteção por rota
 * IMPORTANTE: Rotas mais específicas devem vir primeiro!
 */
export const routeConfigs: Record<string, RouteConfig> = {
  // === ROTAS ADMINISTRATIVAS ===
  '/admin/users/create': {
    realmRoles: ['admin'],
    clientRoles: ['create-users'],
    requireAllRoles: true
  },

  '/admin/users': {
    realmRoles: ['admin'],
    clientRoles: ['manage-users'],
    requireAllRoles: true
  },

  '/admin/system': {
    realmRoles: ['admin', 'super-admin'],
    requireAllRoles: false
  },

  '/admin': {
    realmRoles: ['admin'],
    requireAllRoles: true
  },

  // === GESTÃO ===
  '/management/reports': {
    realmRoles: ['manager'],
    clientRoles: ['view-reports', 'generate-reports'],
    requireAllRoles: true
  },

  '/management': {
    realmRoles: ['manager', 'supervisor'],
    requireAllRoles: false
  },

  // === USUÁRIOS ===
  '/users/create': {
    realmRoles: ['admin', 'user-manager'],
    clientRoles: ['create-users'],
    requireAllRoles: false
  },

  '/users': {
    realmRoles: ['user-manager', 'admin'],
    clientRoles: ['view-users'],
    requireAllRoles: false
  },

  // === RELATÓRIOS ===
  '/reports/financial': {
    realmRoles: ['financial-manager', 'admin'],
    clientRoles: ['view-financial-reports'],
    requireAllRoles: false
  },

  '/reports': {
    clientRoles: ['view-reports'],
    requireAllRoles: true
  },

  // === DEPARTAMENTOS ===
  '/departments/create': {
    realmRoles: ['admin', 'department-manager'],
    requireAllRoles: false
  },

  '/departments': {
    allowPublic: false  // Qualquer usuário autenticado
  },

  // === TABELAS ===
  '/tables/new': {
    // realmRoles: ['admin', 'manager'],
    clientRoles: ['HEAD_OFFICE_ADMIN'],
    requireAllRoles: false
  },

  '/tables': {
    // realmRoles: ['admin', 'manager', 'operator'],
    clientRoles: ['HEAD_OFFICE_ADMIN'],
    requireAllRoles: false
  },

  // === TICKETS ===
  '/tickets/new': {
    // realmRoles: ['admin', 'manager'],
    clientRoles: ['HEAD_OFFICE_ADMIN'],
    requireAllRoles: false
  },

  '/tickets': {
    // realmRoles: ['admin', 'manager', 'operator'],
    clientRoles: ['HEAD_OFFICE_ADMIN'],
    requireAllRoles: false
  },

  // === HOLIDAYS ===
  '/holidays': { 
    // realmRoles: ['admin', 'manager'],
    clientRoles: ['HEAD_OFFICE_ADMIN'],
    requireAllRoles: false
  },

  // === VÍDEOS ===
  '/videos/new': {
    // realmRoles: ['admin'],
    clientRoles: ['HEAD_OFFICE_ADMIN'],
    requireAllRoles: true
  },

  '/videos': {
    // realmRoles: ['admin', 'manager'],
    clientRoles: ['HEAD_OFFICE_ADMIN'],
    requireAllRoles: false
  },

  '/dashboard': {
    // realmRoles: ['admin', 'manager'],
    clientRoles: ['HEAD_OFFICE_ADMIN'],
    requireAllRoles: false
  },

  '/panelTV': {
    allowPublic: true,
  },

  '/mobile-auth': {
    allowPublic: true, 
  },

  // === ROTAS ESPECIAIS ===
  '/not-found': {
    allowPublic: true
  },

  '/unauthorized': {
    allowPublic: true
  },

  '/auth': {
    allowPublic: true
  }
}

/**
 * Verifica se a rota é uma rota conhecida/configurada
 */
export function isKnownRoute(path: string): boolean {
  console.log(`🔍 Verificando se rota é conhecida: ${path}`)
  
  // Casos especiais para rota raiz
  if (path === '/') {
    console.log(`✅ Rota raiz é sempre conhecida`)
    return true
  }
  
  // Verificar rotas configuradas
  const configuredRoutes = Object.keys(routeConfigs)
    .sort((a, b) => b.length - a.length)
  
  console.log(`📋 Rotas configuradas:`, configuredRoutes)
  
  for (const route of configuredRoutes) {
    if (path.startsWith(route)) {
      console.log(`✅ Rota encontrada: ${path} corresponde a ${route}`)
      return true
    }
  }
  
  console.log(`❌ Rota NÃO encontrada: ${path}`)
  return false
}

/**
 * Encontra a configuração mais específica para uma rota
 */
export function findRouteConfig(path: string): RouteConfig | null {
  console.log(`🔍 Procurando configuração para: ${path}`)
  
  // Caso especial para rota raiz
  if (path === '/') {
    console.log(`✅ Configuração para rota raiz`)
    return { allowPublic: true }
  }
  
  // Verificar rotas configuradas
  const sortedRoutes = Object.keys(routeConfigs)
    .sort((a, b) => b.length - a.length)
  
  for (const route of sortedRoutes) {
    if (path.startsWith(route)) {
      console.log(`✅ Configuração encontrada: ${path} → ${route}`, routeConfigs[route])
      return routeConfigs[route]
    }
  }
  
  console.log(`❌ Nenhuma configuração específica encontrada para: ${path}`)
  return null
}

/**
 * Verifica se a rota é pública
 */
export function isPublicRoute(path: string): boolean {
  const config = findRouteConfig(path)
  return config?.allowPublic === true
}