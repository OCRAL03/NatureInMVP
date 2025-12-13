import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { motion } from 'framer-motion'
import Card from '../../components/ui/Card'
import imgLechuzas from '../../assets/images/explorar/cueva_de_las_lechuzas.jpeg'
import imgPavas from '../../assets/images/explorar/cueva_de_las_pavas.jpeg'
import imgJardin from '../../assets/images/explorar/jardin_botanico.jpeg'
import imgMariposario from '../../assets/images/explorar/mariposario.jpeg'
import imgserpentario from '../../assets/images/explorar/serpentario.jpg'
import imgmirador_cruz from '../../assets/images/explorar/mirador_cruz.jpg'
import imglaguna_de_los_milagros from '../../assets/images/explorar/laguna_de_los_milagros.jpeg'
import imgcotomono from '../../assets/images/explorar/cotomono.jpg'
import imgcatarata_quinceañera from '../../assets/images/explorar/catarata_quinceañera.jpg'
import imgparque_nacional_tingo_maria from '../../assets/images/explorar/parque_nacional_tm.webp'
import imgcatarata_golondrinas from '../../assets/images/explorar/catarata_santa_carmen.jpg'
import imgcascada_velo_ninfas from '../../assets/images/explorar/cascada_velo_ninfas.jpg'
import imgzoologico_unas from '../../assets/images/explorar/zoologico_unas.webp'

import { useTranslation } from 'react-i18next'
<<<<<<< HEAD
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
=======
import { useState, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Place, SpeciesInfo } from './utils'
import { initLocalSpecies, getSuggestedActivities } from './utils'
import PlaceDetailsPanel from './PlaceDetailsPanel'

