'use client'

import { useState } from 'react'
import { VendorAnalytics } from '@/lib/types'
import { Card } from '@/app/components/common/Card'
import { Table } from '@/app/components/common/Table'
import { Badge } from '@/app/components/common/Badge'
import { Pagination } from '@/app/components/common/Pagination'
import { formatCurrency } from '@/lib/utils'

interface VendorPerformanceTableProps {
  vendors: VendorAnalytics[]
  loading?: boolean
  error?: string
  itemsPerPage?: number
}

export function VendorPerformanceTable({
  vendors,
  loading = false,
  error,
  itemsPerPage = 10,
}: VendorPerformanceTableProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(vendors.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedVendors = vendors.slice(startIndex, startIndex + itemsPerPage)

  const columns = [
    {
      key: 'vendor_name' as const,
      label: 'Vendor Name',
      render: (value: string) => <span className="font-medium text-gray-900">{value}</span>,
    },
    {
      key: 'total_orders' as const,
      label: 'Total Orders',
      render: (value: number) => <span className="text-sm text-gray-700">{value}</span>,
    },
    {
      key: 'total_sales' as const,
      label: 'Total Sales',
      render: (value: number) => <span className="font-medium text-gray-900">{formatCurrency(value)}</span>,
    },
    {
      key: 'average_order_value' as const,
      label: 'Avg Order Value',
      render: (value: number) => <span className="text-sm text-gray-700">{formatCurrency(value)}</span>,
    },
    {
      key: 'order_completion_rate' as const,
      label: 'Completion Rate',
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <div className="w-20 bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${value}%` }}></div>
          </div>
          <span className="text-sm font-medium text-gray-700">{value.toFixed(1)}%</span>
        </div>
      ),
    },
    {
      key: 'sla_compliance' as const,
      label: 'SLA Compliance',
      render: (value: number) => {
        let variant: 'success' | 'warning' | 'danger' = 'success'
        if (value < 70) variant = 'danger'
        else if (value < 85) variant = 'warning'
        return <Badge variant={variant}>{value.toFixed(1)}%</Badge>
      },
    },
    {
      key: 'return_rate' as const,
      label: 'Return Rate',
      render: (value: number) => (
        <span className={`text-sm font-medium ${value > 5 ? 'text-red-600' : 'text-green-600'}`}>
          {value.toFixed(1)}%
        </span>
      ),
    },
    {
      key: 'rating' as const,
      label: 'Rating',
      render: (value: number) => (
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-gray-900">{value.toFixed(1)}</span>
          <span className="text-yellow-400">★</span>
        </div>
      ),
    },
  ]

  return (
    <Card title={`Vendor Performance (${vendors.length} vendors)`}>
      <div className="space-y-4">
        {error && <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>}

        {loading ? (
          <div className="flex justify-center py-12">
            <p className="text-gray-600">Loading vendor data...</p>
          </div>
        ) : vendors.length === 0 ? (
          <div className="flex justify-center py-12">
            <p className="text-gray-600">No vendors found</p>
          </div>
        ) : (
          <>
            <Table<VendorAnalytics>
              columns={columns}
              data={paginatedVendors}
              striped
              emptyMessage="No vendors found"
            />

            {totalPages > 1 && (
              <div className="border-t border-gray-200 pt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={vendors.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  )
}
