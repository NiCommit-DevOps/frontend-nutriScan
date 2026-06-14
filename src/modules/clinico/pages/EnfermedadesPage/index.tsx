import { useMemo, useState } from 'react'
import Button from '@/core/components/ui/Button'
import Input from '@/core/components/ui/Input'
import Select from '@/core/components/ui/Select'
import Badge from '@/core/components/ui/Badge'
import Alert from '@/core/components/ui/Alert'
import EnfermedadFormModal from './components/EnfermedadFormModal'
import { useEnfermedades } from '@/modules/clinico/hooks/useEnfermedades'
import { tonoNivelRiesgo, NIVEL_RIESGO_OPTIONS } from '@/modules/clinico/models'
import { getErrorMessage } from '@/core/utils/getErrorMessage'
import type { Enfermedad } from '@/modules/clinico/models'

const NIVEL_FILTER = [{ value: '', label: 'Todos los niveles' }, ...NIVEL_RIESGO_OPTIONS]

type ModalState = { open: boolean; enfermedad: Enfermedad | null }

export default function EnfermedadesPage() {
  const { enfermedades, loading, error, setError, recargar, eliminar } = useEnfermedades()

  const [search, setSearch] = useState('')
  const [nivel, setNivel] = useState('')
  const [modal, setModal] = useState<ModalState>({ open: false, enfermedad: null })

  const filtradas = useMemo(() => {
    const q = search.trim().toLowerCase()
    return enfermedades.filter((e) => {
      const coincideTexto = !q || (e.nombre ?? '').toLowerCase().includes(q)
      const coincideNivel = !nivel || e.nivelRiesgo === nivel
      return coincideTexto && coincideNivel
    })
  }, [enfermedades, search, nivel])

  const onGuardado = () => {
    setModal({ open: false, enfermedad: null })
    recargar()
  }

  const onEliminar = async (enf: Enfermedad) => {
    if (!window.confirm(`¿Eliminar "${enf.nombre}"? Se desvinculará de todos los clientes.`)) return
    try {
      await eliminar(enf.idEnfermedad)
      recargar()
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo eliminar la enfermedad'))
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-strong">Catálogo de Enfermedades</h1>
          <p className="mt-1 text-sm text-muted">Patologías que el sistema usa para evaluar la compatibilidad nutricional.</p>
        </div>
        <Button onClick={() => setModal({ open: true, enfermedad: null })}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>
          Nueva enfermedad
        </Button>
      </header>

      <Alert type="error" className="mb-4">{error}</Alert>

      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_220px]">
        <Input id="search" placeholder="Buscar por nombre…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select id="nivel" options={NIVEL_FILTER} value={nivel} onChange={(e) => setNivel(e.target.value)} />
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-surface/60">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-faint">
              <tr>
                <th className="px-5 py-3 font-medium">Enfermedad</th>
                <th className="px-5 py-3 font-medium">Descripción</th>
                <th className="px-5 py-3 font-medium">Nivel de riesgo</th>
                <th className="px-5 py-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading ? (
                <tr><td colSpan={4} className="px-5 py-10 text-center text-faint">Cargando…</td></tr>
              ) : filtradas.length === 0 ? (
                <tr><td colSpan={4} className="px-5 py-10 text-center text-faint">No se encontraron enfermedades.</td></tr>
              ) : (
                filtradas.map((e) => (
                  <tr key={e.idEnfermedad} className="hover:bg-surface2">
                    <td className="px-5 py-3 font-medium text-strong">{e.nombre}</td>
                    <td className="px-5 py-3 max-w-md text-muted">
                      <span className="line-clamp-2">{e.descripcion || '—'}</span>
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone={tonoNivelRiesgo(e.nivelRiesgo)}>{e.nivelRiesgo}</Badge>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setModal({ open: true, enfermedad: e })}
                          className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-content hover:border-brand-400/40 hover:text-brand-300"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => onEliminar(e)}
                          className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-content hover:border-red-500/40 hover:text-red-300"
                        >
                          Eliminar
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

      <EnfermedadFormModal
        open={modal.open}
        enfermedad={modal.enfermedad}
        onClose={() => setModal({ open: false, enfermedad: null })}
        onSaved={onGuardado}
      />
    </div>
  )
}
