interface Option {
  value: string | number
  label: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: Option[]
  error?: string
  hint?: string
  placeholder?: string
}

export function Select({
  label,
  options,
  error,
  hint,
  placeholder,
  className = '',
  ...props
}: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {props.required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      <select
        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
        } ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {hint && !error && <p className="mt-1 text-sm text-gray-500">{hint}</p>}
    </div>
  )
}
