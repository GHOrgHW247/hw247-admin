// Admin Portal Type Definitions

// Authentication
export interface AdminUser {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'admin' | 'operator'
  permissions: string[]
}

export interface AuthResponse {
  access_token: string
  user: AdminUser
}

// Orders
export interface Order {
  id: string
  order_number: string
  buyer_id: string
  buyer_name: string
  vendor_id: string
  vendor_name: string
  status: string
  display_status: string
  total_amount: number
  items_count: number
  created_at: string
  updated_at: string
}

export interface OrderDetail extends Order {
  items: OrderItem[]
  timeline: TimelineEvent[]
  sla?: SLAStatus
  audit_log: AuditLog[]
}

export interface OrderItem {
  id: string
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
  status: string
}

export interface TimelineEvent {
  status: string
  display_status: string
  timestamp: string
  actor: string
  notes: string
}

export interface SLAStatus {
  acknowledge: SLAStage
  ship: SLAStage
  deliver: SLAStage
}

export interface SLAStage {
  deadline: string
  status: 'pending' | 'completed' | 'breached'
  completed_at?: string
  alert_threshold_hours: number
}

// Vendors
export interface Vendor {
  id: string
  name: string
  email: string
  status: 'pending' | 'active' | 'suspended' | 'rejected'
  kyc_status: 'pending' | 'verified' | 'rejected'
  total_orders: number
  total_sales: number
  rating: number
  created_at: string
}

export interface VendorDetail extends Vendor {
  kyc_data: KYCData
  bank_details: BankDetails
  documents: Document[]
  performance_metrics: PerformanceMetrics
}

export interface KYCData {
  pan: string
  aadhar?: string
  business_name: string
  business_type: string
  registration_number?: string
  verified_at?: string
}

export interface BankDetails {
  account_number: string
  ifsc_code: string
  account_holder_name: string
  bank_name: string
  verified_at?: string
}

export interface Document {
  id: string
  type: 'pan' | 'aadhar' | 'business_license' | 'bank_statement' | 'other'
  file_url: string
  status: 'pending' | 'verified' | 'rejected'
  uploaded_at: string
  verified_at?: string
}

export interface PerformanceMetrics {
  sla_compliance_rate: number
  average_order_value: number
  order_cancellation_rate: number
  return_rate: number
  customer_rating: number
}

// Settlements
export interface Settlement {
  id: string
  settlement_number: string
  vendor_id: string
  vendor_name: string
  period_start: string
  period_end: string
  status: 'pending' | 'approved' | 'paid' | 'failed'
  total_amount: number
  gross_amount: number
  deductions: number
  created_at: string
}

export interface SettlementDetail extends Settlement {
  calculation_breakdown: CalculationBreakdown
  transactions: Transaction[]
  tax_details: TaxDetails
  payout_details: PayoutDetails
}

export interface CalculationBreakdown {
  gross_sales: number
  commissions: number
  returns: number
  refunds: number
  chargebacks: number
  adjustments: number
  net_amount: number
}

export interface Transaction {
  id: string
  order_id: string
  type: 'sale' | 'return' | 'commission' | 'adjustment'
  amount: number
  description: string
  transaction_date: string
}

export interface TaxDetails {
  gst_amount: number
  tds_amount: number
  other_taxes: number
}

export interface PayoutDetails {
  payout_method: 'bank_transfer' | 'check' | 'wallet'
  bank_account?: string
  payout_date?: string
  reference_number?: string
  status: 'pending' | 'processed' | 'failed'
}

// Returns
export interface Return {
  id: string
  rma_number: string
  order_id: string
  buyer_id: string
  vendor_id: string
  status: 'initiated' | 'in_transit' | 'received' | 'approved' | 'rejected' | 'closed'
  reason: string
  return_date: string
  received_date?: string
  created_at: string
}

export interface ReturnDetail extends Return {
  items: ReturnItem[]
  timeline: TimelineEvent[]
  dispute_thread: DisputeMessage[]
  escalation?: Escalation
}

export interface ReturnItem {
  id: string
  product_id: string
  product_name: string
  quantity: number
  reason: string
  condition: string
}

export interface DisputeMessage {
  id: string
  sender: 'buyer' | 'vendor' | 'admin'
  sender_name: string
  message: string
  created_at: string
}

export interface Escalation {
  id: string
  escalation_level: 1 | 2 | 3
  escalated_at: string
  escalated_to: string
  reason: string
  status: 'open' | 'resolved' | 'closed'
}

// Analytics
export interface AnalyticsMetrics {
  date: string
  gmv: number
  orders_count: number
  returns_count: number
  return_rate: number
  average_order_value: number
}

export interface VendorAnalytics {
  vendor_id: string
  vendor_name: string
  total_orders: number
  total_sales: number
  average_order_value: number
  order_completion_rate: number
  sla_compliance: number
  return_rate: number
  rating: number
}

// Audit
export interface AuditLog {
  id: string
  action: string
  entity_type: string
  entity_id: string
  performed_by: string
  changes: Record<string, any>
  created_at: string
  ip_address: string
}

// API Response Wrappers
export interface ApiResponse<T> {
  data: T
  message: string
  status: 'success' | 'error'
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  total_pages: number
}
