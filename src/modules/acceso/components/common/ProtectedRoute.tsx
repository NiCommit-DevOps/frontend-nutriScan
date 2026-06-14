import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/modules/acceso/context/AuthContext'

/**
 * Protege rutas. Si no hay sesión, redirige a /login.
 * Si se pasan `roles`, exige que el usuario tenga uno de ellos.
 */
export default function ProtectedRoute({ roles }: { roles?: string[] }) {
  const { isAuthenticated, role } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (roles && roles.length > 0 && !roles.includes(role)) {
    return <Navigate to="/app" replace />
  }

  return <Outlet />
}
