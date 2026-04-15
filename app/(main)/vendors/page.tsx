'use client'

import { useEffect, useState } from 'react'
import { Vendor } from '@/lib/types'
import { VendorService } from '@/lib/services/vendorService'
import { VendorsList } from './components/VendorsList'
import { Card } from '@/app/components/common/Card'
import { Alert } from '@/app/components/common/Alert'
import { Button } from '@/app/components/common/Button'
import { Input } from '@/app/components/common/Input'
import { Select } from '@/app/components/common/Select'
import { Pagination } from '@/app/components/common/Pagination'
import { Spinner } from '@/app/components/common/Spinner'

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)

  // Filter states
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [kycStatus, setKycStatus] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const fetchVendors = async (page: number = 1) => {
    try {
      setLoading(true)
      setError('')

      const response = await VendorService.getVendors({
        page,
        limit: 10,
        status: status || undefined,
        kycStatus: kycStatus || undefined,
        search: search || undefined,
      })

      setVendors(response.data)
      setCurrentPage(response.page)
      setTotalPages(response.total_pages)
      setTotalItems(response.total)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch vendors')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVendors(1)
  }, [status, kycStatus, search])

  const handlePageChange = async (page: number) => {
    await fetchVendors(page)
  }

  const handleReset = () => {
    setSearch('')
    setStatus('')
    setKycStatus('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendors</h1>
          <p className="text-gray-600 mt-2">Phase H.1B + H.2 - Vendor Management & Performance</p>
        </div>
        <Button variant="primary">+ Add Vendor</Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card padding="md" shadow="sm">
          <p className="text-sm text-gray-600">Total Vendors</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{totalItems}</p>
        </Card>
        <Card padding="md" shadow="sm">
          <p className="text-sm text-gray-600">Pending Approval</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {vendors.filter((v) => v.status === 'pending').length}
          </p>
        </Card>
        <Card padding="md" shadow="sm">
          <p className="text-sm text-gray-600">KYC Pending</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {vendors.filter((v) => v.kyc_status === 'pending').length}
          </p>
        </Card>
        <Card padding="md" shadow="sm">
          <p className="text-sm text-gray-600">Active Vendors</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {vendors.filter((v) => v.status === 'active').length}
          </p>
        </Card>
      </div>

      {/* Filters */}
      <Card padding="md" shadow="sm">
        <div className="space-y-4">
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="Search by vendor name or email..."
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
                label="Vendor Status"
                placeholder="All Statuses"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={[
                  { value: 'pending', label: 'Pending Approval' },
                  { value: 'active', label: 'Active' },
                  { value: 'suspended', label: 'Suspended' },
                  { value: 'rejected', label: 'Rejected' },
                ]}
              />
              <Select
                label="KYC Status"
                placeholder="All KYC Status"
                value={kycStatus}
                onChange={(e) => setKycStatus(e.target.value)}
                options={[
                  { value: 'pending', label: 'Pending' },
                  { value: 'verified', label: 'Verified' },
                  { value: 'rejected', label: 'Rejected' },
                ]}
              />
            </div>
          )}
        </div>
      </Card>

      {/* Results Info */}
      {!loading && !error && (
        <div className="text-sm text-gray-600">
          Showing {vendors.length > 0 ? (currentPage - 1) * 10 + 1 : 0} to{' '}
          {Math.min(currentPage * 10, totalItems)} of {totalItems} vendors
        </div>
      )}

      {/* Error Alert */}
      {error && <Alert type="error" title="Error" dismissible>{error}</Alert>}

      {/* Vendors List */}
      {loading ? (
        <Spinner fullScreen label="Loading vendors..." />
      ) : (
        <>
          <Card padding="none" shadow="sm">
            <VendorsList vendors={vendors} loading={loading} error={error} />
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
