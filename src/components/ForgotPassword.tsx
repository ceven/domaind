import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setErrorMessage('')
    setSuccessMessage('')

    const redirectTo = `${window.location.origin}${window.location.pathname}#/reset-password`
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })

    setSubmitting(false)

    if (error) {
      setErrorMessage(error.message)
      return
    }

    setSuccessMessage('Check your email for a link to reset your password.')
  }

  return (
    <main className="auth-shell single-auth-shell">
      <section className="auth-panel recovery-panel">
        <div className="panel-heading">
          <p className="eyebrow">Domaind / account recovery</p>
          <h2>Reset your password</h2>
          <p className="muted">Enter your email and Supabase will send you a secure reset link.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="recovery-email">Email address</label>
          <input id="recovery-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />

          {errorMessage && <p className="form-message error-message" role="alert">{errorMessage}</p>}
          {successMessage && <p className="form-message success-message" role="status">{successMessage}</p>}

          <button className="primary-button" type="submit" disabled={submitting}>
            {submitting ? 'Sending link...' : 'Email reset link'}
          </button>
        </form>

        <Link className="text-link" to="/login">Back to sign in</Link>
      </section>
    </main>
  )
}

export default ForgotPassword