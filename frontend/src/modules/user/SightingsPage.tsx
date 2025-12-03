import { useEffect, useState } from 'react'
import api from '../../api/client'

type Sighting = {
  id: number
  species: string
  location: string
  created_at: string
}

export default function SightingsPage() {
  const [items, setItems] = useState<Sighting[]>([])
  const [species, setSpecies] = useState('')
  const [location, setLocation] = useState('')

  const load = async () => {
    const res = await api.get('/user/sightings')
    setItems(res.data)
  }

  const add = async () => {
    await api.post('/user/sightings', { species, location })
    setSpecies(''); setLocation('')
    load()
  }

  useEffect(() => { load() }, [])

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="card p-4">
        <h2 className="text-lg mb-2">Nuevo Avistamiento</h2>
        <input className="border p-2 rounded-md mb-2 w-full" placeholder="Especie" value={species} onChange={(e) => setSpecies(e.target.value)} />
        <input className="border p-2 rounded-md mb-2 w-full" placeholder="Ubicación" value={location} onChange={(e) => setLocation(e.target.value)} />
        <button className="btn-primary" onClick={add}>Guardar</button>
      </div>
      <div className="card p-4">
        <h2 className="text-lg mb-2">Lista de Avistamientos</h2>
        <ul className="space-y-2">
          {items.map(it => (
            <li key={it.id} className="border p-2 rounded-md">
              <div className="font-semibold">{it.species}</div>
              <div className="text-sm">{it.location} · {new Date(it.created_at).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
