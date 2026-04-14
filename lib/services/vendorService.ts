import api from '@/lib/api'
import { Vendor, VendorDetail, PaginatedResponse } from '@/lib/types'

/**
 * Vendor management service
 */
export class VendorService {
  /**
   * Get paginated list of vendors with filters
   */
  static async getVendors(params: {
    page?: number
    limit?: number
    status?: string
    kycStatus?: string
    search?: string
  }): Promise<PaginatedResponse<Vendor>> {
    const response = await api.get('/admin/vendors', { params })
    return response.data
  }

  /**
   * Get vendor detail by ID
   */
  static async getVendorDetail(vendorId: string): Promise<VendorDetail> {
    const response = await api.get(`/admin/vendors/${vendorId}`)
    return response.data.data
  }

  /**
   * Approve vendor
   */
  static async approveVendor(vendorId: string): Promise<Vendor> {
    const response = await api.post(`/admin/vendors/${vendorId}/approve`)
    return response.data.data
  }

  /**
   * Reject vendor
   */
  static async rejectVendor(vendorId: string, reason: string): Promise<Vendor> {
    const response = await api.post(`/admin/vendors/${vendorId}/reject`, { reason })
    return response.data.data
  }

  /**
   * Update KYC details
   */
  static async updateKYC(vendorId: string, kycData: any): Promise<any> {
    const response = await api.put(`/admin/vendors/${vendorId}/kyc`, kycData)
    return response.data.data
  }

  /**
   * Update bank details
   */
  static async updateBankDetails(vendorId: string, bankData: any): Promise<any> {
    const response = await api.put(`/admin/vendors/${vendorId}/bank`, bankData)
    return response.data.data
  }

  /**
   * Upload document
   */
  static async uploadDocument(vendorId: string, file: File, docType: string): Promise<any> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', docType)

    const response = await api.post(`/admin/vendors/${vendorId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data.data
  }

  /**
   * Approve vendor catalog
   */
  static async approveCatalog(vendorId: string): Promise<any> {
    const response = await api.put(`/admin/vendors/${vendorId}/catalog/approve`)
    return response.data.data
  }

  /**
   * Get vendor performance metrics
   */
  static async getPerformanceMetrics(vendorId: string): Promise<any> {
    const response = await api.get(`/admin/vendors/${vendorId}/performance`)
    return response.data.data
  }
}
