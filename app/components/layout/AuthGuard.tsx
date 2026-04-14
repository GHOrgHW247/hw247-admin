'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: 'super_admin' | 'admin' | 'operator'
  requiredPermission?: string
}

export function AuthGuard({
  children,
  requiredRole,
  requiredPermission,
}: AuthGuardProps) {
  const router = useRouter()
  const { isLoading, isAuthenticated, hasRole, hasPermission } = useAuth()

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (requiredRole && !hasRole(requiredRole)) {
      router.push('/403')
      return
    }

    if (requiredPermission && !hasPermission(requiredPermission)) {
      router.push('/403')
      return
    }
  }, [isLoading, isAuthenticated, requiredRole, requiredPermission, router, hasRole, hasPermission])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="mb-4">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">403</h1>
          <p className="text-gray-600">Access Denied</p>
          <p className="text-sm text-gray-500 mt-2">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">403</h1>
          <p className="text-gray-600">Access Denied</p>
          <p className="text-sm text-gray-500 mt-2">You don't have the required permission.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
