/** Modelos del historial clínico personal (CU05). */

export interface HistorialClinicoItem {
  idEnfermedad: number
  nombre: string
  descripcion?: string
  nivelRiesgo: string
  padece: boolean
  idClienteEnfermedad?: number
  fechaDiagnostico?: string
  observaciones?: string
}

export interface DetalleDiagnosticoData {
  fechaDiagnostico?: string | null
  observaciones?: string | null
}
