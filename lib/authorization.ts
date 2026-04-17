/**
 * Authorization utility functions for permission checking
 */

import { Role, ROLE_PERMISSIONS, ROLE_NAVIGATION, ALL_NAV_ITEMS } from './roles'

export class AuthorizationService {
  /**
   * Check if a permission string matches the required permission
   * Supports wildcards: "orders.*" matches "orders.view", "orders.update_status", etc.
   */
  static hasPermission(permissions: Set<string>, requiredPermission: string): boolean {
    // Direct match
    if (permissions.has(requiredPermission)) {
      return true
    }

    // Wildcard match (e.g., "orders.*" matches "orders.view")
    if (requiredPermission.includes('*')) {
      const pattern = requiredPermission.replace(/\.\*/, '')
      return Array.from(permissions).some((p) => p.startsWith(pattern))
    }

    return false
  }

  /**
   * Check if user has ANY of the required permissions
   */
  static hasAnyPermission(permissions: Set<string>, requiredPermissions: string[]): boolean {
    if (requiredPermissions.length === 0) return true
    return requiredPermissions.some((p) => this.hasPermission(permissions, p))
  }

  /**
   * Check if user has ALL of the required permissions
   */
  static hasAllPermissions(permissions: Set<string>, requiredPermissions: string[]): boolean {
    if (requiredPermissions.length === 0) return true
    return requiredPermissions.every((p) => this.hasPermission(permissions, p))
  }

  /**
   * Check if user can perform an action on a resource
   * Example: canAccess(permissions, 'orders', 'view')
   */
  static canAccess(permissions: Set<string>, resource: string, action: string): boolean {
    const permission = `${resource}.${action}`
    return this.hasPermission(permissions, permission)
  }

  /**
   * Check if role has specific permission
   */
  static roleHasPermission(role: Role, permission: string): boolean {
    const rolePerms = ROLE_PERMISSIONS[role] || []
    return rolePerms.includes(permission)
  }

  /**
   * Check if any role has the permission
   */
  static rolesHavePermission(roles: Role[], permission: string): boolean {
    return roles.some((role) => this.roleHasPermission(role, permission))
  }

  /**
   * Get accessible modules for given roles
   */
  static getAccessibleModules(roles: Role[]): string[] {
    const modules = new Set<string>()
    roles.forEach((role) => {
      const roleModules = ROLE_NAVIGATION[role] || []
      roleModules.forEach((m) => modules.add(m))
    })
    return Array.from(modules)
  }

  /**
   * Get filtered navigation items for given roles
   */
  static getFilteredNavigation(roles: Role[]) {
    const modules = this.getAccessibleModules(roles)
    return ALL_NAV_ITEMS.filter((item) => modules.includes(item.moduleKey))
  }

  /**
   * Get accessible pages/routes for given roles
   * Returns array of route paths the user can access
   */
  static getAccessibleRoutes(roles: Role[]): string[] {
    const modules = this.getAccessibleModules(roles)
    const routes: string[] = []

    // Map modules to routes
    const moduleToRoutes: Record<string, string[]> = {
      dashboard: ['/dashboard'],
      orders: ['/orders', '/orders/[id]'],
      vendors: ['/vendors', '/vendors/[id]'],
      settlements: ['/settlements', '/settlements/[id]'],
      returns: ['/returns', '/returns/[rma]'],
      analytics: ['/analytics'],
      settings: ['/settings'],
    }

    modules.forEach((module) => {
      const moduleRoutes = moduleToRoutes[module] || []
      routes.push(...moduleRoutes)
    })

    return routes
  }

  /**
   * Check if user can access a specific route
   */
  static canAccessRoute(roles: Role[], route: string): boolean {
    const accessibleRoutes = this.getAccessibleRoutes(roles)
    // Simple match (doesn't handle dynamic routes perfectly)
    return accessibleRoutes.some(
      (r) => r === route || route.startsWith(r.replace(/\[.*?\]/, ''))
    )
  }

  /**
   * Combine permissions from multiple roles
   */
  static getCombinedPermissions(roles: Role[]): Set<string> {
    const permissions = new Set<string>()
    roles.forEach((role) => {
      const rolePerms = ROLE_PERMISSIONS[role] || []
      rolePerms.forEach((p) => permissions.add(p))
    })
    return permissions
  }

  /**
   * Check if a route requires specific permissions
   */
  static requiresPermission(path: string): string | null {
    // Map routes to required permissions
    const routePermissions: Record<string, string> = {
      '/orders': 'orders.view',
      '/vendors': 'vendors.view',
      '/settlements': 'settlements.view',
      '/returns': 'returns.view',
      '/analytics': 'analytics.view',
      '/settings': 'settings.view',
    }

    for (const [route, permission] of Object.entries(routePermissions)) {
      if (path?.startsWith(route)) {
        return permission
      }
    }

    return null
  }
}

/**
 * Hook-safe authorization check functions
 * Can be called from React components
 */
export function useHasPermission(userPermissions: Set<string>) {
  return {
    has: (permission: string) => AuthorizationService.hasPermission(userPermissions, permission),
    hasAny: (permissions: string[]) =>
      AuthorizationService.hasAnyPermission(userPermissions, permissions),
    hasAll: (permissions: string[]) =>
      AuthorizationService.hasAllPermissions(userPermissions, permissions),
    canAccess: (resource: string, action: string) =>
      AuthorizationService.canAccess(userPermissions, resource, action),
  }
}
