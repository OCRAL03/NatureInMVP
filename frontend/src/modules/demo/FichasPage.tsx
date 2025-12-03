import { fichas } from './data'

export default function FichasPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4">Fichas educativas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {fichas.map(f => (
            <div key={f.nombre} className="rounded-card bg-white gradient-border overflow-hidden">
              <img src={f.imagen} alt={f.comun} className="w-full h-40 object-cover" />
              <div className="p-3">
                <div className="font-semibold">{f.comun}</div>
                <div className="text-sm text-gray-700 italic">{f.nombre}</div>
                <div className="text-sm text-gray-700 mt-2">{f.descripcion}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

