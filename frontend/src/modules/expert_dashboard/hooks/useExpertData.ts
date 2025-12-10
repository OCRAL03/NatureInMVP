import { useState, useEffect } from 'react';
import api from '../../../api/client';
import type { ValidationStats, SightingReview } from '../types';

/**
 * Hook para obtener estadísticas de validación del experto desde el backend
 */
export function useValidationStats() {
  const [stats, setStats] = useState<ValidationStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await api.get('/expert/validation-stats/');
      setStats(response.data);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
      setStats({
        total_reviews: 0,
        approved_count: 0,
        rejected_count: 0,
        pending_count: 0,
        approval_rate: 0,
        avg_review_time: 0,
        reviews_this_week: 0,
        reviews_this_month: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, refresh: loadStats };
}

/**
 * Hook para obtener avistamientos pendientes de revisión
 */
export function usePendingSightings() {
  const [sightings, setSightings] = useState<SightingReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSightings();
  }, []);

  const loadSightings = async () => {
    try {
      const response = await api.get('/expert/pending-sightings/');
      setSightings(response.data);
    } catch (error) {
      console.error('Error cargando avistamientos:', error);
      setSightings([]);
    } finally {
      setLoading(false);
    }
  };

  return { sightings, loading, refresh: loadSightings };
}
