'use client'

import { useState } from 'react'
import { Modal } from '@/app/components/common/Modal'
import { Button } from '@/app/components/common/Button'
import { Alert } from '@/app/components/common/Alert'
import { Input } from '@/app/components/common/Input'
import { ReturnService } from '@/lib/services/returnService'

interface ForceApprovalModalProps {
  isOpen: boolean
  onClose: () => void
  rmaNumber: string
  onSuccess: () => void
}

export function ForceApprovalModal({ isOpen, onClose, rmaNumber, onSuccess }: ForceApprovalModalProps) {
  const [action, setAction] = useState<'approve' | 'reject' | null>(null)
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleApprove = async () => {
    setLoading(true)
    setError('')

    try {
      await ReturnService.forceApprove(rmaNumber, reason || 'Admin approval')
      onSuccess()
      resetForm()
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to approve return')
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
      await ReturnService.forceReject(rmaNumber, reason)
      onSuccess()
      resetForm()
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reject return')
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
    <Modal isOpen={isOpen} onClose={onClose} title="Force Return Approval/Rejection" size="md">
      <div className="space-y-4">
        <Alert type="warning" title="Admin Override">
          This will force the return status regardless of normal workflow. This action is audited.
        </Alert>

        {error && <Alert type="error">{error}</Alert>}

        {!action ? (
          <div className="space-y-3">
            <p className="text-gray-700 font-medium">What action do you want to take?</p>
            <div className="flex flex-col gap-2">
              <Button
                variant="success"
                fullWidth
                onClick={() => setAction('approve')}
                disabled={loading}
              >
                ✓ Approve Return
              </Button>
              <Button
                variant="danger"
                fullWidth
                onClick={() => setAction('reject')}
                disabled={loading}
              >
                ✕ Reject Return
              </Button>
            </div>
          </div>
        ) : action === 'approve' ? (
          <div className="space-y-4">
            <Alert type="success" title="Approve Return">
              The return will be approved and the buyer will be refunded.
            </Alert>

            <Input
              label="Reason (Optional)"
              placeholder="Provide reason for approval..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                setError('')
              }}
              multiline
              rows={3}
            />

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
            <Alert type="danger" title="Reject Return">
              The return will be rejected. The buyer will be notified with the reason.
            </Alert>

            <Input
              label="Rejection Reason"
              placeholder="Explain why the return is being rejected..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                setError('')
              }}
              multiline
              rows={3}
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
