import React, { useState, useEffect } from "react";
import chatbotIcon from "../../assets/images/chatbot.jpg";

const IAWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [userRole, setUserRole] = useState<string>("student");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/user/stats/", {
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        const data = await res.json();
        setUserRole(data.role);
      } catch {
        setUserRole("student");
      }
    };
    fetchStats();
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/ia/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, role: userRole }),
      });
      const data = await res.json();
      const iaMsg = data.choices[0].message;
      setMessages((prev) => [...prev, iaMsg]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Error al conectar con la IA." }]);
    }
  };

  if (userRole === "admin" || userRole === "expert") {
    return null;
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => {
            setOpen(true);
            setMessages([
              { role: "assistant", content: userRole === "teacher"
                ? "¡Hola docente! Estoy aquí para apoyarte en tu labor educativa."
                : "¡Hola estudiante! Soy tu asistente virtual, ¿en qué puedo ayudarte hoy?" }
            ]);
          }}
          className="fixed bottom-4 right-4 w-14 h-14 rounded-full bg-green-600 text-white shadow-lg z-50 hover:bg-green-700 transition flex items-center justify-center"
        >
          <img 
            src={chatbotIcon}
            alt="IA" 
            className="w-8 h-8 rounded-full object-cover"       
          />
        </button>
      )}

      {open && (
        <div className="fixed bottom-4 right-4 w-80 h-[500px] bg-white border border-green-300 rounded-lg shadow-lg flex flex-col z-50">
          {/* Header */}
          <div className="bg-green-600 text-white px-4 py-2 flex justify-between items-center rounded-t-lg">
            <span>Asistente Virtual</span>
            <button onClick={() => setOpen(false)} className="text-white text-lg hover:text-green-200">✕</button>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 text-sm bg-green-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`p-2 rounded ${msg.role === "user" ? "bg-green-100 text-right" : "bg-green-200 text-left"}`}>
                {msg.content}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-2 border-t border-green-300 flex gap-2 bg-green-50">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Escribe tu mensaje..."
              className="flex-1 border border-green-400 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <button
              onClick={sendMessage}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition"
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default IAWidget;