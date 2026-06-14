import { useEffect, useState } from 'react'
import Modal from '@/core/components/ui/Modal'
import Input from '@/core/components/ui/Input'
import Alert from '@/core/components/ui/Alert'
import Button from '@/core/components/ui/Button'
import { historialClinicoService } from '@/modules/clinico/service/historialClinico.service'
import { getErrorMessage } from '@/core/utils/getErrorMessage'

const soloFecha = (v) => (v ? String(v).slice(0, 10) : '')

/** Edita fecha de diagnóstico y observaciones de una enfermedad vinculada. */
export default function DetalleDiagnosticoModal({ open, item, onClose, onSaved }) {
  const [form, setForm] = useState({ fechaDiagnostico: '', observaciones: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open || !item) return
    setError('')
    setForm({
      fechaDiagnostico: soloFecha(item.fechaDiagnostico),
      observaciones: item.observaciones ?? '',
    })
  }, [open, item])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await historialClinicoService.actualizarDetalle(item.idEnfermedad, {
        fechaDiagnostico: form.fechaDiagnostico || null,
        observaciones: form.observaciones.trim() || null,
      })
      onSaved?.()
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo guardar el detalle'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={`Detalle — ${item?.nombre ?? ''}`}>
      <Alert type="error" className="mb-4">{error}</Alert>

      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          id="fechaDiagnostico"
          type="date"
          label="Fecha de diagnóstico"
          value={form.fechaDiagnostico}
          onChange={(e) => setForm((f) => ({ ...f, fechaDiagnostico: e.target.value }))}
        />
        <div>
          <label htmlFor="observaciones" className="mb-1.5 block text-sm font-medium text-content">
            Observaciones
          </label>
          <textarea
            id="observaciones"
            rows={4}
            placeholder="Ej. Tomar medicación en ayunas…"
            value={form.observaciones}
            onChange={(e) => setForm((f) => ({ ...f, observaciones: e.target.value }))}
            className="w-full rounded-xl border border-line bg-surface2/70 px-4 py-2.5 text-sm text-strong placeholder-faint transition-colors focus:border-brand-400/60 focus:outline-none focus:ring-2 focus:ring-brand-400/30"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={loading}>{loading ? 'Guardando…' : 'Guardar detalle'}</Button>
        </div>
      </form>
    </Modal>
  )
}
