import { useState, useEffect } from 'react';
import api from '../../../../api/client.ts';
import type { TeacherStats, StudentSummary, Activity, SightingPending } from '../types';

/**
 * Hook para gestionar estadísticas del dashboard de docentes
 */
export function useTeacherStats() {
  const [stats, setStats] = useState<TeacherStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      console.log('Cargando stats de docente...');
      const response = await api.get('/user/teacher/stats/');
      const data = response.data;
      console.log('Stats recibidas:', data);
      
      // Mapear respuesta del backend a TeacherStats
      setStats({
        total_students: data.total_students || 0,
        active_today: data.active_students || 0, // backend usa 'active_students'
        average_points: data.avg_points || 0, // backend usa 'avg_points'
        top_student: null, // El backend no retorna esto aún
        total_activities: 0, // Calculado en otro endpoint
        pending_sightings: 0, // Calculado en otro endpoint
        completion_rate: data.completion_rate || 0,
        engagement_rate: Math.round((data.active_students / data.total_students) * 100) || 0,
      });
    } catch (error) {
      console.error('Error cargando stats de docente:', error);
      console.error('Detalles:', error);
      setStats({
        total_students: 0,
        active_today: 0,
        average_points: 0,
        top_student: null,
        total_activities: 0,
        pending_sightings: 0,
        completion_rate: 0,
        engagement_rate: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading };
}

export function useStudents() {
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      console.log('Cargando estudiantes del backend...');
      const response = await api.get('/user/teacher/students/');
      console.log('Respuesta del backend:', response.data);
      console.log('Total estudiantes recibidos:', response.data.length);
      
      // Mapear datos del backend al formato esperado
      const studentsData = response.data.map((student: any) => ({
        id: student.id,
        username: student.username,
        full_name: student.full_name,
        email: student.email || '',
        grade: student.grade,
        section: student.section,
        points: student.points,
        rank: getRankFromPoints(student.points),
        badges_count: student.badges_count,
        sightings_count: student.total_sightings,
        verified_sightings: student.verified_sightings,
        activities_completed: 0,
        activities_total: 0,
        last_active: student.last_active,
        days_inactive: student.days_inactive,
      }));
      console.log('Estudiantes mapeados:', studentsData);
      setStudents(studentsData);
    } catch (error) {
      console.error('Error cargando estudiantes:', error);
      console.error('Detalles del error:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  return { students, loading };
}

function getRankFromPoints(points: number): string {
  if (points >= 1500) return 'Explorador Experto';
  if (points >= 1000) return 'Explorador Avanzado';
  if (points >= 500) return 'Explorador Intermedio';
  return 'Explorador Principiante';
}

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const response = await api.get('/user/teacher/activities/');
      // Mapear actividades del backend
      const activitiesData = response.data.map((act: any) => ({
        id: act.id,
        title: `${act.activity_type}: ${act.description.substring(0, 50)}`,
        description: act.description,
        type: act.activity_type,
        reward_points: 0,
        deadline: null,
        created_by: act.user.id,
        created_at: act.timestamp,
        assigned_to: [],
        completion_count: 0,
        total_assigned: 0,
        status: 'active',
      }));
      setActivities(activitiesData);
    } catch (error) {
      console.error('Error cargando actividades:', error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  return { activities, loading };
}

export function usePendingSightings() {
  const [sightings, setSightings] = useState<SightingPending[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSightings();
  }, []);

  const loadSightings = async () => {
    try {
      const response = await api.get('/expert/pending-sightings/');
      // Mapear avistamientos pendientes
      const sightingsData = response.data.sightings.slice(0, 10).map((sighting: any) => ({
        id: sighting.id,
        user: {
          id: sighting.user.id,
          username: sighting.user.username,
          full_name: sighting.user.full_name || sighting.user.username,
        },
        species: sighting.species_name || 'Especie no identificada',
        location: sighting.location || 'Ubicación no especificada',
        photo_url: sighting.photo_url,
        description: sighting.description,
        notes: sighting.notes,
        created_at: sighting.created_at,
        verification_status: sighting.verification_status,
      }));
      setSightings(sightingsData);
    } catch (error) {
      console.error('Error cargando avistamientos pendientes:', error);
      setSightings([]);
    } finally {
      setLoading(false);
    }
  };

  return { sightings, loading };
}
