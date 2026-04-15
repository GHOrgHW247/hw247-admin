'use client'

import { useAuth } from '@/app/context/AuthContext'
import { Button } from '@/app/components/common/Button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function UnauthorizedPage() {
  const { roles } = useAuth()
  const router = useRouter()

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md text-center">
        {/* Icon */}
        <div className="text-7xl mb-6">🔒</div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Access Denied</h1>

        {/* Description */}
        <p className="text-gray-600 mb-8 text-lg">
          Your current role does not have permission to access this page.
        </p>

        {/* Current Role Info */}
        {roles.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <p className="text-sm font-medium text-gray-700 mb-3">Your Role:</p>
            <div className="flex justify-center gap-2 flex-wrap">
              {roles.map((role) => (
                <span
                  key={role}
                  className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold"
                >
                  {role.replace(/_/g, ' ').toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 text-left">
          <p className="text-sm text-blue-900">
            <strong>Need access?</strong> Contact your administrator to request the required permissions for this module.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 flex-col">
          <Link href="/dashboard" className="w-full">
            <Button variant="primary" fullWidth>
              Go to Dashboard
            </Button>
          </Link>
          <Button variant="secondary" fullWidth onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    </div>
  )
}
