'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { AnalyticsMetrics } from '@/lib/types'
import { Card } from '@/app/components/common/Card'

interface OrdersReturnsChartProps {
  data: AnalyticsMetrics[]
  isLoading?: boolean
}

export function OrdersReturnsChart({ data, isLoading }: OrdersReturnsChartProps) {
  if (isLoading) {
    return (
      <Card title="Orders vs Returns" subtitle="Comparison of orders and returns over time">
        <div className="flex h-80 items-center justify-center bg-gray-50">
          <p className="text-gray-600">Loading chart data...</p>
        </div>
      </Card>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Card title="Orders vs Returns" subtitle="Comparison of orders and returns over time">
        <div className="flex h-80 items-center justify-center bg-gray-50">
          <p className="text-gray-600">No data available for the selected period</p>
        </div>
      </Card>
    )
  }

  // Format data for display
  const chartData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    orders: item.orders_count,
    returns: item.returns_count,
    returnRate: parseFloat((item.return_rate * 100).toFixed(1)),
  }))

  return (
    <Card title="Orders vs Returns" subtitle="Comparison of orders and returns over time">
      <div className="bg-gray-50 p-4 rounded-lg">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
            <YAxis yAxisId="left" stroke="#2563eb" style={{ fontSize: '12px' }} />
            <YAxis yAxisId="right" orientation="right" stroke="#dc2626" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              formatter={(value) => {
                if (typeof value === 'number') {
                  return value.toFixed(1)
                }
                return value
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="orders" fill="#2563eb" name="Orders" />
            <Bar yAxisId="right" dataKey="returns" fill="#dc2626" name="Returns" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
