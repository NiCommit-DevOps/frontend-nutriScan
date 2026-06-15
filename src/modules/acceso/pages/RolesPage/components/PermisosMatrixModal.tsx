import { useEffect, useMemo, useState } from 'react'
import Modal from '@/core/components/ui/Modal'
import Alert from '@/core/components/ui/Alert'
import Button from '@/core/components/ui/Button'
import { rolesService } from '@/modules/acceso/service/roles.service'
import { usePermissions } from '@/modules/acceso/hooks/usePermissions'
import { getErrorMessage } from '@/core/utils/getErrorMessage'
import type { Permission, Role } from '@/modules/acceso/models'

interface Props {
  open: boolean
  rol: Role | null
  onClose: () => void
  onSaved: () => void
}

interface Grupo {
  nombre: string
  permisos: Permission[]
}

/** Capitaliza el nombre del grupo (prefijo antes del punto). */
const tituloGrupo = (g: string) => g.charAt(0).toUpperCase() + g.slice(1)

/**
 * Matriz de permisos agrupada por módulo (recurso.accion), con "Marcar todos" por grupo.
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

  // Agrupa los permisos por el prefijo antes del punto (ej. "usuarios").
  const grupos = useMemo<Grupo[]>(() => {
    const map = new Map<string, Permission[]>()
    for (const p of permisos) {
      const grupo = p.nombre.includes('.') ? p.nombre.split('.')[0] : 'General'
      if (!map.has(grupo)) map.set(grupo, [])
      map.get(grupo)!.push(p)
    }
    return [...map.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([nombre, permisos]) => ({ nombre, permisos }))
  }, [permisos])

  const toggle = (idPermiso: number) => {
    setSeleccion((prev) => {
      const next = new Set(prev)
      if (next.has(idPermiso)) next.delete(idPermiso)
      else next.add(idPermiso)
      return next
    })
  }

  const todosDelGrupo = (grupo: Grupo) => grupo.permisos.every((p) => seleccion.has(p.idPermiso))

  const toggleGrupo = (grupo: Grupo) => {
    const marcarTodos = !todosDelGrupo(grupo)
    setSeleccion((prev) => {
      const next = new Set(prev)
      grupo.permisos.forEach((p) => (marcarTodos ? next.add(p.idPermiso) : next.delete(p.idPermiso)))
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
    <Modal open={open} onClose={onClose} title={`Permisos · ${rol?.nombre ?? ''}`} maxWidth="max-w-3xl">
      <Alert type="error" className="mb-4">{error || errorCatalogo}</Alert>

      {loading ? (
        <p className="py-10 text-center text-faint">Cargando permisos…</p>
      ) : permisos.length === 0 ? (
        <p className="py-10 text-center text-faint">
          No hay permisos en el catálogo.
        </p>
      ) : (
        <div className="max-h-[60vh] space-y-6 overflow-y-auto pr-1">
          {grupos.map((grupo) => (
            <section key={grupo.nombre}>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-bold text-strong">{tituloGrupo(grupo.nombre)}</h3>
                <button
                  type="button"
                  onClick={() => toggleGrupo(grupo)}
                  className="text-xs font-semibold text-brand-300 hover:underline"
                >
                  {todosDelGrupo(grupo) ? 'Quitar todos' : 'Marcar todos'}
                </button>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {grupo.permisos.map((p) => {
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
                        <span className="block text-sm font-medium text-strong">
                          {p.descripcion || p.nombre}
                        </span>
                        <span className="block text-xs text-faint">{p.nombre}</span>
                      </span>
                    </label>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
        <span className="text-xs text-faint">{seleccion.size} permiso(s) seleccionado(s)</span>
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
