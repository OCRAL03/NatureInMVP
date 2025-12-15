import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import SightingCard from './SightingCard';
import SightingDetailModal from './SightingDetailModal';
import { useSightingApproval } from '../hooks/useSightingApproval';
import type { SightingPending } from '../types';

export default function SightingApprovalManager() {
  const { 
    sightings, 
    loading, 
    approveSighting, 
    rejectSighting, 
    getSightingsByStatus,
    getStats,
    filterSightings,
  } = useSightingApproval();

  const [selectedSighting, setSelectedSighting] = useState<SightingPending | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<SightingPending['verification_status'] | 'all'>('pending');

  const stats = getStats();
  const filteredSightings = filterSightings(searchTerm, filterStatus);

  const handleViewDetails = (sighting: SightingPending) => {
    setSelectedSighting(sighting);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedSighting(null), 300);
  };

  const handleQuickApprove = async (sighting: SightingPending) => {
    const result = await approveSighting(sighting.id, 50, '¡Excelente avistamiento!');
    if (result.success) {
      // Mostrar notificación (futuro: usar toast)
      console.log(result.message);
    }
  };

  const handleQuickReject = async (sighting: SightingPending) => {
    const comment = prompt('¿Por qué rechazas este avistamiento?');
    if (comment && comment.trim()) {
      const result = await rejectSighting(sighting.id, comment);
      if (result.success) {
        console.log(result.message);
      }
    }
  };

  const handleApproveFromModal = async (sightingId: number, points: number, comment: string) => {
    const result = await approveSighting(sightingId, points, comment);
    if (result.success) {
      console.log(result.message);
    }
  };

  const handleRejectFromModal = async (sightingId: number, comment: string) => {
    const result = await rejectSighting(sightingId, comment);
    if (result.success) {
      console.log(result.message);
    }
  };

  const statusOptions: { value: SightingPending['verification_status'] | 'all'; label: string; icon: any }[] = [
    { value: 'all', label: 'Todos', icon: Filter },
    { value: 'pending', label: 'Pendientes', icon: Clock },
    { value: 'verified', label: 'Aprobados', icon: CheckCircle },
    { value: 'rejected', label: 'Rechazados', icon: XCircle },
  ];

  return (
    <div className="space-y-6">
      {/* Stats rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="card p-4">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-muted">Total</div>
        </div>
        <div className="card p-4">
          <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
          <div className="text-sm text-muted">Pendientes</div>
        </div>
        <div className="card p-4">
          <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
          <div className="text-sm text-muted">Aprobados</div>
        </div>
        <div className="card p-4">
          <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          <div className="text-sm text-muted">Rechazados</div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-1">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <div className="text-2xl font-bold text-purple-600">{stats.approvalRate}%</div>
          </div>
          <div className="text-sm text-muted">Tasa de aprobación</div>
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Búsqueda */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
          <input
            type="text"
            placeholder="Buscar por especie o estudiante..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            style={{ backgroundColor: 'var(--color-surface)' }}
          />
        </div>

        {/* Filtro por estado */}
        <div className="flex gap-2 overflow-x-auto">
          {statusOptions.map((option) => (
            <motion.button
              key={option.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterStatus(option.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                filterStatus === option.value
                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              style={{
                color: filterStatus === option.value ? 'var(--color-verde-principal)' : 'var(--color-texto)',
              }}
            >
              <option.icon className="w-4 h-4" />
              {option.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Contador de resultados */}
      {(searchTerm || filterStatus !== 'all') && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">
            Mostrando {filteredSightings.length} de {sightings.length} avistamientos
          </span>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      )}

      {/* Grid de avistamientos */}
      {loading ? (
        <div className="text-center py-12 text-muted">
          Cargando avistamientos...
        </div>
      ) : filteredSightings.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-6xl mb-4">
            {filterStatus === 'pending' ? '⏳' : filterStatus === 'verified' ? '✅' : filterStatus === 'rejected' ? '❌' : '🔍'}
          </div>
          <h3 className="text-xl font-semibold mb-2">No hay avistamientos</h3>
          <p className="text-muted">
            {searchTerm || filterStatus !== 'all'
              ? 'No se encontraron avistamientos con los filtros aplicados'
              : 'No hay avistamientos registrados'}
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

      {/* Nota informativa para pendientes */}
      {filterStatus === 'pending' && filteredSightings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold mb-1 text-blue-900 dark:text-blue-200">
                Avistamientos pendientes de verificación
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Revisa cada avistamiento cuidadosamente antes de aprobar. Puedes hacer clic en cualquier 
                card para ver más detalles y agregar comentarios personalizados.
              </p>
            </div>
          </div>
        </motion.div>
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
