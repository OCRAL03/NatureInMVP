/**
 * Hook personalizado para generación de reportes
 * Gestiona la creación, previsualización y exportación de reportes científicos
 */

import { useState } from 'react';
import api from '../../../../api/client.ts';
import type { 
  ReportTemplate, 
  ReportConfig, 
  ReportData,
  ReportExportOptions,
  ReportGenerationResult
} from '../types';

/**
 * Plantillas predefinidas de reportes
 */
export const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: 'validation-summary',
    name: 'Resumen de Validaciones',
    description: 'Informe completo de todas las validaciones realizadas en un período',
    icon: 'FileCheck',
    category: 'validation',
    requiredData: ['validation_stats', 'temporal_trends']
  },
  {
    id: 'biodiversity-analysis',
    name: 'Análisis de Biodiversidad',
    description: 'Reporte detallado de especies identificadas y su distribución taxonómica',
    icon: 'Leaf',
    category: 'biodiversity',
    requiredData: ['biodiversity', 'taxonomy_distribution', 'species_list']
  },
  {
    id: 'conservation-status',
    name: 'Estado de Conservación',
    description: 'Informe sobre especies amenazadas y su estado de conservación IUCN',
    icon: 'Shield',
    category: 'biodiversity',
    requiredData: ['biodiversity', 'conservation_stats', 'species_list']
  },
  {
    id: 'expert-activity',
    name: 'Actividad del Experto',
    description: 'Resumen de la actividad de validación científica del experto',
    icon: 'Award',
    category: 'activity',
    requiredData: ['validation_stats', 'temporal_trends']
  },
  {
    id: 'complete-report',
    name: 'Reporte Completo',
    description: 'Informe integral con todas las métricas, análisis y recomendaciones',
    icon: 'FileText',
    category: 'custom',
    requiredData: ['summary', 'validation_stats', 'biodiversity', 'temporal_trends', 'species_list']
  }
];

/**
 * Hook principal para generación de reportes
 */
