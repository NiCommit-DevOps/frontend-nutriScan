import api from '@/core/api/api'
import type { Permission } from '@/modules/acceso/models'

/** Catálogo de permisos (CU02) — endpoints /api/permisos. */
export const permisosService = {
  async listar(): Promise<Permission[]> {
    const { data } = await api.get<Permission[]>('/permisos')
    return data
  },
}
