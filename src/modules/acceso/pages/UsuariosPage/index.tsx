import { useMemo, useState } from 'react'
import Button from '@/core/components/ui/Button'
import Input from '@/core/components/ui/Input'
import Select from '@/core/components/ui/Select'
import Badge from '@/core/components/ui/Badge'
import Alert from '@/core/components/ui/Alert'
import UsuarioFormModal from './components/UsuarioFormModal'
import { useUsers } from '@/modules/acceso/hooks/useUsers'
import { useRoles } from '@/modules/acceso/hooks/useRoles'
import { getErrorMessage } from '@/core/utils/getErrorMessage'
import type { User } from '@/modules/acceso/models'

const PAGE_SIZE = 8

const TIPO_OPTIONS = [
  { value: '', label: 'Todas las identidades' },
  { value: 'ADMIN', label: 'Administradores' },
  { value: 'CLIENTE', label: 'Clientes' },
]

type ModalState = { open: boolean; mode: 'create' | 'edit'; usuario: User | null }

export default function UsuariosPage() {
  const { usuarios, fisicoPorUsuario, loading, error, setError, recargar, cambiarEstado } = useUsers()
  const { roles } = useRoles()

  const [search, setSearch] = useState('')
  const [tipo, setTipo] = useState('')
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState<ModalState>({ open: false, mode: 'create', usuario: null })

  const filtrados = useMemo(() => {
    const q = search.trim().toLowerCase()
    return usuarios.filter((u) => {
      const coincideTexto =
        !q ||
        `${u.nombre} ${u.apellido}`.toLowerCase().includes(q) ||
        (u.correo ?? '').toLowerCase().includes(q)
      const coincideTipo = !tipo || u.rol === tipo
      return coincideTexto && coincideTipo
    })
  }, [usuarios, search, tipo])

  const totalPages = Math.max(1, Math.ceil(filtrados.length / PAGE_SIZE))
  const pageSafe = Math.min(page, totalPages)
  const visibles = filtrados.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE)

  const abrirCrear = () => setModal({ open: true, mode: 'create', usuario: null })
  const abrirEditar = (usuario: User) => setModal({ open: true, mode: 'edit', usuario })
  const cerrarModal = () => setModal((m) => ({ ...m, open: false }))

  const onGuardado = () => {
    cerrarModal()
    recargar()
  }

  const toggleEstado = async (usuario: User) => {
    const accion = usuario.activo ? 'desactivar' : 'activar'
    if (!window.confirm(`¿Seguro que deseas ${accion} a ${usuario.nombre} ${usuario.apellido}?`)) return
    try {
      await cambiarEstado(usuario.idUsuario, !usuario.activo)
      recargar()
    } catch (err) {
      setError(getErrorMessage(err, `No se pudo ${accion} el usuario`))
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-strong">Gestión de Usuarios</h1>
          <p className="mt-1 text-sm text-muted">Padrón global de clientes y administradores.</p>
        </div>
        <Button onClick={abrirCrear}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>
          Nuevo usuario
        </Button>
      </header>

      <Alert type="error" className="mb-4">{error}</Alert>

      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_220px]">
        <Input
          id="search"
          placeholder="Buscar por nombre, apellido o correo…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
        />
        <Select id="tipo" options={TIPO_OPTIONS} value={tipo} onChange={(e) => { setTipo(e.target.value); setPage(1) }} />
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-surface/60">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-faint">
              <tr>
                <th className="px-5 py-3 font-medium">Usuario</th>
                <th className="px-5 py-3 font-medium">Identidad</th>
                <th className="px-5 py-3 font-medium">Físico</th>
                <th className="px-5 py-3 font-medium">Estado</th>
                <th className="px-5 py-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-faint">Cargando…</td></tr>
              ) : visibles.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-faint">No se encontraron usuarios.</td></tr>
              ) : (
                visibles.map((u) => {
                  const fisico = fisicoPorUsuario[u.idUsuario]
                  return (
                    <tr key={u.idUsuario} className="hover:bg-surface2">
                      <td className="px-5 py-3">
                        <p className="font-medium text-strong">{u.nombre} {u.apellido}</p>
                        <p className="text-xs text-faint">{u.correo}</p>
                      </td>
                      <td className="px-5 py-3">
                        <Badge tone={u.rol === 'ADMIN' ? 'sky' : 'brand'}>{u.rol ?? '—'}</Badge>
                      </td>
                      <td className="px-5 py-3 text-muted">
                        {u.rol === 'CLIENTE' && fisico
                          ? `${fisico.peso ?? '—'} kg · ${fisico.altura ?? '—'} cm`
                          : '—'}
                      </td>
                      <td className="px-5 py-3">
                        <Badge tone={u.activo ? 'green' : 'red'}>{u.activo ? 'Activo' : 'Inactivo'}</Badge>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => abrirEditar(u)}
                            className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-content hover:border-brand-400/40 hover:text-brand-300"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => toggleEstado(u)}
                            className={`rounded-lg border border-line px-3 py-1.5 text-xs font-medium ${
                              u.activo
                                ? 'text-content hover:border-red-500/40 hover:text-red-300'
                                : 'text-content hover:border-emerald-500/40 hover:text-emerald-300'
                            }`}
                          >
                            {u.activo ? 'Desactivar' : 'Activar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {!loading && filtrados.length > 0 && (
          <div className="flex items-center justify-between border-t border-line px-5 py-3 text-sm text-faint">
            <span>
              {filtrados.length} usuario{filtrados.length !== 1 && 's'} · página {pageSafe} de {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={pageSafe <= 1}
                className="rounded-lg border border-line px-3 py-1.5 text-xs text-content disabled:opacity-40 hover:enabled:border-brand-400/40"
              >
                Anterior
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={pageSafe >= totalPages}
                className="rounded-lg border border-line px-3 py-1.5 text-xs text-content disabled:opacity-40 hover:enabled:border-brand-400/40"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      <UsuarioFormModal
        open={modal.open}
        mode={modal.mode}
        usuario={modal.usuario}
        roles={roles}
        onClose={cerrarModal}
        onSaved={onGuardado}
      />
    </div>
  )
}
