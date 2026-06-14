const STEPS = [
  {
    n: '01',
    title: 'Escanea el alimento',
    text: 'Toma una foto o sube una imagen. Nuestro modelo de IA reconoce el alimento al instante.',
    icon: (
      <path d="M3 9a2 2 0 0 1 2-2h1l1.5-2h7L16 7h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Zm9 9a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
    ),
  },
  {
    n: '02',
    title: 'Analiza la nutrición',
    text: 'Extraemos calorías, macros y nutrientes, y los cruzamos con tu historial clínico.',
    icon: (
      <path d="M4 19V5m0 14h16M8 17v-5m4 5V8m4 9v-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    ),
  },
  {
    n: '03',
    title: 'Recibe tu veredicto',
    text: 'Te decimos si es apto, riesgoso o no apto, con recomendaciones claras para tu salud.',
    icon: (
      <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
]

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-400">Cómo funciona</p>
          <h2 className="mt-3 text-3xl font-bold text-strong sm:text-4xl">
            Del plato a la decisión en 3 pasos
          </h2>
          <p className="mt-4 text-muted">
            Sin tablas confusas ni cálculos manuales. NutriScan hace el trabajo pesado por ti.
          </p>
        </div>

        <div className="relative mt-16 grid gap-8 md:grid-cols-3">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="group relative rounded-2xl border border-line bg-surface2/60 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-brand-400/40"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-400/10 text-brand-300 transition-colors group-hover:bg-brand-400 group-hover:text-ink-900">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">{s.icon}</svg>
                </span>
                <span className="text-4xl font-black text-strong/5">{s.n}</span>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-strong">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
