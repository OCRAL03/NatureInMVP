import { minijuegos } from './data'

export default function MinijuegosPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4">Minijuegos</h2>
        <div className="space-y-4">
          {minijuegos.map((m, idx) => (
            <div key={idx} className="p-4 rounded-card bg-white gradient-border">
              <div className="font-semibold">{m.titulo}</div>
              <div className="text-sm text-gray-700">{m.descripcion}</div>
              <div className="text-xs text-gray-600 mt-1">Tipo: {m.tipo}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

