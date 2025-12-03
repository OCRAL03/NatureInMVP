import { Link } from 'react-router-dom'

export default function DemoPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="card p-6">
        <h1 className="text-2xl font-bold mb-4">Demo NatureIn</h1>
        <p className="text-gray-700 mb-6">MVP con datos locales para validar la experiencia.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/demo/usuarios" className="pill pill-blue clickable-green">Usuarios</Link>
          <Link to="/demo/actividades" className="pill pill-yellow clickable-green">Actividades</Link>
          <Link to="/demo/fichas" className="pill pill-green clickable-green">Fichas educativas</Link>
          <Link to="/demo/lugares" className="pill pill-green clickable-green">Lugares turísticos</Link>
          <Link to="/demo/minijuegos" className="pill pill-yellow clickable-green">Minijuegos</Link>
        </div>
      </div>
    </div>
  )
}

