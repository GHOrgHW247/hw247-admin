'use client'

import Link from 'next/link'
import { Settlement } from '@/lib/types'
import { Table } from '@/app/components/common/Table'
import { Badge } from '@/app/components/common/Badge'
import { formatCurrency, formatDate } from '@/lib/utils'

interface SettlementsListProps {
  settlements: Settlement[]
  loading?: boolean
  error?: string
  onRowClick?: (settlement: Settlement) => void
}

export function SettlementsList({ settlements, loading = false, error, onRowClick }: SettlementsListProps) {
  const columns = [
    {
      key: 'settlement_number' as const,
      label: 'Settlement #',
      render: (value: string, row: Settlement) => (
        <Link href={`/settlements/${row.id}`} className="text-blue-600 hover:underline font-medium">
          {value}
        </Link>
      ),
    },
    {
      key: 'vendor_name' as const,
      label: 'Vendor',
      render: (value: string) => <span className="font-medium">{value}</span>,
    },
    {
      key: 'period_start' as const,
      label: 'Period',
      render: (value: string, row: Settlement) => (
        <span className="text-sm text-gray-600">
          {formatDate(value)} to {formatDate(row.period_end)}
        </span>
      ),
    },
    {
      key: 'status' as const,
      label: 'Status',
      render: (value: string) => <Badge status={value}>{value.toUpperCase()}</Badge>,
    },
    {
      key: 'gross_amount' as const,
      label: 'Gross Amount',
      render: (value: number) => <span className="font-medium">{formatCurrency(value)}</span>,
    },
    {
      key: 'deductions' as const,
      label: 'Deductions',
      render: (value: number) => <span className="text-red-600 font-medium">-{formatCurrency(value)}</span>,
    },
    {
      key: 'total_amount' as const,
      label: 'Net Amount',
      render: (value: number) => <span className="font-bold text-blue-600">{formatCurrency(value)}</span>,
    },
    {
      key: 'created_at' as const,
      label: 'Created',
      render: (value: string) => <span className="text-sm text-gray-600">{formatDate(value)}</span>,
    },
  ]

  return (
    <Table<Settlement>
      columns={columns}
      data={settlements}
      loading={loading}
      error={error}
      emptyMessage="No settlements found. Try adjusting your filters."
      onRowClick={onRowClick}
      striped
    />
  )
}
