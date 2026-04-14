interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'blue' | 'gray' | 'green' | 'red'
  fullScreen?: boolean
  label?: string
  className?: string
}

export function Spinner({
  size = 'md',
  color = 'blue',
  fullScreen = false,
  label,
  className = '',
}: SpinnerProps) {
  const sizeStyles = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-4',
    lg: 'w-16 h-16 border-4',
  }

  const colorMap = {
    blue: 'border-blue-200 border-t-blue-600',
    gray: 'border-gray-200 border-t-gray-600',
    green: 'border-green-200 border-t-green-600',
    red: 'border-red-200 border-t-red-600',
  }

  const spinner = (
    <div className="text-center">
      <div
        className={`${sizeStyles[size]} border-current rounded-full animate-spin mx-auto ${colorMap[color]} ${className}`}
      ></div>
      {label && <p className="mt-3 text-gray-600 text-sm">{label}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        {spinner}
      </div>
    )
  }

  return spinner
}
