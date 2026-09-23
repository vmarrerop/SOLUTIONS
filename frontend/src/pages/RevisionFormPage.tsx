import { useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Camera,
  CheckCircle2,
  FileText,
  ImagePlus,
  Save,
  X,
  AlertTriangle,
  MinusCircle,
} from 'lucide-react'
import { Button, Card, PageHeader, cx } from '../components/ui'
import { siguienteConsecutivo } from '../data/mock'
import { useData } from '../store/DataContext'

type ItemEstado = 'ok' | 'atencion' | 'falla' | null

const checklistInicial = [
  'Estado físico general y limpieza',
  'Conexiones eléctricas y cableado',
  'Temperatura y ventilación',
  'Indicadores / alarmas del equipo',
  'Actualizaciones de firmware o software',
  'Pruebas de funcionamiento',
]

function PhotoUpload({ titulo, hint }: { titulo: string; hint: string }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previews, setPreviews] = useState<string[]>([])

  const onFiles = (files: FileList | null) => {
    if (!files) return
    const urls = Array.from(files).map((f) => URL.createObjectURL(f))
    setPreviews((p) => [...p, ...urls])
  }

  return (
    <div>
      <p className="text-sm font-semibold text-zinc-900">{titulo}</p>
      <p className="text-xs text-zinc-500">{hint}</p>
      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
        {previews.map((src, i) => (
          <div key={src} className="group relative aspect-square overflow-hidden rounded-xl">
            <img src={src} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => setPreviews((p) => p.filter((u) => u !== src))}
              className="absolute top-1 right-1 rounded-full bg-ink-950/70 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-zinc-300 text-zinc-400 transition-colors hover:border-brand-400 hover:text-brand-600"
        >
          <ImagePlus className="size-6" />
          <span className="text-[11px] font-semibold">Agregar</span>
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        className="hidden"
        onChange={(e) => onFiles(e.target.files)}
      />
    </div>
  )
}

export function RevisionFormPage() {
  const { equipos } = useData()
  const [params] = useSearchParams()
  const equipoParam = params.get('equipo') ?? 'eq-01'
  const [equipoId, setEquipoId] = useState(equipoParam)
  const [tipo, setTipo] = useState('preventivo')
  const [checklist, setChecklist] = useState<ItemEstado[]>(
    checklistInicial.map(() => null),
  )
  const [enviado, setEnviado] = useState(false)
  const consecutivo = siguienteConsecutivo()

  const setItem = (i: number, estado: ItemEstado) => {
    setChecklist((c) => c.map((v, idx) => (idx === i ? estado : v)))
  }

  if (enviado) {
    return (
      <div className="mx-auto max-w-md pt-10">
        <Card className="p-8 text-center">
          <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="size-9" />
          </span>
          <h1 className="mt-5 text-xl font-bold text-zinc-900">Revisión registrada</h1>
          <p className="mt-2 text-sm text-zinc-500">
            El registro{' '}
            <span className="font-mono font-bold text-zinc-900">{consecutivo}</span> fue
            guardado y el documento PDF fue generado correctamente.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Button className="w-full">
              <FileText className="size-4" />
              Descargar PDF del servicio
            </Button>
            <Link to="/historial">
              <Button variant="secondary" className="w-full">
                Ir al historial
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <PageHeader
        title="Nueva revisión"
        subtitle="Complete el formulario del servicio. El consecutivo se asigna automáticamente."
      />

      {/* Consecutivo */}
      <Card className="flex items-center justify-between gap-3 border-l-4 border-l-brand-600 p-4 sm:p-5">
        <div>
          <p className="text-xs font-medium tracking-wide text-zinc-500 uppercase">
            Consecutivo asignado
          </p>
          <p className="mt-1 font-mono text-xl font-extrabold text-zinc-900">
            {consecutivo}
          </p>
        </div>
        <p className="max-w-45 text-right text-xs text-zinc-500">
          Generado automáticamente por el sistema · 23 sep 2026
        </p>
      </Card>

      {/* Datos generales */}
      <Card className="space-y-4 p-4 sm:p-5">
        <h2 className="text-sm font-bold text-zinc-900">Datos generales</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700">Equipo</label>
            <select
              value={equipoId}
              onChange={(e) => setEquipoId(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
            >
              {equipos.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  {eq.codigo} · {eq.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700">
              Tipo de servicio
            </label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
            >
              <option value="preventivo">Mantenimiento preventivo</option>
              <option value="correctivo">Mantenimiento correctivo</option>
              <option value="revision">Revisión / inspección</option>
              <option value="instalacion">Instalación</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700">Técnico</label>
            <input
              defaultValue="Carlos Mendoza"
              className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700">
              Fecha del servicio
            </label>
            <input
              type="date"
              defaultValue="2026-09-23"
              className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
            />
          </div>
        </div>
      </Card>

      {/* Checklist */}
      <Card className="p-4 sm:p-5">
        <h2 className="text-sm font-bold text-zinc-900">Lista de verificación</h2>
        <p className="text-xs text-zinc-500">
          Marque el estado de cada punto inspeccionado.
        </p>
        <ul className="mt-4 divide-y divide-zinc-100">
          {checklistInicial.map((item, i) => (
            <li
              key={item}
              className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="text-sm text-zinc-700">{item}</span>
              <div className="flex gap-1.5">
                {(
                  [
                    { id: 'ok', label: 'OK', icon: CheckCircle2, active: 'bg-emerald-600 text-white' },
                    { id: 'atencion', label: 'Atención', icon: AlertTriangle, active: 'bg-amber-500 text-white' },
                    { id: 'falla', label: 'Falla', icon: MinusCircle, active: 'bg-brand-600 text-white' },
                  ] as const
                ).map(({ id, label, icon: Icon, active }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setItem(i, checklist[i] === id ? null : id)}
                    className={cx(
                      'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                      checklist[i] === id
                        ? active
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200',
                    )}
                  >
                    <Icon className="size-3.5" />
                    {label}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </Card>

      {/* Fotografías */}
      <Card className="space-y-6 p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <Camera className="size-4 text-zinc-500" />
          <h2 className="text-sm font-bold text-zinc-900">Evidencia fotográfica</h2>
        </div>
        <PhotoUpload
          titulo="Fotos ANTES de la intervención"
          hint="Registre el estado inicial del equipo."
        />
        <PhotoUpload
          titulo="Fotos DESPUÉS de la intervención"
          hint="Registre el estado final una vez completado el servicio."
        />
      </Card>

      {/* Observaciones */}
      <Card className="p-4 sm:p-5">
        <label className="mb-1.5 block text-sm font-bold text-zinc-900">
          Observaciones del servicio
        </label>
        <textarea
          rows={4}
          placeholder="Describa el trabajo realizado, hallazgos y recomendaciones…"
          className="w-full resize-none rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm placeholder:text-zinc-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
        />
      </Card>

      {/* Acciones */}
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" className="sm:w-auto">
          <Save className="size-4" />
          Guardar borrador
        </Button>
        <Button className="sm:w-auto" onClick={() => setEnviado(true)}>
          <FileText className="size-4" />
          Completar y generar PDF
        </Button>
      </div>
    </div>
  )
}
