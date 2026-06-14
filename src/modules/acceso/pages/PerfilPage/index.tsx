import Alert from '@/core/components/ui/Alert'
import Badge from '@/core/components/ui/Badge'
import PerfilInfoCard from './components/PerfilInfoCard'
import PerfilPasswordCard from './components/PerfilPasswordCard'
import { usePerfilPersonal } from '@/modules/acceso/hooks/usePerfilPersonal'
import { useAuth } from '@/modules/acceso/context/AuthContext'
import type { PerfilPersonal } from '@/modules/acceso/models'

export default function PerfilPage() {
  const { updateUser, isCliente } = useAuth()
  const { perfil, setPerfil, loading, error } = usePerfilPersonal()

  const onUpdated = (actualizado: PerfilPersonal) => {
    setPerfil(actualizado)
    // Refresca el nombre y la foto mostrados en el topbar.
    updateUser({
      nombre: actualizado.nombre,
      apellido: actualizado.apellido,
      fotoPerfil: actualizado.fotoPerfil ?? null,
    })
  }

  const iniciales = perfil
    ? `${perfil.nombre?.[0] ?? ''}${perfil.apellido?.[0] ?? ''}`.toUpperCase()
    : '?'

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-strong">Mi Perfil</h1>
        <p className="mt-1 text-sm text-muted">Gestiona tu información personal y de seguridad.</p>
      </header>

      <Alert type="error">{error}</Alert>

      {loading ? (
        <p className="py-10 text-center text-faint">Cargando perfil…</p>
      ) : perfil ? (
        <>
          <div className="flex items-center gap-4 rounded-3xl border border-line bg-surface/60 p-6">
            {perfil.fotoPerfil ? (
              <img src={perfil.fotoPerfil} alt="Foto de perfil" className="h-16 w-16 rounded-2xl object-cover" />
            ) : (
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-400 text-xl font-bold text-ink-900">
                {iniciales}
              </span>
            )}
            <div>
              <h2 className="text-xl font-bold text-strong">{perfil.nombre} {perfil.apellido}</h2>
              <p className="text-sm text-muted">{perfil.correo}</p>
              <Badge tone={perfil.rol === 'ADMIN' ? 'sky' : 'brand'} className="mt-2">{perfil.rol}</Badge>
            </div>
          </div>

          <PerfilInfoCard perfil={perfil} esCliente={isCliente} onUpdated={onUpdated} />
          <PerfilPasswordCard />
        </>
      ) : null}
    </div>
  )
}
