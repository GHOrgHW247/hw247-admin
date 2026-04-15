'use client'

import { PayoutDetails } from '@/lib/types'
import { Card } from '@/app/components/common/Card'
import { Badge } from '@/app/components/common/Badge'
import { Button } from '@/app/components/common/Button'
import { formatCurrency, formatDate } from '@/lib/utils'

interface PayoutTrackingProps {
  payoutDetails: PayoutDetails
  settlementAmount: number
  onProcessPayout: (method: string) => void
  loading?: boolean
}

export function PayoutTracking({
  payoutDetails,
  settlementAmount,
  onProcessPayout,
  loading = false,
}: PayoutTrackingProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPayoutMethodLabel = (method: string) => {
    switch (method) {
      case 'bank_transfer':
        return 'Bank Transfer'
      case 'check':
        return 'Check'
      case 'wallet':
        return 'Wallet/Account'
      default:
        return method
    }
  }

  return (
    <Card title="Payout Tracking" subtitle="Settlement Payment Status & History">
      <div className="space-y-6">
        {/* Payout Status Overview */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-medium">Payout Amount</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{formatCurrency(settlementAmount)}</p>
              <p className="text-sm text-blue-700 mt-2">
                Method: {getPayoutMethodLabel(payoutDetails.payout_method)}
              </p>
            </div>
            <Badge status={payoutDetails.status} size="lg" className={getStatusColor(payoutDetails.status)}>
              {payoutDetails.status.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Payout Details */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
          <p className="font-medium text-gray-900 mb-4">Payout Details</p>

          <div className="space-y-3">
            {/* Payout Method */}
            <div className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
              <span className="text-gray-700">Payout Method</span>
              <span className="font-semibold">{getPayoutMethodLabel(payoutDetails.payout_method)}</span>
            </div>

            {/* Bank Account (if bank transfer) */}
            {payoutDetails.payout_method === 'bank_transfer' && payoutDetails.bank_account && (
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded border border-blue-200">
                <span className="text-gray-700">Account Number</span>
                <span className="font-mono font-semibold text-blue-900">{payoutDetails.bank_account}</span>
              </div>
            )}

            {/* Payout Status */}
            <div className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
              <span className="text-gray-700">Current Status</span>
              <span className={`font-semibold px-3 py-1 rounded-full text-sm ${getStatusColor(payoutDetails.status)}`}>
                {payoutDetails.status.toUpperCase()}
              </span>
            </div>

            {/* Payout Date (if processed) */}
            {payoutDetails.payout_date && (
              <div className="flex items-center justify-between p-3 bg-green-50 rounded border border-green-200">
                <span className="text-gray-700">Payout Date</span>
                <span className="font-semibold text-green-900">{formatDate(payoutDetails.payout_date)}</span>
              </div>
            )}

            {/* Reference Number (if available) */}
            {payoutDetails.reference_number && (
              <div className="flex items-center justify-between p-3 bg-indigo-50 rounded border border-indigo-200">
                <span className="text-gray-700">Reference Number</span>
                <span className="font-mono font-semibold text-indigo-900">{payoutDetails.reference_number}</span>
              </div>
            )}
          </div>
        </div>

        {/* Payout Timeline */}
        <div className="space-y-3">
          <p className="font-medium text-gray-900">Payout Timeline</p>

          <div className="relative">
            {/* Timeline Steps */}
            <div className="space-y-4">
              {/* Step 1: Settlement Created */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-green-600 mt-1.5"></div>
                  <div className="w-1 h-12 bg-gray-300 mt-2"></div>
                </div>
                <div className="pb-4">
                  <p className="font-medium text-gray-900">Settlement Created</p>
                  <p className="text-sm text-gray-600">Settlement batch processed</p>
                </div>
              </div>

              {/* Step 2: Approved */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-green-600 mt-1.5"></div>
                  <div className="w-1 h-12 bg-gray-300 mt-2"></div>
                </div>
                <div className="pb-4">
                  <p className="font-medium text-gray-900">Settlement Approved</p>
                  <p className="text-sm text-gray-600">Approved for payout processing</p>
                </div>
              </div>

              {/* Step 3: Payout Processing */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      payoutDetails.status !== 'pending' ? 'bg-green-600' : 'bg-yellow-600'
                    } mt-1.5`}
                  ></div>
                  <div className="w-1 h-12 bg-gray-300 mt-2"></div>
                </div>
                <div className="pb-4">
                  <p className="font-medium text-gray-900">Payout Processing</p>
                  <p className="text-sm text-gray-600">
                    {payoutDetails.status === 'pending'
                      ? 'Awaiting payment gateway processing'
                      : 'Payment initiated to vendor account'}
                  </p>
                </div>
              </div>

              {/* Step 4: Completed */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      payoutDetails.status === 'processed' ? 'bg-green-600' : 'bg-gray-300'
                    } mt-1.5`}
                  ></div>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Payout Completed</p>
                  <p className="text-sm text-gray-600">
                    {payoutDetails.status === 'processed'
                      ? `Completed on ${formatDate(payoutDetails.payout_date || new Date().toISOString())}`
                      : 'Pending completion'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {payoutDetails.status === 'pending' && (
          <Button
            variant="primary"
            fullWidth
            loading={loading}
            onClick={() => onProcessPayout(payoutDetails.payout_method)}
          >
            💳 Process Payout
          </Button>
        )}

        {payoutDetails.status === 'failed' && (
          <Button
            variant="warning"
            fullWidth
            loading={loading}
            onClick={() => onProcessPayout(payoutDetails.payout_method)}
          >
            🔄 Retry Payout
          </Button>
        )}

        {payoutDetails.status === 'processed' && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-sm text-green-700">
            ✓ Payout has been successfully processed and transferred to the vendor account.
          </div>
        )}

        {/* Information */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-sm space-y-2">
          <p className="font-medium text-blue-900">Payout Information</p>
          <ul className="text-blue-800 space-y-1">
            <li>✓ Payouts are processed daily at 2 AM IST</li>
            <li>✓ Bank transfers typically complete within 24 hours</li>
            <li>✓ Failed payouts are automatically retried</li>
            <li>✓ All transactions are tracked for audit purposes</li>
          </ul>
        </div>
      </div>
    </Card>
  )
}
