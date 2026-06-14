import { NavLink } from 'react-router-dom'
import Logo from '@/core/components/ui/Logo'
import { getMenuForRole } from './menuConfig'
import { useAuth } from '@/modules/acceso/context/AuthContext'

function MenuIcon({ d }: { d: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  )
}

/** Barra lateral de navegación. `onNavigate` se invoca al pulsar un enlace (cierra el drawer móvil). */
export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { role } = useAuth()
  const sections = getMenuForRole(role)

  return (
    <aside className="flex h-full w-64 flex-col border-r border-line bg-surface">
      <div className="flex h-16 items-center border-b border-line px-6">
        <Logo />
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-6">
        {sections.map((section) => (
          <div key={section.section}>
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-widest text-faint">
              {section.section}
            </p>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      [
                        'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-brand-400/15 text-brand-300'
                          : 'text-muted hover:bg-surface2 hover:text-content',
                      ].join(' ')
                    }
                  >
                    <MenuIcon d={item.icon} />
                    <span className="flex-1">{item.label}</span>
                    {item.soon && (
                      <span className="rounded-full bg-surface2 px-2 py-0.5 text-[10px] font-semibold text-faint">
                        Pronto
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}
