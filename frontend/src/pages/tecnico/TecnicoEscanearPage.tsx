import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, CheckCircle2, Keyboard, Zap } from 'lucide-react'
import { Button, Card, PageHeader } from '../../components/ui'
import { useData } from '../../store/DataContext'

export function TecnicoEscanearPage() {
  const navigate = useNavigate()
  const { equipos } = useData()
  const [detectado, setDetectado] = useState<string | null>(null)
  const [codigo, setCodigo] = useState('')
  const [noEncontrado, setNoEncontrado] = useState(false)

  const simularLectura = () => {
    // Demo estática: el QR resuelve a un equipo aleatorio
    const eq = equipos[Math.floor(Math.random() * equipos.length)]
    setDetectado(eq.codigo)
    setTimeout(() => navigate(`/tecnico/reporte?equipo=${eq.id}`), 1200)
  }

  const buscarCodigo = () => {
    const eq = equipos.find(
      (e) => e.codigo.toLowerCase() === codigo.trim().toLowerCase(),
    )
    if (eq) {
      navigate(`/tecnico/reporte?equipo=${eq.id}`)
    } else {
      setNoEncontrado(true)
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <PageHeader
        title="Escanear código QR"
        subtitle="Apunte la cámara al QR del equipo para abrir su reporte de mantenimiento."
      />

      {/* Visor de cámara (simulado en la demo) */}
      <Card className="overflow-hidden bg-ink-950 p-0">
        <div className="relative aspect-square sm:aspect-[4/3]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#2b2b33_0%,#0a0a0c_70%)]" />

          {/* Marco de enfoque */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative size-56">
              <span className="absolute top-0 left-0 h-8 w-8 rounded-tl-lg border-t-4 border-l-4 border-brand-500" />
              <span className="absolute top-0 right-0 h-8 w-8 rounded-tr-lg border-t-4 border-r-4 border-brand-500" />
              <span className="absolute bottom-0 left-0 h-8 w-8 rounded-bl-lg border-b-4 border-l-4 border-brand-500" />
              <span className="absolute right-0 bottom-0 h-8 w-8 rounded-br-lg border-r-4 border-b-4 border-brand-500" />
              {!detectado && (
                <span className="animate-scanline absolute inset-x-3 top-3 h-0.5 rounded-full bg-brand-500 shadow-[0_0_12px_2px_rgba(230,58,73,0.7)]" />
              )}
              {detectado && (
                <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl bg-emerald-500/15 text-emerald-400">
                  <CheckCircle2 className="size-12" />
                  <span className="text-sm font-bold">{detectado} detectado</span>
                </span>
              )}
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-ink-950 to-transparent p-4">
            <p className="flex items-center gap-2 text-xs text-zinc-400">
              <Camera className="size-4" />
              La cámara se activará en el dispositivo del técnico
            </p>
            <button
              type="button"
              className="rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20"
              title="Linterna"
            >
              <Zap className="size-4" />
            </button>
          </div>
        </div>
      </Card>

      <Button className="w-full py-3" onClick={simularLectura}>
        <Camera className="size-4" />
        Simular lectura de QR
      </Button>

      {/* Entrada manual */}
      <Card className="p-4 sm:p-5">
        <p className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
          <Keyboard className="size-4 text-zinc-500" />
          ¿QR ilegible? Ingrese el código manualmente
        </p>
        <div className="mt-3 flex gap-2">
          <input
            value={codigo}
            onChange={(e) => {
              setCodigo(e.target.value)
              setNoEncontrado(false)
            }}
            placeholder="Ej: SRV-001"
            className="flex-1 rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 font-mono text-sm uppercase placeholder:font-sans placeholder:normal-case placeholder:text-zinc-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
          />
          <Button variant="dark" onClick={buscarCodigo}>
            Buscar
          </Button>
        </div>
        {noEncontrado && (
          <p className="mt-2 text-xs font-semibold text-brand-700">
            No se encontró un equipo con ese código.
          </p>
        )}
      </Card>
    </div>
  )
}
