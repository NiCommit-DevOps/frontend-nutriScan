import type { ReactNode } from 'react'

/**
 * Botón reutilizable. Renderiza un <a> si recibe `href`, o un <button> en caso contrario.
 * Variantes: primary (verde lechuga), outline, ghost. Tamaños: sm, md, lg.
 */
interface ButtonProps {
  children?: ReactNode
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  className?: string
  [key: string]: any
}

const VARIANTS = {
  primary:
    'bg-brand-400 text-ink-900 hover:bg-brand-300 shadow-sm focus-visible:ring-brand-300',
  outline:
    'border border-brand-400/60 text-brand-200 hover:bg-brand-400/10 hover:border-brand-300 focus-visible:ring-brand-400',
  ghost:
    'text-brand-100 hover:bg-surface2 focus-visible:ring-brand-400',
}

const SIZES = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  className = '',
  ...props
}: ButtonProps) {
  const classes = [
    'inline-flex items-center justify-center gap-2 rounded-full font-semibold',
    'transition-all duration-200 ease-out',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900',
    'active:scale-[0.97]',
    VARIANTS[variant],
    SIZES[size],
    className,
  ].join(' ')

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
