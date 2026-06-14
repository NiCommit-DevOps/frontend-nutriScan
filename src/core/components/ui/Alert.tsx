import type { ReactNode } from 'react'

const STYLES = {
  error: 'border-red-500/30 bg-red-500/10 text-red-300',
  success: 'border-brand-400/30 bg-brand-400/10 text-brand-200',
  info: 'border-sky-500/30 bg-sky-500/10 text-sky-200',
}

interface AlertProps {
  type?: keyof typeof STYLES
  children?: ReactNode
  className?: string
}

/** Mensaje contextual (error/success/info). No renderiza nada si no hay children. */
export default function Alert({ type = 'info', children, className = '' }: AlertProps) {
  if (!children) return null
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${STYLES[type]} ${className}`}>
      {children}
    </div>
  )
}
