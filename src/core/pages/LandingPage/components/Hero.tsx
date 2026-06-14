import Button from '@/core/components/ui/Button'

export default function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden pt-32 pb-20 sm:pt-40">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-400/10 px-4 py-1.5 text-xs font-semibold text-brand-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400" />
            Potenciado por Inteligencia Artificial
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-strong sm:text-5xl lg:text-6xl">
            Escanea tu comida, <span className="text-brand-500">cuida tu salud</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted lg:mx-0">
            NutriScan identifica alimentos con reconocimiento de imágenes, extrae su
            información nutricional y la contrasta con tu historial clínico para
            decirte al instante si es <span className="font-semibold text-brand-300">recomendable</span>,{' '}
            <span className="font-semibold text-amber-300">riesgoso</span> o{' '}
            <span className="font-semibold text-red-400">no apto</span> para ti.
          </p>

          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
            <Button href="/register" size="lg">
              Comienza gratis
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Button>
            <Button href="#como-funciona" variant="outline" size="lg">
              Ver cómo funciona
            </Button>
          </div>

          <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-line pt-8 text-center lg:text-left">
            {[
              { k: '+95%', v: 'Precisión de análisis' },
              { k: '<3s', v: 'Resultado por escaneo' },
              { k: '24/7', v: 'Disponible siempre' },
            ].map((s) => (
              <div key={s.v}>
                <dt className="text-2xl font-bold text-brand-300 sm:text-3xl">{s.k}</dt>
                <dd className="mt-1 text-xs text-faint sm:text-sm">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-400/15 text-brand-300">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 12h10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-semibold text-strong">Manzana roja</p>
                  <p className="text-xs text-faint">Escaneado hace 2 s</p>
                </div>
              </div>
              <span className="rounded-full bg-brand-400/15 px-3 py-1 text-xs font-bold text-brand-300">
                Apto ✓
              </span>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              {[
                { k: '95', v: 'Kcal' },
                { k: '25g', v: 'Carbos' },
                { k: '0g', v: 'Grasa' },
              ].map((m) => (
                <div key={m.v} className="rounded-xl bg-surface2/60 py-3">
                  <p className="text-lg font-bold text-strong">{m.k}</p>
                  <p className="text-[11px] uppercase tracking-wide text-faint">{m.v}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-brand-400/20 bg-brand-400/5 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-brand-300">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" /></svg>
                Recomendado para tu perfil
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                Bajo índice glucémico. Seguro para tu condición de diabetes tipo 2.
              </p>
            </div>
          </div>

          <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-line bg-surface2 px-4 py-3 shadow-sm sm:block">
            <p className="text-xs text-faint">Analizado con</p>
            <p className="text-sm font-bold text-brand-300">IA Nutricional</p>
          </div>
        </div>
      </div>
    </section>
  )
}
