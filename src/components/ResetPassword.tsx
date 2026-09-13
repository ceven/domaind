import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function ResetPassword() {
  const [ready, setReady] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setReady(Boolean(data.session))
    })

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' && session && mounted) setReady(true)
    })

    return () => {
      mounted = false
      data.subscription.unsubscribe()
    }
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (password !== confirmation) {
      setErrorMessage('Passwords do not match.')
      return
    }

    setSubmitting(true)
    const { error } = await supabase.auth.updateUser({ password })
    setSubmitting(false)

    if (error) {
      setErrorMessage(error.message)
      return
    }

    setSuccessMessage('Your password has been updated. Redirecting...')
    setTimeout(() => navigate('/', { replace: true }), 800)
  }

  if (!ready) {
    return (
      <main className="auth-shell single-auth-shell">
        <section className="auth-panel recovery-panel">
          <p className="eyebrow">Domaind / account recovery</p>
          <h2>Reset link expired.</h2>
          <p className="muted">Request a new password reset link to continue.</p>
          <Link className="text-link" to="/forgot-password">Request a new link</Link>
        </section>
      </main>
    )
  }

  return (
    <main className="auth-shell single-auth-shell">
      <section className="auth-panel recovery-panel">
        <div className="panel-heading">
          <p className="eyebrow">Domaind / account recovery</p>
          <h2>Choose a new password</h2>
          <p className="muted">Use at least six characters for your new password.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="new-password">New password</label>
          <input id="new-password" type="password" autoComplete="new-password" minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} required />

          <label htmlFor="confirm-password">Confirm password</label>
          <input id="confirm-password" type="password" autoComplete="new-password" minLength={6} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} required />

          {errorMessage && <p className="form-message error-message" role="alert">{errorMessage}</p>}
          {successMessage && <p className="form-message success-message" role="status">{successMessage}</p>}

          <button className="primary-button" type="submit" disabled={submitting}>
            {submitting ? 'Updating password...' : 'Update password'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default ResetPassword