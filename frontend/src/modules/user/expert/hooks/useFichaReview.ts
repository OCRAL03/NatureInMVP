import { useState, useEffect } from 'react';
import api from '../../../../api/client.ts';
import type { FichaReview, FichaValidation, FichaFilters } from '../types';

/**
 * Hook para gestionar las fichas pendientes de revisión
 */
export function useFichasReview() {
  const [fichas, setFichas] = useState<FichaReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFichas();
  }, []);

  const loadFichas = async () => {
    try {
      setLoading(true);
      const response = await api.get('/expert/pending-fichas/');
      setFichas(response.data);
    } catch (error) {
      console.error('Error cargando fichas:', error);
      setFichas([]);
    } finally {
      setLoading(false);
    }
  };

  return { fichas, loading, refresh: loadFichas };
}

/**
 * Hook para validar fichas
 */
export function useFichaValidation() {
  const [fichasList, setFichasList] = useState<FichaReview[]>([]);

  const validateFicha = async (validation: FichaValidation): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.post(`/expert/fichas/${validation.ficha_id}/validate/`, validation);
      
      // Actualizar estado local
      setFichasList(prevFichas =>
        prevFichas.map(ficha =>
          ficha.id === validation.ficha_id
            ? {
                ...ficha,
                validation_status: validation.action === 'reject' ? 'rejected' : 
                                 validation.action === 'request_changes' ? 'needs_revision' : 'approved',
                scientific_accuracy: validation.scientific_accuracy,
                review_comments: validation.general_comments,
                corrections: validation.corrections,
              }
            : ficha
        )
      );

      const messages = {
        approve: 'Ficha aprobada exitosamente',
        approve_with_corrections: 'Ficha aprobada con correcciones sugeridas',
        request_changes: 'Se han solicitado cambios al autor',
        reject: 'Ficha rechazada',
      };

      return {
        success: true,
        message: messages[validation.action],
      };
    } catch (error) {
      console.error('Error validando ficha:', error);
      return {
        success: false,
        message: 'Error al validar la ficha',
      };
    }
  };

  const quickApprove = async (fichaId: number): Promise<{ success: boolean; message: string }> => {
    return validateFicha({
      ficha_id: fichaId,
      action: 'approve',
      scientific_accuracy: 4,
      taxonomy_verified: true,
      corrections: [],
      general_comments: 'Aprobación rápida',
      suggestions: '',
    });
  };

  const quickReject = async (fichaId: number, reason: string): Promise<{ success: boolean; message: string }> => {
    return validateFicha({
      ficha_id: fichaId,
      action: 'reject',
      scientific_accuracy: 1,
      taxonomy_verified: false,
      corrections: [],
      general_comments: reason,
      suggestions: '',
    });
  };

  const filterFichas = (
    fichas: FichaReview[],
    filters: FichaFilters
  ): FichaReview[] => {
    let filtered = [...fichas];

    // Búsqueda por texto
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        ficha =>
          ficha.scientific_name.toLowerCase().includes(searchLower) ||
          ficha.common_name.toLowerCase().includes(searchLower) ||
          ficha.author.full_name.toLowerCase().includes(searchLower)
      );
    }

    // Filtro por estado
    if (filters.status !== 'all') {
      filtered = filtered.filter(ficha => ficha.validation_status === filters.status);
    }

    // Filtro por tipo de organismo (reino)
    if (filters.organism_type !== 'all') {
      filtered = filtered.filter(ficha => {
        const kingdom = ficha.taxonomy.kingdom.toLowerCase();
        switch (filters.organism_type) {
          case 'animal':
            return kingdom.includes('animalia');
          case 'plant':
            return kingdom.includes('plantae');
          case 'fungi':
            return kingdom.includes('fungi');
          default:
            return true;
        }
      });
    }

    // Filtro por rol del autor
    if (filters.author_role !== 'all') {
      filtered = filtered.filter(ficha => ficha.author.role === filters.author_role);
    }

    // Filtro por fecha
    if (filters.date_from) {
      filtered = filtered.filter(
        ficha => new Date(ficha.created_at) >= new Date(filters.date_from)
      );
    }
    if (filters.date_to) {
      filtered = filtered.filter(
        ficha => new Date(ficha.created_at) <= new Date(filters.date_to)
      );
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (filters.sort_by) {
        case 'date':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'name':
          comparison = a.scientific_name.localeCompare(b.scientific_name);
          break;
        case 'accuracy':
          comparison = (a.scientific_accuracy || 0) - (b.scientific_accuracy || 0);
          break;
      }
      return filters.sort_order === 'asc' ? comparison : -comparison;
    });

    return filtered;
  };

  const getStats = (fichas: FichaReview[]) => {
    return {
      total: fichas.length,
      pending: fichas.filter(f => f.validation_status === 'pending').length,
      approved: fichas.filter(f => f.validation_status === 'approved').length,
      rejected: fichas.filter(f => f.validation_status === 'rejected').length,
      needs_revision: fichas.filter(f => f.validation_status === 'needs_revision').length,
    };
  };

  return {
    fichasList,
    setFichasList,
    validateFicha,
    quickApprove,
    quickReject,
    filterFichas,
    getStats,
  };
}
