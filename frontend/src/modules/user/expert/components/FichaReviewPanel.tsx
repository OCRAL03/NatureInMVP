import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronDown, SlidersHorizontal, CheckCircle, XCircle, Clock, AlertCircle, FileText } from 'lucide-react';
import type { FichaReview, FichaFilters, FichaValidation } from '../types';
import FichaReviewCard from './FichaReviewCard';
import FichaDetailModal from './FichaDetailModal';
import { useFichasReview, useFichaValidation } from '../hooks/useFichaReview';

interface FichaReviewPanelProps {
  initialFichas?: FichaReview[];
}

export default function FichaReviewPanel({ initialFichas = [] }: FichaReviewPanelProps) {
  const { fichas: loadedFichas, loading: loadingFichas, refresh } = useFichasReview();
  const { 
    fichasList, 
    setFichasList, 
    validateFicha, 
    quickApprove, 
    quickReject,
    filterFichas,
    getStats
  } = useFichaValidation();

  const [selectedFicha, setSelectedFicha] = useState<FichaReview | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FichaFilters>({
    search: '',
    status: 'all',
    organism_type: 'all',
    author_role: 'all',
    date_from: '',
    date_to: '',
    sort_by: 'date',
    sort_order: 'desc',
  });

  // Inicializar lista de fichas
  useEffect(() => {
    const fichas = initialFichas.length > 0 ? initialFichas : loadedFichas;
    setFichasList(fichas);
  }, [initialFichas, loadedFichas, setFichasList]);

  const filteredFichas = filterFichas(fichasList, filters);
  const stats = getStats(fichasList);

  const statusTabs = [
    { key: 'all' as const, label: 'Todas', count: stats.total, icon: SlidersHorizontal },
    { key: 'pending' as const, label: 'Pendientes', count: stats.pending, icon: Clock },
    { key: 'approved' as const, label: 'Aprobadas', count: stats.approved, icon: CheckCircle },
    { key: 'needs_revision' as const, label: 'Revisión', count: stats.needs_revision, icon: AlertCircle },
    { key: 'rejected' as const, label: 'Rechazadas', count: stats.rejected, icon: XCircle },
  ];

  const handleValidate = async (validation: FichaValidation) => {
    const result = await validateFicha(validation);
    if (result.success) {
      setSelectedFicha(null);
      // Mostrar notificación de éxito
      alert(result.message);
    } else {
      alert(result.message);
    }
  };

  const handleQuickAction = async (fichaId: number, action: 'approve' | 'reject') => {
    if (action === 'approve') {
      const result = await quickApprove(fichaId);
      if (result.success) {
        alert(result.message);
      }
    } else {
      const reason = prompt('¿Por qué rechazas esta ficha?');
      if (reason) {
        const result = await quickReject(fichaId, reason);
        if (result.success) {
          alert(result.message);
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra de búsqueda y filtros */}
      <div className="card p-4 space-y-4">
        {/* Búsqueda */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              type="text"
              placeholder="Buscar por nombre científico, común o autor..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="input-field pl-10 w-full"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-outline px-4 flex items-center gap-2 ${showFilters ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
          >
            <Filter className="w-5 h-5" />
            Filtros
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Filtros avanzados */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <div>
                <label className="text-sm font-medium mb-2 block">Tipo de Organismo</label>
                <select
                  value={filters.organism_type}
                  onChange={(e) => setFilters({ ...filters, organism_type: e.target.value as FichaFilters['organism_type'] })}
                  className="input-field w-full"
                >
                  <option value="all">Todos</option>
                  <option value="animal">Animales</option>
                  <option value="plant">Plantas</option>
                  <option value="fungi">Hongos</option>
                  <option value="other">Otros</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Autor</label>
                <select
                  value={filters.author_role}
                  onChange={(e) => setFilters({ ...filters, author_role: e.target.value as FichaFilters['author_role'] })}
                  className="input-field w-full"
                >
                  <option value="all">Todos</option>
                  <option value="teacher">Docentes</option>
                  <option value="student">Estudiantes</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Ordenar por</label>
                <div className="flex gap-2">
                  <select
                    value={filters.sort_by}
                    onChange={(e) => setFilters({ ...filters, sort_by: e.target.value as FichaFilters['sort_by'] })}
                    className="input-field flex-1"
                  >
                    <option value="date">Fecha</option>
                    <option value="name">Nombre</option>
                    <option value="accuracy">Calidad</option>
                  </select>
                  <button
                    onClick={() => setFilters({ ...filters, sort_order: filters.sort_order === 'asc' ? 'desc' : 'asc' })}
                    className="btn-outline px-3"
                  >
                    {filters.sort_order === 'asc' ? '↑' : '↓'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tabs de estado */}
      <div className="card p-2">
        <div className="flex gap-2 overflow-x-auto">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilters({ ...filters, status: tab.key })}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                filters.status === tab.key
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
              <span className="pill pill-sm pill-outline">{tab.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid de fichas */}
      {loadingFichas ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-muted">Cargando fichas...</p>
        </div>
      ) : filteredFichas.length === 0 ? (
        <div className="card p-12 text-center">
          <FileText className="w-16 h-16 text-muted mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No hay fichas para revisar</h3>
          <p className="text-muted">
            {filters.status === 'all'
              ? 'No hay fichas de especies creadas aún.'
              : `No hay fichas con estado "${statusTabs.find(t => t.key === filters.status)?.label}".`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredFichas.map((ficha) => (
              <FichaReviewCard
                key={ficha.id}
                ficha={ficha}
                onClick={() => setSelectedFicha(ficha)}
                onQuickAction={
                  ficha.validation_status === 'pending'
                    ? (action) => handleQuickAction(ficha.id, action)
                    : undefined
                }
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal de detalle */}
      {selectedFicha && (
        <FichaDetailModal
          ficha={selectedFicha}
          isOpen={!!selectedFicha}
          onClose={() => setSelectedFicha(null)}
          onValidate={handleValidate}
        />
      )}
    </div>
  );
}
