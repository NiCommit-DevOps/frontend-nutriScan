/** Modelos de rol (CU02). */

export interface Role {
  idRol: number
  nombre: string
  descripcion?: string
  activo: boolean
}

export interface CreateRoleData {
  nombre: string
  descripcion?: string | null
}

export interface UpdateRoleData {
  nombre?: string
  descripcion?: string | null
  activo?: boolean
}

export interface AssignRoleData {
  idRol: number
}
