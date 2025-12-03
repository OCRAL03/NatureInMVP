import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import type { SpeciesItem } from '../types'

export default function SpeciesCard({ item }: { item: SpeciesItem }) {
  const img = item.imageUrl || '/naturein_logo.svg'
  return (
    <Card className="p-3">
      <img
        src={img}
        alt={item.scientificName}
        className="w-full h-40 object-cover rounded-md mb-2"
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/naturein_logo.svg' }}
      />
      <div className="font-semibold mb-1">{item.scientificName}</div>
      <div className="text-sm text-gray-700 mb-3">{item.description || 'Sin descripción'}</div>
      <div className="flex gap-2">
        <Button>Ver detalles</Button>
        <Button className="border-green-300">Guardar</Button>
      </div>
    </Card>
  )
}
