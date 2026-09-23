import { useRef } from 'react'
import { cx } from './ui'

export const PIN_LARGO = 4

export function PinInput({
  value,
  onChange,
  error,
}: {
  value: string
  onChange: (pin: string) => void
  error?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.focus()}
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
                : i < value.length
                  ? 'border-brand-600 bg-brand-50'
                  : i === value.length
                    ? 'border-brand-500 bg-white ring-2 ring-brand-500/25'
                    : 'border-zinc-300 bg-white',
            )}
          >
            {i < value.length && <span className="size-3 rounded-full bg-brand-600" />}
          </span>
        ))}
      </button>
      {/* Input real (invisible) que captura los dígitos */}
      <input
        ref={inputRef}
        type="password"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="one-time-code"
        maxLength={PIN_LARGO}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, PIN_LARGO))}
        className="sr-only"
      />
      <p className="mt-2 text-center text-xs text-zinc-400">
        Toque los círculos para digitar su PIN
      </p>
    </div>
  )
}
