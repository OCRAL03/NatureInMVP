import { useState } from 'react'
import api from '../../api/client'

export default function GamifyPage() {
  const [launch, setLaunch] = useState<{launch_url: string, params: Record<string, string>}|null>(null)

  const requestLaunch = async () => {
    const res = await api.post('/gamify/lti/launch', {
      launch_url: import.meta.env.VITE_LTI_LAUNCH_URL,
      consumer_key: import.meta.env.VITE_LTI_CONSUMER_KEY,
      shared_secret: import.meta.env.VITE_LTI_SHARED_SECRET,
    })
    setLaunch(res.data)
    setTimeout(() => {
      const form = document.getElementById('lti-launch-form') as HTMLFormElement
      if (form) form.submit()
    }, 100)
  }

  return (
    <div className="card p-4">
      <h1 className="text-xl mb-3">Actividades (Educaplay LTI 1.1)</h1>
      <button className="btn-primary mb-4" onClick={requestLaunch}>Lanzar actividad</button>

      {launch && (
        <form id="lti-launch-form" action={launch.launch_url} method="POST" target="_blank">
          {Object.entries(launch.params).map(([k, v]) => (
            <input key={k} type="hidden" name={k} value={v} />
          ))}
        </form>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="card p-3">
          <h2 className="font-semibold mb-2">Premios</h2>
          <button className="btn-primary" onClick={async () => {
            await api.post('/gamify/award', { points: 10, badge_name: 'Explorador' })
            alert('Puntos e insignia asignados')
          }}>Sumar 10 puntos</button>
        </div>
        <div className="card p-3">
          <h2 className="font-semibold mb-2">Mis Métricas</h2>
          <button className="btn-primary" onClick={async () => {
            const res = await api.get('/gamify/metrics')
            alert(`Puntos: ${res.data.total_points}\nInsignias: ${res.data.badges.join(', ')}`)
          }}>Ver</button>
        </div>
      </div>
    </div>
  )
}
