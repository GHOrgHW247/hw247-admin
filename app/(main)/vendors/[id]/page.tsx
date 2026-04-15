'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { VendorDetail } from '@/lib/types'
import { VendorService } from '@/lib/services/vendorService'
import { Card } from '@/app/components/common/Card'
import { Alert } from '@/app/components/common/Alert'
import { Spinner } from '@/app/components/common/Spinner'
import { Button } from '@/app/components/common/Button'
import { Badge } from '@/app/components/common/Badge'
import { KYCManager } from '../components/KYCManager'
import { BankDetails } from '../components/BankDetails'
import { DocumentManager } from '../components/DocumentManager'
import { PerformanceMetrics } from '../components/PerformanceMetrics'
import { CatalogApproval } from '../components/CatalogApproval'
import { ApprovalModal } from '../components/ApprovalModal'
import { SuspendModal } from '../components/SuspendModal'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function VendorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const vendorId = params.id as string

  const [vendor, setVendor] = useState<VendorDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [showSuspendModal, setShowSuspendModal] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        setLoading(true)
        const data = await VendorService.getVendorDetail(vendorId)
        setVendor(data)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load vendor details')
      } finally {
        setLoading(false)
      }
    }

    fetchVendor()
  }, [vendorId, refreshKey])

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1)
    setShowApprovalModal(false)
    setShowSuspendModal(false)
  }

  if (loading) {
    return <Spinner fullScreen label="Loading vendor details..." />
  }

  if (error || !vendor) {
    return (
      <div className="space-y-6">
        <Button variant="secondary" onClick={() => router.back()}>
          ← Back to Vendors
        </Button>
        <Alert type="error" title="Error">
          {error || 'Vendor not found'}
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="secondary" size="sm" onClick={() => router.back()}>
            ← Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">{vendor.name}</h1>
          <p className="text-gray-600 mt-2">Vendor ID: {vendor.id}</p>
        </div>
        <div className="text-right space-y-2">
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <Badge status={vendor.status} size="lg">
              {vendor.status.toUpperCase()}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-gray-600">KYC Status</p>
            <Badge status={vendor.kyc_status} size="lg">
              {vendor.kyc_status.toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card padding="md" shadow="sm">
          <p className="text-sm text-gray-600">Total Orders</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{vendor.total_orders}</p>
        </Card>
        <Card padding="md" shadow="sm">
          <p className="text-sm text-gray-600">Total Sales</p>
          <p className="text-2xl font-bold text-blue-600 mt-2">{formatCurrency(vendor.total_sales)}</p>
        </Card>
        <Card padding="md" shadow="sm">
          <p className="text-sm text-gray-600">Rating</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">⭐ {vendor.rating.toFixed(1)}</p>
        </Card>
        <Card padding="md" shadow="sm">
          <p className="text-sm text-gray-600">Joined</p>
          <p className="text-lg font-bold text-gray-900 mt-2">{formatDate(vendor.created_at)}</p>
        </Card>
      </div>

      {/* Vendor Information */}
      <Card title="Vendor Information" subtitle="Contact & Account Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-semibold mt-1">{vendor.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Account Status</p>
            <p className="font-semibold mt-1">{vendor.status}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">KYC Status</p>
            <p className="font-semibold mt-1">{vendor.kyc_status}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Joined On</p>
            <p className="font-semibold mt-1">{formatDate(vendor.created_at)}</p>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      {vendor.status === 'pending' && (
        <Card padding="md" shadow="sm">
          <div className="flex gap-3">
            <Button variant="success" fullWidth onClick={() => setShowApprovalModal(true)}>
              ✓ Approve Vendor
            </Button>
            <Button variant="danger" fullWidth onClick={() => setShowApprovalModal(true)}>
              ✕ Reject Vendor
            </Button>
          </div>
        </Card>
      )}

      {vendor.status !== 'suspended' && (
        <Button variant="warning" fullWidth onClick={() => setShowSuspendModal(true)}>
          ⏸️ Suspend Vendor Account
        </Button>
      )}

      {vendor.status === 'suspended' && (
        <Button variant="success" fullWidth onClick={() => setShowSuspendModal(true)}>
          ▶️ Unsuspend Vendor Account
        </Button>
      )}

      {/* KYC Management */}
      <KYCManager
        vendorId={vendorId}
        kycData={vendor.kyc_data}
        kycStatus={vendor.kyc_status}
        onSuccess={handleSuccess}
      />

      {/* Bank Details */}
      <BankDetails vendorId={vendorId} bankData={vendor.bank_details} onSuccess={handleSuccess} />

      {/* Document Manager */}
      <DocumentManager vendorId={vendorId} documents={vendor.documents} onSuccess={handleSuccess} />

      {/* Performance Metrics */}
      <PerformanceMetrics metrics={vendor.performance_metrics} />

      {/* Catalog Approval */}
      <CatalogApproval
        vendorId={vendorId}
        catalogStatus="approved"
        productCount={42}
        onSuccess={handleSuccess}
      />

      {/* Modals */}
      <ApprovalModal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        vendorId={vendorId}
        vendorName={vendor.name}
        onSuccess={handleSuccess}
      />

      <SuspendModal
        isOpen={showSuspendModal}
        onClose={() => setShowSuspendModal(false)}
        vendorId={vendorId}
        vendorName={vendor.name}
        currentStatus={vendor.status}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
