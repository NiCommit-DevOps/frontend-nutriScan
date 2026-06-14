import { useEffect, useState } from 'react'
import Modal from '@/core/components/ui/Modal'
import Input from '@/core/components/ui/Input'
import Alert from '@/core/components/ui/Alert'
import Button from '@/core/components/ui/Button'
import { rolesService } from '@/modules/acceso/service/roles.service'
import { getErrorMessage } from '@/core/utils/getErrorMessage'

const EMPTY = { nombre: '', descripcion: '', activo: true }

/** Crea (rol=null) o edita un rol. */
export default function RolFormModal({ open, rol, onClose, onSaved }) {
  const isEdit = Boolean(rol)
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return
    setError('')
    setForm(
      isEdit
        ? { nombre: rol.nombre ?? '', descripcion: rol.descripcion ?? '', activo: rol.activo ?? true }
        : EMPTY,
    )
  }, [open, isEdit, rol])

  const onChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim() || null,
        ...(isEdit ? { activo: form.activo } : {}),
      }
      if (isEdit) await rolesService.actualizar(rol.idRol, payload)
      else await rolesService.crear(payload)
      onSaved?.()
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo guardar el rol'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Editar rol' : 'Nuevo rol'}>
      <Alert type="error" className="mb-4">{error}</Alert>

      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          id="nombre"
          name="nombre"
          label="Nombre del rol"
          placeholder="Ej. NUTRICIONISTA"
          value={form.nombre}
          onChange={onChange}
          required
        />
        <Input
          id="descripcion"
          name="descripcion"
          label="Descripción"
          placeholder="Breve descripción del rol"
          value={form.descripcion}
          onChange={onChange}
        />

        {isEdit && (
          <label className="flex items-center gap-3 rounded-xl border border-line bg-surface2/40 px-4 py-3">
            <input type="checkbox" name="activo" checked={form.activo} onChange={onChange} className="h-4 w-4 accent-brand-400" />
            <span className="text-sm text-content">Rol activo</span>
          </label>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear rol'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
