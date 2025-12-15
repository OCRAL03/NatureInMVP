import { useEffect, useState } from 'react'
import api from '../../api/client'
import FiltersBar from './components/FiltersBar'
import SpeciesCard from './components/SpeciesCard'
import type { SpeciesItem } from './types'
import Button from '../../components/ui/Button'

const bannerDocente = new URL('../../assets/images/especies/docente-banner.jpg', import.meta.url).href

export default function ExploreCatalogPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SpeciesItem[]>([])
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState<string | null>(null)
  const [selected, setSelected] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('teacher_guide_species') || '[]') } catch { return [] }
  })

  const loadMe = async () => {
    try {
      const u = await api.get('/user/me/')
      setRole(u.data?.role || null)
    } catch {}
  }

  useEffect(() => { loadMe() }, [])

  const onSearch = async (
    q?: string,
    filters?: { category?: string; family?: string; location?: string; estado?: string; alimentacion?: string; reproduccion?: string }
  ) => {
    setLoading(true)
    try {
      const res = await api.post('/content/generate-ficha', { query: q ?? query, filters: filters || {} })
      setResults(res.data.items || [])
    } finally {
      setLoading(false)
    }
  }

  const toggleSelect = (name: string) => {
    const next = selected.includes(name) ? selected.filter(x => x !== name) : [...selected, name]
    setSelected(next)
    localStorage.setItem('teacher_guide_species', JSON.stringify(next))
  }

  const generateGuide = () => {
    window.location.href = '/content/ficha'
  }

  return (
    <div>
      {role === 'teacher' && (
        <div className="relative mb-4 rounded-md overflow-hidden">
          <img src={bannerDocente} alt="Modo Docente" className="w-full h-40 object-cover" />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-between px-4">
            <div className="text-white font-semibold">Modo Docente</div>
            <div className="flex items-center gap-2">
              <div className="text-white text-sm">Seleccionadas: {selected.length}</div>
              <Button onClick={generateGuide}>Generar Guía</Button>
            </div>
          </div>
        </div>
      )}
      <div className="search-hero">
        <div className="filters-bar">
          <FiltersBar onSearch={(q, f) => { setQuery(q); onSearch(q, f) }} />
        </div>
      </div>
      {loading && <div>Cargando...</div>}
      <div className="species-grid">
        {results.map((s) => (
          <div key={s.id} className="relative">
            {role === 'teacher' && (
              <input type="checkbox" className="absolute top-2 left-2 w-4 h-4" checked={selected.includes(s.scientificName)} onChange={() => toggleSelect(s.scientificName)} />
            )}
            <SpeciesCard item={s} />
          </div>
        ))}
      </div>
    </div>
  )
}