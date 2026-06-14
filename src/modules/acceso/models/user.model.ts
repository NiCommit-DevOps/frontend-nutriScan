/** Modelos de usuario / cliente / admin (CU01). */

export interface SelectOption {
  value: string
  label: string
}

/** Opciones de sexo (M/F/O) para los formularios. */
export const SEXO_OPTIONS: SelectOption[] = [
  { value: '', label: 'Selecciona…' },
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Femenino' },
  { value: 'O', label: 'Otro' },
]

/** Etiqueta legible para un código de sexo. */
export function etiquetaSexo(sexo?: string): string {
  const map: Record<string, string> = { M: 'Masculino', F: 'Femenino', O: 'Otro' }
  return (sexo && map[sexo]) || sexo || '—'
}

export interface User {
  idUsuario: number
  nombre: string
  apellido: string
  correo: string
  username: string
  telefono?: string
  sexo?: string
  activo: boolean
  idRol?: number
  rol?: string
}

export interface ClienteResumen {
  peso?: number
  altura?: number
}

export interface UpdateUserData {
  nombre?: string
  apellido?: string
  correo?: string
  telefono?: string | null
  sexo?: string
  idRol?: number
  activo?: boolean
}

export interface CreateUserData {
  nombre: string
  apellido: string
  correo: string
  username?: string
  password: string
  telefono?: string | null
  sexo: string
  idRol: number
}

export interface CreateAdminData {
  nombre: string
  apellido: string
  correo: string
  username?: string
  password: string
  telefono?: string | null
  sexo: string
  idRol: number
  cargo?: string | null
  fechaIngreso?: string | null
  especialidad?: string | null
}
