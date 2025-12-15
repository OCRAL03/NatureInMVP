import { useState, useEffect } from 'react'
import api from '../../api/client'
import Card from '../../components/ui/Card'
import { Send, Inbox, Mail, MailOpen, User } from 'lucide-react'

interface Message {
  id: number
  sender: { id: number; username: string; full_name?: string }
  recipient: { id: number; username: string; full_name?: string }
  subject: string
  content: string
  message_type: string
  read: boolean
  created_at: string
}

/**
 * Sistema de mensajería interna
 * Comunicación entre usuarios del sistema
 */
export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [composing, setComposing] = useState(false)
  const [newMessage, setNewMessage] = useState({
    recipient_id: '',
    subject: '',
    content: ''
  })

  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = async () => {
    try {
      const response = await api.get('/user/messages/')
      setMessages(response.data)
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.content.trim()) return

    try {
      await api.post('/user/messages/', {
        recipient_id: parseInt(newMessage.recipient_id),
        subject: newMessage.subject,
        content: newMessage.content,
        message_type: 'personal'
      })
      
      setNewMessage({ recipient_id: '', subject: '', content: '' })
      setComposing(false)
      loadMessages()
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Error al enviar el mensaje')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Mensajes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comunicación con otros usuarios
          </p>
        </div>
        <button
          onClick={() => setComposing(!composing)}
          className="btn-cta flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Nuevo Mensaje
        </button>
      </div>

      {/* Compose Form */}
      {composing && (
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Nuevo Mensaje</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                ID del Destinatario
              </label>
              <input
                type="number"
                value={newMessage.recipient_id}
                onChange={(e) => setNewMessage({ ...newMessage, recipient_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Ingresa el ID del usuario"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Asunto
              </label>
              <input
                type="text"
                value={newMessage.subject}
                onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Asunto del mensaje"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Mensaje
              </label>
              <textarea
                value={newMessage.content}
                onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Escribe tu mensaje aquí..."
              />
            </div>
            <div className="flex gap-3">
              <button onClick={sendMessage} className="btn-cta flex items-center gap-2">
                <Send className="w-4 h-4" />
                Enviar
              </button>
              <button onClick={() => setComposing(false)} className="btn-outline">
                Cancelar
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Messages List */}
      <div className="space-y-4">
        {messages.length === 0 ? (
          <Card className="p-8 text-center">
            <Inbox className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No tienes mensajes
            </p>
          </Card>
        ) : (
          messages.map((msg) => (
            <Card key={msg.id} className={`p-4 ${!msg.read ? 'border-l-4 border-green-500' : ''}`}>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                  {msg.read ? (
                    <MailOpen className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  ) : (
                    <Mail className="w-5 h-5 text-green-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold">
                      {msg.sender.full_name || msg.sender.username}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(msg.created_at).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  {msg.subject && (
                    <h4 className="font-medium mb-2">{msg.subject}</h4>
                  )}
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {msg.content}
                  </p>
                  <div className="mt-2">
                    <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 
                                   text-blue-800 dark:text-blue-200 rounded-full">
                      {msg.message_type}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
