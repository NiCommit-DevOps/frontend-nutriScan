import api from '@/core/api/api'
import type { User, ClienteResumen, UpdateUserData, CreateUserData, CreateAdminData } from '@/modules/acceso/models'

interface ClienteResponse {
  idUsuario: number
  peso?: number
  altura?: number
}

/** Gestión de usuarios (CU01) — endpoints /api/usuarios, /api/admins, /api/clientes. */
export const usuariosService = {
  /** Padrón global de usuarios. */
  async listar(): Promise<User[]> {
    const { data } = await api.get<User[]>('/usuarios')
    return data
  },

  async obtener(id: number): Promise<User> {
    const { data } = await api.get<User>(`/usuarios/${id}`)
    return data
  },

  /** Actualiza datos base del usuario. */
  async actualizar(id: number, payload: UpdateUserData): Promise<User> {
    const { data } = await api.put<User>(`/usuarios/${id}`, payload)
    return data
  },

  /** Activa o desactiva (desactivación lógica) un usuario. */
  async cambiarEstado(id: number, activo: boolean): Promise<void> {
    await api.patch(`/usuarios/${id}/estado`, null, { params: { activo } })
  },

  async eliminar(id: number): Promise<void> {
    await api.delete(`/usuarios/${id}`)
  },

  /** Crea un usuario genérico con el rol indicado (USUARIO + idRol). */
  async crear(payload: CreateUserData) {
    const { data } = await api.post('/usuarios', payload)
    return data
  },

  /** Crea un Administrador (USUARIO + ADMIN). */
  async crearAdmin(payload: CreateAdminData) {
    const { data } = await api.post('/admins', payload)
    return data
  },

  /** Resumen físico (peso/altura) por usuario, desde el padrón de clientes. */
  async listarClientes(): Promise<Record<number, ClienteResumen>> {
    const { data } = await api.get<ClienteResponse[]>('/clientes')
    const map: Record<number, ClienteResumen> = {}
    data.forEach((c) => {
      map[c.idUsuario] = { peso: c.peso, altura: c.altura }
    })
    return map
  },
}
