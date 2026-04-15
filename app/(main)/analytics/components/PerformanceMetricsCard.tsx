'use client'

import { VendorAnalytics } from '@/lib/types'
import { Card } from '@/app/components/common/Card'
import { Badge } from '@/app/components/common/Badge'
import { formatCurrency } from '@/lib/utils'

interface PerformanceMetricsCardProps {
  vendors: VendorAnalytics[]
  type: 'top' | 'bottom'
  metric: 'sales' | 'rating' | 'sla_compliance'
  loading?: boolean
}

export function PerformanceMetricsCard({
  vendors,
  type,
  metric,
  loading = false,
}: PerformanceMetricsCardProps) {
  const getMetricValue = (vendor: VendorAnalytics): number => {
    switch (metric) {
      case 'sales':
        return vendor.total_sales
      case 'rating':
        return vendor.rating
      case 'sla_compliance':
        return vendor.sla_compliance
      default:
        return 0
    }
  }

  const formatMetricValue = (vendor: VendorAnalytics): string => {
    const value = getMetricValue(vendor)
    switch (metric) {
      case 'sales':
        return formatCurrency(value)
      case 'rating':
        return `${value.toFixed(1)} ★`
      case 'sla_compliance':
        return `${value.toFixed(1)}%`
      default:
        return '0'
    }
  }

  const getMetricLabel = (): string => {
    switch (metric) {
      case 'sales':
        return 'Total Sales'
      case 'rating':
        return 'Rating'
      case 'sla_compliance':
        return 'SLA Compliance'
      default:
        return ''
    }
  }

  const getBadgeVariant = (vendor: VendorAnalytics): 'success' | 'warning' | 'danger' | 'default' => {
    if (metric === 'sla_compliance') {
      const value = vendor.sla_compliance
      if (value >= 90) return 'success'
      if (value >= 75) return 'warning'
      return 'danger'
    }
    return 'default'
  }

  // Sort vendors by metric
  let sorted = [...vendors].sort((a, b) => getMetricValue(b) - getMetricValue(a))

  // Get top 5 or bottom 5
  if (type === 'top') {
    sorted = sorted.slice(0, 5)
  } else {
    sorted = sorted.slice(-5).reverse()
  }

  const title = type === 'top' ? 'Top Performers' : 'Bottom Performers'
  const subtitle = `By ${getMetricLabel()}`

  return (
    <Card title={title} subtitle={subtitle}>
      {loading ? (
        <div className="flex justify-center py-8">
          <p className="text-gray-600">Loading data...</p>
        </div>
      ) : sorted.length === 0 ? (
        <div className="flex justify-center py-8">
          <p className="text-gray-600">No data available</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((vendor, index) => (
            <div key={vendor.vendor_id} className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full font-semibold text-white ${
                    type === 'top'
                      ? index === 0
                        ? 'bg-yellow-500'
                        : index === 1
                          ? 'bg-gray-400'
                          : 'bg-orange-600'
                      : 'bg-red-500'
                  }`}
                >
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{vendor.vendor_name}</p>
                  <p className="text-xs text-gray-600">{vendor.vendor_id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={getBadgeVariant(vendor)}>{formatMetricValue(vendor)}</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
