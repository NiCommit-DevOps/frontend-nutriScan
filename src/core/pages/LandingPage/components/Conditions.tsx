const CONDITIONS = [
  { name: 'Diabetes', desc: 'Controla el índice glucémico y los azúcares de cada alimento.' },
  { name: 'Hipertensión', desc: 'Vigila el sodio y evita alimentos que eleven tu presión arterial.' },
  { name: 'Colesterol alto', desc: 'Identifica grasas saturadas y opciones más saludables para tu corazón.' },
  { name: 'Control de peso', desc: 'Sigue tus calorías y macros para alcanzar tus objetivos.' },
]

export default function Conditions() {
  return (
    <section id="para-quien" className="py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-400">Para quién</p>
          <h2 className="mt-3 text-3xl font-bold text-strong sm:text-4xl">
            Pensado para quienes cuidan su condición médica
          </h2>
          <p className="mt-4 max-w-lg text-muted">
            NutriScan no da recomendaciones genéricas: adapta cada análisis a tu perfil
            de salud para que cada decisión alimentaria sea segura.
          </p>

          <ul className="mt-8 space-y-4">
            {CONDITIONS.map((c) => (
              <li key={c.name} className="flex gap-4">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-400/15 text-brand-300">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" /></svg>
                </span>
                <div>
                  <p className="font-semibold text-strong">{c.name}</p>
                  <p className="text-sm text-muted">{c.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="rounded-3xl border border-line bg-surface p-7 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-amber-400/15 text-amber-300">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /></svg>
                </span>
                <div>
                  <p className="text-sm font-semibold text-strong">Refresco azucarado</p>
                  <p className="text-xs text-faint">39 g de azúcar</p>
                </div>
              </div>
              <span className="rounded-full bg-amber-400/15 px-3 py-1 text-xs font-bold text-amber-300">
                Riesgoso ⚠
              </span>
            </div>

            <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-surface2">
              <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-amber-400 to-red-500" />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              <span className="font-semibold text-amber-300">Alerta:</span> el alto contenido
              de azúcar puede elevar tu glucosa. Te sugerimos agua o una bebida sin azúcar.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
