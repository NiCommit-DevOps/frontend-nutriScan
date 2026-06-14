import api from '@/core/api/api'
import type { Enfermedad, EnfermedadData } from '@/modules/clinico/models'

/** Catálogo de enfermedades (CU04) — endpoints /api/enfermedades. */
export const enfermedadesService = {
  async listar(): Promise<Enfermedad[]> {
    const { data } = await api.get<Enfermedad[]>('/enfermedades')
    return data
  },

  async crear(payload: EnfermedadData): Promise<Enfermedad> {
    const { data } = await api.post<Enfermedad>('/enfermedades', payload)
    return data
  },

  async actualizar(id: number, payload: EnfermedadData): Promise<Enfermedad> {
    const { data } = await api.put<Enfermedad>(`/enfermedades/${id}`, payload)
    return data
  },

  async eliminar(id: number): Promise<void> {
    await api.delete(`/enfermedades/${id}`)
  },
}
