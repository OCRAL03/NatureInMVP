import { useEffect, useState } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import SpeciesCard from '../content/components/SpeciesCard'
import type { SpeciesItem } from '../content/types'
import tingoMaria from '../../assets/images/explorar/tingo_maria.jpg'
import imgGallito from '../../assets/images/especies/gallito_de_las_rocas.jpg'
import imgOrquidea from '../../assets/images/especies/orquidea.jpg'
import imgTigrillo from '../../assets/images/especies/tigrillo.jpg'

export default function LandingPage() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let i = 0
    const id = setInterval(() => { i += 7; if (i > 1200) { i = 1200; clearInterval(id) } setCount(i) }, 20)
    return () => clearInterval(id)
  }, [])
  const species: SpeciesItem[] = [
    { id: 'sp-1', scientificName: 'Gallito de las rocas', description: 'Ave emblemática de la selva alta.', imageUrl: imgGallito, kingdom: 'Animalia', status: 'LC' },
    { id: 'sp-2', scientificName: 'Orquídea amazónica', description: 'Flor icónica de gran diversidad.', imageUrl: imgOrquidea, kingdom: 'Plantae', status: 'NT' },
    { id: 'sp-3', scientificName: 'Tigrillo', description: 'Felino ágil y nocturno.', imageUrl: imgTigrillo, kingdom: 'Animalia', status: 'VU' },
    { id: 'sp-4', scientificName: 'Orquídea epífita', description: 'Crece sobre árboles, sin parasitarlos.', imageUrl: imgOrquidea, kingdom: 'Plantae', status: 'LC' },
    { id: 'sp-5', scientificName: 'Gallito andino', description: 'Pariente cercano de colorido intenso.', imageUrl: imgGallito, kingdom: 'Animalia', status: 'LC' },
  ]
  return (
    <div>
      <section className="rounded-2xl overflow-hidden mb-6 relative">
        <img src={tingoMaria} alt="Tingo María" className="w-full h-64 md:h-96 object-cover" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl md:text-4xl font-semibold text-white drop-shadow mb-3">NatureIn: descubre y protege nuestra biodiversidad</h1>
          <p className="text-white/90 mb-4 max-w-2xl">Explora especies, lugares turísticos y contenidos educativos de Tingo María mientras aprendes de forma dinámica.</p>
          <div className="flex gap-3">
            <a href="/login?tab=register" className="btn-cta">Empieza ahora</a>
            <a href="/content" className="btn-outline">Explora especies</a>
            <a href="/explore" className="btn-outline">Explora lugares turísticos</a>
          </div>
        </div>
      </section>
      <section className="species-grid mb-6">
        {species.map((item) => (
          <SpeciesCard key={item.id} item={item} />
        ))}
      </section>
      <section className="grid md:grid-cols-3 gap-4 mb-6">
        <Card className="p-6">
          <div className="text-base font-semibold mb-1">Contenido educativo</div>
          <div className="text-sm text-gray-700">Accede a fichas, lecturas y recursos que se actualizan con datos abiertos.</div>
        </Card>
        <Card className="p-6">
          <div className="text-base font-semibold mb-1">Exploración guiada</div>
          <div className="text-sm text-gray-700">Rutas, lugares y actividades para conocer mejor la región.</div>
        </Card>
        <Card className="p-6">
          <div className="text-base font-semibold mb-1">Gamificación</div>
          <div className="text-sm text-gray-700">Desafíos, puntos y logros para motivar el aprendizaje sostenible.</div>
        </Card>
      </section>
      <section className="grid md:grid-cols-4 gap-4 mb-6">
        {[
          { title: 'Aprender', desc: 'Lecturas y videos', href: '/content' },
          { title: 'Jugar', desc: 'Desafíos y badges', href: '/gamify' },
          { title: 'Explorar', desc: 'Rutas y lugares', href: '/explore' },
          { title: 'Avistamientos', desc: 'Registra tu hallazgo', href: '/sightings' },
        ].map((f) => (
          <div key={f.title} className="feature-card">
            <div className="font-semibold mb-1">{f.title}</div>
            <div className="text-sm text-gray-700 mb-3">{f.desc}</div>
            <a className="btn-outline" href={f.href}>Ir</a>
          </div>
        ))}
      </section>
      <Card className="p-6">
        <div className="grid md:grid-cols-3 gap-4 items-start">
          <div>
            <div className="text-2xl font-semibold">{count}+</div>
            <div className="text-xs text-gray-600">Registros consultados</div>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            <Card className="p-4">
              <div className="pill pill-green mb-2">ODS 15</div>
              <div className="text-sm text-gray-700">Vida de ecosistemas terrestres: promovemos conocimiento y cuidado de flora/fauna.</div>
            </Card>
            <Card className="p-4">
              <div className="pill pill-yellow mb-2">ODS 13</div>
              <div className="text-sm text-muted">Acción por el clima: educación y rutas responsables para reducir impactos.</div>
            </Card>
            <Card className="p-4">
              <div className="pill pill-blue mb-2">ODS 4</div>
              <div className="text-sm text-muted">Educación de calidad: aprendizaje activo y accesible con datos abiertos.</div>
            </Card>
          </div>
          <div className="text-center">
            <a href="/login?tab=register" className="btn-cta">Únete gratis</a>
          </div>
        </div>
      </Card>
    </div>
  )
}
