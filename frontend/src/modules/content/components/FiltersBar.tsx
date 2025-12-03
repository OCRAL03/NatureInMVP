import { useState } from 'react'

type Filters = { category?: string; family?: string; location?: string; estado?: string; alimentacion?: string; reproduccion?: string }

export default function FiltersBar({ onSearch }: { onSearch: (q: string, filters: Filters) => void }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [family, setFamily] = useState('')
  const [location, setLocation] = useState('')
  const [estado, setEstado] = useState('')
  const [alimentacion, setAlimentacion] = useState('')
  const [reproduccion, setReproduccion] = useState('')

  const submit = () => onSearch(query, { category, family, location, estado, alimentacion, reproduccion })

  return (
    <div className="flex flex-wrap gap-2 items-center mb-4">
      <input
        className="border rounded-md p-2 flex-1 min-w-[240px]"
        placeholder="¿Qué especie estás buscando?"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="btn-primary clickable-green" onClick={submit}>Buscar</button>
      <select className="border rounded-md p-2" value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Categoria</option>
        <option value="Plantae">Plantae</option>
        <option value="Animalia">Animalia</option>
      </select>
      <select className="border rounded-md p-2" value={family} onChange={(e) => setFamily(e.target.value)}>
        <option value="">Familia</option>
        <option value="Orchidaceae">Orchidaceae</option>
        <option value="Felidae">Felidae</option>
        <option value="Euphonidae">Euphonidae</option>
      </select>
      <select className="border rounded-md p-2" value={location} onChange={(e) => setLocation(e.target.value)}>
        <option value="">Ubicación</option>
        <option value="Tingo María">Tingo María</option>
        <option value="Huánuco">Huánuco</option>
        <option value="Perú">Perú</option>
      </select>
      <select className="border rounded-md p-2" value={estado} onChange={(e) => setEstado(e.target.value)}>
        <option value="">Estado de Conservación</option>
        <option value="LC">LC</option>
        <option value="NT">NT</option>
        <option value="VU">VU</option>
        <option value="EN">EN</option>
        <option value="CR">CR</option>
      </select>
      <select className="border rounded-md p-2" value={alimentacion} onChange={(e) => setAlimentacion(e.target.value)}>
        <option value="">Tipo de Alimentación</option>
        <option value="Herbívoro">Herbívoro</option>
        <option value="Carnívoro">Carnívoro</option>
        <option value="Omnívoro">Omnívoro</option>
      </select>
      <select className="border rounded-md p-2" value={reproduccion} onChange={(e) => setReproduccion(e.target.value)}>
        <option value="">Tipo Reproducción</option>
        <option value="Sexuada">Sexuada</option>
        <option value="Asexuada">Asexuada</option>
      </select>
    </div>
  )
}
