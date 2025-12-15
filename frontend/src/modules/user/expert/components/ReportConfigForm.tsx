/**
 * ReportConfigForm - Formulario de configuración de reportes
 * Permite al usuario personalizar los parámetros del reporte a generar
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Filter, FileText, Globe, Download } from 'lucide-react';
import type { ReportConfig, ReportTemplate } from '../types';
import { useDefaultConfig } from '../hooks/useReportGenerator';
import { ANALYTICS_PERIODS } from '../hooks/useAnalyticsData';

interface ReportConfigFormProps {
  selectedTemplate: ReportTemplate;
  onConfigChange: (config: ReportConfig) => void;
  initialConfig?: Partial<ReportConfig>;
}

export default function ReportConfigForm({
  selectedTemplate,
  onConfigChange,
  initialConfig
}: ReportConfigFormProps) {
  const defaultConfig = useDefaultConfig(selectedTemplate.id);
  const [config, setConfig] = useState<ReportConfig>({
    ...defaultConfig,
    ...initialConfig
  } as ReportConfig);

  useEffect(() => {
    onConfigChange(config);
  }, [config]);

  const handleChange = (field: keyof ReportConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSectionToggle = (section: keyof ReportConfig['include_sections']) => {
    setConfig(prev => ({
      ...prev,
      include_sections: {
        ...prev.include_sections,
        [section]: !prev.include_sections[section]
      }
    }));
  };

  const handleFilterChange = (filterKey: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [filterKey]: value
      }
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Información básica */}
      <div className="card p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--color-texto)' }}>
          <FileText className="w-5 h-5 text-blue-600" />
          Información Básica
        </h3>

        <div className="space-y-4">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-muted mb-2">
              Título del Reporte
            </label>
            <input
              type="text"
              value={config.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ color: 'var(--color-texto)' }}
              placeholder="Ej: Reporte Mensual de Biodiversidad"
            />
          </div>

          {/* Período y rango de fechas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-2">
                Período
              </label>
              <select
                value={config.period}
                onChange={(e) => handleChange('period', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                style={{ color: 'var(--color-texto)' }}
              >
                {ANALYTICS_PERIODS.map(period => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted mb-2 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Desde
              </label>
              <input
                type="date"
                value={config.date_from}
                onChange={(e) => handleChange('date_from', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                style={{ color: 'var(--color-texto)' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted mb-2 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Hasta
              </label>
              <input
                type="date"
                value={config.date_to}
                onChange={(e) => handleChange('date_to', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                style={{ color: 'var(--color-texto)' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Secciones a incluir */}
      <div className="card p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--color-texto)' }}>
          <Filter className="w-5 h-5 text-purple-600" />
          Secciones del Reporte
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(config.include_sections).map(([key, value]) => (
            <label
              key={key}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={value}
                onChange={() => handleSectionToggle(key as keyof ReportConfig['include_sections'])}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-medium capitalize" style={{ color: 'var(--color-texto)' }}>
                {key.replace(/_/g, ' ')}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Filtros */}
      <div className="card p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--color-texto)' }}>
          <Filter className="w-5 h-5 text-amber-600" />
          Filtros Avanzados
        </h3>

        <div className="space-y-4">
          {/* Filtro por reinos */}
          <div>
            <label className="block text-sm font-medium text-muted mb-2">
              Reinos a Incluir
            </label>
            <div className="flex flex-wrap gap-2">
              {['Animalia', 'Plantae', 'Fungi', 'Protista', 'Bacteria'].map(kingdom => (
                <button
                  key={kingdom}
                  onClick={() => {
                    const current = config.filters.kingdoms || [];
                    const updated = current.includes(kingdom)
                      ? current.filter(k => k !== kingdom)
                      : [...current, kingdom];
                    handleFilterChange('kingdoms', updated);
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    (config.filters.kingdoms || []).includes(kingdom)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {kingdom}
                </button>
              ))}
            </div>
          </div>

          {/* Filtro por estado de validación */}
          <div>
            <label className="block text-sm font-medium text-muted mb-2">
              Estados de Validación
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'approved', label: 'Aprobadas', color: 'green' },
                { value: 'rejected', label: 'Rechazadas', color: 'red' },
                { value: 'pending', label: 'Pendientes', color: 'blue' },
                { value: 'needs_revision', label: 'Necesitan Revisión', color: 'amber' }
              ].map(status => (
                <button
                  key={status.value}
                  onClick={() => {
                    const current = config.filters.validation_status || [];
                    const updated = current.includes(status.value as any)
                      ? current.filter(s => s !== status.value)
                      : [...current, status.value as any];
                    handleFilterChange('validation_status', updated);
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    (config.filters.validation_status || []).includes(status.value as any)
                      ? `bg-${status.color}-600 text-white`
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          {/* Precisión mínima */}
          <div>
            <label className="block text-sm font-medium text-muted mb-2">
              Precisión Científica Mínima: {config.filters.min_accuracy || 0}/5
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={config.filters.min_accuracy || 0}
              onChange={(e) => handleFilterChange('min_accuracy', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Formato y opciones de exportación */}
      <div className="card p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--color-texto)' }}>
          <Download className="w-5 h-5 text-green-600" />
          Formato de Exportación
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Formato */}
          <div>
            <label className="block text-sm font-medium text-muted mb-2">
              Formato
            </label>
            <select
              value={config.format}
              onChange={(e) => handleChange('format', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
              style={{ color: 'var(--color-texto)' }}
            >
              <option value="pdf">PDF (Documento)</option>
              <option value="excel">Excel (Hoja de Cálculo)</option>
              <option value="csv">CSV (Valores Separados)</option>
              <option value="json">JSON (Datos Estructurados)</option>
            </select>
          </div>

          {/* Idioma */}
          <div>
            <label className="block text-sm font-medium text-muted mb-2 flex items-center gap-1">
              <Globe className="w-4 h-4" />
              Idioma
            </label>
            <select
              value={config.language}
              onChange={(e) => handleChange('language', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
              style={{ color: 'var(--color-texto)' }}
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
