'use client'

import { useState } from 'react'
import { Button } from '@/app/components/common/Button'
import { Input } from '@/app/components/common/Input'
import { Select } from '@/app/components/common/Select'

interface DateRangePickerProps {
  onDateRangeChange?: (startDate: string, endDate: string) => void
  onGroupByChange?: (groupBy: 'day' | 'week' | 'month') => void
  onPeriodChange?: (days: number) => void
  defaultPeriodDays?: number
}

export function DateRangePicker({
  onDateRangeChange,
  onGroupByChange,
  onPeriodChange,
  defaultPeriodDays = 30,
}: DateRangePickerProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(defaultPeriodDays)
  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month'>('day')
  const [showCustom, setShowCustom] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const handlePeriodSelect = (days: number) => {
    setSelectedPeriod(days)
    setShowCustom(false)
    onPeriodChange?.(days)
  }

  const handleGroupByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newGroupBy = e.target.value as 'day' | 'week' | 'month'
    setGroupBy(newGroupBy)
    onGroupByChange?.(newGroupBy)
  }

  const handleApplyCustomDateRange = () => {
    if (startDate && endDate) {
      onDateRangeChange?.(startDate, endDate)
    }
  }

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
      <div className="space-y-3">
        <p className="font-medium text-gray-900">Period</p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedPeriod === 7 ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => handlePeriodSelect(7)}
          >
            7 Days
          </Button>
          <Button
            variant={selectedPeriod === 30 ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => handlePeriodSelect(30)}
          >
            30 Days
          </Button>
          <Button
            variant={selectedPeriod === 60 ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => handlePeriodSelect(60)}
          >
            60 Days
          </Button>
          <Button
            variant={selectedPeriod === 90 ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => handlePeriodSelect(90)}
          >
            90 Days
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setShowCustom(!showCustom)}>
            {showCustom ? 'Hide Custom' : 'Custom'}
          </Button>
        </div>
      </div>

      {showCustom && (
        <div className="space-y-3 border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
          <Button
            variant="primary"
            fullWidth
            onClick={handleApplyCustomDateRange}
            disabled={!startDate || !endDate}
          >
            Apply Custom Range
          </Button>
        </div>
      )}

      <div className="space-y-3 border-t border-gray-200 pt-4">
        <p className="font-medium text-gray-900">Group By</p>
        <Select
          value={groupBy}
          onChange={handleGroupByChange}
          options={[
            { value: 'day', label: 'Daily' },
            { value: 'week', label: 'Weekly' },
            { value: 'month', label: 'Monthly' },
          ]}
        />
      </div>
    </div>
  )
}
