import api from '@/lib/api'
import { Return, ReturnDetail, PaginatedResponse } from '@/lib/types'

/**
 * Return/RTO management service
 */
export class ReturnService {
  /**
   * Get paginated list of returns
   */
  static async getReturns(params: {
    page?: number
    limit?: number
    status?: string
    vendorId?: string
    search?: string
  }): Promise<PaginatedResponse<Return>> {
    const response = await api.get('/admin/returns', { params })
    return response.data
  }

  /**
   * Get return detail by RMA number
   */
  static async getReturnDetail(rmaNumber: string): Promise<ReturnDetail> {
    const response = await api.get(`/admin/returns/${rmaNumber}`)
    return response.data.data
  }

  /**
   * Force approve return
   */
  static async forceApprove(rmaNumber: string, reason?: string): Promise<Return> {
    const response = await api.post(`/admin/returns/${rmaNumber}/force-approval`, { reason })
    return response.data.data
  }

  /**
   * Force reject return
   */
  static async forceReject(rmaNumber: string, reason?: string): Promise<Return> {
    const response = await api.post(`/admin/returns/${rmaNumber}/force-rejection`, { reason })
    return response.data.data
  }

  /**
   * Add dispute message
   */
  static async addDisputeMessage(rmaNumber: string, message: string): Promise<any> {
    const response = await api.post(`/admin/returns/${rmaNumber}/dispute-message`, {
      message,
    })
    return response.data
  }

  /**
   * Escalate return
   */
  static async escalate(rmaNumber: string, reason: string): Promise<Return> {
    const response = await api.post(`/admin/returns/${rmaNumber}/escalate`, { reason })
    return response.data.data
  }

  /**
   * Get return analytics
   */
  static async getAnalytics(params: { startDate?: string; endDate?: string }): Promise<any> {
    const response = await api.get('/admin/returns/analytics', { params })
    return response.data.data
  }
}
