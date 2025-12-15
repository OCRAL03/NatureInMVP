import { useState } from 'react';
import type { SightingPending } from '../types';

interface ApprovalResult {
  success: boolean;
  message: string;
}

/**
 * Hook para gestionar aprobaciones y rechazos de avistamientos
 * Actualmente usa datos mock, preparado para integración con backend
 */
export function useSightingApproval() {
  const [sightings, setSightings] = useState<SightingPending[]>([
    {
      id: 1,
      user: {
        id: 1,
        username: 'ana_garcia',
        full_name: 'Ana García',
        avatar_url: undefined,
      },
      species: 'Morpho peleides',
      common_name: 'Mariposa Morpho Azul',
      location: 'Parque Nacional Tingo María, Sector Cueva de las Lechuzas',
      coordinates: {
        lat: -9.2847,
        lng: -76.0127,
      },
      photo_url: '/api/placeholder/400/300',
      description: 'Encontré esta hermosa mariposa azul cerca de la cueva. Sus alas brillaban mucho con la luz del sol.',
      notes: 'Estaba volando cerca de unas flores moradas',
      confidence_level: 0.85,
      created_at: new Date(Date.now() - 3600000).toISOString(), // Hace 1 hora
      verification_status: 'pending',
    },
    {
      id: 2,
      user: {
        id: 2,
        username: 'carlos_lopez',
        full_name: 'Carlos López',
        avatar_url: undefined,
      },
      species: 'Ara ararauna',
      common_name: 'Guacamayo Azul y Amarillo',
      location: 'Río Huallaga, zona de embarcadero',
      coordinates: {
        lat: -9.2901,
        lng: -76.0089,
      },
      photo_url: '/api/placeholder/400/300',
      description: 'Vi una pareja de guacamayos volando juntos sobre el río. Tomé esta foto cuando se posaron en un árbol.',
      notes: 'Eran muy ruidosos y coloridos',
      confidence_level: 0.92,
      created_at: new Date(Date.now() - 7200000).toISOString(), // Hace 2 horas
      verification_status: 'pending',
    },
    {
      id: 3,
      user: {
        id: 3,
        username: 'maria_torres',
        full_name: 'María Torres',
        avatar_url: undefined,
      },
      species: 'Ceiba pentandra',
      common_name: 'Ceiba',
      location: 'Bosque primario de la reserva',
      coordinates: {
        lat: -9.2923,
        lng: -76.0156,
      },
      photo_url: '/api/placeholder/400/300',
      description: 'Este árbol gigante tiene más de 30 metros de altura. Sus raíces tabulares son impresionantes.',
      notes: 'El tronco tiene espinas grandes',
      confidence_level: 0.78,
      created_at: new Date(Date.now() - 86400000).toISOString(), // Hace 1 día
      verification_status: 'pending',
    },
    {
      id: 4,
      user: {
        id: 1,
        username: 'ana_garcia',
        full_name: 'Ana García',
        avatar_url: undefined,
      },
      species: 'Boa constrictor',
      common_name: 'Boa Constrictor',
      location: 'Sendero principal del parque',
      coordinates: {
        lat: -9.2867,
        lng: -76.0134,
      },
      photo_url: '/api/placeholder/400/300',
      description: 'Encontré esta serpiente tomando sol en una roca. Medía aproximadamente 2 metros.',
      notes: 'Se movió lentamente hacia los arbustos',
      confidence_level: 0.88,
      created_at: new Date(Date.now() - 172800000).toISOString(), // Hace 2 días
      verification_status: 'verified',
      verified_at: new Date(Date.now() - 86400000).toISOString(),
      verification_comment: 'Excelente avistamiento! La identificación es correcta. Ten cuidado al observar reptiles.',
      reward_points: 120,
    },
    {
      id: 5,
      user: {
        id: 2,
        username: 'carlos_lopez',
        full_name: 'Carlos López',
        avatar_url: undefined,
      },
      species: 'Panthera onca',
      common_name: 'Jaguar',
      location: 'Zona restringida del bosque',
      photo_url: '/api/placeholder/400/300',
      description: 'Creo que vi un jaguar pero la foto salió borrosa.',
      notes: 'Estaba muy lejos',
      confidence_level: 0.35,
      created_at: new Date(Date.now() - 259200000).toISOString(), // Hace 3 días
      verification_status: 'rejected',
      verified_at: new Date(Date.now() - 172800000).toISOString(),
      verification_comment: 'La imagen está muy borrosa para confirmar la identificación. Por favor, intenta tomar fotos más nítidas.',
    },
  ]);

  const [loading, setLoading] = useState(false);

  /**
   * Aprobar un avistamiento
   */
  const approveSighting = async (
    sightingId: number,
    points: number,
    comment: string
  ): Promise<ApprovalResult> => {
    setLoading(true);

    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500));

    setSightings(prev => prev.map(sighting => {
      if (sighting.id === sightingId) {
        return {
          ...sighting,
          verification_status: 'verified' as const,
          verified_at: new Date().toISOString(),
          verification_comment: comment || 'Avistamiento aprobado',
          reward_points: points,
        };
      }
      return sighting;
    }));

    setLoading(false);

    return {
      success: true,
      message: `Avistamiento aprobado. ${points} puntos otorgados.`,
    };
  };

  /**
   * Rechazar un avistamiento
   */
  const rejectSighting = async (
    sightingId: number,
    comment: string
  ): Promise<ApprovalResult> => {
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 500));

    if (!comment.trim()) {
      setLoading(false);
      return {
        success: false,
        message: 'Se requiere un comentario para rechazar el avistamiento',
      };
    }

    setSightings(prev => prev.map(sighting => {
      if (sighting.id === sightingId) {
        return {
          ...sighting,
          verification_status: 'rejected' as const,
          verified_at: new Date().toISOString(),
          verification_comment: comment,
        };
      }
      return sighting;
    }));

    setLoading(false);

    return {
      success: true,
      message: 'Avistamiento rechazado',
    };
  };

  /**
   * Obtener avistamientos por estado
   */
  const getSightingsByStatus = (status: SightingPending['verification_status']) => {
    return sightings.filter(sighting => sighting.verification_status === status);
  };

  /**
   * Obtener estadísticas de avistamientos
   */
  const getStats = () => {
    const total = sightings.length;
    const pending = sightings.filter(s => s.verification_status === 'pending').length;
    const verified = sightings.filter(s => s.verification_status === 'verified').length;
    const rejected = sightings.filter(s => s.verification_status === 'rejected').length;

    // Calcular tiempo promedio de respuesta (solo mock)
    const avgResponseTime = '2.5 horas'; // Esto vendría del backend

    return {
      total,
      pending,
      verified,
      rejected,
      avgResponseTime,
      approvalRate: total > 0 ? Math.round((verified / (verified + rejected)) * 100) : 0,
    };
  };

  /**
   * Filtrar avistamientos
   */
  const filterSightings = (
    searchTerm: string = '',
    status: SightingPending['verification_status'] | 'all' = 'all',
    studentId: number | null = null
  ) => {
    return sightings.filter(sighting => {
      const matchesSearch = 
        sighting.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sighting.common_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sighting.user.full_name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = status === 'all' || sighting.verification_status === status;
      const matchesStudent = !studentId || sighting.user.id === studentId;

      return matchesSearch && matchesStatus && matchesStudent;
    });
  };

  return {
    sightings,
    loading,
    approveSighting,
    rejectSighting,
    getSightingsByStatus,
    getStats,
    filterSightings,
  };
}
