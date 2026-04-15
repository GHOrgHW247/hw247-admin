'use client'

import { useState, useRef } from 'react'
import { Document } from '@/lib/types'
import { Card } from '@/app/components/common/Card'
import { Button } from '@/app/components/common/Button'
import { Alert } from '@/app/components/common/Alert'
import { Badge } from '@/app/components/common/Badge'
import { VendorService } from '@/lib/services/vendorService'
import { formatDate } from '@/lib/utils'

interface DocumentManagerProps {
  vendorId: string
  documents: Document[]
  onSuccess: () => void
}

const documentTypes = [
  { value: 'pan', label: 'PAN Certificate' },
  { value: 'aadhar', label: 'Aadhar Card' },
  { value: 'business_license', label: 'Business License' },
  { value: 'bank_statement', label: 'Bank Statement' },
  { value: 'other', label: 'Other Documents' },
]

export function DocumentManager({ vendorId, documents, onSuccess }: DocumentManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedType, setSelectedType] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedType) {
      setError('Please select a document type')
      return
    }

    setUploading(true)
    setError('')
    setSuccess('')

    try {
      await VendorService.uploadDocument(vendorId, file, selectedType)
      setSuccess('Document uploaded successfully')
      setSelectedType('')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      setTimeout(() => {
        onSuccess()
        setSuccess('')
      }, 1500)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload document')
    } finally {
      setUploading(false)
    }
  }

  const getDocumentTypeLabel = (type: string) => {
    return documentTypes.find((dt) => dt.value === type)?.label || type
  }

  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case 'verified':
  //       return 'bg-green-100 text-green-800'
  //     case 'pending':
  //       return 'bg-yellow-100 text-yellow-800'
  //     case 'rejected':
  //       return 'bg-red-100 text-red-800'
  //     default:
  //       return 'bg-gray-100 text-gray-800'
  //   }
  // }

  return (
    <Card title="Document Management" subtitle="Upload and Verify Documents">
      <div className="space-y-6">
        {/* Upload Section */}
        <div className="bg-blue-50 p-4 rounded border border-blue-200 space-y-4">
          <p className="font-medium text-gray-900">Upload New Document</p>

          {error && <Alert type="error">{error}</Alert>}
          {success && <Alert type="success">{success}</Alert>}

          <div className="flex gap-3">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              disabled={uploading}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select document type...</option>
              {documentTypes.map((dt) => (
                <option key={dt.value} value={dt.value}>
                  {dt.label}
                </option>
              ))}
            </select>

            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              disabled={uploading || !selectedType}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
            />

            <Button
              variant="primary"
              loading={uploading}
              onClick={() => fileInputRef.current?.click()}
              disabled={!selectedType || uploading}
            >
              📁 Choose File
            </Button>
          </div>

          <p className="text-xs text-gray-600">Accepted formats: PDF, JPG, PNG (Max 5MB)</p>
        </div>

        {/* Documents List */}
        <div>
          <p className="font-medium text-gray-900 mb-3">Uploaded Documents ({documents.length})</p>

          {documents.length === 0 ? (
            <p className="text-gray-600 text-sm">No documents uploaded yet</p>
          ) : (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{getDocumentTypeLabel(doc.type)}</p>
                    <p className="text-sm text-gray-600">
                      Uploaded on {formatDate(doc.uploaded_at)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {doc.verified_at && (
                      <p className="text-xs text-green-700">✓ Verified {formatDate(doc.verified_at)}</p>
                    )}
                    <Badge status={doc.status} size="sm">
                      {doc.status.toUpperCase()}
                    </Badge>
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <Alert type="info" title="Document Verification">
          All documents are verified by our compliance team. This may take 1-2 business days. You can upload additional
          supporting documents anytime.
        </Alert>
      </div>
    </Card>
  )
}
