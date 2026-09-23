import { useNavigate } from 'react-router-dom'
import { QrCode, FileText, Camera, ShieldCheck, ArrowRight } from 'lucide-react'
import { Button } from '../components/ui'

const features = [
  { icon: QrCode, text: 'Identificación de equipos por código QR' },
  { icon: Camera, text: 'Evidencia fotográfica antes y después' },
  { icon: FileText, text: 'Reportes PDF con consecutivo automático' },
  { icon: ShieldCheck, text: 'Roles y permisos por tipo de usuario' },
]

export function LoginPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      {/* Panel de marca */}
      <div className="relative flex flex-col justify-between overflow-hidden bg-ink-950 px-6 py-8 text-white sm:px-10 lg:w-1/2 lg:py-12">
        <div className="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-brand-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-24 size-96 rounded-full bg-brand-600/10 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-brand-600 shadow-lg shadow-brand-600/40">
            <span className="text-lg font-extrabold">S</span>
          </div>
          <div className="leading-tight">
            <p className="font-bold">Solutions Machine</p>
            <p className="text-xs tracking-wide text-zinc-400 uppercase">
              Gestión de Activos
            </p>
          </div>
        </div>

        <div className="relative mt-10 lg:mt-0">
          <h1 className="max-w-md text-3xl font-extrabold tracking-tight sm:text-4xl">
            Control total de sus activos y{' '}
            <span className="text-brand-500">mantenimientos</span>
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-400">
            Centralice el historial de servicios, revisiones y evidencias de cada
            equipo con trazabilidad completa desde cualquier dispositivo.
          </p>
          <ul className="mt-8 hidden space-y-4 lg:block">
            {features.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-zinc-300">
                <span className="flex size-9 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
                  <Icon className="size-4 text-brand-500" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative mt-10 hidden text-xs text-zinc-500 lg:block">
          © 2026 Solutions Machine · Portal de Backoffice
        </p>
      </div>

      {/* Formulario */}
      <div className="flex flex-1 items-center justify-center bg-zinc-100 px-6 py-10 sm:px-10">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            Iniciar sesión
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Acceda con sus credenciales corporativas.
          </p>

          <form
            className="mt-8 space-y-5"
            onSubmit={(e) => {
              e.preventDefault()
              navigate('/')
            }}
          >
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="nombre@solutionsmachine.co"
                className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm placeholder:text-zinc-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm placeholder:text-zinc-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-zinc-600">
                <input
                  type="checkbox"
                  className="size-4 rounded border-zinc-300 accent-brand-600"
                />
                Recordarme
              </label>
              <a href="#" className="font-semibold text-brand-600 hover:text-brand-700">
                ¿Olvidó su contraseña?
              </a>
            </div>
            <Button type="submit" className="w-full py-3">
              Ingresar al portal
              <ArrowRight className="size-4" />
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-zinc-400">
            Acceso restringido a personal autorizado de Solutions Machine.
          </p>
        </div>
      </div>
    </div>
  )
}
