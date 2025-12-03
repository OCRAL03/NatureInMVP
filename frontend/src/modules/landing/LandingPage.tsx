import { useEffect, useState } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

export default function LandingPage() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let i = 0
    const id = setInterval(() => { i += 7; if (i > 1200) { i = 1200; clearInterval(id) } setCount(i) }, 20)
    return () => clearInterval(id)
  }, [])
  return (
    <div>
      <section className="landing-hero">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h1 className="text-2xl font-semibold mb-2">NatureIn</h1>
            <p className="text-sm text-gray-700 mb-3">Aprende, explora y juega mientras descubres la biodiversidad de Tingo María.</p>
            <div className="flex gap-3">
              <a href="/login?tab=register" className="btn-cta">Empieza ahora</a>
              <a href="/content" className="btn-outline">Explorar especies</a>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-md">
            <img src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=60" alt="Bosque" className="w-full h-full object-cover" />
          </div>
        </div>
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
        <div className="grid md:grid-cols-3 gap-4 items-center">
          <div className="text-center">
            <div className="text-2xl font-semibold">{count}+</div>
            <div className="text-xs text-gray-600">Registros consultados</div>
          </div>
          <div className="footer-links justify-center">
            <span className="pill pill-green">ODS 15</span>
            <span className="pill pill-yellow">ODS 13</span>
            <span className="pill pill-blue">ODS 4</span>
          </div>
          <div className="text-center">
            <a href="/login?tab=register" className="btn-cta">Únete gratis</a>
          </div>
        </div>
      </Card>
    </div>
  )
}
