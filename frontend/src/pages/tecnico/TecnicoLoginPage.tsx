import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, KeyRound, QrCode, ShieldCheck } from 'lucide-react'
import { Button, cx } from '../../components/ui'
import { useData } from '../../store/DataContext'

/* Credenciales de demo (quemadas en código) */
const CREDENCIALES = {
  email: 'tecnico@gmail.com',
  pin: '1234',
}

const PIN_LARGO = 4

export function TecnicoLoginPage() {
  const navigate = useNavigate()
  const { codigo } = useParams()
  const { equipos } = useData()
  const pinRef = useRef<HTMLInputElement>(null)
  const [email, setEmail] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | null>(null)

  const entrar = (emailActual: string, pinActual: string) => {
    if (emailActual.trim().toLowerCase() !== CREDENCIALES.email) {
      setError('Correo o PIN incorrectos. Verifique e intente de nuevo.')
      setPin('')
      return
    }
    if (pinActual !== CREDENCIALES.pin) {
      setError('Correo o PIN incorrectos. Verifique e intente de nuevo.')
      setPin('')
      return
    }
    sessionStorage.setItem('sm-tecnico', '1')
    // Demo estática: el QR abre el formulario de un equipo aleatorio
    const aleatorio = equipos[Math.floor(Math.random() * equipos.length)]
    navigate(`/tecnico/reporte?equipo=${aleatorio.id}`, { replace: true })
  }

  const onPinChange = (valor: string) => {
    const limpio = valor.replace(/\D/g, '').slice(0, PIN_LARGO)
    setPin(limpio)
    setError(null)
    // Al completar los 4 dígitos se valida automáticamente
    if (limpio.length === PIN_LARGO) entrar(email, limpio)
  }

  const ingresar = (e: React.FormEvent) => {
    e.preventDefault()
    entrar(email, pin)
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
          onSubmit={ingresar}
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
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError(null)
              }}
              placeholder="tecnico@gmail.com"
              autoComplete="username"
              className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm placeholder:text-zinc-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
            />
          </div>

          {/* PIN de 4 dígitos (oculto, circulitos) */}
          <div>
            <label className="mb-2 block text-center text-sm font-medium text-zinc-700">
              PIN de acceso
            </label>
            <button
              type="button"
              onClick={() => pinRef.current?.focus()}
              className="mx-auto flex items-center justify-center gap-4"
              aria-label="Ingresar PIN"
            >
              {Array.from({ length: PIN_LARGO }).map((_, i) => (
                <span
                  key={i}
                  className={cx(
                    'flex size-12 items-center justify-center rounded-full border-2 transition-all',
                    error
                      ? 'border-brand-400 bg-brand-50'
                      : i < pin.length
                        ? 'border-brand-600 bg-brand-50'
                        : i === pin.length
                          ? 'border-brand-500 bg-white ring-2 ring-brand-500/25'
                          : 'border-zinc-300 bg-white',
                  )}
                >
                  {i < pin.length && (
                    <span className="size-3 rounded-full bg-brand-600" />
                  )}
                </span>
              ))}
            </button>
            {/* Input real (invisible) que captura los dígitos */}
            <input
              ref={pinRef}
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              maxLength={PIN_LARGO}
              value={pin}
              onChange={(e) => onPinChange(e.target.value)}
              className="sr-only"
            />
            <p className="mt-2 text-center text-xs text-zinc-400">
              Toque los círculos para digitar su PIN
            </p>
          </div>

          {error && (
            <p className="rounded-lg bg-brand-50 px-3 py-2 text-center text-xs font-semibold text-brand-700">
              {error}
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
            <p className="mt-1 font-mono">{CREDENCIALES.email}</p>
            <p className="font-mono">PIN: {CREDENCIALES.pin}</p>
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
