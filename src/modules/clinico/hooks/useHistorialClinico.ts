import { useCallback, useEffect, useState } from 'react'
import { historialClinicoService } from '@/modules/clinico/service/historialClinico.service'
import { getErrorMessage } from '@/core/utils/getErrorMessage'
import type { HistorialClinicoItem } from '@/modules/clinico/models'

/** Checklist del historial clínico del cliente (CU05). */
export function useHistorialClinico() {
  const [items, setItems] = useState<HistorialClinicoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const recargar = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setItems(await historialClinicoService.obtener())
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo cargar tu historial clínico'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    recargar()
  }, [recargar])

  /** Sincroniza con la lista de IDs marcados y refresca el estado local. */
  const actualizar = useCallback(async (idsEnfermedades: number[]) => {
    const data = await historialClinicoService.actualizar(idsEnfermedades)
    setItems(data)
    return data
  }, [])

  return { items, loading, error, setError, recargar, actualizar }
}
