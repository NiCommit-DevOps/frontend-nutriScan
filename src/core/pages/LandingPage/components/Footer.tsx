import Logo from '@/core/components/ui/Logo'

const COLS = [
  {
    title: 'Producto',
    links: [
      { label: 'Cómo funciona', href: '#como-funciona' },
      { label: 'Beneficios', href: '#beneficios' },
      { label: 'Para quién', href: '#para-quien' },
    ],
  },
  {
    title: 'Cuenta',
    links: [
      { label: 'Iniciar sesión', href: '/login' },
      { label: 'Registrarse', href: '/register' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacidad', href: '#' },
      { label: 'Términos', href: '#' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-line bg-app">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-faint">
              Nutrición inteligente con IA. Escanea, analiza y decide qué comer según tu salud.
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-strong">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-sm text-faint transition-colors hover:text-brand-300">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 sm:flex-row">
          <p className="text-xs text-faint">
            © {new Date().getFullYear()} NutriScan. Todos los derechos reservados.
          </p>
          <p className="text-xs text-faint">Hecho con 💚 para tu salud</p>
        </div>
      </div>
    </footer>
  )
}
