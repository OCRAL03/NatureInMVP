import { useState, useRef, useEffect } from 'react';
import api from '../../api/client';
import chatbotImg from '../../assets/images/chatbot.jpg';
import { Send, User, Bot } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll automático al último mensaje
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const send = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user' as const, text: input };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const payload = { message: userMsg.text, history: messages };
      const res = await api.post('/content/chat', payload, { timeout: 120000 });
      const reply = (res.data?.reply || '').trim();

      if (reply) {
        setMessages((m: { role: 'user' | 'assistant'; text: string }[]) => [
          ...m,
          { role: 'assistant', text: reply },
        ]);
      } else {
        setMessages((m) => [
          ...m,
          { role: 'assistant', text: 'No pude obtener una respuesta de la IA.' },
        ]);
      }
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: 'assistant', text: '⚠️ Hubo un error de conexión al consultar la IA.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      send();
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-[90vh] flex flex-col p-4">
      {/* HEADER DEL CHAT */}
      <div className="bg-surface shadow-lg rounded-t-xl p-4 flex items-center border-b border-base">
        <img src={chatbotImg} alt="Chatbot Avatar" className="w-10 h-10 rounded-full mr-3 object-cover" />
        <div>
          <h1 className="text-xl font-bold">Asistente Virtual Llama</h1>
          <p className={`text-sm ${isLoading ? 'text-blue-600' : 'text-green-500'}`}>
            {isLoading ? 'Escribiendo...' : 'En línea'}
          </p>
        </div>
      </div>

      {/* ÁREA DE MENSAJES (CUERPO DEL CHAT) */}
      <div className="flex-1 bg-surface overflow-y-auto p-4 space-y-4 shadow-inner">
        {messages.length === 0 && (
          <div className="text-center p-10 text-muted">
            <Bot size={48} className="mx-auto text-muted mb-3" />
            <p>¡Hola! Soy tu asistente. ¿En qué puedo ayudarte hoy?</p>
          </div>
        )}
        
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
          <div
            className={`max-w-[80%] p-3 rounded-xl shadow-md flex items-start space-x-2 transition-all duration-300 ${
                m.role === 'user'
                  ? 'bg-green-600 text-white rounded-br-none'
                  : 'bg-surface rounded-tl-none gradient-border'
              }`}
            >
              {m.role === 'assistant' && (
                <Bot size={20} className="mt-1 flex-shrink-0 text-green-600" />
              )}
              <p className="whitespace-pre-wrap">{m.text}</p>
              {m.role === 'user' && (
                <User size={20} className="mt-1 flex-shrink-0 text-white" />
              )}
            </div>
          </div>
        ))}
        {/* Indicador de carga (si está cargando) */}
        {isLoading && (
            <div className="flex justify-start">
                 <div className="max-w-[80%] p-3 rounded-xl shadow-md flex items-center bg-surface rounded-tl-none gradient-border animate-pulse">
                    <Bot size={20} className="mr-2 text-blue-600" />
                    <p className="italic text-blue-600">La IA está escribiendo...</p>
                 </div>
            </div>
        )}
        <div ref={messagesEndRef} /> {/* Referencia para el scroll */}
      </div>

      {/* CAJA DE ENTRADA (FOOTER DEL CHAT) */}
      <div className="bg-surface p-4 flex gap-3 items-center border-t border-base rounded-b-xl shadow-2xl">
        <Input
          className={`input-field gradient-border focus-blue flex-1 rounded-full px-4 ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isLoading ? 'Espera un momento...' : 'Escribe tu mensaje aquí...'}
          disabled={isLoading}
        />
        <Button
          className={`btn-pill clickable-green flex items-center gap-2 ${!input.trim() || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={send}
          disabled={!input.trim() || isLoading}
        >
          <Send size={20} />
          Enviar
        </Button>
      </div>
    </div>
  );
}
