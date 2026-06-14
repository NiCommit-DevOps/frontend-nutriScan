import { useCallback, useEffect, useState } from 'react'
import { rolesService } from '@/modules/acceso/service/roles.service'
import { getErrorMessage } from '@/core/utils/getErrorMessage'
import type { Role, UpdateRoleData } from '@/modules/acceso/models'

/**
 * Roles del sistema (CU02). `autoCargar=false` evita la carga inicial
 * (útil cuando solo se necesita la lista para un selector).
 */
export function useRoles(autoCargar = true) {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(autoCargar)
  const [error, setError] = useState('')

  const recargar = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setRoles(await rolesService.listar())
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron cargar los roles'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (autoCargar) recargar()
  }, [autoCargar, recargar])

  const actualizar = useCallback(
    (id: number, payload: UpdateRoleData) => rolesService.actualizar(id, payload),
    [],
  )

  return { roles, loading, error, setError, recargar, actualizar }
}
