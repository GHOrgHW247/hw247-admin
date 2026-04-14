// Utility Functions

/**
 * Format currency in INR
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format date and time
 */
export const formatDateTime = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

/**
 * Format date only
 */
export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

/**
 * Get status badge color
 */
export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    // Order statuses
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
    shipped: 'bg-purple-100 text-purple-800 border-purple-300',
    delivered: 'bg-green-100 text-green-800 border-green-300',
    cancelled: 'bg-red-100 text-red-800 border-red-300',
    failed: 'bg-red-100 text-red-800 border-red-300',

    // Vendor statuses
    active: 'bg-green-100 text-green-800 border-green-300',
    suspended: 'bg-orange-100 text-orange-800 border-orange-300',
    rejected: 'bg-red-100 text-red-800 border-red-300',

    // Settlement statuses
    approved: 'bg-green-100 text-green-800 border-green-300',
    paid: 'bg-green-100 text-green-800 border-green-300',

    // Return statuses
    'in_transit': 'bg-blue-100 text-blue-800 border-blue-300',
    received: 'bg-purple-100 text-purple-800 border-purple-300',
    closed: 'bg-gray-100 text-gray-800 border-gray-300',

    // Default
    default: 'bg-gray-100 text-gray-800 border-gray-300',
  }

  return colorMap[status.toLowerCase()] || colorMap.default
}

/**
 * Truncate text
 */
export const truncateText = (text: string, length: number): string => {
  return text.length > length ? `${text.substring(0, length)}...` : text
}

/**
 * Calculate percentage
 */
export const calculatePercentage = (value: number, total: number): number => {
  return total === 0 ? 0 : Math.round((value / total) * 100)
}

/**
 * Sleep function for async operations
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Validate email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone number (Indian format)
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/
  return phoneRegex.test(phone.replace(/\D/g, ''))
}

/**
 * Format time remaining
 */
export const formatTimeRemaining = (deadlineStr: string): string => {
  const deadline = new Date(deadlineStr)
  const now = new Date()
  const diffMs = deadline.getTime() - now.getTime()

  if (diffMs < 0) {
    return 'Overdue'
  }

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`
  }

  if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''}`
  }

  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`
}
