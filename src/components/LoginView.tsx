import type { FormEvent } from 'react'
import '../styles/auth.css'

interface LoginViewProps {
  email: string
  password: string
  isSubmitting: boolean
  errorMessage: string | null
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onPresetSelect: (role: 'admin' | 'client') => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

function LoginView({
  email,
  password,
  isSubmitting,
  errorMessage,
  onEmailChange,
  onPasswordChange,
  onPresetSelect,
  onSubmit,
}: LoginViewProps) {
  return (
    <main className="auth-shell">
      <section className="auth-visual">
        <div className="auth-shape" aria-hidden="true" />

        <div className="auth-brand">
          <div className="auth-logo">
            <span className="logo-mark">D</span>
            <strong>Dostra</strong>
          </div>

          <div className="auth-copy">
            <h1>Sign in to Dostra CRM</h1>
            <p>Lead operations for teams managing inbound client pipelines.</p>
          </div>
        </div>
      </section>

      <section className="auth-panel surface-card">
        <div className="surface-head">
          <div>
            <h3>Access the dashboard</h3>
          </div>
        </div>

        <div className="role-toggle" aria-label="Seeded local accounts">
          <button className="toggle-button" onClick={() => onPresetSelect('admin')} type="button">
            Use admin seed
          </button>
          <button className="toggle-button" onClick={() => onPresetSelect('client')} type="button">
            Use client seed
          </button>
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          <label>
            <span>Email address</span>
            <input
              autoComplete="email"
              required
              type="email"
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
            />
          </label>
          <label>
            <span>Password</span>
            <input
              autoComplete="current-password"
              required
              type="password"
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
            />
          </label>

          {errorMessage ? <p className="error-banner">{errorMessage}</p> : null}

          <button className="primary-button auth-submit" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default LoginView
