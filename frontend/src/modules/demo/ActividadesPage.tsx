import { actividades } from './data'

export default function ActividadesPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4">Actividades</h2>
        <div className="space-y-4">
          {actividades.map((a, idx) => (
            <div key={idx} className="p-4 rounded-card bg-white gradient-border">
              <div className="font-semibold">{a.titulo}</div>
              <div className="text-sm text-gray-700">{a.descripcion}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

