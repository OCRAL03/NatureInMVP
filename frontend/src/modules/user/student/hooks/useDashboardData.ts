import { useEffect, useState } from 'react'
import api from '../../../../api/client.ts'
import { DashboardData, LoadingState } from '../types'

/**
 * Hook personalizado para cargar datos del dashboard
 * Optimizado: una sola llamada al backend
 */
export function useDashboardData(): LoadingState<DashboardData> {
  const [state, setState] = useState<LoadingState<DashboardData>>({
    data: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const response = await api.get<DashboardData>('/user/dashboard/')
      setState({
        data: response.data,
        loading: false,
        error: null
      })
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Error al cargar el dashboard'
      setState({
        data: null,
        loading: false,
        error: errorMessage
      })
    }
  }

  return state
}
