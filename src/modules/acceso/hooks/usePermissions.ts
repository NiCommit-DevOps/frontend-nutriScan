import { useCallback, useEffect, useState } from 'react'
import { permisosService } from '@/modules/acceso/service/permisos.service'
import { getErrorMessage } from '@/core/utils/getErrorMessage'
import type { Permission } from '@/modules/acceso/models'

/** Catálogo de permisos (CU02). `enabled=false` pospone la carga. */
export function usePermissions(enabled = true) {
  const [permisos, setPermisos] = useState<Permission[]>([])
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState('')

  const recargar = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setPermisos(await permisosService.listar())
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron cargar los permisos'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (enabled) recargar()
  }, [enabled, recargar])

  return { permisos, loading, error, setError, recargar }
}
