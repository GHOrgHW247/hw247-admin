interface CardProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  shadow?: 'none' | 'sm' | 'md' | 'lg'
  border?: boolean
  onClick?: () => void
  className?: string
}

export function Card({
  children,
  title,
  subtitle,
  padding = 'md',
  shadow = 'md',
  border = true,
  onClick,
  className = '',
}: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  }

  const shadowStyles = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  }

  const borderStyle = border ? 'border border-gray-200' : ''
  const hoverStyle = onClick ? 'cursor-pointer hover:shadow-lg hover:border-gray-300 transition-all' : ''

  return (
    <div
      className={`bg-white rounded-lg ${borderStyle} ${shadowStyles[shadow]} ${paddingStyles[padding]} ${hoverStyle} ${className}`}
      onClick={onClick}
    >
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  )
}
