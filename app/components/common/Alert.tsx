interface AlertProps {
  children: React.ReactNode
  type?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
}

export function Alert({
  children,
  type = 'info',
  title,
  dismissible = false,
  onDismiss,
  className = '',
}: AlertProps) {
  const typeStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  }

  const iconStyles = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ⓘ',
  }

  return (
    <div className={`border rounded-md p-4 ${typeStyles[type]} ${className}`}>
      <div className="flex gap-3">
        <span className="text-lg font-semibold">{iconStyles[type]}</span>
        <div className="flex-1">
          {title && <h3 className="font-semibold mb-1">{title}</h3>}
          <p className="text-sm">{children}</p>
        </div>
        {dismissible && (
          <button
            onClick={onDismiss}
            className="text-lg hover:opacity-70 transition-opacity"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
