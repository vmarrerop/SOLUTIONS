import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, KeyRound, QrCode, ShieldCheck } from 'lucide-react'
import { Button } from '../../components/ui'
import { PinInput, PIN_LARGO } from '../../components/PinInput'
import { setRol, validarCredenciales } from '../../utils/auth'
import { useData } from '../../store/DataContext'

export function TecnicoLoginPage() {
  const navigate = useNavigate()
  const { codigo } = useParams()
  const { equipos } = useData()
  const [usuario, setUsuario] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  const entrar = (usuarioActual: string, pinActual: string) => {
    const rol = validarCredenciales(usuarioActual, pinActual)
    if (rol !== 'tecnico') {
      setError(true)
      setPin('')
      return
    }
    setRol('tecnico')
    // Demo estática: el QR abre el formulario de un equipo aleatorio
    const aleatorio = equipos[Math.floor(Math.random() * equipos.length)]
    navigate(`/tecnico/reporte?equipo=${aleatorio.id}`, { replace: true })
  }

  const onPinChange = (valor: string) => {
    setPin(valor)
    setError(false)
    // Al completar los 4 dígitos se valida automáticamente
    if (valor.length === PIN_LARGO) entrar(usuario, valor)
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-ink-950 px-6 py-10">
      <div className="pointer-events-none fixed -top-32 -right-32 size-96 rounded-full bg-brand-600/20 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-40 -left-24 size-96 rounded-full bg-brand-600/10 blur-3xl" />

      <div className="relative w-full max-w-sm">
        {/* Marca */}
        <div className="flex items-center justify-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-brand-600 shadow-lg shadow-brand-600/40">
            <span className="text-lg font-extrabold text-white">S</span>
          </div>
          <div className="leading-tight text-white">
            <p className="font-bold">Solutions Machine</p>
            <p className="text-xs tracking-wide text-zinc-400 uppercase">
              Acceso técnico
            </p>
          </div>
        </div>

        {/* Equipo detectado por QR */}
        <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
          <QrCode className="size-4 shrink-0 text-brand-500" />
          <p className="text-sm text-zinc-300">
            {codigo ? (
              <>
                QR detectado:{' '}
                <span className="font-mono font-bold text-white uppercase">{codigo}</span>
              </>
            ) : (
              'Escanee el QR del equipo para iniciar el reporte'
            )}
          </p>
        </div>

        {/* Formulario */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            entrar(usuario, pin)
          }}
          className="mt-6 space-y-5 rounded-2xl bg-white p-6 shadow-2xl"
        >
          <div>
            <h1 className="text-lg font-bold text-zinc-900">Iniciar sesión</h1>
            <p className="text-sm text-zinc-500">
              Identifíquese para llenar el reporte de mantenimiento.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700">
              Usuario
            </label>
            <input
              value={usuario}
              onChange={(e) => {
                setUsuario(e.target.value)
                setError(false)
              }}
              placeholder="tecnico"
              autoComplete="username"
              autoCapitalize="none"
              className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm placeholder:text-zinc-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-center text-sm font-medium text-zinc-700">
              PIN de acceso
            </label>
            <PinInput value={pin} onChange={onPinChange} error={error} />
          </div>

          {error && (
            <p className="rounded-lg bg-brand-50 px-3 py-2 text-center text-xs font-semibold text-brand-700">
              Usuario o PIN incorrectos. Verifique e intente de nuevo.
            </p>
          )}

          <Button type="submit" className="w-full py-3">
            Ingresar y abrir reporte
            <ArrowRight className="size-4" />
          </Button>

          {/* Ayuda demo */}
          <div className="rounded-xl bg-zinc-50 p-3 text-xs text-zinc-500">
            <p className="flex items-center gap-1.5 font-semibold text-zinc-700">
              <KeyRound className="size-3.5" />
              Credenciales de demostración
            </p>
            <p className="mt-1 font-mono">Usuario: tecnico</p>
            <p className="font-mono">PIN: 1234</p>
          </div>
        </form>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-zinc-500">
          <ShieldCheck className="size-3.5" />
          Acceso restringido a técnicos autorizados
        </p>
      </div>
    </div>
  )
}
