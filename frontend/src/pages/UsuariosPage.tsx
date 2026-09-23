import { UserPlus, MoreVertical, ShieldCheck } from 'lucide-react'
import {
  Avatar,
  Button,
  Card,
  PageHeader,
  RolBadge,
  cx,
} from '../components/ui'
import { formatFecha, usuarios } from '../data/mock'

const permisos = [
  { rol: 'Administrador', detalle: 'Acceso total: equipos, usuarios, reportes y configuración.' },
  { rol: 'Supervisor', detalle: 'Gestiona equipos y revisiones. Aprueba y consulta reportes.' },
  { rol: 'Técnico', detalle: 'Escanea QR, diligencia formularios y carga fotografías.' },
  { rol: 'Consulta', detalle: 'Solo lectura del historial y descarga de PDFs.' },
]

export function UsuariosPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Usuarios y permisos"
        subtitle="Control de acceso al portal según el rol de cada colaborador"
        actions={
          <Button>
            <UserPlus className="size-4" />
            Invitar usuario
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Lista de usuarios */}
        <Card className="overflow-hidden lg:col-span-2">
          <ul className="divide-y divide-zinc-100">
            {usuarios.map((u) => (
              <li key={u.id} className="flex items-center gap-3 px-4 py-3.5 sm:px-5">
                <Avatar
                  nombre={u.nombre}
                  className={cx(u.rol === 'admin' && 'bg-brand-600')}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold text-zinc-900">
                      {u.nombre}
                    </p>
                    <RolBadge rol={u.rol} />
                  </div>
                  <p className="mt-0.5 truncate text-xs text-zinc-500">{u.email}</p>
                </div>
                <div className="hidden shrink-0 text-right sm:block">
                  <p className="text-xs text-zinc-500">Último acceso</p>
                  <p className="text-sm font-semibold text-zinc-900">
                    {formatFecha(u.ultimoAcceso)}
                  </p>
                </div>
                <span
                  className={cx(
                    'shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold',
                    u.estado === 'activo'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-zinc-100 text-zinc-500',
                  )}
                >
                  {u.estado === 'activo' ? 'Activo' : 'Inactivo'}
                </span>
                <button
                  type="button"
                  className="shrink-0 rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
                  title="Opciones"
                >
                  <MoreVertical className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        </Card>

        {/* Matriz de roles */}
        <Card className="p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-brand-600" />
            <h2 className="text-sm font-bold text-zinc-900">Roles del sistema</h2>
          </div>
          <ul className="mt-4 space-y-4">
            {permisos.map((p) => (
              <li key={p.rol} className="rounded-xl bg-zinc-50 p-3.5">
                <p className="text-sm font-bold text-zinc-900">{p.rol}</p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">{p.detalle}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
