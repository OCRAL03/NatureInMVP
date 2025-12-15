import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, Flag, CheckCircle, XCircle, Info } from 'lucide-react';
import type { SightingReview, ReviewFilters } from '../types';
import { useSightingReview } from '../hooks/useSightingReview';

// Importar componentes reutilizables del teacher_dashboard
import SightingCard from '../../teacher/components/SightingCard';
import SightingDetailModal from '../../teacher/components/SightingDetailModal';

interface SightingReviewPanelProps {
  initialSightings: SightingReview[];
}

export default function SightingReviewPanel({ initialSightings }: SightingReviewPanelProps) {
  const {
    sightings,
    loading,
    approveSighting,
    rejectSighting,
    requestMoreInfo,
    flagForPeerReview,
    getReviewStats,
    setSightingsList,
  } = useSightingReview();

  const [selectedSighting, setSelectedSighting] = useState<SightingReview | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<ReviewFilters>({
    search: '',
    status: 'pending',
    confidenceMin: 0,
    confidenceMax: 1,
    rarity: 'all',
    dateFrom: '',
    dateTo: '',
    student: null,
    sortBy: 'date',
    sortOrder: 'desc',
  });

  // Inicializar con datos externos
  useEffect(() => {
    if (initialSightings.length > 0) {
      setSightingsList(initialSightings);
    }
  }, [initialSightings]);

  const stats = getReviewStats();

  // Filtrar y ordenar avistamientos
  const filteredSightings = sightings
    .filter(sighting => {
      const matchesSearch = 
        sighting.species.toLowerCase().includes(filters.search.toLowerCase()) ||
        sighting.common_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        sighting.user.full_name.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesStatus = filters.status === 'all' || sighting.verification_status === filters.status;
      
      const matchesConfidence = 
        !sighting.confidence_level || 
        (sighting.confidence_level >= filters.confidenceMin && sighting.confidence_level <= filters.confidenceMax);
      
      const matchesRarity = filters.rarity === 'all' || sighting.rarity_level === filters.rarity;

      return matchesSearch && matchesStatus && matchesConfidence && matchesRarity;
    })
    .sort((a, b) => {
      const order = filters.sortOrder === 'asc' ? 1 : -1;
      
      switch (filters.sortBy) {
        case 'date':
          return order * (new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        case 'confidence':
          return order * ((b.confidence_level || 0) - (a.confidence_level || 0));
        case 'species':
          return order * a.species.localeCompare(b.species);
        default:
          return 0;
      }
    });

  const handleViewDetails = (sighting: SightingReview) => {
    setSelectedSighting(sighting);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedSighting(null), 300);
  };

  const handleQuickApprove = async (sighting: SightingReview) => {
    const points = sighting.rarity_level === 'rare' || sighting.rarity_level === 'endemic' ? 150 :
                   sighting.rarity_level === 'uncommon' ? 100 : 50;
    
    const result = await approveSighting(
      sighting.id,
      points,
      'Identificación correcta. Excelente observación.',
      true
    );
    
    if (result.success) {
      console.log(result.message);
    }
  };

  const handleQuickReject = async (sighting: SightingReview) => {
    const reason = prompt('¿Por qué rechazas este avistamiento? (Explicación científica)');
    if (reason && reason.trim()) {
      const result = await rejectSighting(sighting.id, reason);
      if (result.success) {
        console.log(result.message);
      }
    }
  };

  const handleApproveFromModal = async (sightingId: number, points: number, comment: string) => {
    const result = await approveSighting(sightingId, points, comment, true);
    if (result.success) {
      console.log(result.message);
      handleCloseModal();
    }
  };

  const handleRejectFromModal = async (sightingId: number, comment: string) => {
    const result = await rejectSighting(sightingId, comment);
    if (result.success) {
      console.log(result.message);
      handleCloseModal();
    }
  };

  const statusOptions = [
    { value: 'all' as const, label: 'Todos', count: sightings.length },
    { value: 'pending' as const, label: 'Pendientes', count: stats.pending },
    { value: 'verified' as const, label: 'Aprobados', count: stats.verified },
    { value: 'rejected' as const, label: 'Rechazados', count: stats.rejected },
  ];

  const rarityOptions = [
    { value: 'all' as const, label: 'Todas las rarezas' },
    { value: 'common' as const, label: 'Común' },
    { value: 'uncommon' as const, label: 'Poco común' },
    { value: 'rare' as const, label: 'Raro' },
    { value: 'endemic' as const, label: 'Endémico' },
    { value: 'endangered' as const, label: 'En peligro' },
  ];

  return (
    <div className="space-y-6">
      {/* Barra de búsqueda y filtros */}
      <div className="space-y-4">
        {/* Búsqueda principal */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              type="text"
              placeholder="Buscar por especie, nombre común o estudiante..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: 'var(--color-surface)' }}
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-5 py-3 rounded-lg transition-colors ${
              showFilters
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span className="font-medium">Filtros Avanzados</span>
          </motion.button>
        </div>

        {/* Filtros de estado (siempre visibles) */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {statusOptions.map((option) => (
            <motion.button
              key={option.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilters({ ...filters, status: option.value })}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                filters.status === option.value
                  ? 'bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              style={{
                color: filters.status === option.value ? 'var(--color-azul-principal)' : 'var(--color-texto)',
              }}
            >
              <span className="font-medium">{option.label}</span>
              <span className="pill pill-blue text-xs">{option.count}</span>
            </motion.button>
          ))}
        </div>

        {/* Panel de filtros avanzados */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="card p-5 space-y-4"
            >
              <h3 className="font-semibold flex items-center gap-2" style={{ color: 'var(--color-texto)' }}>
                <Filter className="w-5 h-5" />
                Filtros Avanzados
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Nivel de confianza */}
                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: 'var(--color-texto)' }}>
                    Nivel de Confianza IA
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={filters.confidenceMin * 100}
                      onChange={(e) => setFilters({ ...filters, confidenceMin: Number(e.target.value) / 100 })}
                      className="flex-1"
                    />
                    <span className="text-sm font-mono text-muted">
                      {Math.round(filters.confidenceMin * 100)}%
                    </span>
                  </div>
                </div>

                {/* Rareza */}
                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: 'var(--color-texto)' }}>
                    Nivel de Rareza
                  </label>
                  <select
                    value={filters.rarity}
                    onChange={(e) => setFilters({ ...filters, rarity: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ backgroundColor: 'var(--color-surface)' }}
                  >
                    {rarityOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ordenar por */}
                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: 'var(--color-texto)' }}>
                    Ordenar por
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={filters.sortBy}
                      onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ backgroundColor: 'var(--color-surface)' }}
                    >
                      <option value="date">Fecha</option>
                      <option value="confidence">Confianza</option>
                      <option value="species">Especie</option>
                    </select>
                    <button
                      onClick={() => setFilters({ ...filters, sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      style={{ backgroundColor: 'var(--color-surface)' }}
                    >
                      {filters.sortOrder === 'asc' ? '↑' : '↓'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Botón limpiar filtros */}
              <div className="flex justify-end">
                <button
                  onClick={() => setFilters({
                    search: '',
                    status: 'pending',
                    confidenceMin: 0,
                    confidenceMax: 1,
                    rarity: 'all',
                    dateFrom: '',
                    dateTo: '',
                    student: null,
                    sortBy: 'date',
                    sortOrder: 'desc',
                  })}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Limpiar todos los filtros
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Contador de resultados */}
      {filters.search && (
        <div className="text-sm text-muted">
          Mostrando {filteredSightings.length} de {sightings.length} avistamientos
        </div>
      )}

      {/* Grid de avistamientos */}
      {loading ? (
        <div className="text-center py-12 text-muted">
          Cargando avistamientos...
        </div>
      ) : filteredSightings.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No hay avistamientos</h3>
          <p className="text-muted">
            {filters.search || filters.status !== 'all'
              ? 'No se encontraron avistamientos con los filtros aplicados'
              : 'No hay avistamientos pendientes de revisión'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredSightings.map((sighting, index) => (
              <motion.div
                key={sighting.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
              >
                <SightingCard
                  sighting={sighting}
                  onViewDetails={handleViewDetails}
                  onApprove={sighting.verification_status === 'pending' ? handleQuickApprove : undefined}
                  onReject={sighting.verification_status === 'pending' ? handleQuickReject : undefined}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal de detalles */}
      <SightingDetailModal
        sighting={selectedSighting}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onApprove={handleApproveFromModal}
        onReject={handleRejectFromModal}
      />
    </div>
  );
}
