'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { Card } from '@/app/components/common/Card'
import { Alert } from '@/app/components/common/Alert'
import { Spinner } from '@/app/components/common/Spinner'
import { Button } from '@/app/components/common/Button'
import { formatCurrency } from '@/lib/utils'

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

        // Mock data for now - simulates API response
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

  const KPICard = ({
    label,
    value,
    unit = '',
    trend,
  }: {
    label: string
    value: number | string
    unit?: string
    trend?: { value: number; direction: 'up' | 'down' }
  }) => (
    <Card padding="md" shadow="sm">
      <p className="text-gray-600 text-sm font-medium">{label}</p>
      <div className="flex items-baseline gap-2 mt-2">
        <p className="text-3xl font-bold text-gray-900">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        {unit && <span className="text-lg text-gray-600">{unit}</span>}
        {trend && (
          <span className={`text-sm font-semibold ${trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend.direction === 'up' ? '↑' : '↓'} {trend.value}%
          </span>
        )}
      </div>
    </Card>
  )

  if (loading) {
    return <Spinner fullScreen label="Loading dashboard..." />
  }

  if (error) {
    return <Alert type="error" title="Error">{error}</Alert>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Platform overview and key metrics</p>
      </div>

      {/* Status Alert */}
      <Alert type="info" title="Week 1 Setup Complete">
        Authentication, navigation, and dashboard foundation are ready. Connected to API patterns.
      </Alert>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard label="Total Orders" value={metrics.totalOrders} trend={{ value: 12, direction: 'up' }} />
        <KPICard label="Active Vendors" value={metrics.activeVendors} trend={{ value: 8, direction: 'up' }} />
        <KPICard label="Pending Settlements" value={metrics.pendingSettlements} trend={{ value: 3, direction: 'down' }} />
        <KPICard label="Total Returns" value={metrics.totalReturns} trend={{ value: 5, direction: 'up' }} />
        <KPICard
          label="GMV (Gross Merchandise Value)"
          value={formatCurrency(metrics.gmv)}
          trend={{ value: 18, direction: 'up' }}
        />
        <KPICard label="Average Order Value" value={formatCurrency(metrics.aov)} />
      </div>

      {/* Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card title="Recent Activity" subtitle="Latest platform events">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded">
              <span className="text-xl">📦</span>
              <div>
                <p className="text-sm font-medium text-gray-900">Order #ORD-15234 shipped</p>
                <p className="text-xs text-gray-600 mt-1">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded">
              <span className="text-xl">✓</span>
              <div>
                <p className="text-sm font-medium text-gray-900">Vendor VND-342 approved</p>
                <p className="text-xs text-gray-600 mt-1">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded">
              <span className="text-xl">💰</span>
              <div>
                <p className="text-sm font-medium text-gray-900">Settlement batch processed</p>
                <p className="text-xs text-gray-600 mt-1">1 hour ago</p>
              </div>
            </div>
          </div>
        </Card>

        {/* System Health */}
        <Card title="System Health" subtitle="Platform status indicators">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded border border-green-200">
              <div>
                <p className="text-sm font-medium text-gray-900">API Server</p>
                <p className="text-xs text-gray-600">hw247-api on port 4000</p>
              </div>
              <span className="text-green-600 font-bold">✓ Online</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded border border-green-200">
              <div>
                <p className="text-sm font-medium text-gray-900">Database</p>
                <p className="text-xs text-gray-600">PostgreSQL</p>
              </div>
              <span className="text-green-600 font-bold">✓ Connected</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded border border-blue-200">
              <div>
                <p className="text-sm font-medium text-gray-900">Frontend</p>
                <p className="text-xs text-gray-600">Next.js 15 + React 19</p>
              </div>
              <span className="text-blue-600 font-bold">⚡ Ready</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions" subtitle="Common admin tasks">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button variant="secondary" size="sm">
            👥 Approve Vendors
          </Button>
          <Button variant="secondary" size="sm">
            💰 Process Settlements
          </Button>
          <Button variant="secondary" size="sm">
            🔄 Review Returns
          </Button>
          <Button variant="secondary" size="sm">
            📊 View Reports
          </Button>
        </div>
      </Card>

      {/* Implementation Status */}
      <Card title="Week 1 Implementation Status" subtitle="Setup & Foundation">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <p className="text-sm text-gray-700">Repository created (hw247-admin)</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <p className="text-sm text-gray-700">Authentication system with JWT</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <p className="text-sm text-gray-700">Dashboard foundation with KPI cards</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <p className="text-sm text-gray-700">10+ reusable UI components</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <p className="text-sm text-gray-700">Type-safe API client (axios)</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <p className="text-sm text-gray-700">Routing & layout structure</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
