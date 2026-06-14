import api from '@/core/api/api'
import type { Role, CreateRoleData, UpdateRoleData } from '@/modules/acceso/models'
import type { Permission } from '@/modules/acceso/models'

/** Gestión de roles y sus permisos (CU02) — endpoints /api/roles. */
export const rolesService = {
  async listar(): Promise<Role[]> {
    const { data } = await api.get<Role[]>('/roles')
    return data
  },

  async obtener(id: number): Promise<Role> {
    const { data } = await api.get<Role>(`/roles/${id}`)
    return data
  },

  async crear(payload: CreateRoleData): Promise<Role> {
    const { data } = await api.post<Role>('/roles', payload)
    return data
  },

  async actualizar(id: number, payload: UpdateRoleData): Promise<Role> {
    const { data } = await api.put<Role>(`/roles/${id}`, payload)
    return data
  },

  async eliminar(id: number): Promise<void> {
    await api.delete(`/roles/${id}`)
  },

  /** Permisos asignados a un rol. */
  async listarPermisos(id: number): Promise<Permission[]> {
    const { data } = await api.get<Permission[]>(`/roles/${id}/permisos`)
    return data
  },

  async asignarPermiso(id: number, idPermiso: number): Promise<void> {
    await api.post(`/roles/${id}/permisos`, { idPermiso })
  },

  async quitarPermiso(id: number, idPermiso: number): Promise<void> {
    await api.delete(`/roles/${id}/permisos/${idPermiso}`)
  },
}