const allPlaces: Place[] = [
  {
    title: 'Zoológico UNAS',
    coords: [-9.31264, -75.99576],
    img: imgzoologico_unas,
    images: [imgzoologico_unas],
    description: 'Pequeño zoológico universitario que alberga especies nativas de la región, incluyendo aves, reptiles y mamíferos. Enfocado en la conservación y educación ambiental.',
    review: 'Ideal para familias y estudiantes interesados en la fauna local. Buenas instalaciones y guías informativos.'
  },
  {
    title: 'Cuevas de las Lechuzas',
    coords: [-9.32898, -76.02689],
    img: imgLechuzas, 
  images: [imgLechuzas],
    description: 'Famosa caverna natural, hábitat de guácharos (mal llamados lechuzas) y murciélagos. Un ecosistema único en el Parque Nacional Tingo María.',
    review: 'Impresionante formación rocosa, ideal para amantes de la espeleología y la observación de aves nocturnas.'
  },
  {
    title: 'Parque Nacional Tingo María',
    coords: [-9.37256, -75.99941],
    img: imgparque_nacional_tingo_maria,
    images: [imgparque_nacional_tingo_maria],
    description: 'Área protegida que alberga una gran biodiversidad, incluyendo la famosa formación rocosa "La Bella Durmiente". Ideal para senderismo y observación de fauna.',
    review: 'Un paraíso para los amantes de la naturaleza, con rutas bien señalizadas y vistas espectaculares.',
  },
  {
    title: 'Catarata Golondrinas',
    coords: [-9.36083, -76.06485],
    img: imgcatarata_golondrinas,
    images: [imgcatarata_golondrinas],
    description: 'Cascada de 20 metros de altura rodeada de exuberante vegetación. Un lugar popular para nadar y relajarse en la naturaleza.',
    review: 'El sonido del agua y el entorno selvático crean una atmósfera tranquila y revitalizante.'
  },
  {
    title: 'Cascada Velo de las Ninfas',
    coords: [-9.35012, -76.05023],
    img: imgcascada_velo_ninfas,
    images: [imgcascada_velo_ninfas],
    description: 'Hermosa cascada que forma un velo de agua cayendo desde una altura considerable. Ideal para fotografía y disfrutar del paisaje natural.',
    review: 'Un lugar mágico donde la naturaleza muestra su belleza en todo su esplendor.'
  },
  {
    title: 'Catarata Quinceañera',
    coords: [-9.36161, -75.97932],
    img: imgcatarata_quinceañera,
    images: [imgcatarata_quinceañera],
    description: 'Cascada de 15 metros de altura ubicada en un entorno selvático, perfecta para nadar y disfrutar de la naturaleza.',
    review: 'Un lugar refrescante con aguas cristalinas. Ideal para un día de picnic y aventura.'
  },
  {
    title: 'Cuevas de las Pavas', 
    coords: [-9.37442, -75.96127], 
    img: imgPavas, 
  images: [imgPavas],
    description: 'Un conjunto de pequeñas cuevas y cascadas cerca del río, perfecto para un baño refrescante y senderismo ligero.',
    review: 'Ambiente tranquilo y hermoso paisaje fluvial. Genial para pasar la tarde con la familia.'
  },
  {
    title: 'Jardín Botánico', 
    coords: [-9.30416, -76.00407], 
    img: imgJardin, 
    images: [imgJardin],
    description: 'Colección de flora regional, incluyendo orquídeas y plantas medicinales. Un centro de investigación y educación ambiental.',
    review: 'Muy educativo y bien mantenido. La variedad de orquídeas es espectacular.'
  },
  {
    title: 'Mariposario', 
    coords: [-9.28531, -75.99271], 
    img: imgMariposario, 
  images: [imgMariposario],
    description: 'Un área dedicada a la crianza y exhibición de mariposas nativas de la selva alta. Contribuye a la conservación de especies.',
    review: 'Experiencia mágica, lleno de color y vida. Se pueden observar las etapas de la metamorfosis.'
  },
  {
    title: 'Serpentario', 
    coords: [-9.28442, -76.00690], 
    img: imgserpentario, 
  images: [imgserpentario],
    description: 'Alberga diversas especies de serpientes y reptiles de la Amazonía. Importante para la educación sobre la fauna local.',
    review: 'Interesante para conocer más sobre los reptiles, aunque podría tener mejores instalaciones.'
  },
  {
    title: 'Mirador', 
    coords: [-9.28965, -75.99734], 
    img: imgmirador_cruz, 
    images: [imgmirador_cruz],
    description: 'Punto panorámico que ofrece vistas espectaculares de la ciudad de Tingo María y la geografía circundante, incluyendo la Bella Durmiente.',
    review: 'Vistas inmejorables al atardecer. Es la mejor manera de apreciar el paisaje de la "Bella Durmiente".'
  },
  {
    title: 'Laguna de los Milagros', 
    coords: [-9.144916, -75.995331], 
    img: imglaguna_de_los_milagros, 
  images: [imglaguna_de_los_milagros],
    description: 'Una laguna de aguas tranquilas rodeada de vegetación, popular para paseos en bote y actividades recreativas. Se dice que sus aguas tienen propiedades curativas.',
    review: 'Un lugar ideal para relajarse y desconectar. La niebla matinal le da un aire misterioso.'
  },
  {
    title: 'Coto Mono', 
    coords: [-9.31667, -76.03333], 
    img: imgcotomono, 
    images: [imgcotomono],
    description: 'Una zona boscosa conocida por ser hábitat de diversas especies de monos, parte de la conservación de la fauna local.',
    review: 'Si tienes suerte, verás monos en su entorno natural. Es importante ir con un guía.'
  }
]

const INITIAL_DISPLAY_COUNT = 4;
>>>>>>> 35f5be2 (cambios mapa)

