import type { FormEvent } from 'react'
import DostraLogo from './DostraLogo.tsx'

interface LoginViewProps {
  email: string
  errorMessage: string | null
  isSubmitting: boolean
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
  password: string
}

function LoginView({
  email,
  errorMessage,
  isSubmitting,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  password,
}: LoginViewProps) {
  return (
    <main className="min-h-screen grid place-items-center px-6 py-10 bg-(--bg)">
      <section className="w-full max-w-110 flex flex-col gap-7 border border-(--line) rounded-[10px] bg-(--surface) p-7">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5">
            <DostraLogo size={24} />
            <strong className="text-[18px] font-semibold tracking-[-0.3px]">Dostra</strong>
          </div>
          <p className="font-mono text-[11.5px] text-(--ink-faint) uppercase tracking-[1px]">
            Lead operations
          </p>
          <h1 className="text-[28px] font-medium tracking-[-0.5px]">Sign in</h1>
          <p className="text-[13.5px] text-(--ink-muted) leading-[1.6]">
            Inbound leads, captured and accountable.
          </p>
        </div>

        <form className="flex flex-col gap-3.5" onSubmit={onSubmit}>
          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-[11.5px] text-(--ink-muted) uppercase tracking-[0.8px]">
              Email
            </span>
            <input
              className="border border-(--line) rounded-md bg-(--surface) text-(--ink) px-3 py-2.5 text-sm"
              autoComplete="email"
              required
              type="email"
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-[11.5px] text-(--ink-muted) uppercase tracking-[0.8px]">
              Password
            </span>
            <input
              className="border border-(--line) rounded-md bg-(--surface) text-(--ink) px-3 py-2.5 text-sm"
              autoComplete="current-password"
              required
              type="password"
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
            />
          </label>

          <div className="flex justify-end">
            <button
              className="cursor-not-allowed opacity-75 text-(--ink-muted) text-sm"
              disabled
              type="button"
            >
              Forgot password{' '}
              <span className="inline-flex items-center gap-1 rounded border border-(--line) px-1.75 py-0.75 font-mono text-[10.5px] uppercase tracking-[0.8px] text-(--ink-faint)">
                soon
              </span>
            </button>
          </div>

          {errorMessage ? (
            <p className="text-(--danger) text-[12.5px] leading-normal">{errorMessage}</p>
          ) : null}

          <button
            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-(--ink) bg-(--ink) text-(--bg) cursor-pointer px-3.5 py-2.5 transition-all duration-180 ease-in-out disabled:cursor-not-allowed disabled:opacity-75"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default LoginView
