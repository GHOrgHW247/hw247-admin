'use client'

import Link from 'next/link'
import { Order } from '@/lib/types'
import { Table } from '@/app/components/common/Table'
import { Badge } from '@/app/components/common/Badge'
import { formatCurrency, formatDate } from '@/lib/utils'

interface OrdersListProps {
  orders: Order[]
  loading?: boolean
  error?: string | null
  onRowClick?: (order: Order) => void
}

export function OrdersList({ orders, loading = false, error, onRowClick }: OrdersListProps) {
  const columns = [
    {
      key: 'order_number' as const,
      label: 'Order ID',
      render: (value: string, row: Order) => (
        <Link href={`/orders/${row.id}`} className="text-blue-600 hover:underline font-medium">
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
      key: 'buyer_name' as const,
      label: 'Buyer',
    },
    {
      key: 'total_amount' as const,
      label: 'Amount',
      render: (value: number) => <span className="font-semibold">{formatCurrency(value)}</span>,
    },
    {
      key: 'status' as const,
      label: 'Status',
      render: (value: string) => <Badge status={value}>{value.toUpperCase()}</Badge>,
    },
    {
      key: 'created_at' as const,
      label: 'Date',
      render: (value: string) => <span className="text-sm text-gray-600">{formatDate(value)}</span>,
    },
    {
      key: 'items_count' as const,
      label: 'Items',
      render: (value: number) => <span className="text-center">{value}</span>,
    },
  ]

  return (
    <Table<Order>
      columns={columns}
      data={orders}
      loading={loading}
      error={error || undefined}
      emptyMessage="No orders found. Try adjusting your filters."
      onRowClick={onRowClick}
      striped
    />
  )
}
