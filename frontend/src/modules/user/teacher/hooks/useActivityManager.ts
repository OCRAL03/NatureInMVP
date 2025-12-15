import { useState } from 'react';
import type { Activity } from '../types';

/**
 * Hook para gestionar actividades (CRUD operations)
 * Actualmente usa datos mock, preparado para integración con backend
 */
export function useActivityManager() {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 1,
      title: 'Lectura: Biodiversidad de la Amazonía',
      description: 'Lee el artículo sobre la biodiversidad de la región amazónica y responde las preguntas de comprensión.',
      type: 'reading',
      reward_points: 80,
      deadline: new Date(Date.now() + 86400000 * 7).toISOString(),
      created_by: 1,
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      assigned_to: [1, 2, 3],
      completion_count: 2,
      total_assigned: 3,
      status: 'active',
    },
    {
      id: 2,
      title: 'Quiz: Biodiversidad de la Región',
      description: 'Completa el cuestionario sobre especies endémicas de Tingo María y su importancia ecológica.',
      type: 'quiz',
      reward_points: 50,
      deadline: new Date(Date.now() + 86400000 * 3).toISOString(),
      created_by: 1,
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      assigned_to: [1, 2],
      completion_count: 1,
      total_assigned: 2,
      status: 'active',
    },
    {
      id: 3,
      title: 'Exploración del Río Huallaga',
      description: 'Visita 3 puntos específicos del río y documenta las especies acuáticas que observes.',
      type: 'exploration',
      reward_points: 150,
      deadline: new Date(Date.now() + 86400000 * 14).toISOString(),
      created_by: 1,
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      assigned_to: [1],
      completion_count: 0,
      total_assigned: 1,
      status: 'active',
    },
    {
      id: 4,
      title: 'Investigación: Plantas Medicinales',
      description: 'Realiza una investigación sobre 3 plantas medicinales locales. Incluye usos tradicionales y científicos.',
      type: 'research',
      reward_points: 200,
      deadline: null,
      created_by: 1,
      created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
      assigned_to: [2, 3],
      completion_count: 2,
      total_assigned: 2,
      status: 'completed',
    },
  ]);

  const [loading, setLoading] = useState(false);

  /**
   * Crear nueva actividad
   */
  const createActivity = async (data: Partial<Activity>) => {
    setLoading(true);
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500));

    const newActivity: Activity = {
      id: Math.max(...activities.map(a => a.id), 0) + 1,
      title: data.title || '',
      description: data.description || '',
      type: data.type || 'quiz',
      reward_points: data.reward_points || 0,
      deadline: data.deadline || null,
      created_by: 1, // ID del docente actual
      created_at: new Date().toISOString(),
      assigned_to: [],
      completion_count: 0,
      total_assigned: 0,
      status: 'active',
    };

    setActivities(prev => [newActivity, ...prev]);
    setLoading(false);
    
    return newActivity;
  };

  /**
   * Actualizar actividad existente
   */
  const updateActivity = async (id: number, data: Partial<Activity>) => {
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));

    setActivities(prev => prev.map(activity => 
      activity.id === id
        ? {
            ...activity,
            ...data,
            // No permitir cambiar ciertos campos
            id: activity.id,
            created_by: activity.created_by,
            created_at: activity.created_at,
          }
        : activity
    ));

    setLoading(false);
  };

  /**
   * Eliminar actividad
   */
  const deleteActivity = async (id: number) => {
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 300));

    setActivities(prev => prev.filter(activity => activity.id !== id));
    
    setLoading(false);
  };

  /**
   * Asignar actividad a estudiantes
   */
  const assignActivity = async (activityId: number, studentIds: number[]) => {
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));

    setActivities(prev => prev.map(activity => {
      if (activity.id === activityId) {
        // Combinar estudiantes existentes con nuevos (sin duplicados)
        const allAssigned = [...new Set([...activity.assigned_to, ...studentIds])];
        
        return {
          ...activity,
          assigned_to: allAssigned,
          total_assigned: allAssigned.length,
        };
      }
      return activity;
    }));

    setLoading(false);
  };

  /**
   * Filtrar actividades por estado
   */
  const getActivitiesByStatus = (status: Activity['status']) => {
    return activities.filter(activity => activity.status === status);
  };

  /**
   * Obtener estadísticas de actividades
   */
  const getStats = () => {
    const total = activities.length;
    const active = activities.filter(a => a.status === 'active').length;
    const completed = activities.filter(a => a.status === 'completed').length;
    const expired = activities.filter(a => a.status === 'expired').length;
    
    const totalAssigned = activities.reduce((sum, a) => sum + a.total_assigned, 0);
    const totalCompleted = activities.reduce((sum, a) => sum + a.completion_count, 0);
    const avgCompletion = totalAssigned > 0 ? Math.round((totalCompleted / totalAssigned) * 100) : 0;

    return {
      total,
      active,
      completed,
      expired,
      avgCompletion,
    };
  };

  return {
    activities,
    loading,
    createActivity,
    updateActivity,
    deleteActivity,
    assignActivity,
    getActivitiesByStatus,
    getStats,
  };
}
