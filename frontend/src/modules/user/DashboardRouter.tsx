import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import api from '../../api/client'

export default function DashboardRouter() {
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const u = await api.get('/auth/me/')
        setRole(u.data?.role || null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div>Cargando...</div>
  if (role === 'teacher') return <Navigate to="/dashboard/teacher" replace />
  if (role === 'expert') return <Navigate to="/dashboard/expert" replace />
  if (role === 'admin') return <Navigate to="/dashboard/admin" replace />
  return <Navigate to="/dashboard/student" replace />
}

