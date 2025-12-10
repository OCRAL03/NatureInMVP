import { useEffect, useState } from 'react'
import api from '../../api/client'

type Message = { id: number; sender_id: number; recipient_id: number; content: string; created_at: string; read: boolean }

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [to, setTo] = useState('')
  const [text, setText] = useState('')

  const load = async () => {
    const res = await api.get('/user/messages')
    setMessages(res.data || [])
  }

  const send = async () => {
    if (!to || !text) return
    await api.post('/user/messages', { recipient: Number(to), content: text })
    setText('')
    load()
  }

  useEffect(() => { load() }, [])

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="md:col-span-2 p-4 border rounded-md">
        <div className="font-semibold mb-2">Mensajes recibidos</div>
        <div className="space-y-2">
          {messages.map(m => (
            <div key={m.id} className="p-2 border rounded-md">
              <div className="text-xs text-muted">De: {m.sender_id} • {new Date(m.created_at).toLocaleString()}</div>
              <div>{m.content}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 border rounded-md">
        <div className="font-semibold mb-2">Nuevo mensaje</div>
        <input className="input-field w-full mb-2" placeholder="ID destinatario" value={to} onChange={(e) => setTo(e.target.value)} />
        <textarea className="input-field w-full h-24" placeholder="Escribe tu mensaje" value={text} onChange={(e) => setText(e.target.value)} />
        <button className="btn-primary mt-2" onClick={send}>Enviar</button>
      </div>
    </div>
  )
}

