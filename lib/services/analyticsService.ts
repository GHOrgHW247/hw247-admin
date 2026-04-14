import api from '@/lib/api'
import { AnalyticsMetrics, VendorAnalytics } from '@/lib/types'

/**
 * Analytics & reporting service
 */
export class AnalyticsService {
  /**
   * Get dashboard metrics
   */
  static async getDashboardMetrics(): Promise<any> {
    const response = await api.get('/admin/analytics/dashboard')
    return response.data.data
  }

  /**
   * Get GMV trends
   */
  static async getGMVTrends(params: { days?: number; groupBy?: 'day' | 'week' | 'month' }): Promise<AnalyticsMetrics[]> {
    const response = await api.get('/admin/analytics/gmv', { params })
    return response.data.data
  }

  /**
   * Get order analytics
   */
  static async getOrderAnalytics(params: { days?: number }): Promise<any> {
    const response = await api.get('/admin/analytics/orders', { params })
    return response.data.data
  }

  /**
   * Get vendor analytics
   */
  static async getVendorAnalytics(params: {
    limit?: number
    sortBy?: string
  }): Promise<VendorAnalytics[]> {
    const response = await api.get('/admin/analytics/vendors', { params })
    return response.data.data
  }

  /**
   * Get return analytics
   */
  static async getReturnAnalytics(params: { days?: number }): Promise<any> {
    const response = await api.get('/admin/analytics/returns', { params })
    return response.data.data
  }

  /**
   * Get settlement analytics
   */
  static async getSettlementAnalytics(params: { months?: number }): Promise<any> {
    const response = await api.get('/admin/analytics/settlements', { params })
    return response.data.data
  }

  /**
   * Generate custom report
   */
  static async generateReport(params: {
    type: 'orders' | 'vendors' | 'settlements' | 'returns'
    startDate: string
    endDate: string
    format: 'pdf' | 'csv' | 'excel'
  }): Promise<Blob> {
    const response = await api.post('/admin/reports/generate', params, {
      responseType: 'blob',
    })
    return response.data
  }

  /**
   * Export report
   */
  static async exportReport(reportId: string, format: 'pdf' | 'csv' | 'excel'): Promise<Blob> {
    const response = await api.get(`/admin/reports/${reportId}/export`, {
      params: { format },
      responseType: 'blob',
    })
    return response.data
  }
}
