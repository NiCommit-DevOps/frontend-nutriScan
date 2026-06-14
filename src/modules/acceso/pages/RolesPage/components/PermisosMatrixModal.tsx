import { useEffect, useState } from 'react'
import Modal from '@/core/components/ui/Modal'
import Alert from '@/core/components/ui/Alert'
import Button from '@/core/components/ui/Button'
import { rolesService } from '@/modules/acceso/service/roles.service'
import { usePermissions } from '@/modules/acceso/hooks/usePermissions'
import { getErrorMessage } from '@/core/utils/getErrorMessage'
import type { Role } from '@/modules/acceso/models'

interface Props {
  open: boolean
  rol: Role | null
  onClose: () => void
  onSaved: () => void
}

/**
 * Matriz de permisos: checklist de todos los PERMISO con los del rol preseleccionados.
 * Al guardar, calcula el diff y aplica add/remove (el backend no tiene reemplazo masivo).
 */
export default function PermisosMatrixModal({ open, rol, onClose, onSaved }: Props) {
  const { permisos, loading: cargandoCatalogo, error: errorCatalogo } = usePermissions(open)

  const [seleccion, setSeleccion] = useState<Set<number>>(new Set())
  const [original, setOriginal] = useState<Set<number>>(new Set())
  const [cargandoAsignados, setCargandoAsignados] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open || !rol) return
    let activo = true
    ;(async () => {
      setCargandoAsignados(true)
      setError('')
      try {
        const asignados = await rolesService.listarPermisos(rol.idRol)
        if (!activo) return
        const ids = new Set(asignados.map((p) => p.idPermiso))
        setSeleccion(new Set(ids))
        setOriginal(new Set(ids))
      } catch (err) {
        if (activo) setError(getErrorMessage(err, 'No se pudieron cargar los permisos del rol'))
      } finally {
        if (activo) setCargandoAsignados(false)
      }
    })()
    return () => {
      activo = false
    }
  }, [open, rol])

  const toggle = (idPermiso: number) => {
    setSeleccion((prev) => {
      const next = new Set(prev)
      if (next.has(idPermiso)) next.delete(idPermiso)
      else next.add(idPermiso)
      return next
    })
  }

  const guardar = async () => {
    if (!rol) return
    setSaving(true)
    setError('')
    try {
      const aAgregar = [...seleccion].filter((id) => !original.has(id))
      const aQuitar = [...original].filter((id) => !seleccion.has(id))
      await Promise.all([
        ...aAgregar.map((id) => rolesService.asignarPermiso(rol.idRol, id)),
        ...aQuitar.map((id) => rolesService.quitarPermiso(rol.idRol, id)),
      ])
      onSaved()
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron guardar los permisos'))
    } finally {
      setSaving(false)
    }
  }

  const loading = cargandoCatalogo || cargandoAsignados

  return (
    <Modal open={open} onClose={onClose} title={`Permisos — ${rol?.nombre ?? ''}`} maxWidth="max-w-xl">
      <Alert type="error" className="mb-4">{error || errorCatalogo}</Alert>

      {loading ? (
        <p className="py-10 text-center text-faint">Cargando permisos…</p>
      ) : permisos.length === 0 ? (
        <p className="py-10 text-center text-faint">
          No hay permisos en el catálogo. Créalos en el backend (tabla PERMISO).
        </p>
      ) : (
        <div className="max-h-[55vh] space-y-2 overflow-y-auto pr-1">
          {permisos.map((p) => {
            const checked = seleccion.has(p.idPermiso)
            return (
              <label
                key={p.idPermiso}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-colors ${
                  checked ? 'border-brand-400/40 bg-brand-400/5' : 'border-line hover:bg-surface2'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(p.idPermiso)}
                  className="mt-0.5 h-4 w-4 accent-brand-400"
                />
                <span>
                  <span className="block text-sm font-medium text-strong">{p.nombre}</span>
                  {p.descripcion && <span className="block text-xs text-faint">{p.descripcion}</span>}
                </span>
              </label>
            )
          })}
        </div>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
        <span className="text-xs text-faint">{seleccion.size} seleccionado(s)</span>
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="button" onClick={guardar} disabled={saving || loading}>
            {saving ? 'Guardando…' : 'Guardar permisos'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
