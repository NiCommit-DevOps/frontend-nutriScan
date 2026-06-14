import type { ReactNode } from 'react'

interface InputProps {
  label?: ReactNode
  id?: string
  error?: string
  className?: string
  [key: string]: any
}

/** Campo de texto con etiqueta y mensaje de error opcional. */
export default function Input({ label, id, error, className = '', ...props }: InputProps) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-content">
          {label}
        </label>
      )}
      <input
        id={id}
        className={[
          'w-full rounded-xl border bg-surface2/70 px-4 py-2.5 text-sm text-strong placeholder-faint',
          'transition-colors focus:outline-none focus:ring-2',
          error
            ? 'border-red-500/60 focus:ring-red-500/40'
            : 'border-line focus:border-brand-400/60 focus:ring-brand-400/30',
        ].join(' ')}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
}
