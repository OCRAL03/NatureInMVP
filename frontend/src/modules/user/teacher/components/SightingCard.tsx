import { motion } from 'framer-motion';
import { MapPin, Calendar, User, Eye, CheckCircle, XCircle } from 'lucide-react';
import type { SightingPending } from '../types';

interface SightingCardProps {
  sighting: SightingPending;
  onViewDetails: (sighting: SightingPending) => void;
  onApprove?: (sighting: SightingPending) => void;
  onReject?: (sighting: SightingPending) => void;
}

export default function SightingCard({ sighting, onViewDetails, onApprove, onReject }: SightingCardProps) {
  const getStatusColor = () => {
    switch (sighting.verification_status) {
      case 'verified':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'rejected':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    }
  };

  const getStatusText = () => {
    switch (sighting.verification_status) {
      case 'verified':
        return 'Verificado';
      case 'rejected':
        return 'Rechazado';
      default:
        return 'Pendiente';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `Hace ${diffMins} min${diffMins !== 1 ? 's' : ''}`;
    } else if (diffHours < 24) {
      return `Hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
    } else if (diffDays < 7) {
      return `Hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'short', 
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="card overflow-hidden"
    >
      {/* Imagen */}
      <div 
        className="relative h-48 bg-gray-200 dark:bg-gray-700 cursor-pointer group"
        onClick={() => onViewDetails(sighting)}
      >
        {sighting.photo_url ? (
          <img
            src={sighting.photo_url}
            alt={sighting.species}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-6xl">🔍</div>
          </div>
        )}
        
        {/* Estado badge */}
        <div className="absolute top-3 right-3">
          <span className={`pill ${getStatusColor()} font-medium shadow-lg`}>
            {getStatusText()}
          </span>
        </div>

        {/* Nivel de confianza si existe */}
        {sighting.confidence_level && (
          <div className="absolute top-3 left-3">
            <span className="pill bg-white/90 dark:bg-gray-900/90 text-xs font-medium shadow-lg">
              {Math.round(sighting.confidence_level * 100)}% confianza
            </span>
          </div>
        )}

        {/* Overlay hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="bg-white dark:bg-gray-800 rounded-full p-3 shadow-xl">
            <Eye className="w-6 h-6" style={{ color: 'var(--color-verde-principal)' }} />
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        {/* Especie */}
        <div className="mb-3">
          <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--color-texto)' }}>
            {sighting.species}
          </h3>
          {sighting.common_name && (
            <p className="text-sm text-muted italic">
              {sighting.common_name}
            </p>
          )}
        </div>

        {/* Info grid */}
        <div className="space-y-2 mb-4">
          {/* Estudiante */}
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-muted flex-shrink-0" />
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {sighting.user.avatar_url && (
                <img
                  src={sighting.user.avatar_url}
                  alt={sighting.user.full_name}
                  className="w-5 h-5 rounded-full"
                />
              )}
              <span className="truncate" style={{ color: 'var(--color-texto)' }}>
                {sighting.user.full_name}
              </span>
            </div>
          </div>

          {/* Ubicación */}
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="w-4 h-4 text-muted flex-shrink-0 mt-0.5" />
            <span className="text-muted line-clamp-2">
              {sighting.location}
            </span>
          </div>

          {/* Fecha */}
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted flex-shrink-0" />
            <span className="text-muted">
              {formatDate(sighting.created_at)}
            </span>
          </div>
        </div>

        {/* Descripción si existe */}
        {sighting.description && (
          <p className="text-sm text-muted line-clamp-2 mb-4">
            {sighting.description}
          </p>
        )}

        {/* Acciones rápidas - solo para pendientes */}
        {sighting.verification_status === 'pending' && onApprove && onReject && (
          <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onApprove(sighting);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              <CheckCircle className="w-4 h-4" />
              Aprobar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onReject(sighting);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              <XCircle className="w-4 h-4" />
              Rechazar
            </motion.button>
          </div>
        )}

        {/* Mensaje de verificación */}
        {sighting.verification_status !== 'pending' && sighting.verification_comment && (
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-muted italic line-clamp-2">
              "{sighting.verification_comment}"
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
