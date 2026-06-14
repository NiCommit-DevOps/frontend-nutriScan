interface LogoProps {
  withText?: boolean
  className?: string
}

/** Logotipo NutriScan: hoja + texto. */
export default function Logo({ withText = true, className = '' }: LogoProps) {
  return (
    <a href="#inicio" className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-400 text-ink-900 shadow-sm">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 21c6-1 9-5 9-12 0-1.1-.1-2.2-.4-3.2C16 5 9 6 6.5 11 5 14 5.5 18 6 19.5 7.5 16 10 13.5 14 12c-3 2.5-5 5-6 9Z"
            fill="currentColor"
          />
        </svg>
      </span>
      {withText && (
        <span className="text-lg font-bold tracking-tight text-strong">
          Nutri<span className="text-brand-400">Scan</span>
        </span>
      )}
    </a>
  )
}
