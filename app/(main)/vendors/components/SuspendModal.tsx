'use client'

import { useState } from 'react'
import { Modal } from '@/app/components/common/Modal'
import { Button } from '@/app/components/common/Button'
import { Alert } from '@/app/components/common/Alert'
import { Input } from '@/app/components/common/Input'
import { Select } from '@/app/components/common/Select'

interface SuspendModalProps {
  isOpen: boolean
  onClose: () => void
  vendorId: string
  vendorName: string
  currentStatus: string
  onSuccess: () => void
}

export function SuspendModal({
  isOpen,
  onClose,
  vendorId,
  vendorName,
  currentStatus,
  onSuccess,
}: SuspendModalProps) {
  const [action, setAction] = useState<'suspend' | 'unsuspend' | null>(null)
  const [reason, setReason] = useState('')
  const [duration, setDuration] = useState('7') // days
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const durationOptions = [
    { value: '1', label: '1 Day' },
    { value: '3', label: '3 Days' },
    { value: '7', label: '7 Days' },
    { value: '30', label: '30 Days' },
    { value: 'permanent', label: 'Permanent' },
  ]

  const suspendReasons = [
    { value: 'quality_issues', label: 'Quality Issues' },
    { value: 'compliance_violation', label: 'Compliance Violation' },
    { value: 'return_rate', label: 'High Return Rate' },
    { value: 'customer_complaints', label: 'Customer Complaints' },
    { value: 'sla_breach', label: 'SLA Breach' },
    { value: 'other', label: 'Other' },
  ]

  const handleSuspend = async () => {
    if (!reason) {
      setError('Please provide a reason for suspension')
      return
    }

    setLoading(true)
    setError('')

    try {
      // API call would go here
      // await VendorService.suspendVendor(vendorId, { reason, duration })
      console.log('Suspending vendor:', vendorId, reason, duration)
      onSuccess()
      resetForm()
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to suspend vendor')
    } finally {
      setLoading(false)
    }
  }

  const handleUnsuspend = async () => {
    setLoading(true)
    setError('')

    try {
      // API call would go here
      // await VendorService.unsuspendVendor(vendorId)
      console.log('Unsuspending vendor:', vendorId)
      onSuccess()
      resetForm()
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to unsuspend vendor')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setAction(null)
    setReason('')
    setDuration('7')
    setError('')
  }

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Vendor Account Management" size="md">
      <div className="space-y-4">
        <Alert type="info" title="Vendor Information">
          <p className="font-medium">{vendorName}</p>
          <p className="text-sm mt-1">Current Status: {currentStatus.toUpperCase()}</p>
        </Alert>

        {error && <Alert type="error">{error}</Alert>}

        {!action ? (
          <div className="space-y-3">
            <p className="text-gray-700 font-medium">Vendor Account Actions</p>
            <div className="flex flex-col gap-2">
              {currentStatus !== 'suspended' && (
                <Button
                  variant="warning"
                  fullWidth
                  onClick={() => setAction('suspend')}
                  disabled={loading}
                >
                  ⏸️ Suspend Vendor
                </Button>
              )}
              {currentStatus === 'suspended' && (
                <Button
                  variant="success"
                  fullWidth
                  onClick={() => setAction('unsuspend')}
                  disabled={loading}
                >
                  ▶️ Unsuspend Vendor
                </Button>
              )}
              <Button
                variant="secondary"
                fullWidth
                onClick={onClose}
                disabled={loading}
              >
                Close
              </Button>
            </div>
          </div>
        ) : action === 'suspend' ? (
          <div className="space-y-4">
            <Alert type="warning" title="Suspend Vendor Account">
              Suspending this vendor will disable their ability to sell. All active orders will continue to be processed.
            </Alert>

            <Select
              label="Suspension Reason"
              placeholder="Select a reason"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                setError('')
              }}
              options={suspendReasons}
              required
            />

            <Select
              label="Suspension Duration"
              placeholder="Select duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              options={durationOptions}
            />

            <Input
              label="Additional Comments"
              placeholder="Add any additional details..."
              multiline
              rows={3}
              disabled={loading}
            />

            <div className="flex gap-3">
              <Button
                variant="danger"
                fullWidth
                loading={loading}
                onClick={handleSuspend}
              >
                Confirm Suspension
              </Button>
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setAction(null)}
                disabled={loading}
              >
                Back
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Alert type="success" title="Unsuspend Vendor Account">
              This will restore the vendor's ability to sell on the platform.
            </Alert>

            <div className="bg-gray-50 p-3 rounded border border-gray-200 text-sm">
              <p className="font-medium text-gray-900">Unsuspension Details</p>
              <ul className="mt-2 text-gray-700 space-y-1">
                <li>✓ Vendor access will be restored</li>
                <li>✓ Can create new listings immediately</li>
                <li>✓ Previous suspensions will be recorded</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button
                variant="success"
                fullWidth
                loading={loading}
                onClick={handleUnsuspend}
              >
                Confirm Unsuspension
              </Button>
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setAction(null)}
                disabled={loading}
              >
                Back
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
