/** Modelos del catálogo de enfermedades (CU04). */

/** Niveles de riesgo permitidos. */
export const NIVELES_RIESGO = ['Bajo', 'Medio', 'Alto'] as const
export type NivelRiesgo = (typeof NIVELES_RIESGO)[number]

export interface SelectOption {
  value: string
  label: string
}

export const NIVEL_RIESGO_OPTIONS: SelectOption[] = NIVELES_RIESGO.map((v) => ({ value: v, label: v }))

/** Tono de Badge según el nivel de riesgo. */
export function tonoNivelRiesgo(nivel?: string): string {
  const map: Record<string, string> = { Bajo: 'green', Medio: 'amber', Alto: 'red' }
  return (nivel && map[nivel]) || 'gray'
}

export interface Enfermedad {
  idEnfermedad: number
  nombre: string
  descripcion?: string
  nivelRiesgo: NivelRiesgo
}

export interface EnfermedadData {
  nombre: string
  descripcion?: string | null
  nivelRiesgo: string
}
