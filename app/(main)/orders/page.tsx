'use client'

import { useEffect, useState } from 'react'
import { FilterBar } from '@/app/components/filters/FilterBar'
import { OrdersList } from './components/OrdersList'
import { Pagination } from '@/app/components/common/Pagination'
import { Card } from '@/app/components/common/Card'
import { Alert } from '@/app/components/common/Alert'
import { Button } from '@/app/components/common/Button'
import { RoleGuard } from '@/app/components/layout/RoleGuard'
import { useOrderFilters } from './hooks/useOrderFilters'

function OrdersPageContent() {
  const { orders, loading, error, currentPage, totalPages, totalItems, setFilters, setPage } =
    useOrderFilters()
  const [showBatchOps, setShowBatchOps] = useState(false)
  const [selectedOrders] = useState<string[]>([])

  useEffect(() => {
    // Initial load
    setFilters({})
  }, [setFilters])

  const handleFilterChange = async (filters: Record<string, any>) => {
    await setFilters(filters)
  }

  // const toggleOrderSelection = (orderId: string) => {
  //   setSelectedOrders((prev) =>
  //     prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
  //   )
  // }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-2">Phase H.1 - Order Management with Filtering</p>
        </div>
        <div className="flex gap-2">
          {selectedOrders.length > 0 && (
            <Button variant="primary" onClick={() => setShowBatchOps(true)}>
              📦 Batch Dispatch ({selectedOrders.length})
            </Button>
          )}
          <Button variant="secondary" onClick={() => setShowBatchOps(!showBatchOps)}>
            🖨️ Print Center
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar onFilterChange={handleFilterChange} loading={loading} />

      {/* Results Info */}
      {!loading && !error && (
        <div className="text-sm text-gray-600">
          Showing {orders.length > 0 ? (currentPage - 1) * 10 + 1 : 0} to{' '}
          {Math.min(currentPage * 10, totalItems)} of {totalItems} orders
        </div>
      )}

      {/* Error Alert */}
      {error && <Alert type="error" title="Error" dismissible>{error}</Alert>}

      {/* Orders List */}
      <Card padding="none" shadow="sm">
        <OrdersList orders={orders} loading={loading} error={error} />
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={10}
          onPageChange={setPage}
        />
      )}

      {/* Batch Operations Placeholder */}
      {showBatchOps && (
        <Card title="Batch Operations" subtitle="Coming in Week 2">
          <div className="space-y-4">
            <Alert type="info">Batch dispatch and print center features will be implemented in Week 2</Alert>
            <Button variant="secondary" fullWidth onClick={() => setShowBatchOps(false)}>
              Close
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}

export default function OrdersPage() {
  return (
    <RoleGuard requiredRoles={['master_admin', 'order_team', 'finance_team']}>
      <OrdersPageContent />
    </RoleGuard>
  )
}
