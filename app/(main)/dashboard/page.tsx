'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'

interface DashboardMetrics {
  totalOrders: number
  activeVendors: number
  pendingSettlements: number
  totalReturns: number
  gmv: number
  aov: number
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalOrders: 0,
    activeVendors: 0,
    pendingSettlements: 0,
    totalReturns: 0,
    gmv: 0,
    aov: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true)
        // TODO: Replace with actual API endpoint once backend is ready
        // const response = await api.get('/admin/analytics/dashboard')
        // setMetrics(response.data)

        // Mock data for now
        setMetrics({
          totalOrders: 15234,
          activeVendors: 342,
          pendingSettlements: 28,
          totalReturns: 456,
          gmv: 2850000,
          aov: 1875,
        })
      } catch (err: any) {
        setError('Failed to load dashboard metrics')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  const KPICard = ({ label, value, unit = '' }: { label: string; value: number | string; unit?: string }) => (
    <div className="card p-6">
      <p className="text-gray-600 text-sm font-medium">{label}</p>
      <p className="text-3xl font-bold text-gray-900 mt-2">
        {typeof value === 'number' ? value.toLocaleString() : value}
        {unit && <span className="text-lg text-gray-600 ml-1">{unit}</span>}
      </p>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-lg text-gray-600">Loading dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of platform metrics and key indicators</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard label="Total Orders" value={metrics.totalOrders} />
        <KPICard label="Active Vendors" value={metrics.activeVendors} />
        <KPICard label="Pending Settlements" value={metrics.pendingSettlements} />
        <KPICard label="Total Returns" value={metrics.totalReturns} />
        <KPICard label="GMV" value={`₹${(metrics.gmv / 100000).toFixed(1)}`} unit="L" />
        <KPICard label="Average Order Value" value={`₹${metrics.aov}`} />
      </div>

      {/* Placeholder Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <p className="text-gray-600">Coming soon...</p>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">System Health</h2>
          <p className="text-gray-600">Coming soon...</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="btn-secondary">Approve Vendors</button>
          <button className="btn-secondary">Process Settlements</button>
          <button className="btn-secondary">Review Returns</button>
          <button className="btn-secondary">View Reports</button>
        </div>
      </div>
    </div>
  )
}
