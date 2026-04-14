import { getStatusColor } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  status?: string
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Badge({
  children,
  status,
  variant = 'default',
  size = 'md',
  className = '',
}: BadgeProps) {
  let colorClass = ''

  if (status) {
    colorClass = getStatusColor(status)
  } else {
    const variantColorMap = {
      default: 'bg-gray-100 text-gray-800 border-gray-300',
      success: 'bg-green-100 text-green-800 border-green-300',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      danger: 'bg-red-100 text-red-800 border-red-300',
      info: 'bg-blue-100 text-blue-800 border-blue-300',
    }
    colorClass = variantColorMap[variant]
  }

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  }

  return (
    <span
      className={`inline-flex items-center border rounded-full font-medium ${sizeStyles[size]} ${colorClass} ${className}`}
    >
      {children}
    </span>
  )
}
