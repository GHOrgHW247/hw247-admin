interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  showInfo?: boolean
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  showInfo = true,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const getPaginationItems = () => {
    const items = []
    const maxVisible = 5
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages, start + maxVisible - 1)

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1)
    }

    if (start > 1) {
      items.push(1)
      if (start > 2) {
        items.push('...')
      }
    }

    for (let i = start; i <= end; i++) {
      items.push(i)
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        items.push('...')
      }
      items.push(totalPages)
    }

    return items
  }

  return (
    <div className="flex items-center justify-between mt-6 px-6 py-4 bg-white border-t border-gray-200">
      <div>
        {showInfo && (
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{startItem}</span> to{' '}
            <span className="font-semibold">{endItem}</span> of{' '}
            <span className="font-semibold">{totalItems}</span> results
          </p>
        )}
      </div>

      <div className="flex gap-1">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>

        {/* Page Numbers */}
        {getPaginationItems().map((item, index) => (
          <button
            key={index}
            onClick={() => typeof item === 'number' && onPageChange(item)}
            disabled={item === '...'}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              item === currentPage
                ? 'bg-blue-600 text-white'
                : item === '...'
                  ? 'cursor-default'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {item}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>
    </div>
  )
}
