'use client'

import { useAuth } from '@/app/context/AuthContext'
import { Role } from '@/lib/roles'
import { Spinner } from '@/app/components/common/Spinner'
import { Alert } from '@/app/components/common/Alert'
import { Button } from '@/app/components/common/Button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface RoleGuardProps {
  children: React.ReactNode
  /**
   * Any of these roles grants access
   * If empty, only checks permissions
   */
  requiredRoles?: Role[]
  /**
   * All of these permissions required (AND logic)
   * If empty, only checks roles
   */
  requiredPermissions?: string[]
  /**
   * Custom fallback UI when unauthorized
   */
  fallback?: React.ReactNode
  /**
   * If true, redirects to dashboard on unauthorized (instead of showing error)
   */
  redirectOnUnauthorized?: boolean
  /**
   * Custom redirect URL (defaults to /dashboard)
   */
  redirectUrl?: string
}

/**
 * RoleGuard Component
 * Protects routes based on user roles and permissions
 *
 * Usage:
 * <RoleGuard requiredRoles={['master_admin', 'order_team']}>
 *   <OrdersPage />
 * </RoleGuard>
 *
 * <RoleGuard requiredPermissions={['orders.update_status']}>
 *   <UpdateButton />
 * </RoleGuard>
 *
 * <RoleGuard
 *   requiredRoles={['master_admin']}
 *   redirectOnUnauthorized
 *   redirectUrl="/dashboard"
 * >
 *   <SettingsPage />
 * </RoleGuard>
 */
export function RoleGuard({
  children,
  requiredRoles,
  requiredPermissions,
  fallback,
  redirectOnUnauthorized = false,
  redirectUrl = '/dashboard',
}: RoleGuardProps) {
  const { isLoading, isAuthenticated, roles, permissions, hasRole, hasPermission } = useAuth()
  const router = useRouter()

  // Still loading
  if (isLoading) {
    return <Spinner fullScreen label="Checking permissions..." />
  }

  // Not authenticated
  if (!isAuthenticated) {
    router.push('/login')
    return <Spinner fullScreen label="Redirecting to login..." />
  }

  // Check role access
  const hasRequiredRole = !requiredRoles || requiredRoles.length === 0 || hasRole(requiredRoles)

  // Check permission access
  const hasRequiredPermissions =
    !requiredPermissions ||
    requiredPermissions.length === 0 ||
    requiredPermissions.every((p) => hasPermission(p))

  // Unauthorized
  if (!hasRequiredRole || !hasRequiredPermissions) {
    if (redirectOnUnauthorized) {
      router.push(redirectUrl)
      return <Spinner fullScreen label="Redirecting..." />
    }

    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            Your role does not have permission to access this page.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm font-medium text-gray-900 mb-2">Your Roles:</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {roles.map((role) => (
                <span
                  key={role}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                >
                  {role}
                </span>
              ))}
            </div>

            {requiredRoles && requiredRoles.length > 0 && (
              <>
                <p className="text-sm font-medium text-gray-900 mb-2">Required Roles:</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {requiredRoles.map((role) => (
                    <span
                      key={role}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </>
            )}

            {requiredPermissions && requiredPermissions.length > 0 && (
              <>
                <p className="text-sm font-medium text-gray-900 mb-2">Required Permissions:</p>
                <ul className="space-y-1 text-xs text-gray-600">
                  {requiredPermissions.map((perm) => (
                    <li key={perm} className="flex items-center gap-2">
                      <span
                        className={
                          permissions.has(perm) ? 'text-green-600' : 'text-red-600'
                        }
                      >
                        {permissions.has(perm) ? '✓' : '✗'}
                      </span>
                      <code className="text-xs">{perm}</code>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <div className="flex gap-3">
            <Link href="/dashboard" className="flex-1">
              <Button variant="primary" fullWidth>
                Go to Dashboard
              </Button>
            </Link>
            <Button variant="secondary" fullWidth onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Authorized - render children
  return <>{children}</>
}
