# NutriScan · Frontend

Interfaz web del sistema **NutriScan**: landing pública, autenticación y panel con sidebar
dinámico por rol (módulos Acceso, Clínico y Alimentario).

Construido con **React 19 + TypeScript + Vite** y **Tailwind CSS 4**. Incluye modo claro/oscuro.

---

## ✅ Requisitos previos

- **Node.js 20+** (incluye npm)
- El **backend** de NutriScan corriendo (por defecto en `http://localhost:8080`)

---

## 🚀 Puesta en marcha

```bash
# 1. Clonar
git clone <URL_DEL_REPO_FRONTEND>
cd frontend-nutriScan

# 2. (Opcional) Configurar la URL del backend
cp .env.example .env          # Windows PowerShell: Copy-Item .env.example .env

# 3. Instalar dependencias
npm install

# 4. Ejecutar en desarrollo
npm run dev
```

Vite mostrará la URL local (normalmente **http://localhost:5173**).

### Otros scripts
```bash
npm run build       # Chequeo de tipos (tsc) + build de producción
npm run preview     # Previsualiza la build de producción
npm run typecheck   # Solo verificación de tipos
npm run lint        # Linter
```

---

## 🔑 Variables de entorno

| Variable | Descripción | Por defecto |
|---|---|---|
| `VITE_API_URL` | URL base de la API del backend | `http://localhost:8080/api` |

Ver [`.env.example`](.env.example).

---

## 📦 Dependencias principales

**Producción:** `react`, `react-dom`, `react-router-dom`, `axios`
**Desarrollo:** `vite`, `@vitejs/plugin-react`, `typescript`, `@types/react`,
`@types/react-dom`, `tailwindcss`, `@tailwindcss/vite`, `eslint` (+ plugins)

---

## 🗂️ Estructura (por módulos)

```
src/
├── core/                 # Compartido: api, componentes UI, layout, tema, landing
│   ├── api/ components/ pages/LandingPage/ theme/ utils/
└── modules/
    ├── acceso/           # Auth, usuarios, roles, permisos, perfil
    │   ├── components/ context/ hooks/ models/ pages/ service/
    ├── clinico/          # Enfermedades e historial clínico
    └── alimentario/      # (pendiente)
```

> Alias de importación: `@/` apunta a `src/` (configurado en `vite.config.ts` y `tsconfig.json`).

---

## 🔐 Acceso de prueba

Con el backend recién iniciado existe un administrador por defecto:
- **Correo:** `admin@nutriscan.com`
- **Contraseña:** `Admin1234`

También puedes registrarte como **cliente** desde la pantalla de registro.
