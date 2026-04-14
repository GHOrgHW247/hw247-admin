'use client'

import { useState } from 'react'
import { Modal } from '@/app/components/common/Modal'
import { Select } from '@/app/components/common/Select'
import { Input } from '@/app/components/common/Input'
import { Button } from '@/app/components/common/Button'
import { Alert } from '@/app/components/common/Alert'
import { OrderService } from '@/lib/services/orderService'

interface ForceStatusModalProps {
  isOpen: boolean
  onClose: () => void
  orderId: string
  currentStatus: string
  onSuccess: () => void
}

export function ForceStatusModal({
  isOpen,
  onClose,
  orderId,
  currentStatus,
  onSuccess,
}: ForceStatusModalProps) {
  const [newStatus, setNewStatus] = useState('')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const statusOptions = [
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'failed', label: 'Failed' },
  ]

  const handleForceStatus = async () => {
    if (!newStatus) {
      setError('Please select a new status')
      return
    }

    setLoading(true)
    setError('')

    try {
      await OrderService.forceStatusChange(orderId, newStatus, reason || 'Admin force status change')
      onSuccess()
      resetForm()
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to change order status')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setNewStatus('')
    setReason('')
    setError('')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Force Status Change" size="md">
      <div className="space-y-4">
        <Alert type="warning" title="Warning">
          Forcing a status change will bypass normal workflow validation. This action is audited.
        </Alert>

        <div className="bg-gray-50 p-3 rounded border border-gray-200 text-sm">
          <p className="text-gray-600">Current Status: <span className="font-semibold">{currentStatus.toUpperCase()}</span></p>
        </div>

        {error && <Alert type="error">{error}</Alert>}

        <Select
          label="New Status"
          options={statusOptions}
          value={newStatus}
          onChange={(e) => {
            setNewStatus(e.target.value)
            setError('')
          }}
          placeholder="Select new status"
          required
        />

        <Input
          label="Reason (Optional)"
          placeholder="Why are you forcing this status change?"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          multiline={true}
        />

        <div className="flex gap-3 pt-4">
          <Button variant="primary" fullWidth loading={loading} onClick={handleForceStatus}>
            Force Status Change
          </Button>
          <Button variant="secondary" fullWidth onClick={onClose} disabled={loading}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  )
}