export default function ExplorePage() {
  const { t } = useTranslation()
  const [speciesDetails, setSpeciesDetails] = useState<Record<string, SpeciesInfo[]>>({})
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null) 
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT)
  const placesRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()

  const hasMorePlaces = allPlaces.length > displayCount

  const visiblePlaces = allPlaces.slice(0, displayCount)

  const placesForMap = allPlaces

  const loadSpecies = async (p: Place) => {
    // Only load local/specified species for the place.
    // We avoid external API calls here to ensure the list is specific to the site.
    if (speciesDetails[p.title]) return
    const local = p.localSpecies || []
    setSpeciesDetails((prev) => ({ ...prev, [p.title]: [...local] }))
  }

  const handlePlaceClick = (place: Place) => {
    setSelectedPlace(place)
    loadSpecies(place)
  }

  const currentSpecies = useMemo(() => {
    return selectedPlace ? speciesDetails[selectedPlace.title] || [] : []
  }, [selectedPlace, speciesDetails])

  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [inlinePreview, setInlinePreview] = useState<Place | null>(null)

  const onStartExploring = () => {
    // expand to show places and scroll to them
    setDisplayCount(allPlaces.length)
    setTimeout(() => placesRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  const suggestedActivities = (place?: Place) => getSuggestedActivities(place)


  // PlaceDetailsPanel is implemented in its own file `PlaceDetailsPanel.tsx` to keep this component lean

  return (
    <div>
      <PlaceDetailsPanel
        selectedPlace={selectedPlace}
        speciesDetails={speciesDetails}
        setSelectedPlace={setSelectedPlace}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        handlePlaceClick={handlePlaceClick}
      />

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="card p-6 mb-6">
        <h1 className="text-2xl mb-3">{t('headings.welcome')}</h1>
        <p className="mb-4">{t('texts.welcomeDesc')}</p>
        <button className="btn-primary" onClick={onStartExploring}>{t('actions.startExploring')}</button>
      </motion.div>
      
      <hr className="my-6 border-gray-200" />

  <h2 className="text-xl mb-3">{t('headings.explorePlaces')}</h2>
  <div ref={placesRef} />
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {visiblePlaces.map((p) => (
          <motion.div key={p.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <Card className="p-2 hover:shadow-lg transition duration-200" onClick={() => handlePlaceClick(p)}>
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setInlinePreview(inlinePreview?.title === p.title ? null : p); }}
                  aria-label={`Ver reseña de ${p.title}`}
                  className="block w-full h-32 p-0 m-0 bg-transparent border-0"
                >
                  <img src={p.img} alt={p.title} className="w-full h-32 object-cover rounded-md" />
                </button>
              </div>
              <div className="mt-2 font-semibold">{p.title}</div>
            </Card>

            {inlinePreview?.title === p.title && (
              <div className="mt-2 p-3 bg-white rounded-md shadow-sm border border-gray-200">
                <div className="text-sm text-gray-700 mb-2">{p.description}</div>
                <blockquote className="text-sm italic text-gray-600 border-l-4 border-green-500 pl-3">{p.review}</blockquote>
                <div className="mt-2 flex gap-2">
                  <button className="text-primary font-semibold" onClick={() => handlePlaceClick(p)}>Ver más</button>
                  <button className="text-sm text-muted" onClick={() => setInlinePreview(null)}>Cerrar</button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
      
      {hasMorePlaces && (
        <div className="flex justify-center mb-6">
            <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                onClick={() => setDisplayCount(allPlaces.length)} 
                className="text-primary font-semibold py-2 px-4 rounded-full hover:bg-green-50 transition duration-300 flex items-center gap-1"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
                Ver más lugares para explorar
            </motion.button>
        </div>
      )}
      
      {!hasMorePlaces && allPlaces.length > INITIAL_DISPLAY_COUNT && (
        <div className="flex justify-center mb-6">
            <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                onClick={() => setDisplayCount(INITIAL_DISPLAY_COUNT)} 
                // ESTILO DE OCULTAR: Enlace sutil con ícono hacia arriba
                className="text-primary font-semibold py-2 px-4 rounded-full hover:bg-green-50 transition duration-300 flex items-center gap-1"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
                Ocultar
            </motion.button>
        </div>
      )}
      
      <hr className="my-6 border-gray-200" />
      
      <div className="mb-6">
        <MapContainer center={[-9.300, -75.990]} zoom={12} scrollWheelZoom className="h-64 w-full rounded-xl shadow-md">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
          {placesForMap.map((p) => (
            <CircleMarker 
              key={p.title} 
              center={p.coords as any} 
              radius={8} 
              pathOptions={{ color: '#4CAF50' }} 
              eventHandlers={{ 
                  click: () => handlePlaceClick(p) 
              }}
            >
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
      
      <hr className="my-6 border-gray-200" />
      
      <h2 className="text-xl mb-3">{t('headings.learnPlaying')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {suggestedActivities(selectedPlace).map((a) => (
          <Card key={a.id} className="p-3 flex flex-col justify-between">
            <div>
              <div className="font-semibold mb-1">{a.title}</div>
              <div className="text-sm text-muted">{a.desc}</div>
            </div>
            <div className="mt-3 flex gap-2">
              <button className="btn-secondary" onClick={() => navigate(a.to, { state: { placeTitle: selectedPlace?.title } })}>
                Ir a la actividad
              </button>
              {a.id === 'lti' && (
                <button className="btn-primary" onClick={() => navigate('/gamify')}>
                  Lanzar juego
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>
   </div>
  )
}