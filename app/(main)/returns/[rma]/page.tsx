'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ReturnDetail } from '@/lib/types'
import { ReturnService } from '@/lib/services/returnService'
import { Card } from '@/app/components/common/Card'
import { Alert } from '@/app/components/common/Alert'
import { Spinner } from '@/app/components/common/Spinner'
import { Button } from '@/app/components/common/Button'
import { Badge } from '@/app/components/common/Badge'
import { DisputeThread } from './components/DisputeThread'
import { ForceApprovalModal } from './components/ForceApprovalModal'
import { formatDate, formatDateTime } from '@/lib/utils'

export default function ReturnDetailPage() {
  const params = useParams()
  const router = useRouter()
  const rmaNumber = params.rma as string

  const [returnData, setReturnData] = useState<ReturnDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const fetchReturn = async () => {
      try {
        setLoading(true)
        const data = await ReturnService.getReturnDetail(rmaNumber)
        setReturnData(data)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load return details')
      } finally {
        setLoading(false)
      }
    }

    fetchReturn()
  }, [rmaNumber, refreshKey])

  const handleAddMessage = async (message: string) => {
    try {
      await ReturnService.addDisputeMessage(rmaNumber, message)
      setRefreshKey((prev) => prev + 1)
    } catch (err: any) {
      throw err
    }
  }

  const handleSuccess = () => {
    setShowApprovalModal(false)
    setRefreshKey((prev) => prev + 1)
  }

  if (loading) {
    return <Spinner fullScreen label="Loading return details..." />
  }

  if (error || !returnData) {
    return (
      <div className="space-y-6">
        <Button variant="secondary" onClick={() => router.back()}>
          ← Back to Returns
        </Button>
        <Alert type="error" title="Error">
          {error || 'Return not found'}
        </Alert>
      </div>
    )
  }

  // Check if escalated (7+ days without resolution)
  const returnDate = new Date(returnData.return_date)
  const daysSinceReturn = Math.floor((Date.now() - returnDate.getTime()) / (1000 * 60 * 60 * 24))
  const isEscalated = daysSinceReturn > 7 && !['approved', 'rejected', 'closed'].includes(returnData.status)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="secondary" size="sm" onClick={() => router.back()}>
            ← Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Return {returnData.rma_number}</h1>
          <p className="text-gray-600 mt-2">Order: {returnData.order_id}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Status</p>
          <Badge status={returnData.status} size="lg">
            {returnData.status.toUpperCase()}
          </Badge>
          {isEscalated && (
            <Badge variant="danger" size="sm" className="mt-2 block">
              ⚠ ESCALATED
            </Badge>
          )}
        </div>
      </div>

      {/* Escalation Alert */}
      {isEscalated && (
        <Alert type="warning" title="Return Escalated">
          This return has been open for {daysSinceReturn} days without resolution. Action required immediately.
        </Alert>
      )}

      {/* Return Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Return Information">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">RMA Number</p>
              <p className="font-semibold">{returnData.rma_number}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Return Reason</p>
              <p className="font-semibold">{returnData.reason}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Return Date</p>
              <p className="font-semibold">{formatDate(returnData.return_date)}</p>
            </div>
            {returnData.received_date && (
              <div>
                <p className="text-sm text-gray-600">Received Date</p>
                <p className="font-semibold">{formatDate(returnData.received_date)}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600">Days Open</p>
              <p className={`font-semibold ${isEscalated ? 'text-red-600' : ''}`}>{daysSinceReturn} days</p>
            </div>
          </div>
        </Card>

        <Card title="Parties Involved">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="font-mono font-semibold text-xs">{returnData.order_id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Buyer ID</p>
              <p className="font-mono font-semibold text-xs">{returnData.buyer_id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Vendor ID</p>
              <p className="font-mono font-semibold text-xs">{returnData.vendor_id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Return Status</p>
              <Badge status={returnData.status} size="sm">
                {returnData.status.toUpperCase()}
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Return Items */}
      <Card title={`Return Items (${returnData.items.length})`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Product</th>
                <th className="px-4 py-2 text-right font-semibold">Qty</th>
                <th className="px-4 py-2 text-left font-semibold">Reason</th>
                <th className="px-4 py-2 text-left font-semibold">Condition</th>
              </tr>
            </thead>
            <tbody>
              {returnData.items.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{item.product_name}</td>
                  <td className="px-4 py-3 text-right">{item.quantity}</td>
                  <td className="px-4 py-3 text-sm">{item.reason}</td>
                  <td className="px-4 py-3">
                    <Badge variant="default" size="sm">
                      {item.condition.toUpperCase()}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Timeline */}
      <Card title="Return Timeline">
        <div className="space-y-4">
          {returnData.timeline && returnData.timeline.length > 0 ? (
            returnData.timeline.map((event, idx) => (
              <div key={idx} className="flex gap-4 pb-4 border-b last:border-b-0">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge status={event.status} size="sm">
                      {event.display_status.toUpperCase()}
                    </Badge>
                    <span className="text-sm text-gray-600">{formatDateTime(event.timestamp)}</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{event.notes}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No timeline events</p>
          )}
        </div>
      </Card>

      {/* Escalation Section */}
      {returnData.escalation && (
        <Card title="Escalation Details" className="border-l-4 border-red-500">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Escalation Level</p>
              <p className="font-semibold text-lg text-red-600">Level {returnData.escalation.escalation_level}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Escalated To</p>
              <p className="font-semibold">{returnData.escalation.escalated_to}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Reason</p>
              <p className="font-semibold">{returnData.escalation.reason}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Escalation Date</p>
              <p className="font-semibold">{formatDate(returnData.escalation.escalated_at)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <Badge status={returnData.escalation.status} size="sm">
                {returnData.escalation.status.toUpperCase()}
              </Badge>
            </div>
          </div>
        </Card>
      )}

      {/* Dispute Thread */}
      <DisputeThread
        rmaNumber={rmaNumber}
        messages={returnData.dispute_thread}
        onAddMessage={handleAddMessage}
      />

      {/* Admin Actions */}
      {!['approved', 'rejected', 'closed'].includes(returnData.status) && (
        <div className="flex gap-3">
          <Button variant="success" fullWidth onClick={() => setShowApprovalModal(true)}>
            ⚖️ Approve/Reject Return
          </Button>
          {isEscalated && (
            <Button variant="warning" fullWidth>
              🔼 Escalate Further
            </Button>
          )}
        </div>
      )}

      {/* Modals */}
      <ForceApprovalModal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        rmaNumber={rmaNumber}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
