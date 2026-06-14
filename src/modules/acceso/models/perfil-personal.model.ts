/** Modelos del perfil personal propio (CU03). */
import type { SelectOption } from './user.model'

/** Tipos de sangre disponibles para el perfil del cliente. */
export const TIPO_SANGRE_OPTIONS: SelectOption[] = ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(
  (v) => ({ value: v, label: v || 'Selecciona…' }),
)

export interface PerfilPersonal {
  idUsuario: number
  nombre: string
  apellido: string
  correo: string
  username: string
  telefono?: string
  sexo?: string
  activo: boolean
  rol: string
  peso?: number
  altura?: number
  fechaNacimiento?: string
  tipoSangre?: string
  fotoPerfil?: string
}

export interface UpdatePerfilData {
  nombre?: string
  apellido?: string
  telefono?: string | null
  sexo?: string | null
  peso?: number | null
  altura?: number | null
  tipoSangre?: string | null
  fechaNacimiento?: string | null
  fotoPerfil?: string | null
}

export interface CambioPasswordData {
  passwordActual: string
  passwordNueva: string
  confirmarPassword: string
}
