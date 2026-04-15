'use client'

interface KPICardProps {
  label: string
  value: string | number
  trend?: {
    percentage: number
    isPositive: boolean
  }
  unit?: string
  icon?: string
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple'
}

const colorClasses = {
  blue: 'border-blue-500 bg-blue-50',
  green: 'border-green-500 bg-green-50',
  red: 'border-red-500 bg-red-50',
  yellow: 'border-yellow-500 bg-yellow-50',
  purple: 'border-purple-500 bg-purple-50',
}

const trendColorClasses = {
  positive: 'text-green-600',
  negative: 'text-red-600',
}

export function KPICard({ label, value, trend, unit, icon, color = 'blue' }: KPICardProps) {
  return (
    <div className={`rounded-lg border-b-4 border-l border-t border-r border-gray-200 bg-white p-6 shadow-sm ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <div className="mt-3 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {unit && <span className="text-sm text-gray-600">{unit}</span>}
          </div>
          {trend && (
            <div className={`mt-2 text-sm font-medium ${trend.isPositive ? trendColorClasses.positive : trendColorClasses.negative}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.percentage).toFixed(1)}%
            </div>
          )}
        </div>
        {icon && <div className="text-3xl">{icon}</div>}
      </div>
    </div>
  )
}
