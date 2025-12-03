import { useState } from 'react'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import api from '../../api/client'

export default function CreateFichaPage() {
  const [name, setName] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [description, setDescription] = useState('')
  const [progress, setProgress] = useState(0)

  const fetchData = async () => {
    const res = await api.post('/content/generate-ficha', { query: name })
    const item = (res.data.items || [])[0]
    if (item) {
      setImage(item.imageUrl || null)
      setDescription(item.description || '')
    }
  }

  return (
    <div>
      <h1 className="text-xl mb-4">Creación de Ficha de Especie</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4 md:col-span-2">
          <div className="aspect-video mb-3">
            {image ? (
              <img src={image} alt={name} className="w-full h-[50vh] object-cover rounded-md" />
            ) : (
              <div className="w-full h-[50vh] rounded-md border bg-green-50 flex items-center justify-center">Sin imagen</div>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={fetchData}>Buscar datos</Button>
          </div>
        </Card>
        <Card className="p-4">
          <div className="mb-2">Información taxonómica</div>
          <Input placeholder="Nombre común/científico" value={name} onChange={(e) => setName(e.target.value)} />
          <textarea className="border rounded-md p-2 mt-3 w-full h-32" placeholder="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} />
          <div className="mt-3">{progress}/5 completed</div>
          <Button className="mt-3">Guardar progreso</Button>
        </Card>
      </div>
    </div>
  )
}
