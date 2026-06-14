/*
 * Configuración del menú lateral. Cada item declara qué roles lo ven.
 * Roles posibles: 'ADMIN' | 'CLIENTE'.
 */

export interface MenuItem {
  label: string
  to: string
  icon: string
  roles: string[]
  soon?: boolean
}

export interface MenuSection {
  section: string
  items: MenuItem[]
}

// Iconos como paths de SVG (viewBox 0 0 24 24, stroke).
const icons: Record<string, string> = {
  perfil: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1',
  usuarios:
    'M17 20h5v-1a4 4 0 0 0-3-3.87M9 20H4v-1a4 4 0 0 1 3-3.87m6-1a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm6-4a3 3 0 1 0 0-6M5 11a3 3 0 1 0 0-6',
  roles: 'M12 2 4 5v6c0 5 3.4 9.3 8 11 4.6-1.7 8-6 8-11V5l-8-3Z',
  historial: 'M12 8v4l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  enfermedad: 'M9 3h6v3h3v6h-3v3H9v-3H6V9h3V6V3Z',
  escanear:
    'M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 12h10',
  catalogo: 'M4 6h16M4 12h16M4 18h16',
  scans: 'M3 3v18h18M7 14l3-3 3 3 5-6',
}

export const MENU: MenuSection[] = [
  {
    section: 'Acceso',
    items: [
      { label: 'Mi Perfil', to: '/app/perfil', icon: icons.perfil, roles: ['ADMIN', 'CLIENTE'] },
      { label: 'Usuarios', to: '/app/usuarios', icon: icons.usuarios, roles: ['ADMIN'] },
      { label: 'Roles y Permisos', to: '/app/roles', icon: icons.roles, roles: ['ADMIN'] },
    ],
  },
  {
    section: 'Clínico',
    items: [
      { label: 'Mi Historial Clínico', to: '/app/clinico/historial', icon: icons.historial, roles: ['CLIENTE'] },
      { label: 'Catálogo de Enfermedades', to: '/app/clinico/enfermedades', icon: icons.enfermedad, roles: ['ADMIN'] },
    ],
  },
  {
    section: 'Alimentario',
    items: [
      { label: 'Escanear Alimento', to: '/app/alimentario/escanear', icon: icons.escanear, roles: ['CLIENTE'], soon: true },
      { label: 'Mis Escaneos', to: '/app/alimentario/historial', icon: icons.scans, roles: ['CLIENTE'], soon: true },
      { label: 'Catálogo de Productos', to: '/app/alimentario/productos', icon: icons.catalogo, roles: ['ADMIN'], soon: true },
    ],
  },
]

/** Devuelve las secciones del menú visibles para el rol dado (sin secciones vacías). */
export function getMenuForRole(role: string | null): MenuSection[] {
  return MENU.map((section) => ({
    ...section,
    items: section.items.filter((item) => role !== null && item.roles.includes(role)),
  })).filter((section) => section.items.length > 0)
}
