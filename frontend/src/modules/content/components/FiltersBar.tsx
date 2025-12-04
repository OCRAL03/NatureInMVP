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
  const [showPanel, setShowPanel] = useState(false)

  const submit = () => onSearch(query, { category, family, location, estado, alimentacion, reproduccion })

  return (
    <div className="space-y-2 w-full">
      <div className="flex items-center gap-2">
        <input
          className="input-field flex-1 min-w-[240px] rounded-md"
          placeholder="¿Qué especie estás buscando?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn-primary clickable-green" onClick={submit}>Buscar</button>
        <button className="btn-outline md:hidden" onClick={() => setShowPanel(true)}>Filtros de especies</button>
      </div>

      <div className="hidden md:flex flex-wrap gap-2 items-center w-full">
        <select className="input-field flex-1" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Categoria</option>
          <option value="Plantae">Plantae</option>
          <option value="Animalia">Animalia</option>
        </select>
        <select className="input-field flex-1" value={family} onChange={(e) => setFamily(e.target.value)}>
          <option value="">Familia</option>
          <option value="Orchidaceae">Orchidaceae</option>
          <option value="Felidae">Felidae</option>
          <option value="Euphonidae">Euphonidae</option>
        </select>
        <select className="input-field flex-1" value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="">Ubicación</option>
          <option value="Tingo María">Tingo María</option>
          <option value="Huánuco">Huánuco</option>
          <option value="Perú">Perú</option>
        </select>
        <select className="input-field flex-1" value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="">Estado de Conservación</option>
          <option value="LC">Preocupación menor (LC)</option>
          <option value="NT">Casi amenazada (NT)</option>
          <option value="VU">Vulnerable (VU)</option>
          <option value="EN">En peligro (EN)</option>
          <option value="CR">En peligro crítico (CR)</option>
        </select>
        <select className="input-field flex-1" value={alimentacion} onChange={(e) => setAlimentacion(e.target.value)}>
          <option value="">Tipo de Alimentación</option>
          <option value="Herbívoro">Herbívoro</option>
          <option value="Carnívoro">Carnívoro</option>
          <option value="Omnívoro">Omnívoro</option>
        </select>
        <select className="input-field flex-1" value={reproduccion} onChange={(e) => setReproduccion(e.target.value)}>
          <option value="">Tipo Reproducción</option>
          <option value="Sexuada">Sexuada</option>
          <option value="Asexuada">Asexuada</option>
        </select>
      </div>

      {showPanel && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowPanel(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-surface border-t border-base rounded-t-xl p-4">
            <div className="text-sm font-semibold mb-2">Filtros de especies</div>
            <div className="grid grid-cols-1 gap-2">
              <select className="input-field" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Categoria</option>
                <option value="Plantae">Plantae</option>
                <option value="Animalia">Animalia</option>
              </select>
              <select className="input-field" value={family} onChange={(e) => setFamily(e.target.value)}>
                <option value="">Familia</option>
                <option value="Orchidaceae">Orchidaceae</option>
                <option value="Felidae">Felidae</option>
                <option value="Euphonidae">Euphonidae</option>
              </select>
              <select className="input-field" value={location} onChange={(e) => setLocation(e.target.value)}>
                <option value="">Ubicación</option>
                <option value="Tingo María">Tingo María</option>
                <option value="Huánuco">Huánuco</option>
                <option value="Perú">Perú</option>
              </select>
              <select className="input-field" value={estado} onChange={(e) => setEstado(e.target.value)}>
                <option value="">Estado de Conservación</option>
                <option value="LC">Preocupación menor (LC)</option>
                <option value="NT">Casi amenazada (NT)</option>
                <option value="VU">Vulnerable (VU)</option>
                <option value="EN">En peligro (EN)</option>
                <option value="CR">En peligro crítico (CR)</option>
              </select>
              <select className="input-field" value={alimentacion} onChange={(e) => setAlimentacion(e.target.value)}>
                <option value="">Tipo de Alimentación</option>
                <option value="Herbívoro">Herbívoro</option>
                <option value="Carnívoro">Carnívoro</option>
                <option value="Omnívoro">Omnívoro</option>
              </select>
              <select className="input-field" value={reproduccion} onChange={(e) => setReproduccion(e.target.value)}>
                <option value="">Tipo Reproducción</option>
                <option value="Sexuada">Sexuada</option>
                <option value="Asexuada">Asexuada</option>
              </select>
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <button className="btn-outline" onClick={() => setShowPanel(false)}>Cerrar</button>
              <button className="btn-cta" onClick={() => { submit(); setShowPanel(false) }}>Aplicar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
