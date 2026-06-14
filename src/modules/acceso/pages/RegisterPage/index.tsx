import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Input from '@/core/components/ui/Input'
import Select from '@/core/components/ui/Select'
import Alert from '@/core/components/ui/Alert'
import Button from '@/core/components/ui/Button'
import AuthShell from '@/modules/acceso/components/AuthShell'
import { useAuth } from '@/modules/acceso/context/AuthContext'
import { getErrorMessage } from '@/core/utils/getErrorMessage'

const SEXO_OPTIONS = [
  { value: '', label: 'Selecciona…' },
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Femenino' },
  { value: 'O', label: 'Otro' },
]

const INITIAL = {
  nombre: '',
  apellido: '',
  correo: '',
  password: '',
  confirmar: '',
  telefono: '',
  sexo: '',
  peso: '',
  altura: '',
  fechaNacimiento: '',
}

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState(INITIAL)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const validar = () => {
    if (form.password.length < 8) return 'La contraseña debe tener al menos 8 caracteres'
    if (form.password !== form.confirmar) return 'Las contraseñas no coinciden'
    if (!form.sexo) return 'Selecciona tu sexo'
    return ''
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const validationError = validar()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    try {
      const payload = {
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        correo: form.correo.trim(),
        password: form.password,
        telefono: form.telefono.trim() || null,
        sexo: form.sexo,
        // Datos físicos opcionales: solo si el usuario los llenó
        peso: form.peso ? Number(form.peso) : null,
        altura: form.altura ? Number(form.altura) : null,
        fechaNacimiento: form.fechaNacimiento || null,
      }
      await register(payload)
      navigate('/login', {
        replace: true,
        state: { message: '¡Cuenta creada! Ya puedes iniciar sesión.' },
      })
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo completar el registro'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Crea tu cuenta"
      subtitle="Regístrate como cliente y empieza a escanear tus alimentos"
      wide
    >
      <Alert type="error" className="mb-4">{error}</Alert>

      <form onSubmit={onSubmit} className="space-y-5">
        {/* Datos personales */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Input id="nombre" name="nombre" label="Nombre" value={form.nombre} onChange={onChange} required />
          <Input id="apellido" name="apellido" label="Apellido" value={form.apellido} onChange={onChange} required />
        </div>

        <Input
          id="correo"
          name="correo"
          type="email"
          label="Correo electrónico"
          placeholder="tucorreo@ejemplo.com"
          value={form.correo}
          onChange={onChange}
          autoComplete="email"
          required
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="password"
            name="password"
            type="password"
            label="Contraseña"
            placeholder="Mín. 8 caracteres"
            value={form.password}
            onChange={onChange}
            autoComplete="new-password"
            required
          />
          <Input
            id="confirmar"
            name="confirmar"
            type="password"
            label="Confirmar contraseña"
            value={form.confirmar}
            onChange={onChange}
            autoComplete="new-password"
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input id="telefono" name="telefono" label="Teléfono (opcional)" value={form.telefono} onChange={onChange} />
          <Select id="sexo" name="sexo" label="Sexo" options={SEXO_OPTIONS} value={form.sexo} onChange={onChange} required />
        </div>

        {/* Datos físicos opcionales */}
        <div className="rounded-2xl border border-line bg-surface2/40 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-brand-400">
            Datos físicos (opcional)
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input id="peso" name="peso" type="number" step="0.1" min="0" label="Peso (kg)" placeholder="Ej. 70.5" value={form.peso} onChange={onChange} />
            <Input id="altura" name="altura" type="number" step="1" min="0" label="Altura (cm)" placeholder="Ej. 171" value={form.altura} onChange={onChange} />
            <Input id="fechaNacimiento" name="fechaNacimiento" type="date" label="Nacimiento" value={form.fechaNacimiento} onChange={onChange} />
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? 'Creando cuenta…' : 'Crear cuenta'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="font-semibold text-brand-300 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </AuthShell>
  )
}
