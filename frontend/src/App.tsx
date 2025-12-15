import { Route, Routes } from 'react-router-dom'
import LoginForm from './modules/auth/AuthForm'
import ProtectedRoute from './modules/auth/ProtectedRoute'
import SearchPage from './modules/content/SearchPage'
import CreateFichaPage from './modules/content/CreateFichaPage'
import ExploreCatalogPage from './modules/content/ExploreCatalogPage'
import GamifyPage from './modules/gamify/GamifyPage'
import StudentDashboard from './modules/user/student/StudentDashboard'
import TeacherDashboard from './modules/user/teacher/TeacherDashboard'
import ExpertDashboard from './modules/user/expert/ExpertDashboard'
import AdminDashboard from './modules/user/admin/AdminDashboard'
import ChatPage from './modules/chat/ChatPage'
import SightingsPage from './modules/user/SightingsPage'
import ExplorePage from './modules/explore/ExplorePage'
import BaseLayout from './templates/BaseLayout'
import LandingPage from './modules/landing/LandingPage'
import DashboardRouter from './modules/user/DashboardRouter'
import MessagesPage from './modules/messages/MessagesPage'
import ActivityPage from './modules/explore/ActivityPage'


export default function App() {
  return (
    <BaseLayout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/content" element={<SearchPage />} />
        <Route path="/content/catalog" element={<ExploreCatalogPage />} />
        <Route path="/content/ficha" element={<ProtectedRoute><CreateFichaPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
        <Route path="/gamify" element={<GamifyPage />} />
        <Route path="/dashboard/student" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/teacher" element={<ProtectedRoute><TeacherDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/expert" element={<ProtectedRoute><ExpertDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/explore/activity" element={<ActivityPage />} />
        <Route path="/sightings" element={<ProtectedRoute><SightingsPage /></ProtectedRoute>} />
      </Routes>
    </BaseLayout>
  )
}
