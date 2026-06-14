import { useCallback, useEffect, useState } from 'react'
import { perfilService } from '@/modules/acceso/service/perfil.service'
import { getErrorMessage } from '@/core/utils/getErrorMessage'
import type { PerfilPersonal } from '@/modules/acceso/models'

/** Perfil propio del usuario autenticado (CU03). */
export function usePerfilPersonal() {
  const [perfil, setPerfil] = useState<PerfilPersonal | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const recargar = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setPerfil(await perfilService.obtener())
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo cargar tu perfil'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    recargar()
  }, [recargar])

  return { perfil, setPerfil, loading, error, recargar }
}
