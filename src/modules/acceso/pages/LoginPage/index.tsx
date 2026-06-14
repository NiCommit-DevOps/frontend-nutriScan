import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Input from '@/core/components/ui/Input'
import Alert from '@/core/components/ui/Alert'
import Button from '@/core/components/ui/Button'
import AuthShell from '@/modules/acceso/components/AuthShell'
import { useAuth } from '@/modules/acceso/context/AuthContext'
import { getErrorMessage } from '@/core/utils/getErrorMessage'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const successMessage = location.state?.message

  const [form, setForm] = useState({ identificador: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form)
      navigate('/app', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo iniciar sesión'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell title="Bienvenido de vuelta" subtitle="Inicia sesión para continuar con NutriScan">
      <Alert type="success" className="mb-4">{successMessage}</Alert>
      <Alert type="error" className="mb-4">{error}</Alert>

      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          id="identificador"
          name="identificador"
          label="Correo o usuario"
          placeholder="tucorreo@ejemplo.com"
          value={form.identificador}
          onChange={onChange}
          autoComplete="username"
          required
        />
        <Input
          id="password"
          name="password"
          type="password"
          label="Contraseña"
          placeholder="••••••••"
          value={form.password}
          onChange={onChange}
          autoComplete="current-password"
          required
        />

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? 'Ingresando…' : 'Iniciar sesión'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        ¿No tienes cuenta?{' '}
        <Link to="/register" className="font-semibold text-brand-300 hover:underline">
          Regístrate gratis
        </Link>
      </p>
    </AuthShell>
  )
}
