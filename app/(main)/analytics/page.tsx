'use client'

import { useEffect, useState } from 'react'
import { AnalyticsMetrics, VendorAnalytics } from '@/lib/types'
import { AnalyticsService } from '@/lib/services/analyticsService'
import { Alert } from '@/app/components/common/Alert'
import { Spinner } from '@/app/components/common/Spinner'
import { Button } from '@/app/components/common/Button'
import { RoleGuard } from '@/app/components/layout/RoleGuard'
import { KPICard } from './components/KPICard'
import { DateRangePicker } from './components/DateRangePicker'
import { GMVTrendChart } from './components/GMVTrendChart'
import { OrdersReturnsChart } from './components/OrdersReturnsChart'
import { VendorPerformanceTable } from './components/VendorPerformanceTable'
import { PerformanceMetricsCard } from './components/PerformanceMetricsCard'
import { ReportBuilder } from './components/ReportBuilder'
import { formatCurrency } from '@/lib/utils'

interface DashboardMetrics {
  total_gmv: number
  total_orders: number
  total_vendors: number
  average_order_value: number
  sla_compliance_rate: number
  overall_return_rate: number
}

function AnalyticsPageContent() {
  // State management
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics | null>(null)
  const [gmvTrends, setGmvTrends] = useState<AnalyticsMetrics[]>([])
  const [orderAnalytics, setOrderAnalytics] = useState<AnalyticsMetrics[]>([])
  const [vendorAnalytics, setVendorAnalytics] = useState<VendorAnalytics[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [daysSelected, setDaysSelected] = useState(30)
  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month'>('day')
  const [refreshKey, setRefreshKey] = useState(0)

  // Fetch all analytics data
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true)
        setError('')

        // Fetch all data in parallel
        const [metrics, trends, orders, vendors] = await Promise.all([
          AnalyticsService.getDashboardMetrics(),
          AnalyticsService.getGMVTrends({ days: daysSelected, groupBy }),
          AnalyticsService.getOrderAnalytics({ days: daysSelected }),
          AnalyticsService.getVendorAnalytics({ limit: 50, sortBy: 'sales' }),
        ])

        setDashboardMetrics(metrics)
        setGmvTrends(trends)
        setOrderAnalytics(orders)
        setVendorAnalytics(vendors)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load analytics data')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [daysSelected, groupBy, refreshKey])

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const handlePeriodChange = (days: number) => {
    setDaysSelected(days)
  }

  const handleGroupByChange = (newGroupBy: 'day' | 'week' | 'month') => {
    setGroupBy(newGroupBy)
  }

  if (loading && !dashboardMetrics) {
    return <Spinner fullScreen label="Loading analytics dashboard..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Reporting</h1>
          <p className="text-gray-600 mt-2">Platform insights, trends, and vendor performance</p>
        </div>
        <Button variant="secondary" size="sm" onClick={handleRefresh}>
          🔄 Refresh Data
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert type="error" title="Error" dismissible>
          {error}
        </Alert>
      )}

      {/* KPI Cards */}
      {dashboardMetrics && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <KPICard
            label="Total GMV"
            value={formatCurrency(dashboardMetrics.total_gmv)}
            icon="💰"
            color="green"
            trend={{ percentage: 12.5, isPositive: true }}
          />
          <KPICard
            label="Total Orders"
            value={dashboardMetrics.total_orders}
            icon="📦"
            color="blue"
            trend={{ percentage: 8.3, isPositive: true }}
          />
          <KPICard
            label="Average Order Value"
            value={formatCurrency(dashboardMetrics.average_order_value)}
            icon="💳"
            color="purple"
            trend={{ percentage: 3.2, isPositive: true }}
          />
          <KPICard
            label="Active Vendors"
            value={dashboardMetrics.total_vendors}
            icon="🏪"
            color="yellow"
            trend={{ percentage: 5.1, isPositive: true }}
          />
          <KPICard
            label="SLA Compliance"
            value={dashboardMetrics.sla_compliance_rate.toFixed(1)}
            unit="%"
            icon="✓"
            color="green"
            trend={{ percentage: 2.4, isPositive: true }}
          />
          <KPICard
            label="Return Rate"
            value={dashboardMetrics.overall_return_rate.toFixed(2)}
            unit="%"
            icon="↩️"
            color={dashboardMetrics.overall_return_rate > 5 ? 'red' : 'green'}
            trend={{ percentage: 1.2, isPositive: false }}
          />
        </div>
      )}

      {/* Filters & Date Range */}
      <DateRangePicker
        onPeriodChange={handlePeriodChange}
        onGroupByChange={handleGroupByChange}
        defaultPeriodDays={daysSelected}
      />

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GMVTrendChart data={gmvTrends} isLoading={loading} />
        <OrdersReturnsChart data={orderAnalytics} isLoading={loading} />
      </div>

      {/* Vendor Performance Section */}
      <div className="space-y-6">
        {/* Top & Bottom Performers */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <PerformanceMetricsCard
            vendors={vendorAnalytics}
            type="top"
            metric="sales"
            loading={loading}
          />
          <PerformanceMetricsCard
            vendors={vendorAnalytics}
            type="bottom"
            metric="sla_compliance"
            loading={loading}
          />
        </div>

        {/* Vendor Performance Table */}
        <VendorPerformanceTable vendors={vendorAnalytics} loading={loading} itemsPerPage={10} />
      </div>

      {/* Report Builder */}
      <ReportBuilder onGenerateStart={handleRefresh} onGenerateComplete={handleRefresh} />

      {/* Info Alert */}
      <Alert type="info" title="Analytics Dashboard">
        This dashboard provides real-time insights into platform performance. Data is updated every hour. Use the date
        range selector to analyze trends over different periods.
      </Alert>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <RoleGuard requiredRoles={['master_admin', 'finance_team']}>
      <AnalyticsPageContent />
    </RoleGuard>
  )
}
