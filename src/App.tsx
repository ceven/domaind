import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import './App.css'

type AuthMode = 'login' | 'signup'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(() => Boolean(supabase))
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (!supabase) return

    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setSession(data.session)
        setLoading(false)
      }
    })

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setLoading(false)
    })

    return () => {
      mounted = false
      data.subscription.unsubscribe()
    }
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!supabase) return

    setSubmitting(true)
    setErrorMessage('')
    setSuccessMessage('')

    const result =
      mode === 'signup'
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password })

    setSubmitting(false)

    if (result.error) {
      setErrorMessage(result.error.message)
      return
    }

    if (mode === 'signup' && !result.data.session) {
      setSuccessMessage('Check your email to confirm your account, then come back to sign in.')
    }
  }

  async function handleSignOut() {
    if (!supabase) return
    const { error } = await supabase.auth.signOut()
    if (error) setErrorMessage(error.message)
  }

  if (loading) {
    return <main className="auth-shell"><p className="loading-label">Loading your account...</p></main>
  }

  if (!supabase) {
    return (
      <main className="auth-shell">
        <section className="auth-panel config-panel">
          <p className="eyebrow">Domaind / setup</p>
          <h1>Connect your Supabase project.</h1>
          <p className="muted">Inject <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> environment variables, then restart Vite.</p>
        </section>
      </main>
    )
  }

  if (session?.user) {
    return (
      <main className="auth-shell">
        <section className="auth-panel signed-in-panel">
          <p className="eyebrow">Domaind / account</p>
          <div className="status-mark" aria-hidden="true">✓</div>
          <h1>Your watchlist is unlocked.</h1>
          <p className="muted">Your property workspace is ready at <strong>{session.user.email}</strong>.</p>
          <button className="secondary-button" type="button" onClick={handleSignOut}>Sign out</button>
        </section>
      </main>
    )
  }

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
          <h2>{mode === 'login' ? 'Return to your watchlist' : 'Start your watchlist'}</h2>
          <p className="muted">Save the properties you are watching and bring your own analysis along.</p>
        </div>

        <div className="mode-switch" aria-label="Authentication mode">
          <button className={mode === 'login' ? 'active' : ''} type="button" onClick={() => setMode('login')}>Sign in</button>
          <button className={mode === 'signup' ? 'active' : ''} type="button" onClick={() => setMode('signup')}>Sign up</button>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email address</label>
          <input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />

          <label htmlFor="password">Password</label>
          <input id="password" type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} required />

          {errorMessage && <p className="form-message error-message" role="alert">{errorMessage}</p>}
          {successMessage && <p className="form-message success-message" role="status">{successMessage}</p>}

          <button className="primary-button" type="submit" disabled={submitting}>
            {submitting ? 'Working...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default App
