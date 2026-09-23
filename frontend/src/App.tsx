import { Routes, Route, Navigate } from 'react-router-dom'
import { DataProvider } from './store/DataContext'
import { AppLayout } from './components/layout/AppLayout'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { EquiposPage } from './pages/EquiposPage'
import { EquipoNuevoPage } from './pages/EquipoNuevoPage'
import { EquipoDetallePage } from './pages/EquipoDetallePage'
import { EmpresasPage } from './pages/EmpresasPage'
import { EscanearPage } from './pages/EscanearPage'
import { RevisionFormPage } from './pages/RevisionFormPage'
import { HistorialPage } from './pages/HistorialPage'
import { UsuariosPage } from './pages/UsuariosPage'

export default function App() {
  return (
    <DataProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/equipos" element={<EquiposPage />} />
          <Route path="/equipos/nuevo" element={<EquipoNuevoPage />} />
          <Route path="/equipos/:id" element={<EquipoDetallePage />} />
          <Route path="/empresas" element={<EmpresasPage />} />
          <Route path="/escanear" element={<EscanearPage />} />
          <Route path="/revisiones/nueva" element={<RevisionFormPage />} />
          <Route path="/historial" element={<HistorialPage />} />
          <Route path="/usuarios" element={<UsuariosPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </DataProvider>
  )
}
