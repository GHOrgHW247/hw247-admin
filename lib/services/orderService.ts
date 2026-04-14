import api from '@/lib/api'
import { Order, OrderDetail, PaginatedResponse } from '@/lib/types'

/**
 * Order management service
 */
export class OrderService {
  /**
   * Get paginated list of orders with filters
   */
  static async getOrders(params: {
    page?: number
    limit?: number
    status?: string
    vendorId?: string
    dateFrom?: string
    dateTo?: string
    minAmount?: number
    maxAmount?: number
    search?: string
  }): Promise<PaginatedResponse<Order>> {
    const response = await api.get('/admin/orders', { params })
    return response.data
  }

  /**
   * Get order detail by ID
   */
  static async getOrderDetail(orderId: string): Promise<OrderDetail> {
    const response = await api.get(`/admin/orders/${orderId}`)
    return response.data.data
  }

  /**
   * Force change order status
   */
  static async forceStatusChange(
    orderId: string,
    newStatus: string,
    reason: string
  ): Promise<OrderDetail> {
    const response = await api.post(`/admin/orders/${orderId}/force-status`, {
      status: newStatus,
      reason,
    })
    return response.data.data
  }

  /**
   * Cancel order
   */
  static async cancelOrder(orderId: string, reason: string): Promise<OrderDetail> {
    const response = await api.post(`/admin/orders/${orderId}/cancel`, { reason })
    return response.data.data
  }

  /**
   * Batch dispatch orders
   */
  static async batchDispatch(orderIds: string[], courierName: string): Promise<any> {
    const response = await api.post('/admin/orders/batch-dispatch', {
      order_ids: orderIds,
      courier_name: courierName,
    })
    return response.data
  }

  /**
   * Get packing slips
   */
  static async getPrintCenter(orderIds: string[]): Promise<Blob> {
    const response = await api.post(
      '/admin/orders/print-center',
      { order_ids: orderIds },
      { responseType: 'blob' }
    )
    return response.data
  }
}