export function useReportGenerator() {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentReport, setCurrentReport] = useState<ReportData | null>(null);

  /**
   * Genera los datos del reporte según la configuración
   */
  const generateReportData = async (config: ReportConfig): Promise<ReportData | null> => {
    try {
      setGenerating(true);
      setProgress(0);

      // Simular progreso
      setProgress(20);
      
      const response = await api.post('/expert/reports/generate/', config);
      
      setProgress(80);
      
      // Mapear la respuesta del backend al formato esperado por el frontend
      const backendData = response.data;
      const reportData: ReportData = {
        metadata: {
          title: backendData.title || config.title,
          generated_at: backendData.generated_at,
          generated_by: backendData.generated_by?.name || 'Experto',
          period: `${backendData.period?.duration_days || 0} días`,
          date_range: {
            from: backendData.period?.start_date || config.date_from,
            to: backendData.period?.end_date || config.date_to,
          }
        },
        summary: {
          total_validations: backendData.summary?.total_validations || 0,
          total_species: backendData.summary?.total_species || 0,
          approval_rate: backendData.summary?.approval_rate || 0,
          avg_accuracy: backendData.validation_stats?.quality_score || 0
        },
        validation_stats: {
          period: 'custom',
          total_validations: backendData.validation_stats?.approved + backendData.validation_stats?.rejected || 0,
          approved: backendData.validation_stats?.approved || 0,
          rejected: backendData.validation_stats?.rejected || 0,
          needs_revision: backendData.validation_stats?.pending || 0,
          avg_accuracy_score: backendData.validation_stats?.quality_score || 0,
          avg_response_time: backendData.validation_stats?.avg_validation_time || 0,
          quality_trend: 'stable' as const
        },
        biodiversity: backendData.biodiversity || {
          total_species: 0,
          species_validated: 0,
          unique_families: 0,
          unique_kingdoms: 0,
          endemic_count: 0,
          threatened_count: 0
        },
        taxonomy_distribution: backendData.taxonomy_distribution || [],
        temporal_data: backendData.temporal_trends || [],
        species_list: (backendData.species_list || []).map((species: any) => ({
          id: species.rank,
          scientific_name: species.scientific_name,
          common_name: species.common_name || '',
          kingdom: '',
          family: '',
          validation_status: species.validation_status,
          iucn_status: species.conservation_status
        })),
        expert_notes: backendData.notes,
        recommendations: backendData.recommendations || []
      };
      
      setProgress(100);
      setCurrentReport(reportData);
      
      return reportData;
    } catch (error) {
      console.error('Error generando datos del reporte:', error);
      return null;
    } finally {
      setGenerating(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  /**
   * Exporta el reporte en el formato especificado
   */
  const exportReport = async (
    reportData: ReportData,
    options: ReportExportOptions
  ): Promise<ReportGenerationResult> => {
    try {
      setGenerating(true);
      setProgress(0);

      setProgress(30);

      const response = await api.post('/expert/reports/export/', {
        report_data: reportData,
        export_options: options
      }, {
        responseType: 'blob' // Siempre esperamos un archivo
      });

      setProgress(80);

      // Determinar el tipo MIME según el formato
      let mimeType = 'text/csv';
      let extension = '.csv';
      
      if (options.format === 'pdf') {
        mimeType = 'application/pdf';
        extension = '.pdf';
      } else if (options.format === 'excel') {
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        extension = '.xlsx';
      }

      // Crear blob y descargar
      const blob = new Blob([response.data], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Asegurar que el nombre del archivo tenga la extensión correcta
      let filename = options.filename;
      if (!filename.endsWith(extension)) {
        filename = filename.replace(/\.[^/.]+$/, '') + extension;
      }
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setProgress(100);
      
      return {
        success: true,
        download_url: url
      };
    } catch (error) {
      console.error('Error exportando reporte:', error);
      return {
        success: false,
        error: 'Error al exportar el reporte'
      };
    } finally {
      setGenerating(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  /**
   * Genera y exporta el reporte en un solo paso
   */
  const generateAndExport = async (
    config: ReportConfig,
    exportOptions: ReportExportOptions
  ): Promise<ReportGenerationResult> => {
    const reportData = await generateReportData(config);
    
    if (!reportData) {
      return {
        success: false,
        error: 'Error al generar los datos del reporte'
      };
    }

    return await exportReport(reportData, exportOptions);
  };

  /**
   * Limpia el reporte actual
   */
  const clearReport = () => {
    setCurrentReport(null);
    setProgress(0);
  };

  return {
    generating,
    progress,
    currentReport,
    generateReportData,
    exportReport,
    generateAndExport,
    clearReport,
    templates: REPORT_TEMPLATES
  };
}

/**
 * Hook para obtener la configuración por defecto según la plantilla
 */
export function useDefaultConfig(templateId: string): Partial<ReportConfig> {
  const template = REPORT_TEMPLATES.find(t => t.id === templateId);
  
  if (!template) {
    return {};
  }

  const now = new Date();
  const oneMonthAgo = new Date(now);
  oneMonthAgo.setMonth(now.getMonth() - 1);

  return {
    template_id: templateId,
    title: template.name,
    period: 'month',
    date_from: oneMonthAgo.toISOString().split('T')[0],
    date_to: now.toISOString().split('T')[0],
    include_sections: {
      summary: template.requiredData.includes('summary'),
      validation_stats: template.requiredData.includes('validation_stats'),
      biodiversity_analysis: template.requiredData.includes('biodiversity'),
      temporal_trends: template.requiredData.includes('temporal_trends'),
      species_list: template.requiredData.includes('species_list'),
      expert_notes: true,
      recommendations: template.category === 'custom'
    },
    filters: {
      kingdoms: [],
      validation_status: [],
      min_accuracy: 0
    },
    format: 'pdf',
    language: 'es'
  };
}

/**
 * Utilidad para formatear el tamaño de archivo
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
