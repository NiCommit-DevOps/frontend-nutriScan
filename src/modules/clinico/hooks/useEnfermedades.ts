import { useCallback, useEffect, useState } from 'react'
import { enfermedadesService } from '@/modules/clinico/service/enfermedades.service'
import { getErrorMessage } from '@/core/utils/getErrorMessage'
import type { Enfermedad } from '@/modules/clinico/models'

/** Catálogo de enfermedades (CU04). */
export function useEnfermedades() {
  const [enfermedades, setEnfermedades] = useState<Enfermedad[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const recargar = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setEnfermedades(await enfermedadesService.listar())
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo cargar el catálogo de enfermedades'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    recargar()
  }, [recargar])

  const eliminar = useCallback((id: number) => enfermedadesService.eliminar(id), [])

  return { enfermedades, loading, error, setError, recargar, eliminar }
}
