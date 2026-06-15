# Arquitectura del Frontend · NutriScan

Guía para desarrollar un módulo nuevo (ej. **Alimentario**) siguiendo el mismo patrón
que los módulos **Acceso** y **Clínico**.

Stack: **React 19 + TypeScript + Vite + Tailwind CSS 4 + React Router + Axios**.

---

## 1. Organización: `core` + `modules`

```
src/
├── core/                      # COMPARTIDO por toda la app
│   ├── api/api.ts             # Cliente Axios (token + interceptores)
│   ├── components/
│   │   ├── ui/                # Botones, Inputs, Modal, Badge, Alert... (reutilizables)
│   │   ├── layout/            # MainLayout, Sidebar, menuConfig
│   │   └── ModulePlaceholder.tsx
│   ├── pages/LandingPage/     # Página pública
│   ├── theme/                 # ThemeContext + ThemeToggle (modo claro/oscuro)
│   └── utils/                 # getErrorMessage, helpers
│
├── modules/                   # Una carpeta por dominio
│   ├── acceso/                # auth, usuarios, roles, permisos, perfil
│   ├── clinico/               # enfermedades, historial clínico
│   └── alimentario/           # <-- el que vas a crear
│       ├── components/        # Componentes propios del módulo
│       ├── context/           # (si necesita estado global propio)
│       ├── hooks/             # use* (estado + acciones)
│       ├── models/            # Interfaces TypeScript + enums
│       ├── pages/             # Pantallas (cada una: NombrePage/index.tsx)
│       └── service/           # Llamadas a la API (axios)
│
├── App.tsx                    # Rutas (React Router) + providers
└── main.tsx                   # Punto de entrada
```

> **Alias `@`** → apunta a `src/`. Importa siempre con `@/...`
> (ej. `import Button from '@/core/components/ui/Button'`). Configurado en
> `vite.config.ts` y `tsconfig.json`.

> Flujo de datos: **Page → Hook → Service → (Axios) → Backend**.
> Los **Models** (interfaces) tipan todo el camino.

---

## 2. Responsabilidad de cada capa

### 🧩 Models — "Las formas de los datos (tipos)"
Interfaces TypeScript que describen lo que devuelve/recibe la API, más enums/constantes
del dominio. Es el equivalente a los DTOs del backend, en el front.

- Se agrupan por archivo: `producto.model.ts`, etc., y se reexportan en `index.ts` (barrel).
- Convención: `Xxx` (lo que llega), `CreateXxxData` / `UpdateXxxData` (lo que se envía).

```ts
// modules/clinico/models/enfermedad.model.ts
export const NIVELES_RIESGO = ['Bajo', 'Medio', 'Alto'] as const
export type NivelRiesgo = (typeof NIVELES_RIESGO)[number]

export interface Enfermedad {
  idEnfermedad: number
  nombre: string
  descripcion?: string
  nivelRiesgo: NivelRiesgo
}

export interface EnfermedadData {       // para crear/editar
  nombre: string
  descripcion?: string | null
  nivelRiesgo: string
}
```

### 🌐 Service — "Las llamadas HTTP a la API"
Objeto con funciones que llaman al backend usando el cliente `api` (Axios). Sin estado,
sin React. Devuelve datos ya tipados con los Models.

```ts
// modules/clinico/service/enfermedades.service.ts
import api from '@/core/api/api'
import type { Enfermedad, EnfermedadData } from '@/modules/clinico/models'

export const enfermedadesService = {
  async listar(): Promise<Enfermedad[]> {
    const { data } = await api.get<Enfermedad[]>('/enfermedades')
    return data
  },
  async crear(payload: EnfermedadData): Promise<Enfermedad> {
    const { data } = await api.post<Enfermedad>('/enfermedades', payload)
    return data
  },
  async eliminar(id: number): Promise<void> {
    await api.delete(`/enfermedades/${id}`)
  },
}
```

> El cliente `@/core/api/api.ts` ya añade el **token JWT** a cada petición, **refresca**
> el token ante un 401 y maneja el `Content-Type` para subir archivos (`FormData`).
> La URL base sale de `VITE_API_URL` (por defecto `http://localhost:8080/api`).

### 🪝 Hook — "Estado + acciones para la UI"
Custom hook (`useXxx`) que envuelve al service y expone a la pantalla el estado típico:
`data`, `loading`, `error`, y acciones (`recargar`, `crear`, `eliminar`...). Aquí vive el
`useState`/`useEffect`; es el puente entre el service (sin React) y la página.

```ts
// modules/clinico/hooks/useEnfermedades.ts
export function useEnfermedades() {
  const [enfermedades, setEnfermedades] = useState<Enfermedad[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const recargar = useCallback(async () => {
    setLoading(true); setError('')
    try { setEnfermedades(await enfermedadesService.listar()) }
    catch (e) { setError(getErrorMessage(e, 'No se pudo cargar')) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { recargar() }, [recargar])

  return { enfermedades, loading, error, recargar, eliminar: enfermedadesService.eliminar }
}
```

### 🗂️ Context — "Estado global (solo si hace falta)"
Para estado que comparten muchas pantallas. Ejemplos ya hechos:
- `modules/acceso/context/AuthContext.tsx` → usuario logueado, login/logout, rol.
- `core/theme/ThemeContext.tsx` → modo claro/oscuro.

La mayoría de módulos **no** necesitan context propio (basta con hooks). Úsalo solo si de
verdad compartes estado entre varias páginas del módulo.

