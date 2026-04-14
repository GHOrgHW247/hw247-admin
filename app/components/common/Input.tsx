interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  icon?: React.ReactNode
}

export function Input({
  label,
  error,
  hint,
  icon,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {props.required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">{icon}</span>}
        <input
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
            icon ? 'pl-10' : ''
          } ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {hint && !error && <p className="mt-1 text-sm text-gray-500">{hint}</p>}
    </div>
  )
}
