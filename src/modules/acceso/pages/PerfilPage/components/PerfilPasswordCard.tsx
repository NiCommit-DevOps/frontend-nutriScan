import { useState } from 'react'
import Input from '@/core/components/ui/Input'
import Alert from '@/core/components/ui/Alert'
import Button from '@/core/components/ui/Button'
import { perfilService } from '@/modules/acceso/service/perfil.service'
import { getErrorMessage } from '@/core/utils/getErrorMessage'

const EMPTY = { passwordActual: '', passwordNueva: '', confirmarPassword: '' }

export default function PerfilPasswordCard() {
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setOk('')

    if (form.passwordNueva.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres')
      return
    }
    if (form.passwordNueva !== form.confirmarPassword) {
      setError('La confirmación no coincide con la nueva contraseña')
      return
    }

    setLoading(true)
    try {
      await perfilService.cambiarPassword(form)
      setForm(EMPTY)
      setOk('Contraseña actualizada correctamente')
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo cambiar la contraseña'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="rounded-3xl border border-line bg-surface/60 p-6 sm:p-8">
      <h2 className="mb-6 text-lg font-semibold text-strong">Cambiar contraseña</h2>

      <Alert type="error" className="mb-4">{error}</Alert>
      <Alert type="success" className="mb-4">{ok}</Alert>

      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          id="passwordActual"
          name="passwordActual"
          type="password"
          label="Contraseña actual"
          value={form.passwordActual}
          onChange={onChange}
          autoComplete="current-password"
          required
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="passwordNueva"
            name="passwordNueva"
            type="password"
            label="Nueva contraseña"
            placeholder="Mín. 8 caracteres"
            value={form.passwordNueva}
            onChange={onChange}
            autoComplete="new-password"
            required
          />
          <Input
            id="confirmarPassword"
            name="confirmarPassword"
            type="password"
            label="Confirmar nueva contraseña"
            value={form.confirmarPassword}
            onChange={onChange}
            autoComplete="new-password"
            required
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? 'Actualizando…' : 'Actualizar contraseña'}
          </Button>
        </div>
      </form>
    </section>
  )
}
