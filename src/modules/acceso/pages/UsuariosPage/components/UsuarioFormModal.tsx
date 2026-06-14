import { useEffect, useMemo, useState } from 'react'
import Modal from '@/core/components/ui/Modal'
import Input from '@/core/components/ui/Input'
import Select from '@/core/components/ui/Select'
import Alert from '@/core/components/ui/Alert'
import Button from '@/core/components/ui/Button'
import { usuariosService } from '@/modules/acceso/service/usuarios.service'
import { SEXO_OPTIONS } from '@/modules/acceso/models'
import { getErrorMessage } from '@/core/utils/getErrorMessage'
import type { Role, User } from '@/modules/acceso/models'

interface Props {
  open: boolean
  mode: 'create' | 'edit'
  usuario: User | null
  roles: Role[]
  onClose: () => void
  onSaved: () => void
}

const EMPTY = {
  nombre: '', apellido: '', correo: '', username: '', password: '',
  telefono: '', sexo: '', idRol: '', activo: true,
  cargo: '', fechaIngreso: '', especialidad: '',
}

export default function UsuarioFormModal({ open, mode, usuario, roles = [], onClose, onSaved }: Props) {
  const isEdit = mode === 'edit'
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const rolOptions = useMemo(
    () => [
      { value: '', label: 'Selecciona un rol…' },
      ...roles.map((r) => ({ value: String(r.idRol), label: r.nombre })),
    ],
    [roles],
  )

  // ¿El rol seleccionado es ADMIN? → habilita los campos de la extensión Admin.
  const esRolAdmin = useMemo(
    () => roles.find((r) => String(r.idRol) === form.idRol)?.nombre === 'ADMIN',
    [roles, form.idRol],
  )

  useEffect(() => {
    if (!open) return
    setError('')
    if (isEdit && usuario) {
      setForm({
        ...EMPTY,
        nombre: usuario.nombre ?? '',
        apellido: usuario.apellido ?? '',
        correo: usuario.correo ?? '',
        telefono: usuario.telefono ?? '',
        sexo: usuario.sexo ?? '',
        idRol: usuario.idRol ? String(usuario.idRol) : '',
        activo: usuario.activo ?? true,
      })
    } else {
      // Crear: sin rol preseleccionado (el admin elige).
      setForm({ ...EMPTY })
    }
  }, [open, isEdit, usuario])

  const onChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const onSubmit = async (e: any) => {
    e.preventDefault()
    setError('')

    if (!form.idRol) {
      setError('Debes seleccionar un rol')
      return
    }
    if (!isEdit && form.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }

    setLoading(true)
    try {
      if (isEdit && usuario) {
        await usuariosService.actualizar(usuario.idUsuario, {
          nombre: form.nombre.trim(),
          apellido: form.apellido.trim(),
          correo: form.correo.trim(),
          telefono: form.telefono.trim() || null,
          sexo: form.sexo,
          idRol: Number(form.idRol),
          activo: form.activo,
        })
      } else if (esRolAdmin) {
        // Rol ADMIN → crea también la extensión Admin.
        await usuariosService.crearAdmin({
          nombre: form.nombre.trim(),
          apellido: form.apellido.trim(),
          correo: form.correo.trim(),
          username: form.username.trim() || form.correo.trim(),
          password: form.password,
          telefono: form.telefono.trim() || null,
          sexo: form.sexo,
          idRol: Number(form.idRol),
          cargo: form.cargo.trim() || null,
          fechaIngreso: form.fechaIngreso ? `${form.fechaIngreso}T00:00:00` : null,
          especialidad: form.especialidad.trim() || null,
        })
      } else {
        // Cualquier otro rol → usuario genérico.
        await usuariosService.crear({
          nombre: form.nombre.trim(),
          apellido: form.apellido.trim(),
          correo: form.correo.trim(),
          username: form.username.trim() || form.correo.trim(),
          password: form.password,
          telefono: form.telefono.trim() || null,
          sexo: form.sexo,
          idRol: Number(form.idRol),
        })
      }
      onSaved()
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo guardar'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Editar usuario' : 'Nuevo usuario'} maxWidth="max-w-2xl">
      <Alert type="error" className="mb-4">{error}</Alert>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input id="nombre" name="nombre" label="Nombre" value={form.nombre} onChange={onChange} required />
          <Input id="apellido" name="apellido" label="Apellido" value={form.apellido} onChange={onChange} required />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input id="correo" name="correo" type="email" label="Correo" value={form.correo} onChange={onChange} required />
          <Input id="telefono" name="telefono" label="Teléfono" value={form.telefono} onChange={onChange} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Select id="sexo" name="sexo" label="Sexo" options={SEXO_OPTIONS} value={form.sexo} onChange={onChange} required />
          <Select id="idRol" name="idRol" label="Rol" options={rolOptions} value={form.idRol} onChange={onChange} required />
        </div>

        {/* Credenciales solo al crear */}
        {!isEdit && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Input id="username" name="username" label="Usuario (opcional)" placeholder="Por defecto: el correo" value={form.username} onChange={onChange} />
            <Input id="password" name="password" type="password" label="Contraseña" placeholder="Mín. 8 caracteres" value={form.password} onChange={onChange} required />
          </div>
        )}

        {/* Campos de Admin solo si el rol elegido es ADMIN */}
        {!isEdit && esRolAdmin && (
          <div className="rounded-2xl border border-line bg-surface2/40 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-brand-400">
              Datos de administrador
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <Input id="cargo" name="cargo" label="Cargo" value={form.cargo} onChange={onChange} />
              <Input id="fechaIngreso" name="fechaIngreso" type="date" label="Fecha de ingreso" value={form.fechaIngreso} onChange={onChange} />
              <Input id="especialidad" name="especialidad" label="Especialidad" value={form.especialidad} onChange={onChange} />
            </div>
          </div>
        )}

        {/* Estado activo solo al editar */}
        {isEdit && (
          <label className="flex items-center gap-3 rounded-xl border border-line bg-surface2/40 px-4 py-3">
            <input type="checkbox" name="activo" checked={form.activo} onChange={onChange} className="h-4 w-4 accent-brand-400" />
            <span className="text-sm text-content">Usuario activo</span>
          </label>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear usuario'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
