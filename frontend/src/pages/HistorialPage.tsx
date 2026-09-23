import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Download, Camera } from 'lucide-react'
import {
  Button,
  Card,
  EstadoRevisionBadge,
  PageHeader,
  SearchInput,
  TipoServicioBadge,
  cx,
} from '../components/ui'
import { formatFecha, getEquipo, revisiones } from '../data/mock'
import type { TipoServicio } from '../types'

const filtros: Array<{ id: TipoServicio | 'todos'; label: string }> = [
  { id: 'todos', label: 'Todos' },
  { id: 'preventivo', label: 'Preventivos' },
  { id: 'correctivo', label: 'Correctivos' },
  { id: 'revision', label: 'Revisiones' },
]

export function HistorialPage() {
  const [query, setQuery] = useState('')
  const [filtro, setFiltro] = useState<TipoServicio | 'todos'>('todos')

  const lista = useMemo(() => {
    const q = query.trim().toLowerCase()
    return revisiones.filter((r) => {
      if (filtro !== 'todos' && r.tipo !== filtro) return false
      if (!q) return true
      const eq = getEquipo(r.equipoId)
      return [r.consecutivo, r.tecnico, r.observaciones, eq?.nombre, eq?.codigo]
        .join(' ')
        .toLowerCase()
        .includes(q)
    })
  }, [query, filtro])

  return (
    <div className="space-y-5">
      <PageHeader
        title="Historial de servicios"
        subtitle={`${revisiones.length} registros con consecutivo y trazabilidad completa`}
        actions={
          <Button variant="secondary">
            <Download className="size-4" />
            Exportar
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Buscar por consecutivo, equipo, técnico…"
        />
        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
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
        {lista.map((r) => {
          const eq = getEquipo(r.equipoId)
          return (
            <Card key={r.id} className="p-4">
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-sm font-bold text-zinc-900">
                  {r.consecutivo}
                </span>
                <EstadoRevisionBadge estado={r.estado} />
              </div>
              <Link
                to={`/equipos/${r.equipoId}`}
                className="mt-1.5 block text-sm font-semibold text-zinc-900"
              >
                {eq?.nombre}
              </Link>
              <p className="mt-1 line-clamp-2 text-xs text-zinc-500">{r.observaciones}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-zinc-500">
                <TipoServicioBadge tipo={r.tipo} />
                <span>{r.tecnico}</span>
                <span>{formatFecha(r.fecha)}</span>
                <span className="flex items-center gap-1">
                  <Camera className="size-3.5" />
                  {r.fotosAntes + r.fotosDespues}
                </span>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Tabla en desktop */}
      <Card className="hidden overflow-hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-semibold tracking-wide text-zinc-500 uppercase">
              <th className="px-5 py-3.5">Consecutivo</th>
              <th className="px-5 py-3.5">Equipo</th>
              <th className="px-5 py-3.5">Tipo</th>
              <th className="px-5 py-3.5">Técnico</th>
              <th className="px-5 py-3.5">Fecha</th>
              <th className="px-5 py-3.5">Fotos</th>
              <th className="px-5 py-3.5">Estado</th>
              <th className="px-5 py-3.5 text-right">PDF</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {lista.map((r) => {
              const eq = getEquipo(r.equipoId)
              return (
                <tr key={r.id} className="transition-colors hover:bg-zinc-50/70">
                  <td className="px-5 py-3.5 font-mono font-bold text-zinc-900">
                    {r.consecutivo}
                  </td>
                  <td className="px-5 py-3.5">
                    <Link
                      to={`/equipos/${r.equipoId}`}
                      className="font-semibold text-zinc-900 hover:text-brand-700"
                    >
                      {eq?.nombre}
                    </Link>
                    <p className="font-mono text-xs text-zinc-500">{eq?.codigo}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <TipoServicioBadge tipo={r.tipo} />
                  </td>
                  <td className="px-5 py-3.5 text-zinc-600">{r.tecnico}</td>
                  <td className="px-5 py-3.5 text-zinc-600">{formatFecha(r.fecha)}</td>
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-1.5 text-zinc-600">
                      <Camera className="size-4 text-zinc-400" />
                      {r.fotosAntes + r.fotosDespues}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <EstadoRevisionBadge estado={r.estado} />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end">
                      {r.estado === 'completado' ? (
                        <button
                          type="button"
                          title="Descargar PDF"
                          className="rounded-lg p-2 text-brand-600 hover:bg-brand-50"
                        >
                          <FileText className="size-4" />
                        </button>
                      ) : (
                        <span className="p-2 text-zinc-300">
                          <FileText className="size-4" />
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>

      {lista.length === 0 && (
        <Card className="p-10 text-center">
          <p className="text-sm font-semibold text-zinc-900">Sin resultados</p>
          <p className="mt-1 text-sm text-zinc-500">
            No se encontraron registros con los filtros aplicados.
          </p>
        </Card>
      )}
    </div>
  )
}
