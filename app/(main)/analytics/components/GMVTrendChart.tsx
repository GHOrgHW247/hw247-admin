'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { AnalyticsMetrics } from '@/lib/types'
import { Card } from '@/app/components/common/Card'
import { formatCurrency } from '@/lib/utils'

interface GMVTrendChartProps {
  data: AnalyticsMetrics[]
  isLoading?: boolean
}

export function GMVTrendChart({ data, isLoading }: GMVTrendChartProps) {
  if (isLoading) {
    return (
      <Card title="GMV Trend" subtitle="Gross Merchandise Value over time">
        <div className="flex h-80 items-center justify-center bg-gray-50">
          <p className="text-gray-600">Loading chart data...</p>
        </div>
      </Card>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Card title="GMV Trend" subtitle="Gross Merchandise Value over time">
        <div className="flex h-80 items-center justify-center bg-gray-50">
          <p className="text-gray-600">No data available for the selected period</p>
        </div>
      </Card>
    )
  }

  // Format data for display
  const chartData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    gmv: item.gmv,
  }))

  return (
    <Card title="GMV Trend" subtitle="Gross Merchandise Value over time">
      <div className="bg-gray-50 p-4 rounded-lg">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
            <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
            <Tooltip
              formatter={(value) => formatCurrency(value as number)}
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="gmv"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ fill: '#2563eb', r: 4 }}
              activeDot={{ r: 6 }}
              name="GMV"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
