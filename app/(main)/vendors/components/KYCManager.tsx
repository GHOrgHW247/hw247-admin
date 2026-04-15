'use client'

import { useState } from 'react'
import { KYCData } from '@/lib/types'
import { Card } from '@/app/components/common/Card'
import { Input } from '@/app/components/common/Input'
import { Button } from '@/app/components/common/Button'
import { Alert } from '@/app/components/common/Alert'
import { Badge } from '@/app/components/common/Badge'
import { VendorService } from '@/lib/services/vendorService'
import { formatDate } from '@/lib/utils'

interface KYCManagerProps {
  vendorId: string
  kycData: KYCData
  kycStatus: 'pending' | 'verified' | 'rejected'
  onSuccess: () => void
}

export function KYCManager({ vendorId, kycData, kycStatus, onSuccess }: KYCManagerProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Form states
  const [pan, setPan] = useState(kycData.pan)
  const [aadhar, setAadhar] = useState(kycData.aadhar || '')
  const [businessName, setBusinessName] = useState(kycData.business_name)
  const [businessType, setBusinessType] = useState(kycData.business_type)
  const [registrationNumber, setRegistrationNumber] = useState(kycData.registration_number || '')

  const handleSave = async () => {
    if (!pan || !businessName || !businessType) {
      setError('Please fill all required fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      await VendorService.updateKYC(vendorId, {
        pan,
        aadhar: aadhar || undefined,
        business_name: businessName,
        business_type: businessType,
        registration_number: registrationNumber || undefined,
      })
      onSuccess()
      setIsEditing(false)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update KYC')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setPan(kycData.pan)
    setAadhar(kycData.aadhar || '')
    setBusinessName(kycData.business_name)
    setBusinessType(kycData.business_type)
    setRegistrationNumber(kycData.registration_number || '')
    setIsEditing(false)
    setError('')
  }

  if (!isEditing) {
    return (
      <Card title="KYC Verification Details" subtitle="Know Your Customer Documentation">
        <div className="space-y-4">
          {/* Status */}
          <div className="bg-gray-50 p-4 rounded border border-gray-200 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current KYC Status</p>
              <p className="font-semibold mt-1">{kycData.business_name}</p>
            </div>
            <Badge status={kycStatus} size="lg">
              {kycStatus.toUpperCase()}
            </Badge>
          </div>

          {/* KYC Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">PAN Number</p>
              <p className="font-semibold text-lg mt-1">{kycData.pan}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Aadhar Number</p>
              <p className="font-semibold text-lg mt-1">{kycData.aadhar || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Business Type</p>
              <p className="font-semibold mt-1">{kycData.business_type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Registration Number</p>
              <p className="font-semibold mt-1">{kycData.registration_number || 'Not provided'}</p>
            </div>
          </div>

          {/* Verification Details */}
          {kycData.verified_at && (
            <div className="bg-green-50 p-4 rounded border border-green-200">
              <p className="text-sm text-green-700">
                ✓ KYC verified on {formatDate(kycData.verified_at)}
              </p>
            </div>
          )}

          {/* Edit Button */}
          <Button variant="secondary" fullWidth onClick={() => setIsEditing(true)}>
            ✏️ Edit KYC Details
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card title="Edit KYC Details" subtitle="Update Know Your Customer Information">
      <div className="space-y-4">
        {error && <Alert type="error">{error}</Alert>}

        <Input
          label="PAN Number"
          placeholder="Enter PAN number"
          value={pan}
          onChange={(e) => setPan(e.target.value)}
          required
          disabled={loading}
        />

        <Input
          label="Aadhar Number"
          placeholder="Enter Aadhar number (optional)"
          value={aadhar}
          onChange={(e) => setAadhar(e.target.value)}
          disabled={loading}
        />

        <Input
          label="Business Name"
          placeholder="Enter business name"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          required
          disabled={loading}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Type <span className="text-red-600">*</span>
          </label>
          <select
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select business type</option>
            <option value="individual">Individual/Proprietor</option>
            <option value="partnership">Partnership</option>
            <option value="pvt_ltd">Private Limited</option>
            <option value="llp">Limited Liability Partnership</option>
            <option value="trust">Trust</option>
          </select>
        </div>

        <Input
          label="Registration Number"
          placeholder="Enter registration number (optional)"
          value={registrationNumber}
          onChange={(e) => setRegistrationNumber(e.target.value)}
          disabled={loading}
        />

        <div className="flex gap-3 pt-4">
          <Button variant="primary" fullWidth loading={loading} onClick={handleSave}>
            Save KYC Details
          </Button>
          <Button variant="secondary" fullWidth onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>
        </div>
      </div>
    </Card>
  )
}
