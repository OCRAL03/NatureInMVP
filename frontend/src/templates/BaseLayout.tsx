import { useEffect, useState } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Page from './Page'
import ChatPage from '../modules/chat/ChatPage'
import botImg from '../assets/images/chatbot.jpg'

export default function BaseLayout({ children }: { children: React.ReactNode }) {
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    if (saved === 'dark' || (!saved && prefersDark)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Page>
        {children}
      </Page>
      <Footer />

      <div className="fixed bottom-6 right-6 z-50">
        <button
          aria-label="Abrir chatbot"
          onClick={() => setShowChat((v) => !v)}
          className="group relative flex items-center gap-3"
        >
          <div className="absolute -left-40 opacity-0 group-hover:opacity-100 group-hover:-left-52 transition-all duration-300 bg-black/75 text-white text-xs px-3 py-2 rounded-full whitespace-nowrap">
            Resuelve tus dudas en el chat bot
          </div>
          <img src={botImg} alt="Chatbot" className="w-14 h-14 rounded-full shadow-lg border border-green-300 group-hover:scale-105 transition-transform" />
        </button>
      </div>

      {showChat && (
        <div className="fixed top-0 right-0 h-full w-full sm:w-[380px] bg-surface shadow-2xl border-l border-base z-40">
          <div className="flex items-center justify-between p-3 border-b border-base">
            <span className="font-semibold">Chatbot</span>
            <button onClick={() => setShowChat(false)} className="btn-outline">Cerrar</button>
          </div>
          <div className="h-[calc(100%-56px)] overflow-y-auto">
            <ChatPage />
          </div>
        </div>
      )}
    </div>
  )
}
