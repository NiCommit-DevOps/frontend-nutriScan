import api from '@/core/api/api'
import type { PerfilPersonal, UpdatePerfilData, CambioPasswordData } from '@/modules/acceso/models'

/** Perfil propio del usuario autenticado (CU03) — endpoints /api/perfil. */
export const perfilService = {
  async obtener(): Promise<PerfilPersonal> {
    const { data } = await api.get<PerfilPersonal>('/perfil')
    return data
  },

  async actualizar(payload: UpdatePerfilData): Promise<PerfilPersonal> {
    const { data } = await api.put<PerfilPersonal>('/perfil', payload)
    return data
  },

  async cambiarPassword(payload: CambioPasswordData): Promise<void> {
    await api.patch('/perfil/password', payload)
  },

  /** Sube una imagen de perfil (multipart) y devuelve el perfil actualizado. */
  async subirFoto(file: File): Promise<PerfilPersonal> {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await api.post<PerfilPersonal>('/perfil/foto', formData)
    return data
  },

  /** Quita la foto de perfil y devuelve el perfil actualizado. */
  async eliminarFoto(): Promise<PerfilPersonal> {
    const { data } = await api.delete<PerfilPersonal>('/perfil/foto')
    return data
  },
}
