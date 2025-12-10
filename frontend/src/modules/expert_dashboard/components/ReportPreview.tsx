/**
 * ReportPreview - Vista previa del reporte
 * Muestra un resumen de los datos antes de exportar
 */

import { motion } from 'framer-motion';
import { 
  FileText, 
  Calendar, 
  TrendingUp, 
  Leaf, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Download
} from 'lucide-react';
import type { ReportData, ReportConfig } from '../types';

interface ReportPreviewProps {
  reportData: ReportData;
  config: ReportConfig;
  onExport: () => void;
  exporting?: boolean;
}

export default function ReportPreview({
  reportData,
  config,
  onExport,
  exporting = false
}: ReportPreviewProps) {

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Validación: Si no hay datos, mostrar mensaje
  if (!reportData || !reportData.metadata) {
    return (
      <div className="card p-8 text-center">
        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-texto)' }}>
          No hay datos para mostrar
        </h3>
        <p className="text-muted">
          Genera un reporte para ver la vista previa
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header del reporte */}
      <div className="card p-6 border-l-4 border-blue-600">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-texto)' }}>
              {reportData.metadata.title}
            </h2>
            <div className="flex items-center gap-4 text-sm text-muted">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {formatDate(reportData.metadata.date_range.from)} - {formatDate(reportData.metadata.date_range.to)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Formato: {config.format.toUpperCase()}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onExport}
            disabled={exporting}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            {exporting ? 'Exportando...' : 'Exportar Reporte'}
          </button>
        </div>
      </div>

      {/* Resumen ejecutivo */}
      {config.include_sections.summary && (
        <div className="card p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--color-texto)' }}>
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Resumen Ejecutivo
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <p className="text-3xl font-bold text-blue-600">
                {reportData.summary.total_validations}
              </p>
              <p className="text-sm text-muted mt-1">Validaciones</p>
            </div>

            <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
              <p className="text-3xl font-bold text-green-600">
                {reportData.summary.total_species}
              </p>
              <p className="text-sm text-muted mt-1">Especies</p>
            </div>

            <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <p className="text-3xl font-bold text-purple-600">
                {reportData.summary.approval_rate.toFixed(1)}%
              </p>
              <p className="text-sm text-muted mt-1">Tasa Aprobación</p>
            </div>

            <div className="text-center p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20">
              <p className="text-3xl font-bold text-amber-600">
                {reportData.summary.avg_accuracy.toFixed(1)}/5
              </p>
              <p className="text-sm text-muted mt-1">Precisión</p>
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas de validación */}
      {config.include_sections.validation_stats && (
        <div className="card p-6">
          <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-texto)' }}>
            Estadísticas de Validación
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium" style={{ color: 'var(--color-texto)' }}>
                  Aprobadas
                </span>
              </div>
              <span className="text-xl font-bold text-green-600">
                {reportData.validation_stats.approved}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
              <div className="flex items-center gap-3">
                <XCircle className="w-5 h-5 text-red-600" />
                <span className="font-medium" style={{ color: 'var(--color-texto)' }}>
                  Rechazadas
                </span>
              </div>
              <span className="text-xl font-bold text-red-600">
                {reportData.validation_stats.rejected}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <span className="font-medium" style={{ color: 'var(--color-texto)' }}>
                  Necesitan Revisión
                </span>
              </div>
              <span className="text-xl font-bold text-amber-600">
                {reportData.validation_stats.needs_revision}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Análisis de biodiversidad */}
      {config.include_sections.biodiversity_analysis && (
        <div className="card p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--color-texto)' }}>
            <Leaf className="w-5 h-5 text-green-600" />
            Análisis de Biodiversidad
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-muted mb-1">Total Especies</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-texto)' }}>
                {reportData.biodiversity.total_species}
              </p>
            </div>

            <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-muted mb-1">Especies Validadas</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-texto)' }}>
                {reportData.biodiversity.species_validated}
              </p>
            </div>

            <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-muted mb-1">Familias Únicas</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-texto)' }}>
                {reportData.biodiversity.unique_families}
              </p>
            </div>

            <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-muted mb-1">Reinos</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-texto)' }}>
                {reportData.biodiversity.unique_kingdoms}
              </p>
            </div>

            <div className="p-4 rounded-lg border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20">
              <p className="text-sm text-muted mb-1">Endémicas</p>
              <p className="text-2xl font-bold text-green-600">
                {reportData.biodiversity.endemic_species}
              </p>
            </div>

            <div className="p-4 rounded-lg border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20">
              <p className="text-sm text-muted mb-1">Amenazadas</p>
              <p className="text-2xl font-bold text-red-600">
                {reportData.biodiversity.threatened_species}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Distribución taxonómica */}
      {config.include_sections.biodiversity_analysis && reportData.taxonomy_distribution.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-texto)' }}>
            Distribución por Reino
          </h3>

          <div className="space-y-3">
            {reportData.taxonomy_distribution.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: item.color || '#3b82f6' }}
                    />
                    <span className="font-medium" style={{ color: 'var(--color-texto)' }}>
                      {item.kingdom}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-muted">{item.count} especies</span>
                    <span className="font-semibold" style={{ color: 'var(--color-texto)' }}>
                      {item.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ 
                      width: `${item.percentage}%`,
                      backgroundColor: item.color || '#3b82f6'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lista de especies (primeras 10) */}
      {config.include_sections.species_list && reportData.species_list.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-texto)' }}>
            Lista de Especies (Muestra)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold text-muted">Nombre Científico</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted">Nombre Común</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted">Familia</th>
                  <th className="text-center py-3 px-4 font-semibold text-muted">Estado</th>
                </tr>
              </thead>
              <tbody>
                {reportData.species_list.slice(0, 10).map((species, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-4">
                      <span className="italic font-medium" style={{ color: 'var(--color-texto)' }}>
                        {species.scientific_name}
                      </span>
                    </td>
                    <td className="py-3 px-4" style={{ color: 'var(--color-texto)' }}>
                      {species.common_name}
                    </td>
                    <td className="py-3 px-4 text-muted">
                      {species.family}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        species.validation_status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        species.validation_status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                        species.validation_status === 'needs_revision' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {species.validation_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {reportData.species_list.length > 10 && (
              <p className="text-sm text-muted text-center mt-4">
                ... y {reportData.species_list.length - 10} especies más en el reporte completo
              </p>
            )}
          </div>
        </div>
      )}

      {/* Notas del experto */}
      {config.include_sections.expert_notes && reportData.expert_notes && (
        <div className="card p-6">
          <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-texto)' }}>
            Notas del Experto
          </h3>
          <p className="text-muted whitespace-pre-wrap">
            {reportData.expert_notes}
          </p>
        </div>
      )}

      {/* Recomendaciones */}
      {config.include_sections.recommendations && reportData.recommendations && reportData.recommendations.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-texto)' }}>
            Recomendaciones
          </h3>
          <ul className="space-y-2">
            {reportData.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span className="text-muted">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Metadatos del reporte */}
      <div className="card p-4 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center justify-between text-xs text-muted">
          <span>Generado por: {reportData.metadata.generated_by}</span>
          <span>Fecha de generación: {formatDate(reportData.metadata.generated_at)}</span>
          <span>Período: {reportData.metadata.period}</span>
        </div>
      </div>
    </motion.div>
  );
}
