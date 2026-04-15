'use client'

import { useState } from 'react'
import { Modal } from '@/app/components/common/Modal'
import { Button } from '@/app/components/common/Button'
import { Alert } from '@/app/components/common/Alert'
import { Input } from '@/app/components/common/Input'
import { VendorService } from '@/lib/services/vendorService'

interface ApprovalModalProps {
  isOpen: boolean
  onClose: () => void
  vendorId: string
  vendorName: string
  onSuccess: () => void
}

export function ApprovalModal({ isOpen, onClose, vendorId, vendorName, onSuccess }: ApprovalModalProps) {
  const [action, setAction] = useState<'approve' | 'reject' | null>(null)
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleApprove = async () => {
    setLoading(true)
    setError('')

    try {
      await VendorService.approveVendor(vendorId)
      onSuccess()
      resetForm()
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to approve vendor')
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async () => {
    if (!reason.trim()) {
      setError('Please provide a reason for rejection')
      return
    }

    setLoading(true)
    setError('')

    try {
      await VendorService.rejectVendor(vendorId, reason)
      onSuccess()
      resetForm()
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reject vendor')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setAction(null)
    setReason('')
    setError('')
  }

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Vendor Approval Workflow" size="md">
      <div className="space-y-4">
        <Alert type="info" title="Vendor Information">
          <p className="font-medium">{vendorName}</p>
        </Alert>

        {error && <Alert type="error">{error}</Alert>}

        {!action ? (
          <div className="space-y-3">
            <p className="text-gray-700 font-medium">What would you like to do?</p>
            <div className="flex gap-3">
              <Button
                variant="success"
                fullWidth
                onClick={() => setAction('approve')}
                disabled={loading}
              >
                ✓ Approve Vendor
              </Button>
              <Button
                variant="danger"
                fullWidth
                onClick={() => setAction('reject')}
                disabled={loading}
              >
                ✕ Reject Vendor
              </Button>
            </div>
          </div>
        ) : action === 'approve' ? (
          <div className="space-y-4">
            <Alert type="success" title="Approve Vendor">
              This vendor will be activated and can start selling immediately.
            </Alert>
            <div className="flex gap-3">
              <Button variant="success" fullWidth loading={loading} onClick={handleApprove}>
                Confirm Approval
              </Button>
              <Button variant="secondary" fullWidth onClick={() => setAction(null)} disabled={loading}>
                Back
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Alert type="warning" title="Reject Vendor">
              The vendor will be notified and will not be able to sell on the platform.
            </Alert>
            <Input
              label="Rejection Reason"
              placeholder="Explain why this vendor is being rejected..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                setError('')
              }}
              multiline
              rows={4}
              required
            />
            <div className="flex gap-3">
              <Button variant="danger" fullWidth loading={loading} onClick={handleReject}>
                Confirm Rejection
              </Button>
              <Button variant="secondary" fullWidth onClick={() => setAction(null)} disabled={loading}>
                Back
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
