'use client'

import { useEffect, useState } from 'react'
import { Settlement } from '@/lib/types'
import { SettlementService } from '@/lib/services/settlementService'
import { SettlementsList } from './components/SettlementsList'
import { Card } from '@/app/components/common/Card'
import { Alert } from '@/app/components/common/Alert'
import { Button } from '@/app/components/common/Button'
import { Input } from '@/app/components/common/Input'
import { Select } from '@/app/components/common/Select'
import { Pagination } from '@/app/components/common/Pagination'
import { Spinner } from '@/app/components/common/Spinner'

export default function SettlementsPage() {
  const [settlements, setSettlements] = useState<Settlement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)

  // Filter states
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const fetchSettlements = async (page: number = 1) => {
    try {
      setLoading(true)
      setError('')

      const response = await SettlementService.getSettlements({
        page,
        limit: 10,
        status: status || undefined,
        vendorId: search || undefined,
      })

      setSettlements(response.data)
      setCurrentPage(response.page)
      setTotalPages(response.total_pages)
      setTotalItems(response.total)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch settlements')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettlements(1)
  }, [status, search])

  const handlePageChange = async (page: number) => {
    await fetchSettlements(page)
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
          <h1 className="text-3xl font-bold text-gray-900">Settlements</h1>
          <p className="text-gray-600 mt-2">Phase H.3 - Settlement & Payout Management</p>
        </div>
        <Button variant="primary">📊 Generate Settlements</Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card padding="md" shadow="sm">
          <p className="text-sm text-gray-600">Total Settlements</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{totalItems}</p>
        </Card>
        <Card padding="md" shadow="sm">
          <p className="text-sm text-gray-600">Pending Approval</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {settlements.filter((s) => s.status === 'pending').length}
          </p>
        </Card>
        <Card padding="md" shadow="sm">
          <p className="text-sm text-gray-600">Approved</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {settlements.filter((s) => s.status === 'approved').length}
          </p>
        </Card>
        <Card padding="md" shadow="sm">
          <p className="text-sm text-gray-600">Paid Out</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {settlements.filter((s) => s.status === 'paid').length}
          </p>
        </Card>
      </div>

      {/* Filters */}
      <Card padding="md" shadow="sm">
        <div className="space-y-4">
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="Search by settlement number or vendor..."
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
                label="Settlement Status"
                placeholder="All Statuses"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={[
                  { value: 'pending', label: 'Pending' },
                  { value: 'approved', label: 'Approved' },
                  { value: 'paid', label: 'Paid' },
                  { value: 'failed', label: 'Failed' },
                ]}
              />
            </div>
          )}
        </div>
      </Card>

      {/* Results Info */}
      {!loading && !error && (
        <div className="text-sm text-gray-600">
          Showing {settlements.length > 0 ? (currentPage - 1) * 10 + 1 : 0} to{' '}
          {Math.min(currentPage * 10, totalItems)} of {totalItems} settlements
        </div>
      )}

      {/* Error Alert */}
      {error && <Alert type="error" title="Error" dismissible>{error}</Alert>}

      {/* Settlements List */}
      {loading ? (
        <Spinner fullScreen label="Loading settlements..." />
      ) : (
        <>
          <Card padding="none" shadow="sm">
            <SettlementsList settlements={settlements} loading={loading} error={error} />
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
    </div>
  )
}
