import { useRef, useState } from 'react'
import Input from '@/core/components/ui/Input'
import Select from '@/core/components/ui/Select'
import Alert from '@/core/components/ui/Alert'
import Button from '@/core/components/ui/Button'
import { perfilService } from '@/modules/acceso/service/perfil.service'
import { SEXO_OPTIONS, etiquetaSexo, TIPO_SANGRE_OPTIONS } from '@/modules/acceso/models'
import { getErrorMessage } from '@/core/utils/getErrorMessage'
import type { PerfilPersonal } from '@/modules/acceso/models'

interface Props {
  perfil: PerfilPersonal
  esCliente: boolean
  onUpdated: (p: PerfilPersonal) => void
}

const TIPOS_IMG = ['image/png', 'image/jpeg', 'image/webp']
const MAX_MB = 2
const soloFecha = (valor?: string) => (valor ? String(valor).slice(0, 10) : '')

/** Tarjeta de datos del perfil. La foto se elige aquí y se guarda con "Guardar cambios". */
export default function PerfilInfoCard({ perfil, esCliente, onUpdated }: Props) {
  const [editando, setEditando] = useState(false)
  const [form, setForm] = useState(() => estadoInicial(perfil))
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')
  const [loading, setLoading] = useState(false)

  // Estado de la foto (pendiente de guardar)
  const inputRef = useRef<HTMLInputElement>(null)
  const [fotoFile, setFotoFile] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)
  const [fotoEliminada, setFotoEliminada] = useState(false)

  const iniciales = `${perfil.nombre?.[0] ?? ''}${perfil.apellido?.[0] ?? ''}`.toUpperCase() || '?'
  const fotoMostrada = fotoPreview ?? (fotoEliminada ? null : perfil.fotoPerfil)

  const onChange = (e: any) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const resetFoto = () => {
    setFotoFile(null)
    setFotoPreview(null)
    setFotoEliminada(false)
  }

  const entrarEdicion = () => {
    setOk('')
    setForm(estadoInicial(perfil))
    resetFoto()
    setEditando(true)
  }

  const cancelar = () => {
    setForm(estadoInicial(perfil))
    resetFoto()
    setError('')
    setEditando(false)
  }

  const onElegirArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setError('')
    if (!TIPOS_IMG.includes(file.type)) {
      setError('Formato no permitido. Usa JPG, PNG o WEBP.')
      return
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`La imagen no puede superar los ${MAX_MB} MB.`)
      return
    }
    setFotoFile(file)
    setFotoPreview(URL.createObjectURL(file))
    setFotoEliminada(false)
  }

  const quitarFoto = () => {
    setFotoFile(null)
    setFotoPreview(null)
    setFotoEliminada(true)
  }

  const onSubmit = async (e: any) => {
    e.preventDefault()
    setError('')
    setOk('')
    setLoading(true)
    try {
      // 1) Datos personales / antropométricos
      let actualizado = await perfilService.actualizar({
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        telefono: form.telefono.trim() || null,
        sexo: form.sexo || null,
        peso: esCliente && form.peso ? Number(form.peso) : null,
        altura: esCliente && form.altura ? Number(form.altura) : null,
        tipoSangre: esCliente ? form.tipoSangre || null : null,
        fechaNacimiento: esCliente && form.fechaNacimiento ? `${form.fechaNacimiento}T00:00:00` : null,
      })

      // 2) Foto (si cambió)
      if (fotoFile) {
        actualizado = await perfilService.subirFoto(fotoFile)
      } else if (fotoEliminada) {
        actualizado = await perfilService.eliminarFoto()
      }

      onUpdated(actualizado)
      resetFoto()
      setEditando(false)
      setOk('Perfil actualizado correctamente')
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo actualizar el perfil'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="rounded-3xl border border-line bg-surface/60 p-6 sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-strong">Datos personales</h2>
        {!editando && (
          <Button variant="outline" size="sm" onClick={entrarEdicion}>Editar</Button>
        )}
      </div>

      <Alert type="error" className="mb-4">{error}</Alert>
      {!editando && <Alert type="success" className="mb-4">{ok}</Alert>}

      {!editando ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Dato label="Nombre" valor={perfil.nombre} />
          <Dato label="Apellido" valor={perfil.apellido} />
          <Dato label="Correo (no editable)" valor={perfil.correo} />
          <Dato label="Teléfono" valor={perfil.telefono} />
          <Dato label="Sexo" valor={etiquetaSexo(perfil.sexo)} />
          {esCliente && (
            <>
              <Dato label="Peso" valor={perfil.peso ? `${perfil.peso} kg` : undefined} />
              <Dato label="Altura" valor={perfil.altura ? `${perfil.altura} cm` : undefined} />
              <Dato label="Fecha de nacimiento" valor={soloFecha(perfil.fechaNacimiento)} />
              <Dato label="Tipo de sangre" valor={perfil.tipoSangre} />
            </>
          )}
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-5">
          {/* Foto de perfil */}
          <div className="flex items-center gap-4 rounded-2xl border border-line bg-surface2/40 p-4">
            {fotoMostrada ? (
              <img src={fotoMostrada} alt="Foto de perfil" className="h-16 w-16 rounded-2xl object-cover" />
            ) : (
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-400 text-lg font-bold text-ink-900">
                {iniciales}
              </span>
            )}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-400">Foto de perfil</p>
              <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={onElegirArchivo} className="hidden" />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-content hover:border-brand-400/50 hover:text-brand-300"
                >
                  {fotoMostrada ? 'Cambiar imagen' : 'Elegir imagen'}
                </button>
                {fotoMostrada && (
                  <button
                    type="button"
                    onClick={quitarFoto}
                    className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-content hover:border-red-500/40 hover:text-red-300"
                  >
                    Quitar foto
                  </button>
                )}
              </div>
              <p className="mt-1 text-[11px] text-faint">JPG, PNG o WEBP · máx. {MAX_MB} MB</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input id="nombre" name="nombre" label="Nombre" value={form.nombre} onChange={onChange} required />
            <Input id="apellido" name="apellido" label="Apellido" value={form.apellido} onChange={onChange} required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input id="correo" label="Correo (no editable)" value={perfil.correo} disabled />
            <Input id="telefono" name="telefono" label="Teléfono" value={form.telefono} onChange={onChange} />
          </div>
          <Select id="sexo" name="sexo" label="Sexo" options={SEXO_OPTIONS} value={form.sexo} onChange={onChange} />

          {esCliente && (
            <div className="rounded-2xl border border-line bg-surface2/40 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-brand-400">
                Datos antropométricos
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input id="peso" name="peso" type="number" step="0.1" min="0" label="Peso (kg)" placeholder="Ej. 70.5" value={form.peso} onChange={onChange} />
                <Input id="altura" name="altura" type="number" step="1" min="0" label="Altura (cm)" placeholder="Ej. 171" value={form.altura} onChange={onChange} />
                <Input id="fechaNacimiento" name="fechaNacimiento" type="date" label="Fecha de nacimiento" value={form.fechaNacimiento} onChange={onChange} />
                <Select id="tipoSangre" name="tipoSangre" label="Tipo de sangre" options={TIPO_SANGRE_OPTIONS} value={form.tipoSangre} onChange={onChange} />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={cancelar}>Cancelar</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Guardando…' : 'Guardar cambios'}</Button>
          </div>
        </form>
      )}
    </section>
  )
}

function estadoInicial(p: PerfilPersonal) {
  return {
    nombre: p.nombre ?? '',
    apellido: p.apellido ?? '',
    telefono: p.telefono ?? '',
    sexo: p.sexo ?? '',
    peso: p.peso != null ? String(p.peso) : '',
    altura: p.altura != null ? String(p.altura) : '',
    fechaNacimiento: soloFecha(p.fechaNacimiento),
    tipoSangre: p.tipoSangre ?? '',
  }
}

function Dato({ label, valor }: { label: string; valor?: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface2/40 p-4">
      <p className="text-xs uppercase tracking-wide text-faint">{label}</p>
      <p className="mt-1 font-medium text-strong">{valor || '—'}</p>
    </div>
  )
}
