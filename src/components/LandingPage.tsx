import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function LandingPage() {
  const navigate = useNavigate()

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut()
    if (!error) navigate('/login', { replace: true })
  }

  return (
    <main className="landing-shell">
      <section className="landing-panel">
        <p className="eyebrow">Domaind / property intelligence</p>
        <h1>Welcome to your watchlist.</h1>
        <p className="muted">Your saved properties and analysis will live here.</p>
        <button className="secondary-button" type="button" onClick={handleSignOut}>Log out</button>
      </section>
    </main>
  )
}

export default LandingPage