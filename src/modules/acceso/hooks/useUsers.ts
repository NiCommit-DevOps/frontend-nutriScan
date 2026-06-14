import { useCallback, useEffect, useState } from 'react'
import { usuariosService } from '@/modules/acceso/service/usuarios.service'
import { getErrorMessage } from '@/core/utils/getErrorMessage'
import type { User, ClienteResumen } from '@/modules/acceso/models'

/**
 * Padrón de usuarios (CU01) + datos físicos de clientes.
 * Expone el estado de la lista y las acciones a nivel de página.
 */
export function useUsers() {
  const [usuarios, setUsuarios] = useState<User[]>([])
  const [fisicoPorUsuario, setFisicoPorUsuario] = useState<Record<number, ClienteResumen>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const recargar = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const lista = await usuariosService.listar()
      setUsuarios(lista)
      try {
        setFisicoPorUsuario(await usuariosService.listarClientes())
      } catch {
        setFisicoPorUsuario({})
      }
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron cargar los usuarios'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    recargar()
  }, [recargar])

  const cambiarEstado = useCallback(
    (id: number, activo: boolean) => usuariosService.cambiarEstado(id, activo),
    [],
  )

  return { usuarios, fisicoPorUsuario, loading, error, setError, recargar, cambiarEstado }
}
