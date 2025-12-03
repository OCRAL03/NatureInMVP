import { useState } from 'react'
import api from '../../api/client'
import FiltersBar from './components/FiltersBar'
import SpeciesCard from './components/SpeciesCard'
import type { SpeciesItem } from './types'
import LearnHero from './components/LearnHero'
import ActivitiesList from './components/ActivitiesList'
const bannerTigrillo = new URL('../../assets/images/especies/tigrillo.jpg', import.meta.url).href

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SpeciesItem[]>([])
  const [loading, setLoading] = useState(false)

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

  return (
    <div>
      <div className="search-hero">
        <img className="search-hero-banner" src={bannerTigrillo} alt="Tigrillo" />
        <div className="filters-bar">
          <FiltersBar onSearch={(q, f) => { setQuery(q); onSearch(q, f) }} />
        </div>
      </div>
      {loading && <div>Cargando...</div>}
      <div className="species-grid">
        {results.map((s) => (
          <SpeciesCard key={s.id} item={s} />
        ))}
      </div>
      <LearnHero />
      <ActivitiesList />
    </div>
  )
}
