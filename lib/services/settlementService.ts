import api from '@/lib/api'
import { Settlement, SettlementDetail, PaginatedResponse } from '@/lib/types'

/**
 * Settlement management service
 */
export class SettlementService {
  /**
   * Get paginated list of settlements
   */
  static async getSettlements(params: {
    page?: number
    limit?: number
    status?: string
    vendorId?: string
  }): Promise<PaginatedResponse<Settlement>> {
    const response = await api.get('/admin/settlements', { params })
    return response.data
  }

  /**
   * Get settlement detail
   */
  static async getSettlementDetail(settlementId: string): Promise<SettlementDetail> {
    const response = await api.get(`/admin/settlements/${settlementId}`)
    return response.data.data
  }

  /**
   * Generate batch settlements
   */
  static async generateSettlements(params: {
    startDate: string
    endDate: string
  }): Promise<any> {
    const response = await api.post('/admin/settlements/generate', params)
    return response.data
  }

  /**
   * Approve settlement for payment
   */
  static async approveSettlement(settlementId: string): Promise<Settlement> {
    const response = await api.post(`/admin/settlements/${settlementId}/approve`)
    return response.data.data
  }

  /**
   * Process payout
   */
  static async processPayout(settlementId: string, payoutMethod: string): Promise<Settlement> {
    const response = await api.post(`/admin/settlements/${settlementId}/payout`, {
      method: payoutMethod,
    })
    return response.data.data
  }

  /**
   * Export Tally XML (ERP integration)
   */
  static async exportTallyXML(settlementId: string): Promise<Blob> {
    const response = await api.get(`/admin/settlements/${settlementId}/tally-xml`, {
      responseType: 'blob',
    })
    return response.data
  }

  /**
   * Generate settlement report
   */
  static async generateReport(params: { startDate: string; endDate: string }): Promise<Blob> {
    const response = await api.post('/admin/settlements/report', params, {
      responseType: 'blob',
    })
    return response.data
  }
}
