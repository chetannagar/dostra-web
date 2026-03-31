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
    <main className="auth-shell refined-auth">
      <section className="auth-visual">
        <div className="auth-logo">
          <span className="logo-mark">D</span>
          <strong>Dostra CRM</strong>
        </div>
        <div className="auth-quote">
          <span className="pill neutral">Lead Operations</span>
          <h1>Lead ingestion now feels like an operating system, not a spreadsheet.</h1>
          <p>
            Sign in with the seeded Laravel accounts and continue into the protected CRM shell.
          </p>
        </div>
        <div className="auth-persona">
          <strong>Built for admin oversight and client-safe access</strong>
          <small>Seeded admin and client credentials are available in the sign-in card.</small>
        </div>
      </section>

      <section className="auth-panel surface-card">
        <div className="surface-head">
          <div>
            <p className="section-label">Welcome back</p>
            <h3>Access the dashboard</h3>
          </div>
        </div>

        <div className="role-toggle">
          <button className="toggle-button" onClick={() => onPresetSelect('admin')} type="button">
            Admin
          </button>
          <button className="toggle-button" onClick={() => onPresetSelect('client')} type="button">
            Client
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

          <div className="auth-hints stacked">
            <div className="surface-card compact-card">
              <p className="section-label">Seeded admin</p>
              <strong>admin@example.com</strong>
              <small>password</small>
            </div>
            <div className="surface-card compact-card">
              <p className="section-label">Seeded client</p>
              <strong>client@example.com</strong>
              <small>password</small>
            </div>
          </div>

          {errorMessage ? <p className="error-banner">{errorMessage}</p> : null}

          <button className="primary-button auth-submit" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Signing in...' : 'Sign in to dashboard'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default LoginView
