'use client'

import { RoleGuard } from '@/app/components/layout/RoleGuard'

function SettingsPageContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Admin Portal Configuration</p>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Coming Soon</h2>
        <p className="text-gray-600">Settings interface will include:</p>
        <ul className="mt-4 space-y-2 text-sm text-gray-600">
          <li>• Admin user management</li>
          <li>• Role & permission configuration</li>
          <li>• API key management</li>
          <li>• Audit log viewing</li>
          <li>• System configuration</li>
          <li>• Notification preferences</li>
        </ul>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <RoleGuard requiredRoles={['master_admin']}>
      <SettingsPageContent />
    </RoleGuard>
  )
}
