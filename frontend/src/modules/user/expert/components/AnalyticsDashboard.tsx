/**
 * AnalyticsDashboard - Panel principal de Analytics
 * Combina métricas, gráficos de biodiversidad y tendencias de validación
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  FileCheck, 
  Target,
  Leaf,
  Shield,
  Clock,
  Award,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import MetricsCard from './MetricsCard';
import BiodiversityChart from './BiodiversityChart';
import ValidationTrendsChart from './ValidationTrendsChart';
import { 
  useBiodiversityStats,
  useValidationMetrics,
  useTaxonomyDistribution,
  useFamilyDistribution,
  useTemporalData,
  ANALYTICS_PERIODS
} from '../hooks/useAnalyticsData';
import type { AnalyticsPeriod } from '../types';

export default function AnalyticsDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<AnalyticsPeriod['value']>('month');

  // Cargar todos los datos
  const { stats: biodiversityStats, loading: loadingBiodiversity } = useBiodiversityStats();
  const { metrics, loading: loadingMetrics } = useValidationMetrics(selectedPeriod);
  const { distribution: taxonomyDist, loading: loadingTaxonomy } = useTaxonomyDistribution();
  const { families, loading: loadingFamilies } = useFamilyDistribution();
  const { data: temporalData, loading: loadingTemporal } = useTemporalData(selectedPeriod);

  const isLoading = loadingBiodiversity || loadingMetrics || loadingTaxonomy || loadingFamilies || loadingTemporal;

  // Calcular métricas derivadas
  const approvalRate = metrics.total_validations > 0 
    ? (metrics.approved / metrics.total_validations) * 100 
    : 0;

  const validationRate = biodiversityStats.total_species > 0
    ? (biodiversityStats.species_validated / biodiversityStats.total_species) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Header con selector de período */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-texto)' }}>
            Dashboard Analítico
          </h2>
          <p className="text-muted">
            Análisis de biodiversidad y métricas de validación científica
          </p>
        </div>

        {/* Selector de período */}
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-muted" />
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as AnalyticsPeriod['value'])}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ color: 'var(--color-texto)' }}
          >
            {ANALYTICS_PERIODS.map(period => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid de métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricsCard
          title="Total Especies"
          value={biodiversityStats.total_species}
          icon={Leaf}
          color="green"
          subtitle={`${biodiversityStats.unique_families} familias únicas`}
          isLoading={loadingBiodiversity}
        />

        <MetricsCard
          title="Especies Validadas"
          value={biodiversityStats.species_validated}
          icon={FileCheck}
          color="blue"
          change={validationRate - 50} // Cambio respecto al 50%
          changeLabel={`${validationRate.toFixed(1)}% del total`}
          isLoading={loadingBiodiversity}
        />

        <MetricsCard
          title="Tasa de Aprobación"
          value={`${approvalRate.toFixed(1)}%`}
          icon={Target}
          color="purple"
          trend={metrics.quality_trend === 'improving' ? 'up' : metrics.quality_trend === 'declining' ? 'down' : 'stable'}
          subtitle={`${metrics.total_validations} validaciones`}
          isLoading={loadingMetrics}
        />

        <MetricsCard
          title="Precisión Científica"
          value={`${metrics.avg_accuracy_score.toFixed(1)}/5`}
          icon={Award}
          color="amber"
          subtitle={`${metrics.avg_response_time.toFixed(1)}h tiempo promedio`}
          isLoading={loadingMetrics}
        />
      </div>

      {/* Métricas secundarias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricsCard
          title="Especies Endémicas"
          value={biodiversityStats.endemic_species}
          icon={Shield}
          color="green"
          subtitle="Únicas de la región"
          isLoading={loadingBiodiversity}
        />

        <MetricsCard
          title="Especies Amenazadas"
          value={biodiversityStats.threatened_species}
          icon={AlertCircle}
          color="red"
          subtitle="Categorías VU, EN, CR"
          isLoading={loadingBiodiversity}
        />

        <MetricsCard
          title="Tiempo de Respuesta"
          value={`${metrics.avg_response_time.toFixed(1)}h`}
          icon={Clock}
          color="blue"
          subtitle="Promedio de validación"
          isLoading={loadingMetrics}
        />
      </div>

      {/* Gráfico de tendencias temporales */}
      <ValidationTrendsChart 
        data={temporalData}
        isLoading={loadingTemporal}
      />

      {/* Gráficos de biodiversidad */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BiodiversityChart
          taxonomyData={taxonomyDist}
          familyData={families.slice(0, 8)} // Top 8 para primera columna
          isLoading={loadingTaxonomy || loadingFamilies}
        />
        
        {/* Métricas adicionales o segundo gráfico */}
        <div className="space-y-6">
          {/* Resumen de validaciones por estado */}
          <div className="card p-6">
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-texto)' }}>
              Estado de Validaciones
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium" style={{ color: 'var(--color-texto)' }}>
                    Aprobadas
                  </span>
                </div>
                <span className="text-2xl font-bold text-green-600">
                  {metrics.approved}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                <div className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="font-medium" style={{ color: 'var(--color-texto)' }}>
                    Rechazadas
                  </span>
                </div>
                <span className="text-2xl font-bold text-red-600">
                  {metrics.rejected}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <span className="font-medium" style={{ color: 'var(--color-texto)' }}>
                    Necesitan Revisión
                  </span>
                </div>
                <span className="text-2xl font-bold text-amber-600">
                  {metrics.needs_revision}
                </span>
              </div>
            </div>
          </div>

          {/* Indicador de tendencia de calidad */}
          <div className="card p-6">
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-texto)' }}>
              Tendencia de Calidad
            </h3>
            
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-full ${
                metrics.quality_trend === 'improving' ? 'bg-green-100 dark:bg-green-900/30' :
                metrics.quality_trend === 'declining' ? 'bg-red-100 dark:bg-red-900/30' :
                'bg-gray-100 dark:bg-gray-800'
              }`}>
                <TrendingUp className={`w-8 h-8 ${
                  metrics.quality_trend === 'improving' ? 'text-green-600 rotate-0' :
                  metrics.quality_trend === 'declining' ? 'text-red-600 rotate-180' :
                  'text-gray-600 rotate-90'
                }`} />
              </div>
              
              <div className="flex-1">
                <p className="text-2xl font-bold mb-1" style={{ color: 'var(--color-texto)' }}>
                  {metrics.quality_trend === 'improving' ? 'Mejorando' :
                   metrics.quality_trend === 'declining' ? 'Declinando' :
                   'Estable'}
                </p>
                <p className="text-sm text-muted">
                  Basado en precisión científica y tiempo de respuesta
                </p>
              </div>
            </div>
          </div>

          {/* Reinos registrados */}
          <div className="card p-6">
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-texto)' }}>
              Diversidad Taxonómica
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <p className="text-3xl font-bold text-blue-600">
                  {biodiversityStats.unique_kingdoms}
                </p>
                <p className="text-sm text-muted mt-1">Reinos</p>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <p className="text-3xl font-bold text-purple-600">
                  {biodiversityStats.unique_families}
                </p>
                <p className="text-sm text-muted mt-1">Familias</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
