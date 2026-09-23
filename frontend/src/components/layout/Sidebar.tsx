import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Server,
  Building2,
  QrCode,
  ClipboardList,
  History,
  Users,
  LogOut,
} from 'lucide-react'
import { Avatar, LogoSM, cx } from '../ui'

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/equipos', label: 'Equipos', icon: Server },
  { to: '/empresas', label: 'Empresas', icon: Building2 },
  { to: '/escanear', label: 'Escanear QR', icon: QrCode },
  { to: '/revisiones/nueva', label: 'Nueva revisión', icon: ClipboardList },
  { to: '/historial', label: 'Historial', icon: History },
  { to: '/usuarios', label: 'Usuarios', icon: Users },
]

export function Sidebar({
  className,
  onNavigate,
}: {
  className?: string
  onNavigate?: () => void
}) {
  return (
    <aside className={cx('flex-col bg-ink-950 text-zinc-300', className)}>
      <div className="border-b border-white/10 px-5 py-5">
        <LogoSM />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {nav.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cx(
                'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-white/8 text-white'
                  : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-100',
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-brand-600" />
                )}
                <Icon className="size-5 shrink-0" />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <Avatar nombre="Valentina Marín" className="bg-brand-600" />
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-semibold text-white">Valentina Marín</p>
            <p className="truncate text-xs text-zinc-400">Administradora</p>
          </div>
          <button
            type="button"
            title="Cerrar sesión"
            className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
