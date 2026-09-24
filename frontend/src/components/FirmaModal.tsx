import { useState } from 'react'
import { Check, PenLine } from 'lucide-react'
import { Button, cx } from './ui'
import {
  ESTILOS_FIRMA,
  setFirma,
  type EstiloFirma,
  type Firma,
} from '../utils/firma'

export function FirmaModal({ onGuardar }: { onGuardar: (firma: Firma) => void }) {
  const [nombre, setNombre] = useState('')
  const [estilo, setEstilo] = useState<EstiloFirma | null>(null)
  const valido = nombre.trim().length >= 3 && estilo !== null

  const guardar = () => {
    if (!valido || !estilo) return
    const firma: Firma = { nombre: nombre.trim(), estilo }
    setFirma(firma)
    onGuardar(firma)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <PenLine className="size-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-zinc-900">Cree su firma digital</h2>
            <p className="text-xs text-zinc-500">
              Se usará para firmar los reportes de mantenimiento.
            </p>
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">
            Nombre completo
          </label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Carlos Mendoza"
            autoFocus
            className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm placeholder:text-zinc-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
          />
        </div>

        <div className="mt-4">
          <p className="mb-2 text-sm font-medium text-zinc-700">Estilo de firma</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {(Object.keys(ESTILOS_FIRMA) as EstiloFirma[]).map((id) => {
              const e = ESTILOS_FIRMA[id]
              const activo = estilo === id
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setEstilo(id)}
                  className={cx(
                    'relative rounded-xl border px-3 py-4 text-center transition-all',
                    activo
                      ? 'border-brand-600 bg-brand-50 ring-2 ring-brand-500/30'
                      : 'border-zinc-300 bg-white hover:border-zinc-400',
                  )}
                >
                  {activo && (
                    <span className="absolute top-2 right-2 flex size-5 items-center justify-center rounded-full bg-brand-600 text-white">
                      <Check className="size-3" />
                    </span>
                  )}
                  <span
                    className="block truncate text-3xl leading-tight text-ink-900"
                    style={{ fontFamily: e.font }}
                  >
                    {nombre.trim() || 'Su firma'}
                  </span>
                  <span className="mt-2 block text-xs font-semibold text-zinc-700">
                    {e.label}
                  </span>
                  <span className="block text-[11px] text-zinc-400">{e.descripcion}</span>
                </button>
              )
            })}
          </div>
        </div>

        <Button onClick={guardar} disabled={!valido} className="mt-5 w-full py-3">
          <PenLine className="size-4" />
          Guardar mi firma
        </Button>
        <p className="mt-3 text-center text-[11px] text-zinc-400">
          Obligatorio para diligenciar reportes. Podrá firmar con un toque al final del
          formulario.
        </p>
      </div>
    </div>
  )
}
