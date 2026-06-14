import type { ReactNode } from 'react'

interface SelectOption {
  value: string
  label: ReactNode
}

interface SelectProps {
  label?: ReactNode
  id?: string
  error?: string
  options?: SelectOption[]
  className?: string
  [key: string]: any
}

/** Selector con etiqueta. `options` = [{ value, label }]. */
export default function Select({ label, id, error, options = [], className = '', ...props }: SelectProps) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-content">
          {label}
        </label>
      )}
      <select
        id={id}
        className={[
          'w-full rounded-xl border bg-surface2/70 px-4 py-2.5 text-sm text-strong',
          'transition-colors focus:outline-none focus:ring-2',
          error
            ? 'border-red-500/60 focus:ring-red-500/40'
            : 'border-line focus:border-brand-400/60 focus:ring-brand-400/30',
        ].join(' ')}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-surface2">
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
}
