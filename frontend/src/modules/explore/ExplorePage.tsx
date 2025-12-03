import Card from '../../components/ui/Card'

const places = [
  { title: 'Cueva de la Lechuzas', img: 'https://placehold.co/600x400?text=Cueva' },
  { title: 'Cueva de las Pavas', img: 'https://placehold.co/600x400?text=Pavas' },
  { title: 'Jardín Botánico', img: 'https://placehold.co/600x400?text=Jardin' },
  { title: 'Mariposario', img: 'https://placehold.co/600x400?text=Mariposario' },
]

export default function ExplorePage() {
  return (
    <div>
      <div className="card p-6 mb-6">
        <h1 className="text-2xl mb-3">Bienvenido a NatureIn</h1>
        <p className="mb-4">Adéntrate a conocer la belleza de Tingo María. Explora lugares y especies.</p>
        <button className="btn-primary">Empieza a Explorar</button>
      </div>

      <h2 className="text-xl mb-3">Explora Lugares</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {places.map((p) => (
          <Card key={p.title} className="p-2">
            <img src={p.img} alt={p.title} className="w-full h-32 object-cover rounded-md" />
            <div className="mt-2 font-semibold">{p.title}</div>
          </Card>
        ))}
      </div>

      <h2 className="text-xl mb-3">Aprende Jugando</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1,2,3,4].map((i) => (
          <Card key={i} className="p-3">
            <div className="font-semibold mb-1">Actividad {i}</div>
            <div className="text-sm text-gray-700">Contenido de ejemplo</div>
          </Card>
        ))}
      </div>
    </div>
  )
}
