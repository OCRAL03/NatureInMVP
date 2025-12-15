import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'

/**
 * Router inteligente que redirige al dashboard correcto según el rol del usuario
 */
export default function DashboardRouter() {
  const navigate = useNavigate()
  const { role } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (!role) {
      // Si no hay rol, redirigir a login
      navigate('/login', { replace: true })
      return
    }

    // Redirigir según el rol
    switch (role) {
      case 'student':
        navigate('/dashboard/student', { replace: true })
        break
      case 'teacher':
        navigate('/dashboard/teacher', { replace: true })
        break
      case 'expert':
        navigate('/dashboard/expert', { replace: true })
        break
      case 'admin':
        navigate('/dashboard/admin', { replace: true })
        break
      default:
        navigate('/dashboard/student', { replace: true })
    }
  }, [role, navigate])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando tu dashboard...</p>
      </div>
    </div>
  )
}
