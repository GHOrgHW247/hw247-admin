'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { AdminUser } from '@/lib/types'
import { AuthService } from '@/lib/auth'

interface AuthContextType {
  user: AdminUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  hasPermission: (permission: string) => boolean
  hasRole: (role: 'super_admin' | 'admin' | 'operator') => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state from localStorage
  useEffect(() => {
    const currentUser = AuthService.getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { user } = await AuthService.login(email, password)
      setUser(user)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await AuthService.logout()
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const hasPermission = (permission: string): boolean => {
    return user ? user.permissions.includes(permission) : false
  }

  const hasRole = (role: 'super_admin' | 'admin' | 'operator'): boolean => {
    return user ? user.role === role : false
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: user !== null,
    login,
    logout,
    hasPermission,
    hasRole,
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
