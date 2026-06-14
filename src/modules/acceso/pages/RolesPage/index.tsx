import { useState } from 'react'
import Button from '@/core/components/ui/Button'
import Badge from '@/core/components/ui/Badge'
import Alert from '@/core/components/ui/Alert'
import RolFormModal from './components/RolFormModal'
import PermisosMatrixModal from './components/PermisosMatrixModal'
import { useRoles } from '@/modules/acceso/hooks/useRoles'
import { getErrorMessage } from '@/core/utils/getErrorMessage'
import type { Role } from '@/modules/acceso/models'

type FormState = { open: boolean; rol: Role | null }
type MatrizState = { open: boolean; rol: Role | null }

export default function RolesPage() {
  const { roles, loading, error, setError, recargar, actualizar } = useRoles()

  const [formModal, setFormModal] = useState<FormState>({ open: false, rol: null })
  const [matrizModal, setMatrizModal] = useState<MatrizState>({ open: false, rol: null })

  const onGuardado = () => {
    setFormModal({ open: false, rol: null })
    recargar()
  }

  const toggleActivo = async (rol: Role) => {
    const accion = rol.activo ? 'desactivar' : 'activar'
    if (!window.confirm(`¿Seguro que deseas ${accion} el rol "${rol.nombre}"?`)) return
    try {
      await actualizar(rol.idRol, { nombre: rol.nombre, descripcion: rol.descripcion, activo: !rol.activo })
      recargar()
    } catch (err) {
      setError(getErrorMessage(err, `No se pudo ${accion} el rol`))
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-strong">Roles y Permisos</h1>
          <p className="mt-1 text-sm text-muted">Define los roles del sistema y los permisos que los componen.</p>
        </div>
        <Button onClick={() => setFormModal({ open: true, rol: null })}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>
          Nuevo rol
        </Button>
      </header>

      <Alert type="error" className="mb-4">{error}</Alert>

      <div className="overflow-hidden rounded-2xl border border-line bg-surface/60">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-faint">
              <tr>
                <th className="px-5 py-3 font-medium">Rol</th>
                <th className="px-5 py-3 font-medium">Descripción</th>
                <th className="px-5 py-3 font-medium">Estado</th>
                <th className="px-5 py-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading ? (
                <tr><td colSpan={4} className="px-5 py-10 text-center text-faint">Cargando…</td></tr>
              ) : roles.length === 0 ? (
                <tr><td colSpan={4} className="px-5 py-10 text-center text-faint">No hay roles registrados.</td></tr>
              ) : (
                roles.map((r) => (
                  <tr key={r.idRol} className="hover:bg-surface2">
                    <td className="px-5 py-3 font-medium text-strong">{r.nombre}</td>
                    <td className="px-5 py-3 text-muted">{r.descripcion || '—'}</td>
                    <td className="px-5 py-3">
                      <Badge tone={r.activo ? 'green' : 'red'}>{r.activo ? 'Activo' : 'Inactivo'}</Badge>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setMatrizModal({ open: true, rol: r })}
                          className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-content hover:border-brand-400/40 hover:text-brand-300"
                        >
                          Permisos
                        </button>
                        <button
                          onClick={() => setFormModal({ open: true, rol: r })}
                          className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-content hover:border-brand-400/40 hover:text-brand-300"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => toggleActivo(r)}
                          className={`rounded-lg border border-line px-3 py-1.5 text-xs font-medium ${
                            r.activo
                              ? 'text-content hover:border-red-500/40 hover:text-red-300'
                              : 'text-content hover:border-emerald-500/40 hover:text-emerald-300'
                          }`}
                        >
                          {r.activo ? 'Desactivar' : 'Activar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <RolFormModal
        open={formModal.open}
        rol={formModal.rol}
        onClose={() => setFormModal({ open: false, rol: null })}
        onSaved={onGuardado}
      />
      <PermisosMatrixModal
        open={matrizModal.open}
        rol={matrizModal.rol}
        onClose={() => setMatrizModal({ open: false, rol: null })}
        onSaved={() => setMatrizModal({ open: false, rol: null })}
      />
    </div>
  )
}
