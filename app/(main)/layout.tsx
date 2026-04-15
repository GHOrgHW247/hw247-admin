'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AuthGuard } from '@/app/components/layout/AuthGuard'
import { useAuth } from '@/app/context/AuthContext'
import { Button } from '@/app/components/common/Button'
import { ALL_NAV_ITEMS, ROLE_DISPLAY } from '@/lib/roles'
import { AuthorizationService } from '@/lib/authorization'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { logout, user, roles, getAccessibleModules } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = async () => {
    await logout()
  }

  // Filter navigation items based on user roles
  const accessibleModules = getAccessibleModules()
  const filteredNavItems = ALL_NAV_ITEMS.filter((item) => accessibleModules.includes(item.moduleKey))

  const isActive = (href: string) => pathname === href

  // Get role display info
  const roleInfo =
    roles.length > 0 && ROLE_DISPLAY[roles[0]] ? ROLE_DISPLAY[roles[0]] : null

  return (
    <AuthGuard>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-20'
          } bg-gray-900 text-white transition-all duration-300 overflow-hidden flex flex-col`}
        >
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <h1 className={`font-bold text-lg whitespace-nowrap ${!sidebarOpen && 'hidden'}`}>
              HW247
            </h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 hover:bg-gray-800 rounded transition-colors"
              title={sidebarOpen ? 'Collapse' : 'Expand'}
            >
              ☰
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {filteredNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
                title={item.label}
              >
                <span>{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-gray-800 space-y-3">
            {sidebarOpen && user && (
              <div className="text-xs space-y-2">
                {/* Role Badge */}
                {roleInfo && (
                  <div className={`px-2 py-1 rounded-full text-center ${roleInfo.color}`}>
                    <p className="font-semibold text-xs">{roleInfo.label}</p>
                  </div>
                )}
                {/* User Info */}
                <div>
                  <p className="text-gray-400">Logged in as</p>
                  <p className="font-semibold truncate">{user.name}</p>
                  <p className="text-gray-400 text-xs">{user.email}</p>
                </div>
              </div>
            )}
            <Button
              variant="danger"
              size="sm"
              fullWidth={sidebarOpen}
              onClick={handleLogout}
            >
              {sidebarOpen ? 'Logout' : '⎇'}
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Admin Portal</h2>
                <p className="text-sm text-gray-600 mt-1">Week 1 Foundation - Setup Complete</p>
              </div>
              <div className="text-right text-sm text-gray-600">
                <p>Phase H Implementation</p>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
