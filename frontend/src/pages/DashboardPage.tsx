import { Link } from 'react-router-dom'
import {
  Server,
  ClipboardCheck,
  Clock,
  AlertTriangle,
  ArrowRight,
  QrCode,
  Plus,
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  Card,
  PageHeader,
  StatCard,
  Button,
  EstadoRevisionBadge,
  TipoServicioBadge,
} from '../components/ui'
import { revisiones, revisionesPorMes, getEquipo, formatFecha } from '../data/mock'
import { useData } from '../store/DataContext'

export function DashboardPage() {
  const { equipos } = useData()

  const estadoEquipos = [
    {
      name: 'Operativos',
      value: equipos.filter((e) => e.estado === 'operativo').length,
      color: '#10b981',
    },
    {
      name: 'En mantenimiento',
      value: equipos.filter((e) => e.estado === 'mantenimiento').length,
      color: '#f59e0b',
    },
    {
      name: 'Fuera de servicio',
      value: equipos.filter((e) => e.estado === 'fuera_servicio').length,
      color: '#d21f30',
    },
  ]

  const proximas = [...equipos]
    .sort((a, b) => a.proximaRevision.localeCompare(b.proximaRevision))
    .slice(0, 4)
  const recientes = revisiones.slice(0, 5)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Resumen operativo · miércoles, 23 de septiembre de 2026"
        actions={
          <>
            <Link to="/escanear">
              <Button variant="secondary">
                <QrCode className="size-4" />
                Escanear
              </Button>
            </Link>
            <Link to="/revisiones/nueva">
              <Button>
                <Plus className="size-4" />
                Nueva revisión
              </Button>
            </Link>
          </>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          icon={<Server className="size-5" />}
          label="Equipos registrados"
          value={String(equipos.length)}
          hint="3 sedes activas"
          tone="neutral"
        />
        <StatCard
          icon={<ClipboardCheck className="size-5" />}
          label="Revisiones en sep."
          value="8"
          hint="+2 vs. agosto"
          tone="ok"
        />
        <StatCard
          icon={<Clock className="size-5" />}
          label="En proceso"
          value="2"
          hint="Correctivos abiertos"
          tone="warn"
        />
        <StatCard
          icon={<AlertTriangle className="size-5" />}
          label="Fuera de servicio"
          value="1"
          hint="SRV-003 · RAID"
          tone="brand"
        />
      </div>

      {/* Gráficas */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-4 sm:p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-zinc-900">
                Servicios por mes · 2026
              </h2>
              <p className="text-xs text-zinc-500">Preventivos vs. correctivos</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm bg-ink-800" /> Preventivos
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm bg-brand-600" /> Correctivos
              </span>
            </div>
          </div>
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revisionesPorMes} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                <XAxis
                  dataKey="mes"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#71717a' }}
                />
                <YAxis
                  width={28}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#71717a' }}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #e4e4e7',
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="preventivos" name="Preventivos" fill="#1c1c22" radius={[4, 4, 0, 0]} />
                <Bar dataKey="correctivos" name="Correctivos" fill="#d21f30" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 sm:p-5">
          <h2 className="text-sm font-bold text-zinc-900">Estado de equipos</h2>
          <p className="text-xs text-zinc-500">Distribución actual del parque</p>
          <div className="mx-auto h-44 max-w-55">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={estadoEquipos}
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {estadoEquipos.map((s) => (
                    <Cell key={s.name} fill={s.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #e4e4e7',
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="space-y-2">
            {estadoEquipos.map((s) => (
              <li key={s.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-zinc-600">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                  {s.name}
                </span>
                <span className="font-bold tabular-nums text-zinc-900">{s.value}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Listas */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-900">Actividad reciente</h2>
            <Link
              to="/historial"
              className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              Ver historial <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <ul className="divide-y divide-zinc-100">
            {recientes.map((r) => {
              const eq = getEquipo(r.equipoId)
              return (
                <li key={r.id} className="flex items-center gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-zinc-900">
                      {eq?.nombre}
                    </p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-500">
                      <span className="font-mono font-semibold text-zinc-700">
                        {r.consecutivo}
                      </span>
                      · {r.tecnico} · {formatFecha(r.fecha)}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <TipoServicioBadge tipo={r.tipo} />
                    <EstadoRevisionBadge estado={r.estado} />
                  </div>
                </li>
              )
            })}
          </ul>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-900">Próximos mantenimientos</h2>
            <Link
              to="/equipos"
              className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              Ver equipos <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <ul className="divide-y divide-zinc-100">
            {proximas.map((eq) => (
              <li key={eq.id}>
                <Link
                  to={`/equipos/${eq.id}`}
                  className="-mx-2 flex items-center gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-zinc-50"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600">
                    <Server className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-zinc-900">
                      {eq.nombre}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {eq.codigo} · {eq.ubicacion}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs text-zinc-500">Programado</p>
                    <p className="text-sm font-bold text-zinc-900">
                      {formatFecha(eq.proximaRevision)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
