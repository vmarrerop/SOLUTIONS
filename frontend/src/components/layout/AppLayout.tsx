import { useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { BottomNav } from './BottomNav'
import { getRol } from '../../utils/auth'

export function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  if (getRol() !== 'admin') return <Navigate to="/login" replace />

  return (
    <div className="min-h-dvh bg-zinc-100">
      {/* Sidebar fija en desktop */}
      <Sidebar className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:flex" />

      {/* Drawer móvil */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <Sidebar
            className="absolute inset-y-0 left-0 flex w-72 shadow-2xl"
            onNavigate={() => setDrawerOpen(false)}
          />
        </div>
      )}

      <div className="flex min-h-dvh flex-col lg:pl-64">
        <Topbar onOpenMenu={() => setDrawerOpen(true)} />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 pt-5 pb-24 sm:px-6 lg:pb-10">
          <Outlet />
        </main>
      </div>

      <BottomNav />
    </div>
  )
}
