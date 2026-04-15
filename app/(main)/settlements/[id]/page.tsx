'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { SettlementDetail } from '@/lib/types'
import { SettlementService } from '@/lib/services/settlementService'
import { Card } from '@/app/components/common/Card'
import { Alert } from '@/app/components/common/Alert'
import { Spinner } from '@/app/components/common/Spinner'
import { Button } from '@/app/components/common/Button'
import { Badge } from '@/app/components/common/Badge'
import { TaxBreakdown } from '../components/TaxBreakdown'
import { PayoutTracking } from '../components/PayoutTracking'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function SettlementDetailPage() {
  const params = useParams()
  const router = useRouter()
  const settlementId = params.id as string

  const [settlement, setSettlement] = useState<SettlementDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [approving, setApproving] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const fetchSettlement = async () => {
      try {
        setLoading(true)
        const data = await SettlementService.getSettlementDetail(settlementId)
        setSettlement(data)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load settlement details')
      } finally {
        setLoading(false)
      }
    }

    fetchSettlement()
  }, [settlementId, refreshKey])

  const handleApproveSettlement = async () => {
    if (!settlement) return

    setApproving(true)

    try {
      await SettlementService.approveSettlement(settlementId)
      setRefreshKey((prev) => prev + 1)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to approve settlement')
    } finally {
      setApproving(false)
    }
  }

  const handleProcessPayout = async (method: string) => {
    setApproving(true)

    try {
      await SettlementService.processPayout(settlementId, method)
      setRefreshKey((prev) => prev + 1)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to process payout')
    } finally {
      setApproving(false)
    }
  }

  const handleExportTally = async () => {
    try {
      const blob = await SettlementService.exportTallyXML(settlementId)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `settlement-${settlement?.settlement_number}-tally.xml`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to export Tally XML')
    }
  }

  if (loading) {
    return <Spinner fullScreen label="Loading settlement details..." />
  }

  if (error || !settlement) {
    return (
      <div className="space-y-6">
        <Button variant="secondary" onClick={() => router.back()}>
          ← Back to Settlements
        </Button>
        <Alert type="error" title="Error">
          {error || 'Settlement not found'}
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
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Settlement {settlement.settlement_number}</h1>
          <p className="text-gray-600 mt-2">
            Period: {formatDate(settlement.period_start)} to {formatDate(settlement.period_end)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Status</p>
          <Badge status={settlement.status} size="lg">
            {settlement.status.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Settlement Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card padding="md" shadow="sm">
          <p className="text-sm text-gray-600">Vendor</p>
          <p className="text-lg font-bold text-gray-900 mt-2">{settlement.vendor_name}</p>
        </Card>
        <Card padding="md" shadow="sm">
          <p className="text-sm text-gray-600">Gross Amount</p>
          <p className="text-lg font-bold text-blue-600 mt-2">{formatCurrency(settlement.gross_amount)}</p>
        </Card>
        <Card padding="md" shadow="sm">
          <p className="text-sm text-gray-600">Deductions</p>
          <p className="text-lg font-bold text-red-600 mt-2">-{formatCurrency(settlement.deductions)}</p>
        </Card>
        <Card padding="md" shadow="sm">
          <p className="text-sm text-gray-600">Net Amount</p>
          <p className="text-lg font-bold text-green-600 mt-2">{formatCurrency(settlement.total_amount)}</p>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {settlement.status === 'pending' && (
          <Button variant="primary" loading={approving} onClick={handleApproveSettlement}>
            ✓ Approve Settlement
          </Button>
        )}
        {settlement.status === 'approved' && (
          <Button variant="success" loading={approving} onClick={() => handleProcessPayout('bank_transfer')}>
            💳 Process Payout
          </Button>
        )}
        <Button variant="secondary" onClick={handleExportTally}>
          📊 Export to Tally
        </Button>
      </div>

      {/* Calculation Breakdown */}
      <Card title="Calculation Breakdown" subtitle="Settlement Amount Calculation">
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
            <span className="text-gray-700">Gross Sales</span>
            <span className="font-semibold">{formatCurrency(settlement.calculation_breakdown.gross_sales)}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded border border-orange-200">
            <span className="text-gray-700">Commissions</span>
            <span className="font-semibold text-orange-900">-{formatCurrency(settlement.calculation_breakdown.commissions)}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-red-50 rounded border border-red-200">
            <span className="text-gray-700">Returns</span>
            <span className="font-semibold text-red-900">-{formatCurrency(settlement.calculation_breakdown.returns)}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-red-50 rounded border border-red-200">
            <span className="text-gray-700">Refunds</span>
            <span className="font-semibold text-red-900">-{formatCurrency(settlement.calculation_breakdown.refunds)}</span>
          </div>
          {settlement.calculation_breakdown.chargebacks > 0 && (
            <div className="flex items-center justify-between p-3 bg-red-100 rounded border border-red-300">
              <span className="text-gray-700">Chargebacks</span>
              <span className="font-semibold text-red-900">-{formatCurrency(settlement.calculation_breakdown.chargebacks)}</span>
            </div>
          )}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
            <span className="text-gray-700">Adjustments</span>
            <span className="font-semibold">{formatCurrency(settlement.calculation_breakdown.adjustments)}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded border border-green-200">
            <span className="text-gray-900 font-bold">Net Amount</span>
            <span className="font-bold text-green-900 text-lg">{formatCurrency(settlement.calculation_breakdown.net_amount)}</span>
          </div>
        </div>
      </Card>

      {/* Tax Breakdown */}
      <TaxBreakdown taxDetails={settlement.tax_details} totalAmount={settlement.total_amount} />

      {/* Payout Tracking */}
      <PayoutTracking
        payoutDetails={settlement.payout_details}
        settlementAmount={settlement.total_amount}
        onProcessPayout={handleProcessPayout}
        loading={approving}
      />

      {/* Transactions List */}
      <Card title="Transactions" subtitle={`${settlement.transactions.length} transactions`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Order ID</th>
                <th className="px-4 py-2 text-left font-semibold">Type</th>
                <th className="px-4 py-2 text-right font-semibold">Amount</th>
                <th className="px-4 py-2 text-left font-semibold">Description</th>
                <th className="px-4 py-2 text-left font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {settlement.transactions.map((txn) => (
                <tr key={txn.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{txn.order_id}</td>
                  <td className="px-4 py-3">
                    <Badge variant="default" size="sm">
                      {txn.type.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">{formatCurrency(txn.amount)}</td>
                  <td className="px-4 py-3 text-gray-600">{txn.description}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(txn.transaction_date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
