import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import Logo from '@/core/components/ui/Logo'
import ThemeToggle from '@/core/theme/ThemeToggle'

interface AuthShellProps {
  title: string
  subtitle?: string
  children?: ReactNode
  wide?: boolean
}

/** Contenedor visual compartido por las pantallas de autenticación (Login y Registro). */
export default function AuthShell({ title, subtitle, children, wide = false }: AuthShellProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-app px-4 py-12">
      <div className="fixed right-4 top-4">
        <ThemeToggle />
      </div>
      <div className={`w-full ${wide ? 'max-w-2xl' : 'max-w-md'}`}>
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo />
          <h1 className="mt-6 text-2xl font-bold text-strong">{title}</h1>
          <p className="mt-2 text-sm text-muted">{subtitle}</p>
        </div>

        <div className="rounded-3xl border border-line bg-surface/80 p-8 shadow-sm">
          {children}
        </div>

        <p className="mt-6 text-center text-xs text-faint">
          <Link to="/" className="hover:text-brand-300">← Volver al inicio</Link>
        </p>
      </div>
    </div>
  )
}
