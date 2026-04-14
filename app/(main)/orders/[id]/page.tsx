'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { OrderDetail } from '@/lib/types'
import { OrderService } from '@/lib/services/orderService'
import { Card } from '@/app/components/common/Card'
import { Alert } from '@/app/components/common/Alert'
import { Spinner } from '@/app/components/common/Spinner'
import { Button } from '@/app/components/common/Button'
import { Badge } from '@/app/components/common/Badge'
import { formatCurrency, formatDateTime, formatDate } from '@/lib/utils'

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string

  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForceStatus, setShowForceStatus] = useState(false)
  const [newStatus, setNewStatus] = useState('')

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        const data = await OrderService.getOrderDetail(orderId)
        setOrder(data)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load order details')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  const handleForceStatus = async () => {
    if (!order || !newStatus) return

    try {
      const updated = await OrderService.forceStatusChange(orderId, newStatus, 'Admin force status change')
      setOrder(updated)
      setShowForceStatus(false)
      setNewStatus('')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to change order status')
    }
  }

  if (loading) {
    return <Spinner fullScreen label="Loading order details..." />
  }

  if (error || !order) {
    return (
      <div className="space-y-6">
        <Button variant="secondary" onClick={() => router.back()}>
          ← Back to Orders
        </Button>
        <Alert type="error" title="Error">
          {error || 'Order not found'}
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
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Order {order.order_number}</h1>
          <p className="text-gray-600 mt-2">Created on {formatDate(order.created_at)}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Status</p>
          <Badge status={order.status} size="lg">
            {order.display_status.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Order Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <Card title="Order Information">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="font-semibold">{order.order_number}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Vendor</p>
              <p className="font-semibold">{order.vendor_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Buyer</p>
              <p className="font-semibold">{order.buyer_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-xl font-bold text-blue-600">{formatCurrency(order.total_amount)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Items</p>
              <p className="font-semibold">{order.items_count} items</p>
            </div>
          </div>
        </Card>

        {/* Status & Actions */}
        <Card title="Actions">
          <div className="space-y-3">
            <Button variant="primary" fullWidth onClick={() => setShowForceStatus(true)}>
              ⚡ Force Status Change
            </Button>
            <Button variant="danger" fullWidth>
              ✕ Cancel Order
            </Button>
            <Button variant="secondary" fullWidth>
              🔄 Request Shipment
            </Button>
          </div>
        </Card>
      </div>

      {/* Order Items */}
      <Card title={`Order Items (${order.items.length})`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Product</th>
                <th className="px-4 py-2 text-right font-semibold">Qty</th>
                <th className="px-4 py-2 text-right font-semibold">Unit Price</th>
                <th className="px-4 py-2 text-right font-semibold">Total</th>
                <th className="px-4 py-2 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{item.product_name}</td>
                  <td className="px-4 py-3 text-right">{item.quantity}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(item.unit_price)}</td>
                  <td className="px-4 py-3 text-right font-semibold">{formatCurrency(item.total_price)}</td>
                  <td className="px-4 py-3">
                    <Badge status={item.status} size="sm">
                      {item.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Timeline */}
      <Card title="Order Timeline">
        <div className="space-y-4">
          {order.timeline && order.timeline.length > 0 ? (
            order.timeline.map((event, idx) => (
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
                  <p className="text-xs text-gray-500 mt-1">by {event.actor}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No timeline events</p>
          )}
        </div>
      </Card>

      {/* Audit Log */}
      {order.audit_log && order.audit_log.length > 0 && (
        <Card title="Audit Log">
          <div className="space-y-3">
            {order.audit_log.slice(0, 5).map((log, idx) => (
              <div key={idx} className="text-sm p-3 bg-gray-50 rounded border border-gray-200">
                <div className="flex justify-between">
                  <span className="font-semibold">{log.action}</span>
                  <span className="text-gray-600">{formatDateTime(log.created_at)}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">by {log.performed_by}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Force Status Modal */}
      {showForceStatus && (
        <Card
          title="Force Status Change"
          padding="md"
          className="fixed inset-0 m-auto w-96 h-fit shadow-2xl z-50"
        >
          <div className="space-y-4">
            <Alert type="warning" title="Warning">
              Forcing a status change will update order state without following normal workflow.
            </Alert>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select status...</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div className="flex gap-2">
              <Button variant="primary" fullWidth onClick={handleForceStatus} disabled={!newStatus}>
                Confirm
              </Button>
              <Button variant="secondary" fullWidth onClick={() => setShowForceStatus(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Backdrop for Modal */}
      {showForceStatus && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowForceStatus(false)}
        ></div>
      )}
    </div>
  )
}
