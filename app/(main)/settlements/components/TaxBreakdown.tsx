'use client'

import { TaxDetails } from '@/lib/types'
import { Card } from '@/app/components/common/Card'
import { formatCurrency } from '@/lib/utils'

interface TaxBreakdownProps {
  taxDetails: TaxDetails
  totalAmount: number
}

export function TaxBreakdown({ taxDetails, totalAmount }: TaxBreakdownProps) {
  const gstPercentage = ((taxDetails.gst_amount / totalAmount) * 100).toFixed(2)
  const tdsPercentage = ((taxDetails.tds_amount / totalAmount) * 100).toFixed(2)
  const otherPercentage = ((taxDetails.other_taxes / totalAmount) * 100).toFixed(2)

  const totalTaxes = taxDetails.gst_amount + taxDetails.tds_amount + taxDetails.other_taxes
  const netAmount = totalAmount - totalTaxes

  return (
    <Card title="Tax Breakdown" subtitle="GST, TDS, and Other Deductions">
      <div className="space-y-6">
        {/* Tax Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* GST */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700 font-medium">GST (18%)</p>
            <p className="text-2xl font-bold text-blue-900 mt-2">{formatCurrency(taxDetails.gst_amount)}</p>
            <p className="text-xs text-blue-600 mt-1">{gstPercentage}% of total</p>
          </div>

          {/* TDS */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-700 font-medium">TDS (1%)</p>
            <p className="text-2xl font-bold text-purple-900 mt-2">{formatCurrency(taxDetails.tds_amount)}</p>
            <p className="text-xs text-purple-600 mt-1">{tdsPercentage}% of total</p>
          </div>

          {/* Other */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
            <p className="text-sm text-orange-700 font-medium">Other Taxes</p>
            <p className="text-2xl font-bold text-orange-900 mt-2">{formatCurrency(taxDetails.other_taxes)}</p>
            <p className="text-xs text-orange-600 mt-1">{otherPercentage}% of total</p>
          </div>
        </div>

        {/* Detailed Breakdown Table */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
          <p className="font-medium text-gray-900 mb-4">Settlement Calculation</p>

          <div className="space-y-3">
            {/* Gross Amount */}
            <div className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
              <span className="text-gray-700">Gross Settlement Amount</span>
              <span className="font-semibold text-gray-900">{formatCurrency(totalAmount)}</span>
            </div>

            {/* GST */}
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded border border-blue-200">
              <span className="text-gray-700">
                GST (18%) <span className="text-xs text-gray-600">[Goods & Services Tax]</span>
              </span>
              <span className="font-semibold text-blue-900">-{formatCurrency(taxDetails.gst_amount)}</span>
            </div>

            {/* TDS */}
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded border border-purple-200">
              <span className="text-gray-700">
                TDS (1%) <span className="text-xs text-gray-600">[Tax Deducted at Source]</span>
              </span>
              <span className="font-semibold text-purple-900">-{formatCurrency(taxDetails.tds_amount)}</span>
            </div>

            {/* Other Taxes */}
            {taxDetails.other_taxes > 0 && (
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded border border-orange-200">
                <span className="text-gray-700">
                  Other Taxes <span className="text-xs text-gray-600">[Local/State taxes]</span>
                </span>
                <span className="font-semibold text-orange-900">-{formatCurrency(taxDetails.other_taxes)}</span>
              </div>
            )}

            {/* Total Taxes */}
            <div className="flex items-center justify-between p-3 bg-red-50 rounded border border-red-200 my-2">
              <span className="text-gray-700 font-medium">Total Tax Deductions</span>
              <span className="font-bold text-red-900 text-lg">-{formatCurrency(totalTaxes)}</span>
            </div>

            {/* Net Amount */}
            <div className="flex items-center justify-between p-3 bg-green-50 rounded border border-green-200">
              <span className="text-gray-900 font-bold">Net Settlement Amount</span>
              <span className="font-bold text-green-900 text-xl">{formatCurrency(netAmount)}</span>
            </div>
          </div>
        </div>

        {/* Tax Information */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-2 text-sm">
          <p className="font-medium text-blue-900">Tax Information</p>
          <ul className="text-blue-800 space-y-1">
            <li>✓ GST: 18% Goods & Services Tax as per current regulation</li>
            <li>✓ TDS: 1% Tax Deducted at Source per income tax rules</li>
            <li>✓ Other Taxes: Any local, state, or regulatory taxes</li>
            <li>✓ All calculations performed as per Indian tax law</li>
          </ul>
        </div>
      </div>
    </Card>
  )
}
