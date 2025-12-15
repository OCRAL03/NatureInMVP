import { motion } from 'framer-motion';
import { FileText, User, Calendar, CheckCircle, XCircle, Clock, Star } from 'lucide-react';
import type { FichaReview } from '../types';

interface FichaReviewCardProps {
  ficha: FichaReview;
  onClick: () => void;
  onQuickAction?: (action: 'approve' | 'reject') => void;
}

export default function FichaReviewCard({ ficha, onClick, onQuickAction }: FichaReviewCardProps) {
  const statusConfig = {
    pending: {
      label: 'Pendiente',
      color: 'amber',
      icon: Clock,
      bgClass: 'bg-amber-50 dark:bg-amber-900/20',
      textClass: 'text-amber-700 dark:text-amber-400',
    },
    approved: {
      label: 'Aprobada',
      color: 'green',
      icon: CheckCircle,
      bgClass: 'bg-green-50 dark:bg-green-900/20',
      textClass: 'text-green-700 dark:text-green-400',
    },
    rejected: {
      label: 'Rechazada',
      color: 'red',
      icon: XCircle,
      bgClass: 'bg-red-50 dark:bg-red-900/20',
      textClass: 'text-red-700 dark:text-red-400',
    },
    needs_revision: {
      label: 'Requiere cambios',
      color: 'blue',
      icon: FileText,
      bgClass: 'bg-blue-50 dark:bg-blue-900/20',
      textClass: 'text-blue-700 dark:text-blue-400',
    },
  };

  const config = statusConfig[ficha.validation_status];
  const StatusIcon = config.icon;

  // Determinar reino para icono/color
  const getKingdomInfo = (kingdom: string) => {
    const normalized = kingdom.toLowerCase();
    if (normalized.includes('animalia') || normalized.includes('animal')) {
      return { emoji: '🦋', color: 'blue' };
    } else if (normalized.includes('plantae') || normalized.includes('plant')) {
      return { emoji: '🌿', color: 'green' };
    } else if (normalized.includes('fungi')) {
      return { emoji: '🍄', color: 'purple' };
    }
    return { emoji: '🔬', color: 'gray' };
  };

  const kingdomInfo = getKingdomInfo(ficha.taxonomy.kingdom);
  const isPending = ficha.validation_status === 'pending';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="card p-0 overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      {/* Imagen de cabecera */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
        {ficha.images && ficha.images.length > 0 ? (
          <img
            src={ficha.images[0]}
            alt={ficha.common_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl">{kingdomInfo.emoji}</span>
          </div>
        )}
        
        {/* Badge de estado en la esquina */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full ${config.bgClass} backdrop-blur-sm flex items-center gap-1.5`}>
          <StatusIcon className={`w-4 h-4 ${config.textClass}`} />
          <span className={`text-xs font-semibold ${config.textClass}`}>
            {config.label}
          </span>
        </div>

        {/* Calidad científica (si ya fue revisada) */}
        {ficha.scientific_accuracy && (
          <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < ficha.scientific_accuracy!
                    ? 'text-yellow-500 fill-yellow-500'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4 space-y-3">
        {/* Nombres */}
        <div>
          <h3 className="font-bold text-lg mb-1 italic" style={{ color: 'var(--color-texto)' }}>
            {ficha.scientific_name}
          </h3>
          <p className="text-sm text-muted">
            {ficha.common_name}
          </p>
        </div>

        {/* Taxonomía resumida */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="pill pill-sm" style={{ backgroundColor: `var(--color-${kingdomInfo.color})`, color: 'white' }}>
            {ficha.taxonomy.kingdom}
          </span>
          <span className="pill pill-sm pill-outline text-xs">
            {ficha.taxonomy.family}
          </span>
        </div>

        {/* Metadata */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted">
            <User className="w-4 h-4" />
            <span>{ficha.author.full_name}</span>
            <span className={`pill pill-xs ${ficha.author.role === 'teacher' ? 'pill-blue' : 'pill-green'}`}>
              {ficha.author.role === 'teacher' ? 'Docente' : 'Estudiante'}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-muted">
            <Calendar className="w-4 h-4" />
            <span>{new Date(ficha.created_at).toLocaleDateString('es-PE', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}</span>
          </div>
        </div>

        {/* Descripción breve */}
        <p className="text-sm text-muted line-clamp-2">
          {ficha.description}
        </p>

        {/* Acciones rápidas (solo para pendientes) */}
        {isPending && onQuickAction && (
          <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickAction('approve');
              }}
              className="btn-sm flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              Aprobar
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickAction('reject');
              }}
              className="btn-sm flex-1 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-1.5"
            >
              <XCircle className="w-4 h-4" />
              Rechazar
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
