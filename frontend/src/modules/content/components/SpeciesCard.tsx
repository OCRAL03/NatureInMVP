import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import type { SpeciesItem } from '../types'
import { Leaf, PawPrint, Share2, ExternalLink } from 'lucide-react'

export default function SpeciesCard({ item }: { item: SpeciesItem }) {
  const img = item.imageUrl || '/naturein_logo.svg'
  const isFlora = (item.kingdom || '').toLowerCase() === 'plantae'
  const statusMap: Record<string, string> = {
    LC: 'Preocupación menor',
    NT: 'Casi amenazada',
    VU: 'Vulnerable',
    EN: 'En peligro',
    CR: 'En peligro crítico',
  }
  const statusLabel = statusMap[(item.status || '').toUpperCase()] || undefined
  return (
    <Card className="p-3">
      <div className="text-xs text-muted flex items-center gap-2 mb-2">
        {isFlora ? <Leaf className="w-4 h-4" /> : <PawPrint className="w-4 h-4" />}
        <span>{isFlora ? 'Ficha Flora' : 'Ficha Fauna'}</span>
      </div>
      <img
        src={img}
        alt={item.scientificName}
        className="w-full h-40 object-cover rounded-md mb-2"
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/naturein_logo.svg' }}
      />
      <div className="font-semibold mb-1">{item.scientificName}</div>
      <div className="text-sm text-muted mb-3">{item.description || 'Sin descripción'}</div>
      {statusLabel && (
        <div className="text-xs text-muted mb-3">{(item.status || '').toUpperCase()}: {statusLabel}</div>
      )}
      <div className="flex gap-2 items-center">
        <Button>Ver detalles</Button>
        <Button className="btn-outline clickable-green">Guardar</Button>
        <button className="btn-primary p-2">
          <Share2 className="w-4 h-4" />
        </button>
        <a className="btn-primary p-2" href="#" aria-label="Abrir en nuevo">
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </Card>
  )
}
