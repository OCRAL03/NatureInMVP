import { Route, Routes } from 'react-router-dom'
import LoginForm from './modules/auth/AuthForm'
import ProtectedRoute from './modules/auth/ProtectedRoute'
import SearchPage from './modules/content/SearchPage'
import CreateFichaPage from './modules/content/CreateFichaPage'
import GamifyPage from './modules/gamify/GamifyPage'
import ChatPage from './modules/chat/ChatPage'
import SightingsPage from './modules/user/SightingsPage'
import ExplorePage from './modules/explore/ExplorePage'
import BaseLayout from './templates/BaseLayout'
import LandingPage from './modules/landing/LandingPage'
import DemoPage from './modules/demo/DemoPage'
import UsuariosPage from './modules/demo/UsuariosPage'
import ActividadesPage from './modules/demo/ActividadesPage'
import FichasPage from './modules/demo/FichasPage'
import LugaresPage from './modules/demo/LugaresPage'
import MinijuegosPage from './modules/demo/MinijuegosPage'


export default function App() {
  return (
    <BaseLayout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/content" element={<SearchPage />} />
        <Route path="/content/ficha" element={<ProtectedRoute><CreateFichaPage /></ProtectedRoute>} />
        <Route path="/gamify" element={<GamifyPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/sightings" element={<ProtectedRoute><SightingsPage /></ProtectedRoute>} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/demo/usuarios" element={<UsuariosPage />} />
        <Route path="/demo/actividades" element={<ActividadesPage />} />
        <Route path="/demo/fichas" element={<FichasPage />} />
        <Route path="/demo/lugares" element={<LugaresPage />} />
        <Route path="/demo/minijuegos" element={<MinijuegosPage />} />
      </Routes>
    </BaseLayout>
  )
}
