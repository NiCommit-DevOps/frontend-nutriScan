import api from '@/core/api/api'
import type { HistorialClinicoItem, DetalleDiagnosticoData } from '@/modules/clinico/models'

/** Historial clínico del cliente (CU05) — endpoints /api/historial-clinico. */
export const historialClinicoService = {
  /** Checklist completo (todas las enfermedades + cuáles padece el cliente). */
  async obtener(): Promise<HistorialClinicoItem[]> {
    const { data } = await api.get<HistorialClinicoItem[]>('/historial-clinico')
    return data
  },

  /** Sincroniza el historial con la lista de IDs marcados (ej. [1, 3, 5]). */
  async actualizar(idsEnfermedades: number[]): Promise<HistorialClinicoItem[]> {
    const { data } = await api.put<HistorialClinicoItem[]>('/historial-clinico', idsEnfermedades)
    return data
  },

  /** Edita fecha de diagnóstico / observaciones de una enfermedad vinculada. */
  async actualizarDetalle(idEnfermedad: number, payload: DetalleDiagnosticoData): Promise<HistorialClinicoItem> {
    const { data } = await api.put<HistorialClinicoItem>(`/historial-clinico/${idEnfermedad}/detalle`, payload)
    return data
  },
}
