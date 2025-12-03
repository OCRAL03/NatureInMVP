import { useState } from 'react'

export default function ChatPage() {
  const [messages, setMessages] = useState<{role: 'user'|'assistant', text: string}[]>([])
  const [input, setInput] = useState('')

  const send = async () => {
    if (!input.trim()) return
    const userMsg = { role: 'user' as const, text: input }
    setMessages((m) => [...m, userMsg])
    setInput('')
    // Stubbed assistant reply
    setTimeout(() => {
      setMessages((m: {role:'user'|'assistant', text:string}[]) => [...m, { role: 'assistant', text: 'Respuesta simulada del chatbot.' }])
    }, 300)
  }

  return (
    <div className="max-w-2xl mx-auto card p-4">
      <h1 className="text-xl mb-3">Chatbot</h1>
      <div className="space-y-2 mb-3">
        {messages.map((m: {role:'user'|'assistant', text:string}, i: number) => (
          <div key={i} className={`p-2 rounded-md border ${m.role === 'user' ? 'bg-green-50' : 'bg-white'}`}>{m.text}</div>
        ))}
      </div>
      <div className="flex gap-2">
        <input className="border flex-1 p-2 rounded-md" value={input} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)} />
        <button className="btn-primary" onClick={send}>Enviar</button>
      </div>
    </div>
  )
}
