'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { AdminUser } from '@/lib/types'
import { AuthService } from '@/lib/auth'
import { Role } from '@/lib/roles'
import { AuthorizationService } from '@/lib/authorization'

interface AuthContextType {
  user: AdminUser | null
  roles: Role[] // New: Support multiple roles
  permissions: Set<string> // New: Cache of all permissions
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  hasPermission: (permission: string | string[]) => boolean
  hasRole: (role: Role | Role[]) => boolean
  hasAnyPermission: (permissions: string[]) => boolean
  hasAllPermissions: (permissions: string[]) => boolean
  canAccess: (resource: string, action: string) => boolean
  getAccessibleModules: () => string[]
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state from localStorage
  useEffect(() => {
    const currentUser = AuthService.getCurrentUser()
    setUser(currentUser)
    if (currentUser) {
      // Extract roles from user (support both single role and array of roles)
      const userRoles: Role[] = Array.isArray(currentUser.role)
        ? (currentUser.role as Role[])
        : [currentUser.role as Role]
      setRoles(userRoles)
      // Compute permissions from roles
      const combinedPermissions = AuthorizationService.getCombinedPermissions(userRoles)
      setPermissions(combinedPermissions)
    } else {
      setRoles([])
      setPermissions(new Set())
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { user } = await AuthService.login(email, password)
      setUser(user)
      // Extract roles
      const userRoles: Role[] = Array.isArray(user.role)
        ? (user.role as Role[])
        : [user.role as Role]
      setRoles(userRoles)
      // Compute permissions
      const combinedPermissions = AuthorizationService.getCombinedPermissions(userRoles)
      setPermissions(combinedPermissions)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await AuthService.logout()
      setUser(null)
      setRoles([])
      setPermissions(new Set())
    } finally {
      setIsLoading(false)
    }
  }

  const hasPermission = (permission: string | string[]): boolean => {
    if (Array.isArray(permission)) {
      return AuthorizationService.hasAllPermissions(permissions, permission)
    }
    return AuthorizationService.hasPermission(permissions, permission)
  }

  const hasRole = (role: Role | Role[]): boolean => {
    if (Array.isArray(role)) {
      return role.some((r) => roles.includes(r))
    }
    return roles.includes(role)
  }

  const hasAnyPermission = (perms: string[]): boolean => {
    return AuthorizationService.hasAnyPermission(permissions, perms)
  }

  const hasAllPermissions = (perms: string[]): boolean => {
    return AuthorizationService.hasAllPermissions(permissions, perms)
  }

  const canAccess = (resource: string, action: string): boolean => {
    return AuthorizationService.canAccess(permissions, resource, action)
  }

  const getAccessibleModules = (): string[] => {
    return AuthorizationService.getAccessibleModules(roles)
  }

  const value: AuthContextType = {
    user,
    roles,
    permissions,
    isLoading,
    isAuthenticated: user !== null,
    login,
    logout,
    hasPermission,
    hasRole,
    hasAnyPermission,
    hasAllPermissions,
    canAccess,
    getAccessibleModules,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
