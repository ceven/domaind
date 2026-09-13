import Authentication from './components/Authentication'
import ForgotPassword from './components/ForgotPassword'
import LandingPage from './components/LandingPage'
import ProtectedRoute from './components/ProtectedRoute'
import ResetPassword from './components/ResetPassword'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Authentication />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<LandingPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}

export default App
