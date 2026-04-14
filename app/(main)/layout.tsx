'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/login')
    } else {
      setAuthenticated(true)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    router.push('/login')
  }

  if (!authenticated) {
    return null
  }

  const navItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Orders', href: '/orders' },
    { label: 'Vendors', href: '/vendors' },
    { label: 'Settlements', href: '/settlements' },
    { label: 'Returns', href: '/returns' },
    { label: 'Analytics', href: '/analytics' },
    { label: 'Settings', href: '/settings' },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-900 text-white transition-all duration-300 overflow-hidden`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h1 className={`font-bold text-lg ${!sidebarOpen && 'hidden'}`}>
            HW247
          </h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-gray-800 rounded"
          >
            ☰
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-2 rounded hover:bg-gray-800 transition-colors"
              title={item.label}
            >
              {sidebarOpen ? item.label : item.label.charAt(0)}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className={`w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm ${
              !sidebarOpen && 'p-2'
            }`}
          >
            {sidebarOpen ? 'Logout' : '⎇'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">Admin Portal</h2>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
