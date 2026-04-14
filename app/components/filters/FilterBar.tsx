'use client'

import { useState } from 'react'
import { Input } from '@/app/components/common/Input'
import { Select } from '@/app/components/common/Select'
import { Button } from '@/app/components/common/Button'

interface FilterBarProps {
  onFilterChange: (filters: Record<string, any>) => void
  loading?: boolean
  showFilters?: boolean
}

export function FilterBar({ onFilterChange, loading = false, showFilters = true }: FilterBarProps) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [minAmount, setMinAmount] = useState('')
  const [maxAmount, setMaxAmount] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleApplyFilters = () => {
    onFilterChange({
      search: search || undefined,
      status: status || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      minAmount: minAmount ? parseInt(minAmount) : undefined,
      maxAmount: maxAmount ? parseInt(maxAmount) : undefined,
    })
  }

  const handleReset = () => {
    setSearch('')
    setStatus('')
    setDateFrom('')
    setDateTo('')
    setMinAmount('')
    setMaxAmount('')
    onFilterChange({})
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      {/* Basic Search */}
      <div className="flex gap-3">
        <Input
          type="text"
          placeholder="Search by order ID, vendor, or buyer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <Button variant="primary" onClick={handleApplyFilters} loading={loading}>
          🔍 Search
        </Button>
        <Button variant="secondary" onClick={handleReset}>
          ↺ Reset
        </Button>
      </div>

      {/* Advanced Filters Toggle */}
      {showFilters && (
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
        >
          {showAdvanced ? '▼' : '▶'} Advanced Filters
        </button>
      )}

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          {/* Status Filter */}
          <Select
            label="Status"
            placeholder="All Statuses"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: 'pending', label: 'Pending' },
              { value: 'confirmed', label: 'Confirmed' },
              { value: 'shipped', label: 'Shipped' },
              { value: 'delivered', label: 'Delivered' },
              { value: 'cancelled', label: 'Cancelled' },
              { value: 'failed', label: 'Failed' },
            ]}
          />

          {/* Date Range */}
          <Input
            type="date"
            label="From Date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <Input
            type="date"
            label="To Date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />

          {/* Amount Range */}
          <Input
            type="number"
            label="Min Amount (₹)"
            placeholder="0"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
          />
          <Input
            type="number"
            label="Max Amount (₹)"
            placeholder="999999"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
          />

          {/* Apply Button */}
          <div className="flex items-end">
            <Button variant="primary" fullWidth onClick={handleApplyFilters} loading={loading}>
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
