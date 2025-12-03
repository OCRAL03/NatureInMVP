import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../../api/client'

export default function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const onLogout = () => { logout(); navigate('/login') }
  return (
    <nav className="flex items-center p-4 gradient-border bg-white">
      <div className="flex items-center gap-2">
        <Link to="/">
          <img src="/assets/naturein_logo.svg" alt="NatureIn" className="h-7" />
        </Link>
      </div>
      <div className="flex-1 flex justify-center gap-6">
        <Link to="/content" className="text-green-700">Aprender</Link>
        <Link to="/gamify" className="text-green-700">Jugar</Link>
        <Link to="/explore" className="text-green-700">Explorar</Link>
        <Link to="/sightings" className="text-green-700">Avistamientos</Link>
        <Link to="/demo" className="text-green-700">Demo</Link>
      </div>
      <div className="flex items-center gap-3">
        {!token ? (
          <>
            <Link to="/login?tab=register" className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 clickable-green">Regístrate</Link>
            <Link to="/login?tab=login" className="btn-primary">Iniciar sesión</Link>
          </>
        ) : (
          <button className="btn-primary" onClick={onLogout}>Logout</button>
        )}
      </div>
    </nav>
  )
}
