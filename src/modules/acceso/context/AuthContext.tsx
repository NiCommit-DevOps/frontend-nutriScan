import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { authService } from '@/modules/acceso/service/auth.service'
import { STORAGE_KEYS } from '@/core/api/api'
import type { AuthUser, LoginRequest, RegisterData } from '@/modules/acceso/models'

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  role: string | null
  isAdmin: boolean
  isCliente: boolean
  login: (credentials: LoginRequest) => Promise<AuthUser>
  register: (payload: RegisterData) => Promise<unknown>
  logout: () => Promise<void>
  updateUser: (partial: Partial<AuthUser>) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => authService.getCurrentUser())

  const login = useCallback(async (credentials: LoginRequest) => {
    const loggedUser = await authService.login(credentials)
    setUser(loggedUser)
    return loggedUser
  }, [])

  const register = useCallback((payload: RegisterData) => authService.register(payload), [])

  const logout = useCallback(async () => {
    await authService.logout()
    setUser(null)
  }, [])

  /** Actualiza datos del usuario en memoria y en localStorage (p. ej. tras editar el perfil). */
  const updateUser = useCallback((partial: Partial<AuthUser>) => {
    setUser((prev) => {
      const next = { ...(prev as AuthUser), ...partial }
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(next))
      return next
    })
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      role: user?.rol ?? null,
      isAdmin: user?.rol === 'ADMIN',
      isCliente: user?.rol === 'CLIENTE',
      login,
      register,
      logout,
      updateUser,
    }),
    [user, login, register, logout, updateUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
