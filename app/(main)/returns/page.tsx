'use client'

import { useEffect, useState } from 'react'
import { Return } from '@/lib/types'
import { ReturnService } from '@/lib/services/returnService'
import { ReturnsList } from './components/ReturnsList'
import { Card } from '@/app/components/common/Card'
import { Alert } from '@/app/components/common/Alert'
import { Button } from '@/app/components/common/Button'
import { Input } from '@/app/components/common/Input'
import { Select } from '@/app/components/common/Select'
import { Pagination } from '@/app/components/common/Pagination'
import { Spinner } from '@/app/components/common/Spinner'
import { RoleGuard } from '@/app/components/layout/RoleGuard'

function ReturnsPageContent() {
  const [returns, setReturns] = useState<Return[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)

  // Filter states
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const fetchReturns = async (page: number = 1) => {
    try {
      setLoading(true)
      setError('')

      const response = await ReturnService.getReturns({
        page,
        limit: 10,
        status: status || undefined,
        search: search || undefined,
      })

      setReturns(response.data)
      setCurrentPage(response.page)
      setTotalPages(response.total_pages)
      setTotalItems(response.total)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch returns')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReturns(1)
  }, [status, search])

  const handlePageChange = async (page: number) => {
    await fetchReturns(page)
  }

  const handleReset = () => {
    setStatus('')
    setSearch('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Returns & RTO</h1>
          <p className="text-gray-600 mt-2">Phase H.4 - Return Management & Dispute Resolution</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card padding="md" shadow="sm">
          <p className="text-sm text-gray-600">Total Returns</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{totalItems}</p>
        </Card>
        <Card padding="md" shadow="sm">
          <p className="text-sm text-gray-600">In Transit</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {returns.filter((r) => r.status === 'in_transit').length}
          </p>
        </Card>
        <Card padding="md" shadow="sm">
          <p className="text-sm text-gray-600">Pending Approval</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {returns.filter((r) => r.status === 'received').length}
          </p>
        </Card>
        <Card padding="md" shadow="sm">
          <p className="text-sm text-gray-600">Escalated</p>
          <p className="text-3xl font-bold text-red-600 mt-2">
            {returns.filter((r) => r.status === 'closed' && !r.status.includes('approved')).length}
          </p>
        </Card>
      </div>

      {/* Filters */}
      <Card padding="md" shadow="sm">
        <div className="space-y-4">
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="Search by RMA number, order ID, or buyer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
            <Button variant="primary">🔍</Button>
            <Button variant="secondary" onClick={handleReset}>
              ↺ Reset
            </Button>
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            {showAdvanced ? '▼' : '▶'} Advanced Filters
          </button>

          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <Select
                label="Return Status"
                placeholder="All Statuses"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={[
                  { value: 'initiated', label: 'Initiated' },
                  { value: 'in_transit', label: 'In Transit' },
                  { value: 'received', label: 'Received' },
                  { value: 'approved', label: 'Approved' },
                  { value: 'rejected', label: 'Rejected' },
                  { value: 'closed', label: 'Closed' },
                ]}
              />
            </div>
          )}
        </div>
      </Card>

      {/* Results Info */}
      {!loading && !error && (
        <div className="text-sm text-gray-600">
          Showing {returns.length > 0 ? (currentPage - 1) * 10 + 1 : 0} to{' '}
          {Math.min(currentPage * 10, totalItems)} of {totalItems} returns
        </div>
      )}

      {/* Error Alert */}
      {error && <Alert type="error" title="Error" dismissible>{error}</Alert>}

      {/* Returns List */}
      {loading ? (
        <Spinner fullScreen label="Loading returns..." />
      ) : (
        <>
          <Card padding="none" shadow="sm">
            <ReturnsList returns={returns} loading={loading} error={error} />
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={10}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      {/* Info Alert */}
      <Alert type="info" title="Return Management">
        Returns are tracked automatically. Escalations occur after 7 days without resolution. All disputes must be resolved within 30 days per marketplace policy.
      </Alert>
    </div>
  )
}

export default function ReturnsPage() {
  return (
    <RoleGuard requiredRoles={['master_admin', 'order_team', 'support_team']}>
      <ReturnsPageContent />
    </RoleGuard>
  )
}