### 🎨 Components — "Piezas de UI reutilizables"
- **`core/components/ui`**: genéricos (Button, Input, Select, Modal, Badge, Alert). Reúsalos
  siempre, no reinventes estilos.
- **`modules/<modulo>/components`** o **`pages/<Page>/components`**: piezas específicas
  (un modal de formulario, una tarjeta). Si solo la usa una página, va en
  `pages/<Page>/components/`.

> Estilos: Tailwind con **tokens semánticos** que cambian con el tema:
> `bg-app`, `bg-surface`, `bg-surface2`, `text-strong`, `text-content`, `text-muted`,
> `text-faint`, `border-line`, y el color de marca `brand-*` (verde lechuga).
> No uses colores fijos como `bg-white`/`text-gray-400`: rompen el modo oscuro.

### 📄 Pages — "Las pantallas"
Componente de pantalla. **Orquesta**: usa el hook para los datos, los componentes UI para
pintar, y maneja el estado de la vista (filtros, modales abiertos). Cada página es una
carpeta `NombrePage/index.tsx` (+ `components/` si tiene piezas propias).

```tsx
// modules/clinico/pages/EnfermedadesPage/index.tsx
export default function EnfermedadesPage() {
  const { enfermedades, loading, error, recargar, eliminar } = useEnfermedades()
  // ...filtros, modal, render de la tabla con <Button>, <Badge>, etc.
}
```

### 🔀 Routing — `App.tsx`
Define las rutas con React Router. Las privadas van dentro de `<ProtectedRoute>` (exige
sesión) y, si son solo de admin, dentro de `<ProtectedRoute roles={['ADMIN']}>`.

```tsx
<Route path="alimentario/escanear" element={<EscanearPage />} />
<Route element={<ProtectedRoute roles={['ADMIN']} />}>
  <Route path="alimentario/productos" element={<ProductosPage />} />
</Route>
```

### 🧭 Menú lateral — `core/components/layout/menuConfig.ts`
El sidebar se arma desde una lista. Cada ítem declara qué **roles** lo ven; los ítems sin
backend aún llevan `soon: true` (etiqueta "Pronto").

```ts
{ label: 'Escanear Alimento', to: '/app/alimentario/escanear', icon: icons.escanear, roles: ['CLIENTE'] }
```

---

## 3. Cómo encaja todo (flujo de una pantalla)

```
[Page]  usa el hook ──► [Hook]  useState(data/loading/error)
                              │ llama
                              ▼
                        [Service]  api.get('/productos')
                              │ (Axios añade token JWT)
                              ▼
                          Backend  →  JSON
                              ▲
                        [Models]  tipan la respuesta (Producto[])
[Page]  pinta con <Button>, <Badge>, <Modal>... (components/ui)
```

---

## 4. Cosas transversales que ya existen (reutilízalas)

- **`@/core/api/api.ts`**: cliente Axios listo (token, refresh, base URL). Úsalo en todos los services.
- **`@/core/utils/getErrorMessage`**: saca un mensaje legible del error del backend
  (lee `message` / `validationErrors`). Úsalo en los `catch`.
- **UI**: `Button, Input, Select, Modal, Badge, Alert, Logo` en `@/core/components/ui`.
- **`ModulePlaceholder`**: pantalla "en construcción" (lo usan las páginas del Alimentario hoy).
- **Auth**: `useAuth()` (de `@/modules/acceso/context/AuthContext`) da `user`, `role`,
  `isAdmin`, `isCliente`.
- **Tema**: `useTheme()` y `<ThemeToggle />`. Respeta los tokens de color semánticos.

---

## 5. Receta para el frontend del módulo Alimentario (paso a paso)

Supongamos un recurso **Producto**. Para CADA recurso/pantalla:

1. **Model** → `modules/alimentario/models/producto.model.ts` (interfaces `Producto`,
   `ProductoData`) + reexportar en `models/index.ts`.
2. **Service** → `modules/alimentario/service/productos.service.ts` (llamadas a
   `/api/productos` con `api`).
3. **Hook** → `modules/alimentario/hooks/useProductos.ts` (`data/loading/error` + acciones).
4. **Page** → `modules/alimentario/pages/ProductosPage/index.tsx` (usa el hook + UI).
   Si tiene formulario/modal: `ProductosPage/components/ProductoFormModal.tsx`.
5. **Ruta** → en `App.tsx`, reemplaza el placeholder por tu página real.
6. **Menú** → en `menuConfig.ts`, quita `soon: true` del ítem cuando ya funcione.

Orden recomendado: **Model → Service → Hook → Page → Ruta/Menú**.
Verifica con `npm run build` (corre `tsc` + build) o `npm run typecheck`.

### Checklist por recurso
- [ ] Model con las interfaces (lo que llega y lo que se envía).
- [ ] Service con las funciones (`listar`, `crear`, `actualizar`, `eliminar`...).
- [ ] Hook con estado (`data/loading/error`) + acciones.
- [ ] Page que consume el hook y usa componentes de `@/core/components/ui`.
- [ ] Estilos con tokens semánticos (`bg-surface`, `text-strong`, `border-line`...).
- [ ] Ruta en `App.tsx` (dentro de `ProtectedRoute`, con `roles` si es de admin).
- [ ] Ítem en `menuConfig.ts` sin `soon` y con los `roles` correctos.

> Tip: copia un módulo ya hecho (**Clínico → EnfermedadesPage** para un CRUD de admin,
> o **HistorialClinicoPage** para una vista de cliente) y renómbralo. Es lo más rápido.
