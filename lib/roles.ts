/**
 * Role-Based Access Control (RBAC) Configuration
 * Defines all roles, permissions, and module access for the admin portal
 */

export const ROLES = {
  MASTER_ADMIN: 'master_admin',
  ORDER_TEAM: 'order_team',
  CATALOG_TEAM: 'catalog_team',
  FINANCE_TEAM: 'finance_team',
  SUPPORT_TEAM: 'support_team',
} as const

export type Role = typeof ROLES[keyof typeof ROLES]

/**
 * Permission Matrix: Role -> Array of Permissions
 * Permission format: "resource.action"
 * This is the source of truth for what each role can do
 */
export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  master_admin: [
    // Dashboard
    'dashboard.view',
    // Orders
    'orders.view',
    'orders.update_status',
    'orders.export',
    // Vendors
    'vendors.view',
    'vendors.manage_kyc',
    'vendors.manage_documents',
    'vendors.manage_performance',
    'vendors.manage_payout',
    'vendors.export',
    // Settlements
    'settlements.view',
    'settlements.approve',
    'settlements.process_payout',
    'settlements.export',
    'settlements.calculate_taxes',
    // Returns
    'returns.view',
    'returns.manage_dispute',
    'returns.approve_reject',
    'returns.export',
    // Analytics
    'analytics.view',
    'analytics.export',
    'analytics.view_vendor_performance',
    'analytics.custom_reports',
    // Settings
    'settings.view',
    'settings.manage_users',
    'settings.manage_roles',
  ],

  order_team: [
    'dashboard.view',
    'orders.view',
    'orders.update_status',
    'returns.view',
    'returns.manage_dispute',
    'settlements.view',
  ],

  catalog_team: [
    'dashboard.view',
    'vendors.view',
    'vendors.manage_kyc',
    'vendors.manage_documents',
    'vendors.manage_performance',
    'vendors.manage_payout',
    'vendors.export',
  ],

  finance_team: [
    'dashboard.view',
    'settlements.view',
    'settlements.approve',
    'settlements.process_payout',
    'settlements.export',
    'settlements.calculate_taxes',
    'analytics.view',
    'analytics.export',
    'analytics.custom_reports',
    'orders.view',
  ],

  support_team: [
    'dashboard.view',
    'returns.view',
    'returns.manage_dispute',
    'returns.approve_reject',
    'orders.view',
  ],
}

/**
 * Navigation visibility by role
 * Defines which modules/tabs each role can see in the sidebar
 */
export const ROLE_NAVIGATION: Record<Role, string[]> = {
  master_admin: ['dashboard', 'orders', 'vendors', 'settlements', 'returns', 'analytics', 'settings'],
  order_team: ['dashboard', 'orders', 'returns', 'settlements'],
  catalog_team: ['dashboard', 'vendors'],
  finance_team: ['dashboard', 'settlements', 'analytics', 'orders'],
  support_team: ['dashboard', 'returns', 'orders'],
}

/**
 * Navigation items configuration
 * Used in main layout and filtered by role
 */
export interface NavItem {
  label: string
  href: string
  icon?: string
  moduleKey: string // Key used in ROLE_NAVIGATION
}

export const ALL_NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊', moduleKey: 'dashboard' },
  { label: 'Orders', href: '/orders', icon: '📦', moduleKey: 'orders' },
  { label: 'Vendors', href: '/vendors', icon: '🏪', moduleKey: 'vendors' },
  { label: 'Settlements', href: '/settlements', icon: '💰', moduleKey: 'settlements' },
  { label: 'Returns', href: '/returns', icon: '↩️', moduleKey: 'returns' },
  { label: 'Analytics', href: '/analytics', icon: '📈', moduleKey: 'analytics' },
  { label: 'Settings', href: '/settings', icon: '⚙️', moduleKey: 'settings' },
]

/**
 * Role display information
 * Used for UI labels and descriptions
 */
export const ROLE_DISPLAY: Record<Role, { label: string; description: string; color: string }> = {
  master_admin: {
    label: 'Master Admin',
    description: 'Full access to all modules and settings',
    color: 'bg-red-100 text-red-800',
  },
  order_team: {
    label: 'Order Team',
    description: 'Access to orders, returns, and settlements',
    color: 'bg-blue-100 text-blue-800',
  },
  catalog_team: {
    label: 'Catalog Team',
    description: 'Manage vendors and catalog',
    color: 'bg-green-100 text-green-800',
  },
  finance_team: {
    label: 'Finance Team',
    description: 'Manage settlements and financial analytics',
    color: 'bg-purple-100 text-purple-800',
  },
  support_team: {
    label: 'Support Team',
    description: 'Manage returns and customer support',
    color: 'bg-orange-100 text-orange-800',
  },
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: Role): string[] {
  return ROLE_PERMISSIONS[role] || []
}

/**
 * Get all permissions for multiple roles
 */
export function getCombinedPermissions(roles: Role[]): string[] {
  const permissions = new Set<string>()
  roles.forEach((role) => {
    getRolePermissions(role).forEach((p) => permissions.add(p))
  })
  return Array.from(permissions)
}

/**
 * Get accessible modules for a role
 */
export function getRoleModules(role: Role): string[] {
  return ROLE_NAVIGATION[role] || []
}

/**
 * Get accessible modules for multiple roles
 */
export function getCombinedModules(roles: Role[]): string[] {
  const modules = new Set<string>()
  roles.forEach((role) => {
    getRoleModules(role).forEach((m) => modules.add(m))
  })
  return Array.from(modules)
}

/**
 * Filter navigation items by roles
 */
export function getFilteredNavigation(roles: Role[]): NavItem[] {
  const modules = getCombinedModules(roles)
  return ALL_NAV_ITEMS.filter((item) => modules.includes(item.moduleKey))
}

/**
 * Check if role has permission
 */
export function roleHasPermission(role: Role, permission: string): boolean {
  const permissions = getRolePermissions(role)
  return permissions.includes(permission)
}

/**
 * Check if any role has permission
 */
export function rolesHavePermission(roles: Role[], permission: string): boolean {
  return roles.some((role) => roleHasPermission(role, permission))
}
