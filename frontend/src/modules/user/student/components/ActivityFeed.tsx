import { Activity } from '../types'
import { Calendar, Eye, MapPin, Award, User } from 'lucide-react'

interface ActivityFeedProps {
  activities: Activity[]
  maxDisplay?: number
}

/**
 * Feed de actividades recientes del usuario
 * Muestra las últimas acciones realizadas
 */
export default function ActivityFeed({ activities, maxDisplay = 10 }: ActivityFeedProps) {
  const displayActivities = activities.slice(0, maxDisplay)

  const getActivityIcon = (type: Activity['activity_type']) => {
    const icons = {
      login: User,
      sighting: MapPin,
      content_view: Eye,
      badge_earned: Award,
      profile_update: User,
    }
    return icons[type] || User
  }

  const getActivityColor = (type: Activity['activity_type']): string => {
    const colors = {
      login: 'text-blue-600 bg-blue-50',
      sighting: 'text-green-600 bg-green-50',
      content_view: 'text-purple-600 bg-purple-50',
      badge_earned: 'text-yellow-600 bg-yellow-50',
      profile_update: 'text-gray-600 bg-gray-50',
    }
    return colors[type] || 'text-gray-600 bg-gray-50'
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Hace un momento'
    if (diffMins < 60) return `Hace ${diffMins} min`
    if (diffHours < 24) return `Hace ${diffHours} h`
    if (diffDays < 7) return `Hace ${diffDays} días`
    
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  }

  if (activities.length === 0) {
    return (
      <div className="card p-6 text-center">
        <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-3" />
        <p className="text-muted">No hay actividades recientes</p>
      </div>
    )
  }

  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5" />
        <h3 className="font-semibold">Actividad Reciente</h3>
      </div>

      <div className="space-y-3">
        {displayActivities.map((activity) => {
          const Icon = getActivityIcon(activity.activity_type)
          const colorClass = getActivityColor(activity.activity_type)

          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className={`p-2 rounded-lg ${colorClass}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 line-clamp-2">
                  {activity.description}
                </p>
                <p className="text-xs text-muted mt-1">
                  {formatDate(activity.created_at)}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
