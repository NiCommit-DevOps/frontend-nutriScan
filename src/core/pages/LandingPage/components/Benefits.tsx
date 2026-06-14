const FEATURES = [
  {
    title: 'Reconocimiento con IA',
    text: 'Identifica miles de alimentos a partir de una imagen con alta precisión.',
    icon: 'M12 2a7 7 0 0 1 7 7c0 2.4-1.2 4-2.5 5.3-.8.8-1.5 1.6-1.5 2.7v1H9v-1c0-1.1-.7-1.9-1.5-2.7C6.2 13 5 11.4 5 9a7 7 0 0 1 7-7Zm-3 18h6v1a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-1Z',
  },
  {
    title: 'Cruce con historial clínico',
    text: 'Considera diabetes, hipertensión y otras condiciones para un veredicto personalizado.',
    icon: 'M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9Z',
  },
  {
    title: 'Semáforo nutricional',
    text: 'Resultados claros: apto, riesgoso o no apto, sin necesidad de interpretar tablas.',
    icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm0 4.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z',
  },
  {
    title: 'Información al instante',
    text: 'Calorías, macros y nutrientes calculados en segundos por cada escaneo.',
    icon: 'M13 2 4 14h6l-1 8 9-12h-6l1-8Z',
  },
  {
    title: 'Historial de consumo',
    text: 'Lleva un registro de lo que comes y observa tu progreso a lo largo del tiempo.',
    icon: 'M3 3v18h18M7 14l3-3 3 3 5-6',
  },
  {
    title: 'Privacidad y seguridad',
    text: 'Tus datos clínicos están protegidos con autenticación y cifrado.',
    icon: 'M12 2 4 5v6c0 5 3.4 9.3 8 11 4.6-1.7 8-6 8-11V5l-8-3Zm0 6a2 2 0 0 1 2 2c0 .7-.4 1.4-1 1.7V14h-2v-2.3c-.6-.3-1-1-1-1.7a2 2 0 0 1 2-2Z',
  },
]

export default function Benefits() {
  return (
    <section id="beneficios" className="bg-surface py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-400">Beneficios</p>
          <h2 className="mt-3 text-3xl font-bold text-strong sm:text-4xl">
            Tecnología que entiende tu salud
          </h2>
          <p className="mt-4 text-muted">
            Diseñado para que comer sano sea una decisión simple, informada y segura.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <article
              key={f.title}
              className="rounded-2xl border border-line bg-surface2/50 p-7 transition-colors hover:border-brand-400/40"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-400/10 text-brand-300">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d={f.icon} />
                </svg>
              </span>
              <h3 className="mt-5 text-lg font-semibold text-strong">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
