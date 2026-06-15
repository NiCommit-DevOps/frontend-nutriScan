import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from '@/core/theme/ThemeContext'
import { AuthProvider } from '@/modules/acceso/context/AuthContext'
import ProtectedRoute from '@/modules/acceso/components/common/ProtectedRoute'
import MainLayout from '@/core/components/layout/MainLayout'

import LandingPage from '@/core/pages/LandingPage'
import LoginPage from '@/modules/acceso/pages/LoginPage'
import RegisterPage from '@/modules/acceso/pages/RegisterPage'
import PerfilPage from '@/modules/acceso/pages/PerfilPage'
import UsuariosPage from '@/modules/acceso/pages/UsuariosPage'
import RolesPage from '@/modules/acceso/pages/RolesPage'

import EnfermedadesPage from '@/modules/clinico/pages/EnfermedadesPage'
import HistorialClinicoPage from '@/modules/clinico/pages/HistorialClinicoPage'

import EscanearPage from '@/modules/alimentario/pages/EscanearPage'
import MisEscaneosPage from '@/modules/alimentario/pages/MisEscaneosPage'
import ProductosPage from '@/modules/alimentario/pages/ProductosPage'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
      <AuthProvider>
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Privadas: requieren sesión */}
          <Route element={<ProtectedRoute />}>
            <Route path="/app" element={<MainLayout />}>
              <Route index element={<Navigate to="/app/perfil" replace />} />

              {/* Módulo Acceso */}
              <Route path="perfil" element={<PerfilPage />} />

              {/* Módulo Clínico — Cliente */}
              <Route path="clinico/historial" element={<HistorialClinicoPage />} />

              {/* Módulo Alimentario — Cliente (en desarrollo) */}
              <Route path="alimentario/escanear" element={<EscanearPage />} />
              <Route path="alimentario/historial" element={<MisEscaneosPage />} />

              {/* Solo ADMIN */}
              <Route element={<ProtectedRoute roles={['ADMIN']} />}>
                <Route path="usuarios" element={<UsuariosPage />} />
                <Route path="roles" element={<RolesPage />} />
                <Route path="clinico/enfermedades" element={<EnfermedadesPage />} />
                <Route path="alimentario/productos" element={<ProductosPage />} />
              </Route>
            </Route>
          </Route>

          {/* Cualquier otra ruta vuelve al inicio */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
