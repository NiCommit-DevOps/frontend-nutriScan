import { useMemo, useState } from 'react'
import Button from '@/core/components/ui/Button'
import Badge from '@/core/components/ui/Badge'
import Alert from '@/core/components/ui/Alert'
import DetalleDiagnosticoModal from './components/DetalleDiagnosticoModal'
import { useHistorialClinico } from '@/modules/clinico/hooks/useHistorialClinico'
import { tonoNivelRiesgo } from '@/modules/clinico/models'
import { getErrorMessage } from '@/core/utils/getErrorMessage'
import type { HistorialClinicoItem } from '@/modules/clinico/models'

const soloFecha = (v?: string) => (v ? String(v).slice(0, 10) : '')

type DetalleState = { open: boolean; item: HistorialClinicoItem | null }

export default function HistorialClinicoPage() {
  const { items, loading, error, setError, actualizar, recargar } = useHistorialClinico()

  const [seleccion, setSeleccion] = useState<Set<number>>(new Set())
  const [iniciado, setIniciado] = useState(false)
  const [saving, setSaving] = useState(false)
  const [ok, setOk] = useState('')
  const [detalle, setDetalle] = useState<DetalleState>({ open: false, item: null })

  // Inicializa la selección la primera vez que llegan los items.
  if (!iniciado && items.length > 0) {
    setSeleccion(new Set(items.filter((i) => i.padece).map((i) => i.idEnfermedad)))
    setIniciado(true)
  }

  const original = useMemo(
    () => new Set(items.filter((i) => i.padece).map((i) => i.idEnfermedad)),
    [items],
  )

  const hayCambios = useMemo(() => {
    if (seleccion.size !== original.size) return true
    for (const id of seleccion) if (!original.has(id)) return true
    return false
  }, [seleccion, original])

  const toggle = (idEnfermedad: number) => {
    setOk('')
    setSeleccion((prev) => {
      const next = new Set(prev)
      if (next.has(idEnfermedad)) next.delete(idEnfermedad)
      else next.add(idEnfermedad)
      return next
    })
  }

  const guardar = async () => {
    setSaving(true)
    setError('')
    setOk('')
    try {
      const data = await actualizar([...seleccion])
      setSeleccion(new Set(data.filter((i) => i.padece).map((i) => i.idEnfermedad)))
      setOk('Historial clínico actualizado correctamente')
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron guardar los cambios'))
    } finally {
      setSaving(false)
    }
  }

  const onDetalleGuardado = () => {
    setDetalle({ open: false, item: null })
    recargar()
  }

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-strong">Mi Historial Clínico</h1>
          <p className="mt-1 text-sm text-muted">
            Marca las condiciones que padeces. Esto permite a NutriScan evaluar tus alimentos.
          </p>
        </div>
        <Button onClick={guardar} disabled={!hayCambios || saving}>
          {saving ? 'Guardando…' : 'Guardar cambios'}
        </Button>
      </header>

      <Alert type="error" className="mb-4">{error}</Alert>
      <Alert type="success" className="mb-4">{ok}</Alert>

      {loading ? (
        <p className="py-10 text-center text-faint">Cargando…</p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface/40 py-16 text-center text-faint">
          Aún no hay enfermedades en el catálogo. Un administrador debe registrarlas primero.
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => {
            const checked = seleccion.has(item.idEnfermedad)
            return (
              <li
                key={item.idEnfermedad}
                className={`rounded-2xl border px-4 py-3 transition-colors ${
                  checked ? 'border-brand-400/40 bg-brand-400/5' : 'border-line hover:bg-surface2'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(item.idEnfermedad)}
                    className="mt-1 h-4 w-4 accent-brand-400"
                  />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-strong">{item.nombre}</span>
                      <Badge tone={tonoNivelRiesgo(item.nivelRiesgo)}>{item.nivelRiesgo}</Badge>
                    </div>
                    {item.descripcion && <p className="mt-1 text-xs text-faint">{item.descripcion}</p>}

                    {item.padece && (
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                        <span>Diagnóstico: {soloFecha(item.fechaDiagnostico) || '—'}</span>
                        {item.observaciones && <span>Obs.: {item.observaciones}</span>}
                        <button
                          onClick={() => setDetalle({ open: true, item })}
                          className="font-semibold text-brand-300 hover:underline"
                        >
                          Editar detalles
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <DetalleDiagnosticoModal
        open={detalle.open}
        item={detalle.item}
        onClose={() => setDetalle({ open: false, item: null })}
        onSaved={onDetalleGuardado}
      />
    </div>
  )
}
