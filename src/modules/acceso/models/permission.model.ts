/** Modelos de permiso (CU02). */

export interface Permission {
  idPermiso: number
  nombre: string
  descripcion?: string
}

export interface AssignPermissionData {
  idPermiso: number
}
