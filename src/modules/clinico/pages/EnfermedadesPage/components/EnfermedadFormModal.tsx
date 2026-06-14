import { useEffect, useState } from 'react'
import Modal from '@/core/components/ui/Modal'
import Input from '@/core/components/ui/Input'
import Select from '@/core/components/ui/Select'
import Alert from '@/core/components/ui/Alert'
import Button from '@/core/components/ui/Button'
import { enfermedadesService } from '@/modules/clinico/service/enfermedades.service'
import { NIVEL_RIESGO_OPTIONS } from '@/modules/clinico/models/enfermedad.model'
import { getErrorMessage } from '@/core/utils/getErrorMessage'

const EMPTY = { nombre: '', descripcion: '', nivelRiesgo: '' }

const NIVEL_OPTIONS = [{ value: '', label: 'Selecciona…' }, ...NIVEL_RIESGO_OPTIONS]

/** Crea (enfermedad=null) o edita una enfermedad del catálogo. */
export default function EnfermedadFormModal({ open, enfermedad, onClose, onSaved }) {
  const isEdit = Boolean(enfermedad)
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return
    setError('')
    setForm(
      isEdit
        ? {
            nombre: enfermedad.nombre ?? '',
            descripcion: enfermedad.descripcion ?? '',
            nivelRiesgo: enfermedad.nivelRiesgo ?? '',
          }
        : EMPTY,
    )
  }, [open, isEdit, enfermedad])

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.nivelRiesgo) {
      setError('Selecciona el nivel de riesgo')
      return
    }
    setLoading(true)
    try {
      const payload = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim() || null,
        nivelRiesgo: form.nivelRiesgo,
      }
      if (isEdit) await enfermedadesService.actualizar(enfermedad.idEnfermedad, payload)
      else await enfermedadesService.crear(payload)
      onSaved?.()
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo guardar la enfermedad'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Editar enfermedad' : 'Nueva enfermedad'}>
      <Alert type="error" className="mb-4">{error}</Alert>

      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          id="nombre"
          name="nombre"
          label="Nombre"
          placeholder="Ej. Diabetes Tipo 2"
          value={form.nombre}
          onChange={onChange}
          required
        />

        <div>
          <label htmlFor="descripcion" className="mb-1.5 block text-sm font-medium text-content">
            Descripción
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            rows={4}
            placeholder="Descripción detallada de la patología…"
            value={form.descripcion}
            onChange={onChange}
            className="w-full rounded-xl border border-line bg-surface2/70 px-4 py-2.5 text-sm text-strong placeholder-faint transition-colors focus:border-brand-400/60 focus:outline-none focus:ring-2 focus:ring-brand-400/30"
          />
        </div>

        <Select
          id="nivelRiesgo"
          name="nivelRiesgo"
          label="Nivel de riesgo"
          options={NIVEL_OPTIONS}
          value={form.nivelRiesgo}
          onChange={onChange}
          required
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear enfermedad'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
