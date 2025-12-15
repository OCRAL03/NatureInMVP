import { useLocation, useNavigate } from 'react-router-dom'
import Card from '../../components/ui/Card'

export default function ActivityPage() {
  const { state } = useLocation() as { state?: { placeTitle?: string } }
  const place = state?.placeTitle || 'la zona'
  const navigate = useNavigate()

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card p-6">
        <h1 className="text-2xl font-bold mb-4">Actividad: Explora {place}</h1>
        <p className="mb-4">Esta es una actividad de prueba creada para demostrar la navegación desde la página de exploración. Sigue las instrucciones para completarla.</p>

        <Card className="p-4 mb-4">
          <h2 className="font-semibold">Misión</h2>
          <p className="text-sm text-gray-700">Observa el lugar y registra 3 especies diferentes que puedas identificar. Puedes usar la sección de "Avistamientos" para crear tus registros.</p>
        </Card>

        <div className="flex gap-2">
          <button className="btn-primary" onClick={() => navigate('/sightings')}>Ir a Avistamientos</button>
          <button className="btn-secondary" onClick={() => alert('Actividad completada (simulación).')}>Marcar como completada</button>
        </div>
      </div>
    </div>
  )
}