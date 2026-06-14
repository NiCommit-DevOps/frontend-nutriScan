import api, { tokenStore, STORAGE_KEYS } from '@/core/api/api'
import type { AuthUser, LoginRequest, LoginResponse, RegisterData } from '@/modules/acceso/models'

/**
 * Servicio de autenticación: encapsula las llamadas al módulo /auth del backend
 * y la persistencia de tokens + usuario en localStorage.
 */
export const authService = {
  /** Inicia sesión (identificador = username o correo). Devuelve el usuario normalizado. */
  async login({ identificador, password }: LoginRequest): Promise<AuthUser> {
    const { data } = await api.post<LoginResponse>('/auth/login', { identificador, password })
    tokenStore.set({ accessToken: data.accessToken, refreshToken: data.refreshToken })
    const user = mapUser(data)
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user))
    return user
  },

  /** Registro público (se crea como CLIENTE). No inicia sesión automáticamente. */
  async register(payload: RegisterData) {
    const { data } = await api.post('/auth/register', payload)
    return data
  },

  /** Cierra la sesión: revoca el refresh token en el backend y limpia el almacenamiento. */
  async logout(): Promise<void> {
    const refreshToken = tokenStore.getRefresh()
    try {
      if (refreshToken) await api.post('/auth/logout', { refreshToken })
    } catch {
      /* ignoramos errores de red al cerrar sesión */
    } finally {
      tokenStore.clear()
    }
  },

  /** Usuario actual almacenado (o null). */
  getCurrentUser(): AuthUser | null {
    const raw = localStorage.getItem(STORAGE_KEYS.user)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  },

  isAuthenticated(): boolean {
    return Boolean(tokenStore.getAccess())
  },
}

/** Normaliza la respuesta de login al modelo de usuario que usa el frontend. */
function mapUser(data: LoginResponse): AuthUser {
  return {
    idUsuario: data.idUsuario,
    username: data.username,
    nombre: data.nombre,
    apellido: data.apellido,
    correo: data.correo,
    rol: data.rol,
    fotoPerfil: data.fotoPerfil,
  }
}
