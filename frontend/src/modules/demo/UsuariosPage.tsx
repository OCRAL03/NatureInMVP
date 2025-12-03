import { usuarios } from './data'

export default function UsuariosPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4">Usuarios</h2>
        <ul className="divide-y">
          {usuarios.map(u => (
            <li key={u.username} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-semibold">{u.nombre}</div>
                <div className="text-sm text-gray-600">@{u.username}</div>
              </div>
              <span className="pill pill-blue">{u.rol}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

