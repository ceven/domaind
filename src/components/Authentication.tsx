import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function Authentication() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const destination = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/'

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setAuthenticated(Boolean(data.session))
    })

    return () => {
      mounted = false
    }
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setErrorMessage('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setSubmitting(false)

    if (error) {
      setErrorMessage(error.message)
      return
    }

    navigate(destination, { replace: true })
  }

  if (authenticated === null) {
    return <main className="auth-shell"><p className="loading-label">Loading your account...</p></main>
  }

  if (authenticated) return <Navigate to="/" replace />

  return (
    <main className="auth-shell">
      <section className="welcome-panel">
        <div>
          <p className="eyebrow">Domaind / property intelligence</p>
          <h1>Save properties you care about.</h1>
        </div>
        <div>
          <div className="property-preview" aria-label="Saved property preview">
            <div className="property-preview-heading"><span>Saved properties</span><span>03</span></div>
            <div className="property-row"><span className="source-dot source-domain" />2097 Forest St, Annandale<span className="property-tag">DOMAIN</span></div>
            <div className="property-row"><span className="source-dot source-domain" />185 Allevile Road, Erskineville<span className="property-tag">DOMAIN</span></div>
          </div>
          <p className="welcome-note">Sync properties from your watchlist in Domain, then make your own call with everything in one place.</p>
        </div>
      </section>

      <section className="auth-panel">
        <div className="panel-heading">
          <p className="eyebrow">Your research desk</p>
          <h2>Return to your watchlist</h2>
          <p className="muted">Save the properties you are watching and bring your own analysis along.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email address</label>
          <input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />

          <label htmlFor="password">Password</label>
          <input id="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />

          {errorMessage && <p className="form-message error-message" role="alert">{errorMessage}</p>}

          <button className="primary-button" type="submit" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <Link className="text-link forgot-link" to="/forgot-password">Forgot your password?</Link>
      </section>
    </main>
  )
}

export default Authentication