import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { motion } from 'framer-motion'
import Card from '../../components/ui/Card'
import imgLechuzas from '../../assets/images/explorar/cueva_de_las_lechuzas.jpeg'
import imgPavas from '../../assets/images/explorar/cueva_de_las_pavas.jpeg'
import imgJardin from '../../assets/images/explorar/jardin_botanico.jpeg'
import imgMariposario from '../../assets/images/explorar/mariposario.jpeg'
import { useTranslation } from 'react-i18next'
import { useEffect, useMemo, useState } from 'react'
import api from '../../api/client'

type Place = { id: number; title: string; coords: [number, number]; img: string }
type SpeciesInfo = { name: string; image?: string }

function usePlaces(): Place[] {
  const [items, setItems] = useState<Place[]>([])
  const imageMap = useMemo(() => ({
    'cueva_de_las_lechuzas.jpeg': imgLechuzas,
    'cueva_de_las_pavas.jpeg': imgPavas,
    'jardin_botanico.jpeg': imgJardin,
    'mariposario.jpeg': imgMariposario,
  }), [])
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/user/places')
        const mapped: Place[] = (data || []).map((p: any) => ({
          id: p.id,
          title: p.title,
          coords: [p.lat, p.lng],
          img: imageMap[p.image_url] || imgLechuzas,
        }))
        setItems(mapped)
      } catch {}
    }
    load()
  }, [imageMap])
  return items
}

export default function ExplorePage() {
  const { t } = useTranslation()
  const places = usePlaces()
  const [details, setDetails] = useState<Record<string, SpeciesInfo[]>>({})
  const [institutions, setInstitutions] = useState<any[]>([])
  const [placesDocs, setPlacesDocs] = useState<any[]>([])

  const loadSpecies = async (p: Place) => {
    if (details[p.title]) return
    try {
      const [lat, lng] = p.coords
      const gbifUrl = `https://api.gbif.org/v1/occurrence/search?limit=10&decimalLatitude=${lat}&decimalLongitude=${lng}`
      const inatUrl = `https://api.inaturalist.org/v1/observations?per_page=10&lat=${lat}&lng=${lng}`
      const [gbifRes, inatRes] = await Promise.all([fetch(gbifUrl), fetch(inatUrl)])
      const gbifJson = await gbifRes.json()
      const inatJson = await inatRes.json()
      const gbifNames: SpeciesInfo[] = (gbifJson.results || []).slice(0, 3).map((r: any) => ({ name: r.species || r.scientificName || 'Especie' }))
      const inatInfos: SpeciesInfo[] = (inatJson.results || []).slice(0, 3).map((o: any) => ({ name: o.species_guess || o.taxon?.name || 'Observación', image: o.photos?.[0]?.url ? o.photos[0].url.replace('square', 'medium') : undefined }))
      setDetails((prev) => ({ ...prev, [p.title]: [...gbifNames, ...inatInfos] }))
    } catch {}
  }
  useEffect(() => {
    const loadDocs = async () => {
      try {
        const inst = await api.get('/user/docs/institutions')
        setInstitutions(inst.data || [])
      } catch {}
      try {
        const plc = await api.get('/user/docs/places')
        setPlacesDocs(plc.data || [])
      } catch {}
    }
    loadDocs()
  }, [])
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="card p-6 mb-6">
        <h1 className="text-2xl mb-3">{t('headings.welcome')}</h1>
        <p className="mb-4">{t('texts.welcomeDesc')}</p>
        <button className="btn-primary">{t('actions.startExploring')}</button>
      </motion.div>

      <h2 className="text-xl mb-3">{t('headings.explorePlaces')}</h2>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {places.map((p) => (
          <motion.div key={p.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <Card className="p-2">
              <img src={p.img} alt={p.title} className="w-full h-32 object-cover rounded-md" />
              <div className="mt-2 font-semibold">{p.title}</div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="mb-6">
        <MapContainer center={[-9.300, -75.990]} zoom={12} scrollWheelZoom className="h-64 w-full rounded-xl shadow-md">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
          {places.map((p) => (
            <CircleMarker key={p.title} center={p.coords as any} radius={8} pathOptions={{ color: '#4CAF50' }} eventHandlers={{ click: () => loadSpecies(p) }}>
              <Popup>
                <div className="font-semibold mb-2">{p.title}</div>
                <div className="space-y-2">
                  {(details[p.title] || []).map((s, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      {s.image ? <img src={s.image} alt={s.name} className="w-10 h-10 object-cover rounded-md" /> : <div className="w-10 h-10 rounded-md bg-surface border border-base" />}
                      <span className="text-sm">{s.name}</span>
                    </div>
                  ))}
                  {!details[p.title] && <div className="text-xs text-muted">Cargando especies y observaciones...</div>}
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      <h2 className="text-xl mb-3">{t('headings.learnPlaying')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1,2,3,4].map((i) => (
          <Card key={i} className="p-3">
            <div className="font-semibold mb-1">Actividad {i}</div>
            <div className="text-sm text-muted">Contenido de ejemplo</div>
          </Card>
        ))}
      </div>
      <h2 className="text-xl mt-6 mb-3">Instituciones educativas</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {institutions.slice(0, 9).map((ins: any, idx: number) => (
          <Card key={idx} className="p-3">
            <div className="font-semibold">{ins.name}</div>
            <div className="text-sm text-muted">{ins.address || ''}</div>
            {ins.phone && <div className="text-xs text-muted">Tel: {ins.phone}</div>}
          </Card>
        ))}
      </div>
      <h2 className="text-xl mt-6 mb-3">Lugares turísticos</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {placesDocs.slice(0, 9).map((pl: any, idx: number) => (
          <Card key={idx} className="p-3">
            <div className="font-semibold">{pl.title}</div>
            <div className="text-sm text-muted">{pl.description || ''}</div>
            {pl.location && <div className="text-xs text-muted">{pl.location}</div>}
          </Card>
        ))}
      </div>
    </div>
  )
}
