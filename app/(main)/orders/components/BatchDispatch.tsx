'use client'

import { useState } from 'react'
import { Modal } from '@/app/components/common/Modal'
import { Select } from '@/app/components/common/Select'
import { Button } from '@/app/components/common/Button'
import { Alert } from '@/app/components/common/Alert'
import { OrderService } from '@/lib/services/orderService'

interface BatchDispatchProps {
  isOpen: boolean
  onClose: () => void
  orderIds: string[]
  onSuccess: () => void
}

export function BatchDispatch({ isOpen, onClose, orderIds, onSuccess }: BatchDispatchProps) {
  const [courierName, setCourierName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const courierOptions = [
    { value: 'dhl', label: 'DHL Express' },
    { value: 'fedex', label: 'FedEx' },
    { value: 'ups', label: 'UPS' },
    { value: 'bluedart', label: 'Blue Dart' },
    { value: 'ecom', label: 'Ecom Express' },
    { value: 'xpressbees', label: 'XpressBees' },
    { value: 'delhivery', label: 'Delhivery' },
    { value: 'shiprocket', label: 'Shiprocket' },
  ]

  const handleDispatch = async () => {
    if (!courierName || orderIds.length === 0) {
      setError('Please select a courier and ensure orders are selected')
      return
    }

    setLoading(true)
    setError('')

    try {
      await OrderService.batchDispatch(orderIds, courierName)
      onSuccess()
      resetForm()
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to dispatch orders')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setCourierName('')
    setError('')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Batch Dispatch Orders" size="md">
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded border border-blue-200">
          <p className="text-sm font-medium text-blue-900">Selected Orders: {orderIds.length}</p>
          <p className="text-xs text-blue-700 mt-1">These orders will be marked as shipped with the selected courier.</p>
        </div>

        {error && <Alert type="error">{error}</Alert>}

        <Select
          label="Select Courier"
          options={courierOptions}
          value={courierName}
          onChange={(e) => {
            setCourierName(e.target.value)
            setError('')
          }}
          placeholder="Choose a courier service"
          required
        />

        <div className="bg-gray-50 p-3 rounded text-sm">
          <p className="font-medium text-gray-900">Courier Details:</p>
          {courierName ? (
            <div className="mt-2 space-y-1 text-gray-700">
              <p>Service: {courierOptions.find((c) => c.value === courierName)?.label}</p>
              <p>Orders to dispatch: {orderIds.length}</p>
              <p>Tracking numbers will be auto-generated</p>
            </div>
          ) : (
            <p className="text-gray-600 mt-2">Select a courier to see details</p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="primary" fullWidth loading={loading} onClick={handleDispatch}>
            Dispatch {orderIds.length} Orders
          </Button>
          <Button variant="secondary" fullWidth onClick={onClose} disabled={loading}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  )
}
