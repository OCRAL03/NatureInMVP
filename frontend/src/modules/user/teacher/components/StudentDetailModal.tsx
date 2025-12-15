import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Camera, BookOpen, TrendingUp, Calendar, Mail, GraduationCap } from 'lucide-react';
import type { StudentSummary } from '../types';
import ProgressChart from './ProgressChart';

interface StudentDetailModalProps {
  student: StudentSummary | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function StudentDetailModal({ student, isOpen, onClose }: StudentDetailModalProps) {
  if (!student) return null;

  // Mock data para el gráfico de progreso
  const progressData = [
    { date: new Date(Date.now() - 86400000 * 30).toISOString(), points: 400 },
    { date: new Date(Date.now() - 86400000 * 25).toISOString(), points: 520 },
    { date: new Date(Date.now() - 86400000 * 20).toISOString(), points: 680 },
    { date: new Date(Date.now() - 86400000 * 15).toISOString(), points: 850 },
    { date: new Date(Date.now() - 86400000 * 10).toISOString(), points: 1100 },
    { date: new Date(Date.now() - 86400000 * 5).toISOString(), points: 1320 },
    { date: new Date().toISOString(), points: student.points },
  ];

  // Mock de actividades recientes
  const recentActivities = [
    { id: 1, type: 'sighting', title: 'Avistamiento registrado', description: 'Gallito de las Rocas', date: new Date(Date.now() - 3600000).toISOString(), points: 50 },
    { id: 2, type: 'quiz', title: 'Quiz completado', description: 'Biodiversidad Local', date: new Date(Date.now() - 86400000).toISOString(), points: 30 },
    { id: 3, type: 'badge', title: 'Insignia obtenida', description: 'Explorador Dedicado', date: new Date(Date.now() - 86400000 * 2).toISOString(), points: 100 },
  ];

  // Mock de badges
  const badges = [
    { id: 1, name: 'Primer Avistamiento', icon: '🔍', earned_at: new Date(Date.now() - 86400000 * 15).toISOString() },
    { id: 2, name: 'Explorador Dedicado', icon: '🎯', earned_at: new Date(Date.now() - 86400000 * 10).toISOString() },
    { id: 3, name: 'Fotógrafo Nato', icon: '📸', earned_at: new Date(Date.now() - 86400000 * 5).toISOString() },
    { id: 4, name: 'Estudiante Ejemplar', icon: '⭐', earned_at: new Date(Date.now() - 86400000 * 2).toISOString() },
  ];

  const completionRate = Math.round((student.activities_completed / student.activities_total) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="min-h-full flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className="card w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center">
                      <span className="text-2xl font-bold" style={{ color: 'var(--color-verde-principal)' }}>
                        {student.full_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-texto)' }}>
                        {student.full_name}
                      </h2>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-muted">@{student.username}</span>
                        <span className="pill pill-gray text-xs">{student.grade} - {student.section}</span>
                        {student.rank && (
                          <span className="pill pill-purple text-xs">{student.rank}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Información de contacto */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <Mail className="w-5 h-5 text-muted" />
                      <div>
                        <p className="text-xs text-muted">Email</p>
                        <p className="font-medium" style={{ color: 'var(--color-texto)' }}>{student.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <GraduationCap className="w-5 h-5 text-muted" />
                      <div>
                        <p className="text-xs text-muted">Última actividad</p>
                        <p className="font-medium" style={{ color: 'var(--color-texto)' }}>
                          {new Date(student.last_active).toLocaleString('es-ES')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Estadísticas principales */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                      <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-600 dark:text-green-400" />
                      <p className="text-2xl font-bold" style={{ color: 'var(--color-verde-principal)' }}>
                        {student.points}
                      </p>
                      <p className="text-xs text-muted mt-1">Puntos Totales</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
                      <Award className="w-6 h-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {student.badges_count}
                      </p>
                      <p className="text-xs text-muted mt-1">Insignias</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
                      <Camera className="w-6 h-6 mx-auto mb-2 text-amber-600 dark:text-amber-400" />
                      <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                        {student.sightings_count}
                      </p>
                      <p className="text-xs text-muted mt-1">Avistamientos</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                      <BookOpen className="w-6 h-6 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {completionRate}%
                      </p>
                      <p className="text-xs text-muted mt-1">Completitud</p>
                    </div>
                  </div>

                  {/* Gráfico de progreso */}
                  <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" style={{ color: 'var(--color-verde-principal)' }} />
                      Progreso de Puntos
                    </h3>
                    <ProgressChart data={progressData} height={250} />
                  </div>

                  {/* Insignias obtenidas */}
                  <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5" style={{ color: 'var(--color-azul-principal)' }} />
                      Insignias Obtenidas ({badges.length})
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {badges.map((badge, index) => (
                        <motion.div
                          key={badge.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="text-center p-4 rounded-lg bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 hover:scale-105 transition-transform"
                        >
                          <div className="text-4xl mb-2">{badge.icon}</div>
                          <p className="font-semibold text-sm mb-1" style={{ color: 'var(--color-texto)' }}>
                            {badge.name}
                          </p>
                          <p className="text-xs text-muted">
                            {new Date(badge.earned_at).toLocaleDateString('es-ES')}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Actividades recientes */}
                  <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5" style={{ color: 'var(--color-verde-principal)' }} />
                      Actividad Reciente
                    </h3>
                    <div className="space-y-3">
                      {recentActivities.map((activity, index) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            activity.type === 'sighting' ? 'bg-amber-100 dark:bg-amber-900/30' :
                            activity.type === 'quiz' ? 'bg-blue-100 dark:bg-blue-900/30' :
                            'bg-purple-100 dark:bg-purple-900/30'
                          }`}>
                            {activity.type === 'sighting' && <Camera className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
                            {activity.type === 'quiz' && <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                            {activity.type === 'badge' && <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold mb-1" style={{ color: 'var(--color-texto)' }}>
                              {activity.title}
                            </p>
                            <p className="text-sm text-muted mb-2">{activity.description}</p>
                            <div className="flex items-center gap-3 text-xs text-muted">
                              <span>{new Date(activity.date).toLocaleString('es-ES')}</span>
                              <span className="pill pill-green text-xs">+{activity.points} pts</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-6 flex justify-end gap-3">
                  <button onClick={onClose} className="btn btn-secondary">
                    Cerrar
                  </button>
                  <button className="btn btn-primary">
                    Enviar Mensaje
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
