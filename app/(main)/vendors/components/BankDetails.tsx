'use client'

import { useState } from 'react'
import { BankDetails as BankDetailsType } from '@/lib/types'
import { Card } from '@/app/components/common/Card'
import { Input } from '@/app/components/common/Input'
import { Button } from '@/app/components/common/Button'
import { Alert } from '@/app/components/common/Alert'
import { Badge } from '@/app/components/common/Badge'
import { VendorService } from '@/lib/services/vendorService'
import { formatDate } from '@/lib/utils'

interface BankDetailsProps {
  vendorId: string
  bankData: BankDetailsType
  onSuccess: () => void
}

export function BankDetails({ vendorId, bankData, onSuccess }: BankDetailsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [accountNumber, setAccountNumber] = useState(bankData.account_number)
  const [ifscCode, setIfscCode] = useState(bankData.ifsc_code)
  const [accountHolder, setAccountHolder] = useState(bankData.account_holder_name)
  const [bankName, setBankName] = useState(bankData.bank_name)

  const handleSave = async () => {
    if (!accountNumber || !ifscCode || !accountHolder || !bankName) {
      setError('Please fill all required fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      await VendorService.updateBankDetails(vendorId, {
        account_number: accountNumber,
        ifsc_code: ifscCode,
        account_holder_name: accountHolder,
        bank_name: bankName,
      })
      onSuccess()
      setIsEditing(false)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update bank details')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setAccountNumber(bankData.account_number)
    setIfscCode(bankData.ifsc_code)
    setAccountHolder(bankData.account_holder_name)
    setBankName(bankData.bank_name)
    setIsEditing(false)
    setError('')
  }

  if (!isEditing) {
    return (
      <Card title="Bank Account Details" subtitle="Settlement Payment Information">
        <div className="space-y-4">
          {/* Verification Status */}
          <div className="bg-gray-50 p-4 rounded border border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">{bankData.bank_name}</p>
            {bankData.verified_at ? (
              <Badge variant="success" size="sm">
                ✓ Verified
              </Badge>
            ) : (
              <Badge variant="warning" size="sm">
                ⚠ Pending
              </Badge>
            )}
          </div>

          {/* Bank Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Bank Name</p>
              <p className="font-semibold text-lg mt-1">{bankData.bank_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Account Number</p>
              <p className="font-mono font-semibold mt-1">{bankData.account_number}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">IFSC Code</p>
              <p className="font-mono font-semibold mt-1">{bankData.ifsc_code}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Account Holder</p>
              <p className="font-semibold mt-1">{bankData.account_holder_name}</p>
            </div>
          </div>

          {/* Verification Info */}
          {bankData.verified_at && (
            <div className="bg-green-50 p-4 rounded border border-green-200">
              <p className="text-sm text-green-700">
                ✓ Bank account verified on {formatDate(bankData.verified_at)}
              </p>
            </div>
          )}

          {/* Edit Button */}
          <Button variant="secondary" fullWidth onClick={() => setIsEditing(true)}>
            ✏️ Edit Bank Details
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card title="Edit Bank Details" subtitle="Update Settlement Account Information">
      <div className="space-y-4">
        {error && <Alert type="error">{error}</Alert>}

        <Input
          label="Bank Name"
          placeholder="Enter bank name"
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          required
          disabled={loading}
        />

        <Input
          label="Account Number"
          placeholder="Enter account number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          required
          disabled={loading}
        />

        <Input
          label="IFSC Code"
          placeholder="Enter IFSC code (e.g., SBIN0001234)"
          value={ifscCode}
          onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
          required
          disabled={loading}
        />

        <Input
          label="Account Holder Name"
          placeholder="Enter account holder name"
          value={accountHolder}
          onChange={(e) => setAccountHolder(e.target.value)}
          required
          disabled={loading}
        />

        <Alert type="info" title="Important">
          Account number and IFSC code will be verified before enabling settlements. Please ensure details are accurate.
        </Alert>

        <div className="flex gap-3 pt-4">
          <Button variant="primary" fullWidth loading={loading} onClick={handleSave}>
            Save Bank Details
          </Button>
          <Button variant="secondary" fullWidth onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>
        </div>
      </div>
    </Card>
  )
}
