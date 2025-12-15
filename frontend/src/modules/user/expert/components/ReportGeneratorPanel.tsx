/**
 * ReportGeneratorPanel - Panel principal de generación de reportes
 * Gestiona el flujo completo: selección de plantilla → configuración → previsualización → exportación
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  FileCheck, 
  Leaf,
  Shield,
  Award,
  ChevronRight,
  ArrowLeft,
  Loader,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import { useReportGenerator, REPORT_TEMPLATES } from '../hooks/useReportGenerator';
import ReportConfigForm from './ReportConfigForm';
import ReportPreview from './ReportPreview';
import type { ReportConfig, ReportTemplate, ReportExportOptions } from '../types';

type Step = 'template' | 'config' | 'preview';

export default function ReportGeneratorPanel() {
  const [currentStep, setCurrentStep] = useState<Step>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [reportConfig, setReportConfig] = useState<ReportConfig | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showNoDataWarning, setShowNoDataWarning] = useState(false);
  
  const {
    generating,
    progress,
    currentReport,
    generateReportData,
    exportReport,
    clearReport,
    templates
  } = useReportGenerator();

  // Iconos para las plantillas
  const getTemplateIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      FileCheck,
      Leaf,
      Shield,
      Award,
      FileText
    };
    return icons[iconName] || FileText;
  };

  const handleTemplateSelect = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setCurrentStep('config');
    clearReport();
  };

  const handleConfigComplete = async (config: ReportConfig) => {
    setReportConfig(config);
    setErrorMessage(null);
    setShowNoDataWarning(false);
    
    // Generar datos del reporte
    const data = await generateReportData(config);
    
    if (data) {
      // Verificar si hay datos suficientes
      const hasData = 
        data.summary.total_validations > 0 || 
        data.summary.total_species > 0 ||
        data.species_list.length > 0;

      if (!hasData) {
        setShowNoDataWarning(true);
        setErrorMessage('No hay datos disponibles para el período seleccionado. Intenta ajustar las fechas o los filtros.');
        return;
      }
      
      setCurrentStep('preview');
    } else {
      setErrorMessage('Error al generar el reporte. Por favor, verifica tu conexión e inténtalo nuevamente.');
    }
  };

  const handleExport = async () => {
    if (!currentReport || !reportConfig) return;

    setErrorMessage(null);

    const exportOptions: ReportExportOptions = {
      filename: `${reportConfig.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`,
      format: reportConfig.format,
      compress: reportConfig.format === 'json',
      include_images: reportConfig.format === 'pdf',
      page_size: 'A4',
      orientation: 'portrait'
    };

    const result = await exportReport(currentReport, exportOptions);

    if (result.success) {
      // Mostrar mensaje de éxito
      setErrorMessage(null);
    } else {
      setErrorMessage(result.error || 'Error al exportar el reporte. Inténtalo nuevamente.');
    }
  };

  const handleBack = () => {
    setErrorMessage(null);
    setShowNoDataWarning(false);
    
    if (currentStep === 'preview') {
      setCurrentStep('config');
    } else if (currentStep === 'config') {
      setCurrentStep('template');
      setSelectedTemplate(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con navegación de pasos */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-texto)' }}>
              Generador de Reportes
            </h2>
            <p className="text-muted">
              Crea reportes científicos personalizados con tus datos de validación
            </p>
          </div>

          {currentStep !== 'template' && (
            <button
              onClick={handleBack}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </button>
          )}
        </div>

        {/* Indicador de pasos */}
        <div className="flex items-center gap-2">
          {[
            { id: 'template', label: 'Plantilla' },
            { id: 'config', label: 'Configuración' },
            { id: 'preview', label: 'Vista Previa' }
          ].map((step, index) => (
            <div key={step.id} className="flex items-center gap-2 flex-1">
              <div className={`flex-1 h-2 rounded-full ${
                currentStep === step.id ? 'bg-blue-600' :
                ['template', 'config', 'preview'].indexOf(currentStep) > index ? 'bg-green-600' :
                'bg-gray-200 dark:bg-gray-700'
              }`} />
              {index < 2 && <ChevronRight className="w-4 h-4 text-gray-400" />}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-3 text-sm">
          {[
            { id: 'template', label: '1. Seleccionar Plantilla' },
            { id: 'config', label: '2. Configurar Reporte' },
            { id: 'preview', label: '3. Vista Previa y Exportar' }
          ].map((step) => (
            <span
              key={step.id}
              className={`font-medium ${
                currentStep === step.id ? 'text-blue-600' : 'text-muted'
              }`}
            >
              {step.label}
            </span>
          ))}
        </div>
      </div>

      {/* Barra de progreso durante generación */}
      {generating && progress > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <Loader className="w-5 h-5 animate-spin text-blue-600" />
            <span className="font-medium" style={{ color: 'var(--color-texto)' }}>
              {currentStep === 'config' ? 'Generando datos del reporte...' : 'Exportando reporte...'}
            </span>
            <span className="text-sm text-muted ml-auto">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-blue-600 rounded-full"
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      )}

      {/* Mensaje de error */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-4 border-l-4 border-red-600 bg-red-50 dark:bg-red-900/20"
        >
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-red-800 dark:text-red-400 mb-1">
                Error al Generar Reporte
              </h4>
              <p className="text-sm text-red-700 dark:text-red-300">
                {errorMessage}
              </p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-600 hover:text-red-800 transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Advertencia de datos insuficientes */}
      {showNoDataWarning && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-4 border-l-4 border-amber-600 bg-amber-50 dark:bg-amber-900/20"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-amber-800 dark:text-amber-400 mb-1">
                Datos Insuficientes
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                No se encontraron validaciones o especies en el período seleccionado. 
                Esto puede deberse a:
              </p>
              <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1 ml-4">
                <li>• No hay validaciones registradas en este rango de fechas</li>
                <li>• Los filtros aplicados son demasiado restrictivos</li>
                <li>• Aún no has realizado ninguna validación</li>
              </ul>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => {
                    setShowNoDataWarning(false);
                    setErrorMessage(null);
                  }}
                  className="px-3 py-1.5 text-sm bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
                >
                  Ajustar Configuración
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Contenido según el paso actual */}
      <AnimatePresence mode="wait">
        {currentStep === 'template' && (
          <motion.div
            key="template"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => {
                const Icon = getTemplateIcon(template.icon);
                
                return (
                  <motion.button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="card p-6 text-left hover:shadow-lg transition-all border-2 border-transparent hover:border-blue-600"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${
                        template.category === 'validation' ? 'bg-blue-100 dark:bg-blue-900/30' :
                        template.category === 'biodiversity' ? 'bg-green-100 dark:bg-green-900/30' :
                        template.category === 'activity' ? 'bg-purple-100 dark:bg-purple-900/30' :
                        'bg-gray-100 dark:bg-gray-800'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          template.category === 'validation' ? 'text-blue-600' :
                          template.category === 'biodiversity' ? 'text-green-600' :
                          template.category === 'activity' ? 'text-purple-600' :
                          'text-gray-600'
                        }`} />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-bold mb-2" style={{ color: 'var(--color-texto)' }}>
                          {template.name}
                        </h3>
                        <p className="text-sm text-muted mb-3">
                          {template.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            template.category === 'validation' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400' :
                            template.category === 'biodiversity' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400' :
                            template.category === 'activity' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                          }`}>
                            {template.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {currentStep === 'config' && selectedTemplate && (
          <motion.div
            key="config"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <ReportConfigForm
              selectedTemplate={selectedTemplate}
              onConfigChange={setReportConfig}
            />

            <div className="flex justify-end mt-6">
              <button
                onClick={() => reportConfig && handleConfigComplete(reportConfig)}
                disabled={!reportConfig || generating}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {generating ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    Generar Vista Previa
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {currentStep === 'preview' && currentReport && reportConfig && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <ReportPreview
              reportData={currentReport}
              config={reportConfig}
              onExport={handleExport}
              exporting={generating}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
