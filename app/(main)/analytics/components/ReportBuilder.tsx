'use client'

import { useState } from 'react'
import { Card } from '@/app/components/common/Card'
import { Button } from '@/app/components/common/Button'
import { Input } from '@/app/components/common/Input'
import { Select } from '@/app/components/common/Select'
import { Alert } from '@/app/components/common/Alert'
import { AnalyticsService } from '@/lib/services/analyticsService'

interface ReportBuilderProps {
  onGenerateStart?: () => void
  onGenerateComplete?: () => void
}

type ReportType = 'orders' | 'vendors' | 'settlements' | 'returns'
type ExportFormat = 'pdf' | 'csv' | 'excel'

export function ReportBuilder({ onGenerateStart, onGenerateComplete }: ReportBuilderProps) {
  const [reportType, setReportType] = useState<ReportType>('orders')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [format, setFormat] = useState<ExportFormat>('pdf')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Set default date range (last 30 days)
  const setDefaultDateRange = () => {
    const today = new Date()
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    setEndDate(today.toISOString().split('T')[0])
    setStartDate(thirtyDaysAgo.toISOString().split('T')[0])
  }

  const handleGenerateReport = async () => {
    setError('')
    setSuccess('')

    if (!startDate || !endDate) {
      setError('Please select both start and end dates')
      return
    }

    setLoading(true)
    onGenerateStart?.()

    try {
      const blob = await AnalyticsService.generateReport({
        type: reportType,
        startDate,
        endDate,
        format,
      })

      // Trigger download
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url

      // Set filename based on report type and format
      const timestamp = new Date().toISOString().split('T')[0]
      const ext = format === 'excel' ? 'xlsx' : format
      link.download = `${reportType}-report-${timestamp}.${ext}`

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      setSuccess(`${reportType} report generated and downloaded successfully!`)
      onGenerateComplete?.()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate report')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="Custom Report Builder" subtitle="Generate and export reports in your preferred format">
      <div className="space-y-6">
        {error && <Alert type="error">{error}</Alert>}
        {success && <Alert type="success">{success}</Alert>}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Select
            label="Report Type"
            value={reportType}
            onChange={(e) => setReportType(e.target.value as ReportType)}
            options={[
              { value: 'orders', label: 'Orders Report' },
              { value: 'vendors', label: 'Vendors Report' },
              { value: 'settlements', label: 'Settlements Report' },
              { value: 'returns', label: 'Returns Report' },
            ]}
          />

          <Select
            label="Export Format"
            value={format}
            onChange={(e) => setFormat(e.target.value as ExportFormat)}
            options={[
              { value: 'pdf', label: 'PDF' },
              { value: 'csv', label: 'CSV' },
              { value: 'excel', label: 'Excel (XLSX)' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" onClick={setDefaultDateRange} disabled={loading}>
            Last 30 Days
          </Button>
          <Button variant="primary" fullWidth loading={loading} onClick={handleGenerateReport}>
            📥 Generate & Download Report
          </Button>
        </div>

        <div className="border-t border-gray-200 pt-4 text-xs text-gray-600 space-y-2">
          <p>
            <strong>PDF:</strong> Formatted report suitable for printing and sharing
          </p>
          <p>
            <strong>CSV:</strong> Comma-separated values for spreadsheet applications
          </p>
          <p>
            <strong>Excel:</strong> Microsoft Excel format with formatting and formulas
          </p>
        </div>
      </div>
    </Card>
  )
}
