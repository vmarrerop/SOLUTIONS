import { Navigate, useNavigate } from 'react-router-dom'
import { Camera, FileText, History, LogOut, MapPin, Server } from 'lucide-react'
import {
  Card,
  EstadoEquipoBadge,
  EstadoRevisionBadge,
  StatCard,
  TipoServicioBadge,
  cx,
} from '../../components/ui'
import { useData } from '../../store/DataContext'
import { formatFecha, getEquipo, revisiones } from '../../data/mock'
import { CLIENTE_EMPRESA_ID, cerrarSesion, getRol } from '../../utils/auth'

export function ClientePortalPage() {
  const navigate = useNavigate()
  const { equipos, empresas } = useData()

  if (getRol() !== 'cliente') return <Navigate to="/login" replace />

  const empresa = empresas.find((e) => e.id === CLIENTE_EMPRESA_ID)
  const misEquipos = equipos.filter((e) => e.empresaId === CLIENTE_EMPRESA_ID)
  const misRevisiones = revisiones
    .filter((r) => misEquipos.some((e) => e.id === r.equipoId))
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
  const operativos = misEquipos.filter((e) => e.estado === 'operativo').length

  const salir = () => {
    cerrarSesion()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-dvh bg-zinc-100">
      {/* Encabezado */}
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <img
              src="/icon.png"
              alt="Solutions Machine"
              className="size-9 shrink-0 object-contain"
            />
            <div className="leading-tight">
              <p className="text-sm font-bold text-zinc-900">Solutions Machine</p>
              <p className="text-[10px] font-semibold tracking-wide text-brand-600 uppercase">
                Portal del cliente
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={salir}
            className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800"
          >
            <LogOut className="size-4" />
            <span className="hidden sm:inline">Cerrar sesión</span>
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl space-y-5 px-4 pt-5 pb-10 sm:px-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl">
            {empresa?.nombre}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Inventario de sus equipos y trazabilidad completa de los servicios realizados.
          </p>
        </div>

        {/* Resumen */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon={<Server className="size-5" />}
            label="Equipos"
            value={String(misEquipos.length)}
            tone="neutral"
          />
          <StatCard
            icon={<FileText className="size-5" />}
            label="Revisiones"
            value={String(misRevisiones.length)}
            tone="brand"
          />
          <StatCard
            icon={<History className="size-5" />}
            label="Operativos"
            value={`${operativos}/${misEquipos.length}`}
            tone={operativos === misEquipos.length ? 'ok' : 'warn'}
          />
        </div>

        {/* Inventario */}
        <Card className="overflow-hidden">
          <div className="flex items-center gap-2 border-b border-zinc-100 px-4 py-3.5 sm:px-5">
            <Server className="size-4 text-zinc-500" />
            <h2 className="text-sm font-bold text-zinc-900">Mi inventario</h2>
          </div>
          <div className="divide-y divide-zinc-100">
            {misEquipos.map((eq) => (
              <div
                key={eq.id}
                className="flex flex-col gap-2 px-4 py-3.5 sm:flex-row sm:items-center sm:gap-3 sm:px-5"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-zinc-900">
                    <span className="mr-2 font-mono text-xs font-semibold text-zinc-500">
                      {eq.codigo}
                    </span>
                    {eq.nombre}
                  </span>
                  <span className="mt-0.5 flex items-center gap-1 text-xs text-zinc-500">
                    <MapPin className="size-3" />
                    {eq.ubicacion}
                    <span className="hidden sm:inline">
                      · Última revisión: {formatFecha(eq.ultimaRevision)}
                    </span>
                  </span>
                </span>
                <span className="shrink-0">
                  <EstadoEquipoBadge estado={eq.estado} />
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Historial */}
        <Card className="overflow-hidden">
          <div className="flex items-center gap-2 border-b border-zinc-100 px-4 py-3.5 sm:px-5">
            <History className="size-4 text-zinc-500" />
            <h2 className="text-sm font-bold text-zinc-900">Historial de revisiones</h2>
          </div>
          <div className="divide-y divide-zinc-100">
            {misRevisiones.map((r) => {
              const eq = getEquipo(r.equipoId)
              return (
                <div key={r.id} className="px-4 py-3.5 sm:px-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-zinc-900">
                      {r.consecutivo}
                    </span>
                    <span className="text-xs text-zinc-500">{formatFecha(r.fecha)}</span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-zinc-800">{eq?.nombre}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-zinc-500">
                    {r.observaciones}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <TipoServicioBadge tipo={r.tipo} />
                    <EstadoRevisionBadge estado={r.estado} />
                    <span className="text-xs text-zinc-500">{r.tecnico}</span>
                    <span className="flex items-center gap-1 text-xs text-zinc-500">
                      <Camera className="size-3.5" />
                      {r.fotosAntes + r.fotosDespues}
                    </span>
                    {r.estado === 'completado' && (
                      <button
                        type="button"
                        className={cx(
                          'ml-auto flex items-center gap-1.5 rounded-lg px-2.5 py-1.5',
                          'text-xs font-semibold text-brand-600 transition-colors hover:bg-brand-50',
                        )}
                      >
                        <FileText className="size-3.5" />
                        PDF
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
            {misRevisiones.length === 0 && (
              <p className="px-5 py-8 text-center text-sm text-zinc-500">
                Aún no hay revisiones registradas para sus equipos.
              </p>
            )}
          </div>
        </Card>
      </main>
    </div>
  )
}
