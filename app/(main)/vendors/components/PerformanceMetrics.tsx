'use client'

import { PerformanceMetrics as PerformanceMetricsType } from '@/lib/types'
import { Card } from '@/app/components/common/Card'
import { Badge } from '@/app/components/common/Badge'
import { formatCurrency } from '@/lib/utils'

interface PerformanceMetricsProps {
  metrics: PerformanceMetricsType
}

export function PerformanceMetrics({ metrics }: PerformanceMetricsProps) {
  const getComplianceColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600'
    if (rate >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getMetricBadge = (value: number, threshold: number = 80) => {
    if (value >= threshold) return 'success'
    if (value >= threshold - 20) return 'warning'
    return 'danger'
  }

  return (
    <Card title="Performance Metrics" subtitle="Vendor Performance Analytics">
      <div className="space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* SLA Compliance */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700 font-medium">SLA Compliance Rate</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className={`text-3xl font-bold ${getComplianceColor(metrics.sla_compliance_rate)}`}>
                {metrics.sla_compliance_rate.toFixed(1)}%
              </span>
              <Badge
                variant={getMetricBadge(metrics.sla_compliance_rate) as any}
                size="sm"
              >
                {metrics.sla_compliance_rate >= 95 ? 'Excellent' : metrics.sla_compliance_rate >= 80 ? 'Good' : 'Poor'}
              </Badge>
            </div>
          </div>

          {/* Average Order Value */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-700 font-medium">Average Order Value</p>
            <p className="text-2xl font-bold text-purple-900 mt-2">
              {formatCurrency(metrics.average_order_value)}
            </p>
          </div>

          {/* Order Cancellation */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
            <p className="text-sm text-red-700 font-medium">Order Cancellation Rate</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-red-900">{metrics.order_cancellation_rate.toFixed(1)}%</span>
              <Badge
                variant={metrics.order_cancellation_rate > 5 ? 'danger' : 'success'}
                size="sm"
              >
                {metrics.order_cancellation_rate > 5 ? 'High' : 'Normal'}
              </Badge>
            </div>
          </div>

          {/* Return Rate */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
            <p className="text-sm text-orange-700 font-medium">Return Rate</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-orange-900">{metrics.return_rate.toFixed(1)}%</span>
              <Badge
                variant={metrics.return_rate > 8 ? 'warning' : 'success'}
                size="sm"
              >
                {metrics.return_rate > 8 ? 'High' : 'Normal'}
              </Badge>
            </div>
          </div>

          {/* Customer Rating */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <p className="text-sm text-green-700 font-medium">Customer Rating</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-green-900">
                {metrics.customer_rating.toFixed(1)} ⭐
              </span>
              <Badge
                variant={metrics.customer_rating >= 4 ? 'success' : metrics.customer_rating >= 3 ? 'warning' : 'danger'}
                size="sm"
              >
                {metrics.customer_rating >= 4 ? 'Excellent' : metrics.customer_rating >= 3 ? 'Good' : 'Below Avg'}
              </Badge>
            </div>
          </div>

          {/* Health Score */}
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg border border-indigo-200">
            <p className="text-sm text-indigo-700 font-medium">Overall Health Score</p>
            <div className="mt-2">
              <div className="w-full bg-indigo-200 rounded-full h-3">
                <div
                  className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${(metrics.sla_compliance_rate + metrics.customer_rating * 20) / 2.5}%`,
                  }}
                ></div>
              </div>
              <p className="text-lg font-bold text-indigo-900 mt-2">
                {((metrics.sla_compliance_rate + metrics.customer_rating * 20) / 2.5).toFixed(0)}%
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
          <p className="font-medium text-gray-900">Detailed Breakdown</p>

          {/* Compliance Indicator */}
          <div className="flex items-center justify-between p-2">
            <span className="text-gray-700">SLA Compliance</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    metrics.sla_compliance_rate >= 95
                      ? 'bg-green-600'
                      : metrics.sla_compliance_rate >= 80
                        ? 'bg-yellow-600'
                        : 'bg-red-600'
                  }`}
                  style={{ width: `${Math.min(metrics.sla_compliance_rate, 100)}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium w-12 text-right">{metrics.sla_compliance_rate.toFixed(1)}%</span>
            </div>
          </div>

          {/* Return Rate Indicator */}
          <div className="flex items-center justify-between p-2">
            <span className="text-gray-700">Return Rate (Lower is Better)</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    metrics.return_rate <= 5 ? 'bg-green-600' : metrics.return_rate <= 8 ? 'bg-yellow-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${Math.min(metrics.return_rate * 10, 100)}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium w-12 text-right">{metrics.return_rate.toFixed(1)}%</span>
            </div>
          </div>

          {/* Cancellation Rate Indicator */}
          <div className="flex items-center justify-between p-2">
            <span className="text-gray-700">Cancellation Rate (Lower is Better)</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    metrics.order_cancellation_rate <= 3
                      ? 'bg-green-600'
                      : metrics.order_cancellation_rate <= 5
                        ? 'bg-yellow-600'
                        : 'bg-red-600'
                  }`}
                  style={{ width: `${Math.min(metrics.order_cancellation_rate * 10, 100)}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium w-12 text-right">{metrics.order_cancellation_rate.toFixed(1)}%</span>
            </div>
          </div>

          {/* Rating Indicator */}
          <div className="flex items-center justify-between p-2">
            <span className="text-gray-700">Customer Rating</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    metrics.customer_rating >= 4.5 ? 'bg-green-600' : metrics.customer_rating >= 3.5 ? 'bg-yellow-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${(metrics.customer_rating / 5) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium w-12 text-right">{metrics.customer_rating.toFixed(1)}/5</span>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="font-medium text-blue-900 mb-2">Performance Insights</p>
          <ul className="text-sm text-blue-800 space-y-1">
            {metrics.sla_compliance_rate < 80 && <li>• SLA compliance needs improvement. Monitor order fulfillment closely.</li>}
            {metrics.return_rate > 8 && <li>• Return rate is higher than ideal. Check product quality and descriptions.</li>}
            {metrics.order_cancellation_rate > 5 && <li>• Order cancellation rate is above benchmark. Review inventory management.</li>}
            {metrics.customer_rating < 3.5 && <li>• Customer rating is below average. Consider quality improvements.</li>}
            {metrics.sla_compliance_rate >= 95 && metrics.customer_rating >= 4.5 && (
              <li>• Excellent performance! This vendor is a top performer.</li>
            )}
          </ul>
        </div>
      </div>
    </Card>
  )
}
