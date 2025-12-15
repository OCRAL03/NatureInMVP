import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Calendar, User, Award, MessageSquare, Image as ImageIcon, AlertCircle } from 'lucide-react';
import type { SightingPending } from '../types';

interface SightingDetailModalProps {
  sighting: SightingPending | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (sightingId: number, points: number, comment: string) => void;
  onReject?: (sightingId: number, comment: string) => void;
}

export default function SightingDetailModal({ 
  sighting, 
  isOpen, 
  onClose, 
  onApprove, 
  onReject 
}: SightingDetailModalProps) {
  const [showApprovalForm, setShowApprovalForm] = useState(false);
  const [approvalType, setApprovalType] = useState<'approve' | 'reject'>('approve');
  const [points, setPoints] = useState(50);
  const [comment, setComment] = useState('');

  if (!sighting) return null;

  const handleSubmitApproval = () => {
    if (approvalType === 'approve' && onApprove) {
      onApprove(sighting.id, points, comment);
    } else if (approvalType === 'reject' && onReject) {
      onReject(sighting.id, comment);
    }
    
    // Reset form
    setShowApprovalForm(false);
    setComment('');
    setPoints(50);
    onClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div 
              className="card max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 z-10 p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-texto)' }}>
                      {sighting.species}
                    </h2>
                    {sighting.common_name && (
                      <p className="text-muted italic mb-3">
                        Nombre común: {sighting.common_name}
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      <span className={`pill ${
                        sighting.verification_status === 'verified' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : sighting.verification_status === 'rejected'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}>
                        {sighting.verification_status === 'verified' 
                          ? 'Verificado' 
                          : sighting.verification_status === 'rejected'
                          ? 'Rechazado'
                          : 'Pendiente de verificación'}
                      </span>
                      {sighting.confidence_level && (
                        <span className="pill pill-blue">
                          {Math.round(sighting.confidence_level * 100)}% confianza
                        </span>
                      )}
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <X className="w-6 h-6" style={{ color: 'var(--color-texto)' }} />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Imagen */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-muted">
                    <ImageIcon className="w-4 h-4" />
                    Fotografía del avistamiento
                  </div>
                  <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {sighting.photo_url ? (
                      <img
                        src={sighting.photo_url}
                        alt={sighting.species}
                        className="w-full max-h-96 object-contain"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-64">
                        <div className="text-8xl">🔍</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Estudiante */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-muted">
                      <User className="w-4 h-4" />
                      Reportado por
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      {sighting.user.avatar_url ? (
                        <img
                          src={sighting.user.avatar_url}
                          alt={sighting.user.full_name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center">
                          <span className="font-bold" style={{ color: 'var(--color-verde-principal)' }}>
                            {sighting.user.full_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-semibold" style={{ color: 'var(--color-texto)' }}>
                          {sighting.user.full_name}
                        </p>
                        <p className="text-sm text-muted">@{sighting.user.username}</p>
                      </div>
                    </div>
                  </div>

                  {/* Fecha */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-muted">
                      <Calendar className="w-4 h-4" />
                      Fecha y hora
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      <p className="font-medium" style={{ color: 'var(--color-texto)' }}>
                        {formatDate(sighting.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* Ubicación */}
                  <div className="space-y-2 md:col-span-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-muted">
                      <MapPin className="w-4 h-4" />
                      Ubicación
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      <p className="font-medium mb-1" style={{ color: 'var(--color-texto)' }}>
                        {sighting.location}
                      </p>
                      {sighting.coordinates && (
                        <p className="text-sm text-muted">
                          Coordenadas: {sighting.coordinates.lat.toFixed(6)}, {sighting.coordinates.lng.toFixed(6)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Descripción */}
                {sighting.description && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-muted">
                      <MessageSquare className="w-4 h-4" />
                      Descripción del estudiante
                    </div>
                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      <p style={{ color: 'var(--color-texto)' }}>
                        {sighting.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* Notas adicionales */}
                {sighting.notes && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-muted">
                      <AlertCircle className="w-4 h-4" />
                      Notas adicionales
                    </div>
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                      <p style={{ color: 'var(--color-texto)' }}>
                        {sighting.notes}
                      </p>
                    </div>
                  </div>
                )}

                {/* Comentario de verificación previo */}
                {sighting.verification_comment && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-muted">
                      <MessageSquare className="w-4 h-4" />
                      Comentario del docente
                    </div>
                    <div className={`p-4 rounded-lg ${
                      sighting.verification_status === 'verified'
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                        : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                    }`}>
                      <p style={{ color: 'var(--color-texto)' }}>
                        {sighting.verification_comment}
                      </p>
                      {sighting.verified_at && (
                        <p className="text-xs text-muted mt-2">
                          {formatDate(sighting.verified_at)}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Formulario de aprobación/rechazo */}
                {sighting.verification_status === 'pending' && (onApprove || onReject) && (
                  <AnimatePresence>
                    {!showApprovalForm ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700"
                      >
                        {onApprove && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setApprovalType('approve');
                              setShowApprovalForm(true);
                            }}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                          >
                            <Award className="w-5 h-5" />
                            Aprobar Avistamiento
                          </motion.button>
                        )}
                        {onReject && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setApprovalType('reject');
                              setShowApprovalForm(true);
                            }}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                          >
                            <X className="w-5 h-5" />
                            Rechazar
                          </motion.button>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700"
                      >
                        <h3 className="font-bold text-lg" style={{ color: 'var(--color-texto)' }}>
                          {approvalType === 'approve' ? 'Aprobar avistamiento' : 'Rechazar avistamiento'}
                        </h3>

                        {/* Puntos (solo para aprobar) */}
                        {approvalType === 'approve' && (
                          <div className="space-y-2">
                            <label className="block text-sm font-medium" style={{ color: 'var(--color-texto)' }}>
                              Puntos a otorgar
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="500"
                              value={points}
                              onChange={(e) => setPoints(Number(e.target.value))}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                              style={{ backgroundColor: 'var(--color-surface)' }}
                            />
                            <p className="text-xs text-muted">
                              Recomendado: 50-100 puntos para avistamientos comunes, 100-200 para especies raras
                            </p>
                          </div>
                        )}

                        {/* Comentario */}
                        <div className="space-y-2">
                          <label className="block text-sm font-medium" style={{ color: 'var(--color-texto)' }}>
                            Comentario {approvalType === 'reject' && '(requerido)'}
                          </label>
                          <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder={
                              approvalType === 'approve'
                                ? 'Felicidades por tu avistamiento...'
                                : 'Por favor, explica por qué se rechaza este avistamiento...'
                            }
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                            style={{ backgroundColor: 'var(--color-surface)' }}
                          />
                        </div>

                        {/* Botones */}
                        <div className="flex gap-3">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSubmitApproval}
                            disabled={approvalType === 'reject' && !comment.trim()}
                            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                              approvalType === 'approve'
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed'
                            }`}
                          >
                            {approvalType === 'approve' ? 'Confirmar Aprobación' : 'Confirmar Rechazo'}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setShowApprovalForm(false);
                              setComment('');
                              setPoints(50);
                            }}
                            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            style={{ color: 'var(--color-texto)' }}
                          >
                            Cancelar
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
