import { NavLink } from 'react-router-dom'
import { Server, QrCode, History, Building2 } from 'lucide-react'
import { cx } from '../ui'

const items = [
  { to: '/equipos', label: 'Equipos', icon: Server },
  { to: '/empresas', label: 'Empresas', icon: Building2 },
  { to: '/escanear', label: 'Escanear', icon: QrCode, primary: true },
  { to: '/historial', label: 'Historial', icon: History },
]

export function BottomNav() {
  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white/95 backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4">
        {items.map(({ to, label, icon: Icon, primary }) =>
          primary ? (
            <NavLink
              key={to}
              to={to}
              className="relative -mt-5 flex flex-col items-center gap-1 pb-2"
            >
              <span className="flex size-13 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg shadow-brand-600/40 ring-4 ring-zinc-100">
                <Icon className="size-6" />
              </span>
              <span className="text-[10px] font-semibold text-zinc-600">{label}</span>
            </NavLink>
          ) : (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cx(
                  'flex flex-col items-center gap-1 pt-2.5 pb-2 text-[10px] font-medium transition-colors',
                  isActive ? 'text-brand-600' : 'text-zinc-500 hover:text-zinc-800',
                )
              }
            >
              <Icon className="size-5" />
              {label}
            </NavLink>
          ),
        )}
      </div>
    </nav>
  )
}
