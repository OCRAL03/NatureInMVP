/**
 * Hook personalizado para Analytics Dashboard
 * Maneja estadísticas de biodiversidad, métricas de validación y tendencias temporales
 */

import { useState, useEffect } from 'react';
import api from '../../../api/client';
import type { 
  BiodiversityStats, 
  ValidationMetrics, 
  TemporalData,
  TaxonomyDistribution,
  FamilyDistribution,
  ConservationStats,
  AnalyticsPeriod
} from '../types';

/**
 * Hook para cargar estadísticas de biodiversidad
 */
export function useBiodiversityStats() {
  const [stats, setStats] = useState<BiodiversityStats>({
    total_species: 0,
    species_validated: 0,
    unique_families: 0,
    unique_kingdoms: 0,
    endemic_species: 0,
    threatened_species: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/expert/analytics/biodiversity/');
      setStats(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar estadísticas de biodiversidad');
      console.error('Error loading biodiversity stats:', err);
      setStats({
        total_species: 0,
        species_validated: 0,
        unique_families: 0,
        unique_kingdoms: 0,
        endemic_species: 0,
        threatened_species: 0
      });
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, error, refresh: loadStats };
}

/**
 * Hook para cargar métricas de validación por período
 */
export function useValidationMetrics(period: AnalyticsPeriod['value'] = 'month') {
  const [metrics, setMetrics] = useState<ValidationMetrics>({
    period: period as ValidationMetrics['period'],
    total_validations: 0,
    approved: 0,
    rejected: 0,
    needs_revision: 0,
    avg_accuracy_score: 0,
    avg_response_time: 0,
    quality_trend: 'stable'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMetrics();
  }, [period]);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/expert/analytics/validation-metrics/?period=${period}`);
      setMetrics(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar métricas de validación');
      console.error('Error loading validation metrics:', err);
      setMetrics({
        period: period as ValidationMetrics['period'],
        total_validations: 0,
        approved: 0,
        rejected: 0,
        needs_revision: 0,
        avg_accuracy_score: 0,
        avg_response_time: 0,
        quality_trend: 'stable'
      });
    } finally {
      setLoading(false);
    }
  };

  return { metrics, loading, error, refresh: loadMetrics };
}

/**
 * Hook para cargar distribución taxonómica
 */
export function useTaxonomyDistribution() {
  const [distribution, setDistribution] = useState<TaxonomyDistribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDistribution();
  }, []);

  const loadDistribution = async () => {
    try {
      setLoading(true);
      const response = await api.get('/expert/analytics/taxonomy-distribution/');
      setDistribution(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar distribución taxonómica');
      console.error('Error loading taxonomy distribution:', err);
      setDistribution([]);
    } finally {
      setLoading(false);
    }
  };

  return { distribution, loading, error, refresh: loadDistribution };
}

/**
 * Hook para cargar distribución por familia (top 10)
 */
export function useFamilyDistribution() {
  const [families, setFamilies] = useState<FamilyDistribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFamilies();
  }, []);

  const loadFamilies = async () => {
    try {
      setLoading(true);
      const response = await api.get('/expert/analytics/family-distribution/');
      setFamilies(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar distribución por familia');
      console.error('Error loading family distribution:', err);
      setFamilies([]);
    } finally {
      setLoading(false);
    }
  };

  return { families, loading, error, refresh: loadFamilies };
}

/**
 * Hook para cargar datos temporales (tendencias)
 */
export function useTemporalData(period: AnalyticsPeriod['value'] = 'month') {
  const [data, setData] = useState<TemporalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [period]);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/expert/analytics/temporal/?period=${period}`);
      setData(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar datos temporales');
      console.error('Error loading temporal data:', err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refresh: loadData };
}

/**
 * Hook para cargar estadísticas de conservación (IUCN)
 */
export function useConservationStats() {
  const [stats, setStats] = useState<ConservationStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/expert/analytics/conservation-stats/');
      setStats(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar estadísticas de conservación');
      console.error('Error loading conservation stats:', err);
      setStats([]);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, error, refresh: loadStats };
}

/**
 * Períodos disponibles para análisis
 */
export const ANALYTICS_PERIODS: AnalyticsPeriod[] = [
  { label: 'Última Semana', value: 'week', days: 7 },
  { label: 'Último Mes', value: 'month', days: 30 },
  { label: 'Último Trimestre', value: 'quarter', days: 90 },
  { label: 'Último Año', value: 'year', days: 365 },
  { label: 'Todo el Tiempo', value: 'all', days: -1 }
];
