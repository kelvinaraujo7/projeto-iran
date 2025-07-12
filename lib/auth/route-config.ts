import { RouteConfig } from '@/types/auth'

/**
* Per-route protection configuration
* IMPORTANT: More specific routes must come first!
*/
export const routeConfigs: Record<string, RouteConfig> = {
  // === ADMINISTRATIVE ROUTES ===  
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

  // === MANAGEMENT ===
  '/management/reports': {
    realmRoles: ['manager'],
    clientRoles: ['view-reports', 'generate-reports'],
    requireAllRoles: true
  },

  '/management': {
    realmRoles: ['manager', 'supervisor'],
    requireAllRoles: false
  },

  // === USERS ===
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

  // === REPORTS ===
  '/reports/financial': {
    realmRoles: ['financial-manager', 'admin'],
    clientRoles: ['view-financial-reports'],
    requireAllRoles: false
  },

  '/reports': {
    clientRoles: ['view-reports'],
    requireAllRoles: true
  },

  // === DEPARTMENTS ===
  '/departments/create': {
    realmRoles: ['admin', 'department-manager'],
    requireAllRoles: false
  },

  '/departments': {
    allowPublic: false  // Any authenticated user
  },

  // === TABLES ===
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

// === SPECIAL ROUTES ===
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
* Checks if the route is a known/configured route
*/
export function isKnownRoute(path: string): boolean {  
// Special cases for root route
  if (path === '/') {
    return true
  }
  
  const configuredRoutes = Object.keys(routeConfigs)
    .sort((a, b) => b.length - a.length)
  
  for (const route of configuredRoutes) {
    if (path.startsWith(route)) {
      return true
    }
  }
  
  return false
}

/**
* Finds the most specific configuration for a route
*/
export function findRouteConfig(path: string): RouteConfig | null {
  
  // Special case for root route
  if (path === '/') {
    return { allowPublic: true }
  }
  
  const sortedRoutes = Object.keys(routeConfigs)
    .sort((a, b) => b.length - a.length)
  
  for (const route of sortedRoutes) {
    if (path.startsWith(route)) {
      return routeConfigs[route]
    }
  }
  
  return null
}

/**
* Checks if the route is public
*/
export function isPublicRoute(path: string): boolean {
  const config = findRouteConfig(path)
  return config?.allowPublic === true
}