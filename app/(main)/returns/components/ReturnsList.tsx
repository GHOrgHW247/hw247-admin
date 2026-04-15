'use client'

import Link from 'next/link'
import { Return } from '@/lib/types'
import { Table } from '@/app/components/common/Table'
import { Badge } from '@/app/components/common/Badge'
import { formatDate } from '@/lib/utils'

interface ReturnsListProps {
  returns: Return[]
  loading?: boolean
  error?: string
  onRowClick?: (rma: Return) => void
}

export function ReturnsList({ returns, loading = false, error, onRowClick }: ReturnsListProps) {
  const columns = [
    {
      key: 'rma_number' as const,
      label: 'RMA #',
      render: (value: string, row: Return) => (
        <Link href={`/returns/${row.rma_number}`} className="text-blue-600 hover:underline font-medium">
          {value}
        </Link>
      ),
    },
    {
      key: 'order_id' as const,
      label: 'Order ID',
      render: (value: string) => <span className="font-mono text-xs">{value}</span>,
    },
    {
      key: 'buyer_id' as const,
      label: 'Buyer',
    },
    {
      key: 'vendor_id' as const,
      label: 'Vendor',
    },
    {
      key: 'reason' as const,
      label: 'Return Reason',
      render: (value: string) => <span className="text-sm">{value}</span>,
    },
    {
      key: 'status' as const,
      label: 'Status',
      render: (value: string) => <Badge status={value}>{value.toUpperCase()}</Badge>,
    },
    {
      key: 'return_date' as const,
      label: 'Date',
      render: (value: string) => <span className="text-sm text-gray-600">{formatDate(value)}</span>,
    },
  ]

  return (
    <Table<Return>
      columns={columns}
      data={returns}
      loading={loading}
      error={error}
      emptyMessage="No returns found. Try adjusting your filters."
      onRowClick={onRowClick}
      striped
    />
  )
}
