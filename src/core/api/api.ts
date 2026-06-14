import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

/** Claves de almacenamiento en localStorage. */
export const STORAGE_KEYS = {
  access: 'nutriscan_access',
  refresh: 'nutriscan_refresh',
  user: 'nutriscan_user',
} as const

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api'

const api: AxiosInstance = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

/* ----- Helpers de token ----- */
export const tokenStore = {
  getAccess: () => localStorage.getItem(STORAGE_KEYS.access),
  getRefresh: () => localStorage.getItem(STORAGE_KEYS.refresh),
  set: ({ accessToken, refreshToken }: { accessToken?: string; refreshToken?: string }) => {
    if (accessToken) localStorage.setItem(STORAGE_KEYS.access, accessToken)
    if (refreshToken) localStorage.setItem(STORAGE_KEYS.refresh, refreshToken)
  },
  clear: () => {
    localStorage.removeItem(STORAGE_KEYS.access)
    localStorage.removeItem(STORAGE_KEYS.refresh)
    localStorage.removeItem(STORAGE_KEYS.user)
  },
}

/* ----- Interceptor de petición: agrega el Bearer token ----- */
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStore.getAccess()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  // Para subir archivos dejamos que el navegador fije el Content-Type con su boundary.
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }
  return config
})

/* ----- Interceptor de respuesta: intenta refrescar el token una vez ante un 401 ----- */
let refreshing: Promise<{ data: { accessToken: string; refreshToken: string } }> | null = null

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined
    const status = error.response?.status

    const isAuthCall =
      original?.url?.includes('/auth/refresh') || original?.url?.includes('/auth/login')

    if (status === 401 && original && !original._retry && !isAuthCall && tokenStore.getRefresh()) {
      original._retry = true
      try {
        refreshing =
          refreshing ?? api.post('/auth/refresh', { refreshToken: tokenStore.getRefresh() })
        const { data } = await refreshing
        refreshing = null
        tokenStore.set({ accessToken: data.accessToken, refreshToken: data.refreshToken })
        original.headers.Authorization = `Bearer ${data.accessToken}`
        return api(original)
      } catch (e) {
        refreshing = null
        tokenStore.clear()
        if (typeof window !== 'undefined') window.location.href = '/login'
        return Promise.reject(e)
      }
    }

    return Promise.reject(error)
  },
)

export default api
