import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Button, Card, PageHeader, cx } from '../components/ui'
import { useData } from '../store/DataContext'
import type { EstadoEquipo, Equipo } from '../types'

const ESTADOS: Record<
  EstadoEquipo,
  { label: string; dot: string; text: string }
> = {
  operativo: { label: 'Operativo', dot: 'bg-emerald-500', text: 'text-emerald-600' },
  mantenimiento: { label: 'Mantenimiento', dot: 'bg-amber-500', text: 'text-amber-600' },
  fuera_servicio: { label: 'Fuera de servicio', dot: 'bg-brand-600', text: 'text-brand-600' },
}

/* Lo que falla va primero */
const PESO: Record<EstadoEquipo, number> = {
  fuera_servicio: 0,
  mantenimiento: 1,
  operativo: 2,
}

function fechaCorta(iso: string | null) {
  if (!iso) return '—'
  const hoy = new Date()
  const local = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`
  if (iso === local) return 'hoy'
  return new Date(`${iso}T12:00:00`).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
  })
}

function footerDe(eq: Equipo): { label: string; valor: string } {
  if (eq.estado === 'fuera_servicio')
    return { label: 'Correctivo en curso', valor: `desde ${fechaCorta(eq.ultimaRevision)}` }
  if (eq.estado === 'mantenimiento')
    return { label: 'Revisión en curso', valor: fechaCorta(eq.ultimaRevision) }
  return { label: 'Próx. preventivo', valor: fechaCorta(eq.proximaRevision) }
}

function EquipoCard({ eq }: { eq: Equipo }) {
  const est = ESTADOS[eq.estado]
  const footer = footerDe(eq)
  return (
    <Link to={`/equipos/${eq.id}`} className="block h-full">
      <Card
        className={cx(
          'flex h-full flex-col p-4 transition-shadow hover:shadow-md',
          eq.estado === 'fuera_servicio' && 'border-brand-300 ring-1 ring-brand-200',
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-xs font-semibold tracking-wide text-zinc-500">
            {eq.codigo}
          </span>
          <span className={cx('flex items-center gap-1.5 text-xs font-semibold', est.text)}>
            <span className={cx('size-1.5 rounded-full', est.dot)} />
            {est.label}
          </span>
        </div>
        <p className="mt-2 text-sm leading-snug font-bold text-zinc-900">{eq.nombre}</p>
        <p className="mt-1 text-xs text-zinc-500">{eq.ubicacion}</p>
        <div className="mt-auto flex items-end justify-between gap-2 border-t border-zinc-100 pt-3">
          <span className="text-xs text-zinc-500">{footer.label}</span>
          <span
            className={cx(
              'text-xs font-bold',
              eq.estado === 'fuera_servicio' ? 'text-brand-700' : 'text-zinc-900',
            )}
          >
            {footer.valor}
          </span>
        </div>
      </Card>
    </Link>
  )
}

export function EquiposPage() {
  const { equipos, empresas } = useData()
  const [params] = useSearchParams()
  const [filtro, setFiltro] = useState<EstadoEquipo | 'todos'>('todos')
  const empresaFiltro = params.get('empresa') ?? ''

  const conteos = useMemo(() => {
    const base = empresaFiltro
      ? equipos.filter((e) => e.empresaId === empresaFiltro)
      : equipos
    return {
      todos: base.length,
      operativo: base.filter((e) => e.estado === 'operativo').length,
      mantenimiento: base.filter((e) => e.estado === 'mantenimiento').length,
      fuera_servicio: base.filter((e) => e.estado === 'fuera_servicio').length,
    }
  }, [equipos, empresaFiltro])

  /* Empresas con sus equipos filtrados; las que tienen fallas, arriba */
  const grupos = useMemo(() => {
    return empresas
      .map((empresa) => {
        const lista = equipos
          .filter((e) => e.empresaId === empresa.id)
          .filter((e) => !empresaFiltro || e.empresaId === empresaFiltro)
          .filter((e) => filtro === 'todos' || e.estado === filtro)
          .sort((a, b) => PESO[a.estado] - PESO[b.estado])
        return { empresa, lista, todos: equipos.filter((e) => e.empresaId === empresa.id) }
      })
      .filter((g) => g.lista.length > 0 && (!empresaFiltro || g.empresa.id === empresaFiltro))
      .sort(
        (a, b) =>
          Math.min(...a.lista.map((e) => PESO[e.estado])) -
          Math.min(...b.lista.map((e) => PESO[e.estado])),
      )
  }, [empresas, equipos, filtro, empresaFiltro])

  const resumenDe = (lista: Equipo[]) => {
    const fuera = lista.filter((e) => e.estado === 'fuera_servicio').length
    const mant = lista.filter((e) => e.estado === 'mantenimiento').length
    const partes = [`${lista.length} ${lista.length === 1 ? 'equipo' : 'equipos'}`]
    if (fuera) partes.push(`${fuera} fuera de servicio`)
    else if (mant) partes.push(`${mant} en mantenimiento`)
    else partes.push('todo operativo')
    return partes.join(' · ')
  }

  const hoy = new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long' })
  const empresaSel = empresas.find((e) => e.id === empresaFiltro)

  const chips: Array<{ id: EstadoEquipo | 'todos'; label: string; n: number; dot?: string }> = [
    { id: 'todos', label: 'Todos', n: conteos.todos },
    { id: 'operativo', label: 'Operativos', n: conteos.operativo, dot: 'bg-emerald-500' },
    { id: 'mantenimiento', label: 'Mantenimiento', n: conteos.mantenimiento, dot: 'bg-amber-500' },
    { id: 'fuera_servicio', label: 'Fuera de servicio', n: conteos.fuera_servicio, dot: 'bg-brand-600' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={empresaSel ? empresaSel.nombre : 'Equipos'}
        subtitle={
          empresaSel
            ? `${conteos.todos} ${conteos.todos === 1 ? 'equipo' : 'equipos'} · ${hoy}`
            : `${equipos.length} equipos en ${new Set(equipos.map((e) => e.empresaId)).size} empresas · ${hoy}`
        }
        actions={
          <Link to="/equipos/nuevo">
            <Button>
              <Plus className="size-4" />
              Registrar equipo
            </Button>
          </Link>
        }
      />

      {/* Filtros por estado */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {chips.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setFiltro(c.id)}
            className={cx(
              'flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-colors',
              filtro === c.id
                ? 'bg-ink-950 text-white'
                : 'bg-white text-zinc-700 ring-1 ring-zinc-200 hover:bg-zinc-50',
            )}
          >
            {c.dot && <span className={cx('size-1.5 rounded-full', c.dot)} />}
            {c.label}
            <span className={cx('font-bold', filtro === c.id ? 'text-white' : 'text-zinc-900')}>
              {c.n}
            </span>
          </button>
        ))}
      </div>

      {/* Grupos por empresa */}
      {grupos.map(({ empresa, lista }) => (
        <section key={empresa.id} className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm">
              <span className="font-bold text-zinc-900">{empresa.nombre}</span>{' '}
              <span className="text-zinc-500">{resumenDe(lista)}</span>
            </p>
            {!empresaFiltro && (
              <Link
                to={`/equipos?empresa=${empresa.id}`}
                className="shrink-0 text-xs font-semibold text-brand-600 hover:text-brand-700"
              >
                Ver empresa →
              </Link>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {lista.map((eq) => (
              <EquipoCard key={eq.id} eq={eq} />
            ))}
          </div>
        </section>
      ))}

      {grupos.length === 0 && (
        <Card className="p-10 text-center">
          <p className="text-sm font-semibold text-zinc-900">Sin resultados</p>
          <p className="mt-1 text-sm text-zinc-500">
            No hay equipos con los filtros aplicados.
          </p>
        </Card>
      )}
    </div>
  )
}
