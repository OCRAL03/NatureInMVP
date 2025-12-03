import { lugares } from './data'

export default function LugaresPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4">Lugares turísticos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {lugares.map(l => (
            <div key={l.nombre} className="rounded-card bg-white gradient-border overflow-hidden">
              <img src={l.imagen} alt={l.nombre} className="w-full h-40 object-cover" />
              <div className="p-3">
                <div className="font-semibold">{l.nombre}</div>
                <div className="text-sm text-gray-700 mt-2">{l.descripcion}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

