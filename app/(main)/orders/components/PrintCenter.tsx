'use client'

import { useState } from 'react'
import { Modal } from '@/app/components/common/Modal'
import { Button } from '@/app/components/common/Button'
import { Alert } from '@/app/components/common/Alert'
import { Input } from '@/app/components/common/Input'
import { OrderService } from '@/lib/services/orderService'

interface PrintCenterProps {
  isOpen: boolean
  onClose: () => void
  orderIds: string[]
}

export function PrintCenter({ isOpen, onClose, orderIds }: PrintCenterProps) {
  const [copies, setCopies] = useState('1')
  const [paperSize, setPaperSize] = useState('a4')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleGeneratePrintCenter = async () => {
    if (orderIds.length === 0) {
      setError('No orders selected')
      return
    }

    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const blob = await OrderService.getPrintCenter(orderIds)

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `packing-slips-${Date.now()}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      setSuccess(true)
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate packing slips')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Print Center - Packing Slips" size="md">
      <div className="space-y-4">
        <div className="bg-purple-50 p-4 rounded border border-purple-200">
          <p className="text-sm font-medium text-purple-900">Print Settings</p>
          <p className="text-xs text-purple-700 mt-1">
            Generate packing slips for {orderIds.length} order{orderIds.length !== 1 ? 's' : ''}
          </p>
        </div>

        {error && <Alert type="error">{error}</Alert>}
        {success && <Alert type="success" title="Success">Packing slips generated and downloaded!</Alert>}

        <Input
          type="number"
          label="Number of Copies per Slip"
          min="1"
          max="10"
          value={copies}
          onChange={(e) => setCopies(e.target.value)}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Paper Size</label>
          <select
            value={paperSize}
            onChange={(e) => setPaperSize(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="a4">A4 (210 x 297 mm)</option>
            <option value="letter">Letter (8.5 x 11 in)</option>
            <option value="a5">A5 (148 x 210 mm)</option>
            <option value="thermal">Thermal Label (100 x 150 mm)</option>
          </select>
        </div>

        <div className="bg-gray-50 p-3 rounded text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Orders:</span>
            <span className="font-medium">{orderIds.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Copies per Order:</span>
            <span className="font-medium">{copies}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Pages:</span>
            <span className="font-medium">{orderIds.length * parseInt(copies)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Paper Size:</span>
            <span className="font-medium">{paperSize.toUpperCase()}</span>
          </div>
        </div>

        <Alert type="info" title="Print Tips">
          Ensure your printer is connected and has sufficient paper. Click the print button below to generate PDF.
        </Alert>

        <div className="flex gap-3 pt-4">
          <Button
            variant="primary"
            fullWidth
            loading={loading}
            onClick={handleGeneratePrintCenter}
            disabled={orderIds.length === 0 || success}
          >
            🖨️ Generate PDF
          </Button>
          <Button variant="secondary" fullWidth onClick={onClose} disabled={loading}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  )
}
