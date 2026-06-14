import Button from '@/core/components/ui/Button'

export default function CTASection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="rounded-3xl border border-line bg-surface p-10 text-center sm:p-16">
          <h2 className="text-3xl font-bold text-strong sm:text-4xl">
            Empieza a comer con inteligencia hoy
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-muted">
            Crea tu cuenta gratis y deja que la IA cuide de tu alimentación. ¿Eres
            administrador? Accede al panel de gestión.
          </p>

          <div className="relative mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/register" size="lg">
              Registrarme como cliente
            </Button>
            <Button href="/login" variant="outline" size="lg">
              Iniciar sesión
            </Button>
          </div>

          <p className="relative mt-6 text-xs text-faint">
            Acceso de administradores disponible desde{' '}
            <a href="/login" className="font-semibold text-brand-300 hover:underline">
              Iniciar sesión
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  )
}
