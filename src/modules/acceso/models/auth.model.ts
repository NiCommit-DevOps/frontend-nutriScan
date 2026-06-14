/** Modelos de autenticación (CU01/CU03). */

/** Roles base del sistema. */
export const ROLES = {
  ADMIN: 'ADMIN',
  CLIENTE: 'CLIENTE',
} as const

export type RolNombre = (typeof ROLES)[keyof typeof ROLES]

/** Usuario autenticado guardado en sesión. */
export interface AuthUser {
  idUsuario: number
  username: string
  nombre: string
  apellido: string
  correo: string
  rol: string
  fotoPerfil?: string | null
}

export interface LoginRequest {
  /** Correo o username. */
  identificador: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  idUsuario: number
  username: string
  nombre: string
  apellido: string
  correo: string
  rol: string
  fotoPerfil?: string | null
}

/** Datos del autoregistro público (rol CLIENTE). */
export interface RegisterData {
  nombre: string
  apellido: string
  correo: string
  username?: string
  password: string
  telefono?: string | null
  sexo: string
  peso?: number | null
  altura?: number | null
  fechaNacimiento?: string | null
}
