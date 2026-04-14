interface Column<T> {
  key: keyof T
  label: string
  render?: (value: any, row: T) => React.ReactNode
  className?: string
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  error?: string
  emptyMessage?: string
  onRowClick?: (row: T) => void
  striped?: boolean
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  error,
  emptyMessage = 'No data available',
  onRowClick,
  striped = true,
}: TableProps<T>) {
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">
        {error}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-gray-600">{emptyMessage}</div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`border-b border-gray-200 transition-colors ${
                striped && rowIndex % 2 === 1 ? 'bg-gray-50' : 'bg-white'
              } ${onRowClick ? 'hover:bg-blue-50 cursor-pointer' : ''}`}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className={`px-6 py-4 text-sm text-gray-900 ${column.className || ''}`}
                >
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
