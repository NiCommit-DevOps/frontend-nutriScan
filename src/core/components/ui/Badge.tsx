import type { ReactNode } from 'react'

const TONES = {
  brand: 'bg-brand-400/15 text-brand-300',
  gray: 'bg-surface2 text-content',
  green: 'bg-emerald-400/15 text-emerald-300',
  red: 'bg-red-400/15 text-red-300',
  amber: 'bg-amber-400/15 text-amber-300',
  sky: 'bg-sky-400/15 text-sky-300',
}

interface BadgeProps {
  tone?: string
  children?: ReactNode
  className?: string
}

/** Etiqueta de estado/categoría. */
export default function Badge({ tone = 'gray', children, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${TONES[tone]} ${className}`}>
      {children}
    </span>
  )
}
