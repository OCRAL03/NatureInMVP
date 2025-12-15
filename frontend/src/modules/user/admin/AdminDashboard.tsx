import { useEffect, useState } from 'react'
import api from '../../../api/client'
import Card from '../../../components/ui/Card'
import { Users, FileText, MapPin, Activity, Shield } from 'lucide-react'

interface AdminStats {
  total_users: number
  total_sightings: number
  total_activities: number
  total_places: number
  pending_reviews: number
}

/**
 * Dashboard de administración del sistema
 * Panel de control para gestión de usuarios, contenido y configuración
 */
export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      // TODO: Implementar endpoint /api/admin/stats/
      const response = await api.get('/admin/stats/')
      setStats(response.data)
    } catch (error) {
      console.error('Error loading admin stats:', error)
      // Datos de ejemplo mientras se implementa el endpoint
      setStats({
        total_users: 0,
        total_sightings: 0,
        total_activities: 0,
        total_places: 0,
        pending_reviews: 0
      })
    } finally {
      setLoading(false)
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
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Panel de Administración
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gestión del sistema NatureIn
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Usuarios</p>
              <p className="text-2xl font-bold">{stats?.total_users || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <FileText className="w-6 h-6 text-green-600 dark:text-green-300" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avistamientos</p>
              <p className="text-2xl font-bold">{stats?.total_sightings || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Activity className="w-6 h-6 text-purple-600 dark:text-purple-300" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Actividades</p>
              <p className="text-2xl font-bold">{stats?.total_activities || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <MapPin className="w-6 h-6 text-orange-600 dark:text-orange-300" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Lugares</p>
              <p className="text-2xl font-bold">{stats?.total_places || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
              <Shield className="w-6 h-6 text-red-600 dark:text-red-300" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pendientes</p>
              <p className="text-2xl font-bold">{stats?.pending_reviews || 0}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Management Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Gestión de Usuarios</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Administrar cuentas, roles y permisos
          </p>
          <button className="btn-primary w-full">
            Ver Usuarios
          </button>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Contenido</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Revisar y moderar avistamientos
          </p>
          <button className="btn-primary w-full">
            Revisar Contenido
          </button>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Configuración</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Ajustes del sistema y parámetros
          </p>
          <button className="btn-primary w-full">
            Configurar
          </button>
        </Card>
      </div>
    </div>
  )
}
