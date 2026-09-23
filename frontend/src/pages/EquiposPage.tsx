import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Server, Plus, MapPin, ChevronRight, QrCode, Building2 } from 'lucide-react'
import {
  Button,
  Card,
  EstadoEquipoBadge,
  PageHeader,
  SearchInput,
  cx,
} from '../components/ui'
import { useData } from '../store/DataContext'
import { formatFecha } from '../data/mock'
import type { EstadoEquipo } from '../types'

const filtros: Array<{ id: EstadoEquipo | 'todos'; label: string }> = [
  { id: 'todos', label: 'Todos' },
  { id: 'operativo', label: 'Operativos' },
  { id: 'mantenimiento', label: 'En mantenimiento' },
  { id: 'fuera_servicio', label: 'Fuera de servicio' },
]

export function EquiposPage() {
  const { equipos, empresas, getEmpresa } = useData()
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [filtro, setFiltro] = useState<EstadoEquipo | 'todos'>('todos')
  const empresaFiltro = params.get('empresa') ?? ''

  const lista = useMemo(() => {
    const q = query.trim().toLowerCase()
    return equipos.filter((e) => {
      if (empresaFiltro && e.empresaId !== empresaFiltro) return false
      if (filtro !== 'todos' && e.estado !== filtro) return false
      if (!q) return true
      return [e.nombre, e.codigo, e.tipo, e.ubicacion, e.serial]
        .join(' ')
        .toLowerCase()
        .includes(q)
    })
  }, [equipos, query, filtro, empresaFiltro])

  return (
    <div className="space-y-5">
      <PageHeader
        title="Equipos"
        subtitle={`${equipos.length} activos registrados en el inventario`}
        actions={
          <Link to="/equipos/nuevo">
            <Button>
              <Plus className="size-4" />
              Registrar equipo
            </Button>
          </Link>
        }
      />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Buscar por nombre, código, serial…"
          />
          <select
            value={empresaFiltro}
            onChange={(e) =>
              setParams(e.target.value ? { empresa: e.target.value } : {}, {
                replace: true,
              })
            }
            className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none sm:w-56"
          >
            <option value="">Todas las empresas</option>
            {empresas.map((em) => (
              <option key={em.id} value={em.id}>
                {em.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          {filtros.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFiltro(f.id)}
              className={cx(
                'shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors',
                filtro === f.id
                  ? 'bg-ink-950 text-white'
                  : 'bg-white text-zinc-600 ring-1 ring-zinc-200 hover:bg-zinc-50',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards en móvil */}
      <div className="grid gap-3 md:hidden">
        {lista.map((eq) => (
          <Link key={eq.id} to={`/equipos/${eq.id}`}>
            <Card className="flex items-center gap-3 p-4 transition-shadow active:shadow-md">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-ink-950 text-white">
                <Server className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-zinc-900">{eq.nombre}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-zinc-500">
                  <span className="font-mono font-semibold text-zinc-700">{eq.codigo}</span>
                  · <MapPin className="size-3" /> {eq.ubicacion}
                </p>
                <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-zinc-500">
                  <Building2 className="size-3" />
                  {getEmpresa(eq.empresaId)?.nombre ?? 'Sin empresa'}
                </p>
                <div className="mt-2">
                  <EstadoEquipoBadge estado={eq.estado} />
                </div>
              </div>
              <ChevronRight className="size-5 shrink-0 text-zinc-400" />
            </Card>
          </Link>
        ))}
      </div>

      {/* Tabla en desktop */}
      <Card className="hidden overflow-hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-semibold tracking-wide text-zinc-500 uppercase">
              <th className="px-5 py-3.5">Equipo</th>
              <th className="px-5 py-3.5">Empresa</th>
              <th className="px-5 py-3.5">Ubicación</th>
              <th className="px-5 py-3.5">Última revisión</th>
              <th className="px-5 py-3.5">Próxima</th>
              <th className="px-5 py-3.5">Estado</th>
              <th className="px-5 py-3.5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {lista.map((eq) => (
              <tr key={eq.id} className="transition-colors hover:bg-zinc-50/70">
                <td className="px-5 py-3.5">
                  <Link to={`/equipos/${eq.id}`} className="group flex items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-ink-950 text-white">
                      <Server className="size-4" />
                    </span>
                    <span>
                      <span className="block font-semibold text-zinc-900 group-hover:text-brand-700">
                        {eq.nombre}
                      </span>
                      <span className="font-mono text-xs text-zinc-500">
                        {eq.codigo} · {eq.tipo}
                      </span>
                    </span>
                  </Link>
                </td>
                <td className="px-5 py-3.5 text-zinc-600">
                  {getEmpresa(eq.empresaId)?.nombre ?? '—'}
                </td>
                <td className="px-5 py-3.5 text-zinc-600">{eq.ubicacion}</td>
                <td className="px-5 py-3.5 text-zinc-600">{formatFecha(eq.ultimaRevision)}</td>
                <td className="px-5 py-3.5 font-semibold text-zinc-900">
                  {formatFecha(eq.proximaRevision)}
                </td>
                <td className="px-5 py-3.5">
                  <EstadoEquipoBadge estado={eq.estado} />
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex justify-end gap-1">
                    <Link
                      to={`/equipos/${eq.id}`}
                      title="Ver código QR"
                      className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                    >
                      <QrCode className="size-4" />
                    </Link>
                    <Link
                      to={`/equipos/${eq.id}`}
                      title="Ver detalle"
                      className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                    >
                      <ChevronRight className="size-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {lista.length === 0 && (
        <Card className="p-10 text-center">
          <p className="text-sm font-semibold text-zinc-900">Sin resultados</p>
          <p className="mt-1 text-sm text-zinc-500">
            No se encontraron equipos con los filtros aplicados.
          </p>
        </Card>
      )}
    </div>
  )
}
