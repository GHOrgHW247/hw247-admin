'use client'

import Link from 'next/link'
import { Vendor } from '@/lib/types'
import { Table } from '@/app/components/common/Table'
import { Badge } from '@/app/components/common/Badge'
import { formatCurrency, formatDate } from '@/lib/utils'

interface VendorsListProps {
  vendors: Vendor[]
  loading?: boolean
  error?: string
  onRowClick?: (vendor: Vendor) => void
}

export function VendorsList({ vendors, loading = false, error, onRowClick }: VendorsListProps) {
  const columns = [
    {
      key: 'name' as const,
      label: 'Vendor Name',
      render: (value: string, row: Vendor) => (
        <Link href={`/vendors/${row.id}`} className="text-blue-600 hover:underline font-medium">
          {value}
        </Link>
      ),
    },
    {
      key: 'email' as const,
      label: 'Email',
      render: (value: string) => <span className="text-sm text-gray-600">{value}</span>,
    },
    {
      key: 'status' as const,
      label: 'Status',
      render: (value: string) => <Badge status={value}>{value.toUpperCase()}</Badge>,
    },
    {
      key: 'kyc_status' as const,
      label: 'KYC',
      render: (value: string) => {
        const colors = {
          pending: 'bg-yellow-100 text-yellow-800',
          verified: 'bg-green-100 text-green-800',
          rejected: 'bg-red-100 text-red-800',
        }
        return (
          <Badge variant="default" className={colors[value as keyof typeof colors]}>
            {value.toUpperCase()}
          </Badge>
        )
      },
    },
    {
      key: 'total_orders' as const,
      label: 'Orders',
      render: (value: number) => <span className="text-center font-semibold">{value}</span>,
    },
    {
      key: 'total_sales' as const,
      label: 'Sales',
      render: (value: number) => <span className="font-medium">{formatCurrency(value)}</span>,
    },
    {
      key: 'rating' as const,
      label: 'Rating',
      render: (value: number) => (
        <span className="font-medium">
          ⭐ {value.toFixed(1)}
        </span>
      ),
    },
    {
      key: 'created_at' as const,
      label: 'Joined',
      render: (value: string) => <span className="text-sm text-gray-600">{formatDate(value)}</span>,
    },
  ]

  return (
    <Table<Vendor>
      columns={columns}
      data={vendors}
      loading={loading}
      error={error}
      emptyMessage="No vendors found. Try adjusting your filters."
      onRowClick={onRowClick}
      striped
    />
  )
}
