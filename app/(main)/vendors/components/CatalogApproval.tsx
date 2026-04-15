'use client'

import { useState } from 'react'
import { Card } from '@/app/components/common/Card'
import { Button } from '@/app/components/common/Button'
import { Alert } from '@/app/components/common/Alert'
import { Badge } from '@/app/components/common/Badge'
import { VendorService } from '@/lib/services/vendorService'

interface CatalogApprovalProps {
  vendorId: string
  catalogStatus: 'pending' | 'approved' | 'rejected'
  productCount: number
  onSuccess: () => void
}

export function CatalogApproval({ vendorId, catalogStatus, productCount, onSuccess }: CatalogApprovalProps) {
  const [approving, setApproving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleApproveCatalog = async () => {
    setApproving(true)
    setError('')
    setSuccess('')

    try {
      await VendorService.approveCatalog(vendorId)
      setSuccess('Catalog approved successfully')
      setTimeout(() => {
        onSuccess()
        setSuccess('')
      }, 2000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to approve catalog')
    } finally {
      setApproving(false)
    }
  }

  return (
    <Card title="Catalog Management" subtitle="Product Listing Approval">
      <div className="space-y-4">
        {/* Status Section */}
        <div className="bg-gray-50 p-4 rounded border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Catalog Status</p>
            <p className="font-semibold mt-1">{productCount} products listed</p>
          </div>
          <Badge status={catalogStatus} size="lg">
            {catalogStatus.toUpperCase()}
          </Badge>
        </div>

        {/* Alerts */}
        {error && <Alert type="error">{error}</Alert>}
        {success && <Alert type="success">{success}</Alert>}

        {/* Catalog Details */}
        <div className="space-y-3">
          <div className="p-3 bg-blue-50 rounded border border-blue-200">
            <p className="text-sm text-blue-900 font-medium">Product Listing Information</p>
            <ul className="mt-2 space-y-1 text-sm text-blue-800">
              <li>✓ Total Products: {productCount}</li>
              <li>✓ Categories Covered: 8</li>
              <li>✓ Images Added: 87%</li>
              <li>✓ Descriptions Complete: 92%</li>
            </ul>
          </div>

          {catalogStatus === 'pending' && (
            <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
              <p className="text-sm text-yellow-900 font-medium">⚠ Action Required</p>
              <p className="mt-1 text-sm text-yellow-800">
                Catalog is pending approval. Review product listings and approve when ready.
              </p>
            </div>
          )}

          {catalogStatus === 'approved' && (
            <div className="p-3 bg-green-50 rounded border border-green-200">
              <p className="text-sm text-green-900 font-medium">✓ Approved</p>
              <p className="mt-1 text-sm text-green-800">
                Catalog is approved and live on the platform. Products are visible to buyers.
              </p>
            </div>
          )}

          {catalogStatus === 'rejected' && (
            <div className="p-3 bg-red-50 rounded border border-red-200">
              <p className="text-sm text-red-900 font-medium">✕ Rejected</p>
              <p className="mt-1 text-sm text-red-800">
                Catalog does not meet quality standards. Contact vendor for resubmission.
              </p>
            </div>
          )}
        </div>

        {/* Action Button */}
        {catalogStatus === 'pending' && (
          <Button
            variant="primary"
            fullWidth
            loading={approving}
            onClick={handleApproveCatalog}
          >
            ✓ Approve Catalog
          </Button>
        )}

        {catalogStatus === 'approved' && (
          <div className="p-3 bg-green-50 rounded text-sm text-green-700">
            Catalog approved and live. Vendor can upload new products anytime.
          </div>
        )}

        {/* Quality Guidelines */}
        <div className="bg-gray-50 p-3 rounded border border-gray-200 text-sm space-y-2">
          <p className="font-medium text-gray-900">Quality Guidelines</p>
          <ul className="text-gray-700 space-y-1">
            <li>✓ Product title clearly describes the item</li>
            <li>✓ High-quality images (minimum 3 per product)</li>
            <li>✓ Accurate product descriptions</li>
            <li>✓ Correct pricing and SKU information</li>
            <li>✓ Appropriate product category</li>
            <li>✓ All attributes filled out</li>
          </ul>
        </div>
      </div>
    </Card>
  )
}
