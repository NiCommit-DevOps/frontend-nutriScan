import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import ThemeToggle from '@/core/theme/ThemeToggle'
import { useAuth } from '@/modules/acceso/context/AuthContext'

export default function MainLayout() {
  const { user, role, logout } = useAuth()
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  const iniciales = `${user?.nombre?.[0] ?? ''}${user?.apellido?.[0] ?? ''}`.toUpperCase()

  return (
    <div className="min-h-screen bg-app text-content">
      {/* Sidebar fijo en escritorio */}
      <div className="hidden md:fixed md:inset-y-0 md:left-0 md:block">
        <Sidebar />
      </div>

      {/* Drawer móvil */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawerOpen(false)} />
          <div className="absolute inset-y-0 left-0">
            <Sidebar onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      <div className="md:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-app/80 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-lg text-content hover:bg-surface2 md:hidden"
            aria-label="Abrir menú"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </button>

          <div className="ml-auto flex items-center gap-4">
            <ThemeToggle />
            <div className="text-right">
              <p className="text-sm font-semibold text-strong">
                {user?.nombre} {user?.apellido}
              </p>
              <p className="text-xs text-brand-400">{role}</p>
            </div>
            {user?.fotoPerfil ? (
              <img src={user.fotoPerfil} alt="Foto de perfil" className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-400 text-sm font-bold text-ink-900">
                {iniciales || '?'}
              </span>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-line px-3 py-2 text-sm font-medium text-content transition-colors hover:border-red-500/40 hover:text-red-300"
            >
              Salir
            </button>
          </div>
        </header>

        {/* Contenido */}
        <main className="p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
