interface ModulePlaceholderProps {
  title: string
  description?: string
}

/** Pantalla genérica "en construcción" para módulos cuyo backend aún no existe. */
export default function ModulePlaceholder({ title, description }: ModulePlaceholderProps) {
  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-strong">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </header>

      <div className="grid place-items-center rounded-3xl border border-dashed border-line bg-surface/40 py-20 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-400/10 text-brand-300">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 8v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </span>
        <h2 className="mt-5 text-lg font-semibold text-strong">Módulo en construcción</h2>
        <p className="mt-2 max-w-sm text-sm text-faint">
          Esta sección estará disponible cuando se implemente su backend. La navegación y los
          permisos por rol ya están listos.
        </p>
      </div>
    </div>
  )
}
