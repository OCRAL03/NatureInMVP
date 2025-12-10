import { motion } from 'framer-motion';
import { Award, BookOpen, Camera, TrendingUp, Eye } from 'lucide-react';
import type { StudentSummary } from '../types';

interface StudentCardProps {
  student: StudentSummary;
  onViewDetails: (student: StudentSummary) => void;
}

export default function StudentCard({ student, onViewDetails }: StudentCardProps) {
  const completionRate = Math.round((student.activities_completed / student.activities_total) * 100);
  const isActive = new Date().getTime() - new Date(student.last_active).getTime() < 3600000; // Activo en última hora

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="card p-5 hover:shadow-lg transition-all cursor-pointer"
      onClick={() => onViewDetails(student)}
    >
      {/* Header con Avatar y Info Básica */}
      <div className="flex items-start gap-4 mb-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center">
            <span className="text-xl font-bold" style={{ color: 'var(--color-verde-principal)' }}>
              {student.full_name.charAt(0).toUpperCase()}
            </span>
          </div>
          {isActive && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" 
                 title="Activo recientemente" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--color-texto)' }}>
            {student.full_name}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted">@{student.username}</span>
            <span className="pill pill-gray text-xs">{student.grade} - {student.section}</span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(student);
          }}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Ver detalles completos"
        >
          <Eye className="w-5 h-5 text-muted" />
        </button>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-3 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-xs text-muted">Puntos</span>
          </div>
          <p className="text-lg font-bold" style={{ color: 'var(--color-verde-principal)' }}>
            {student.points}
          </p>
        </div>

        <div className="text-center p-3 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs text-muted">Badges</span>
          </div>
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {student.badges_count}
          </p>
        </div>

        <div className="text-center p-3 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Camera className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-xs text-muted">Avistamientos</span>
          </div>
          <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
            {student.sightings_count}
          </p>
        </div>
      </div>

      {/* Rango */}
      {student.rank && (
        <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
          <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
            {student.rank}
          </span>
        </div>
      )}

      {/* Progreso de Actividades */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-muted" />
            <span className="text-muted">Actividades</span>
          </div>
          <span className="font-semibold" style={{ color: 'var(--color-texto)' }}>
            {student.activities_completed}/{student.activities_total}
          </span>
        </div>
        
        <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full"
          />
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted">{completionRate}% completado</span>
          <span className={`font-medium ${
            completionRate >= 80 ? 'text-green-600 dark:text-green-400' :
            completionRate >= 50 ? 'text-amber-600 dark:text-amber-400' :
            'text-red-600 dark:text-red-400'
          }`}>
            {completionRate >= 80 ? '¡Excelente!' : completionRate >= 50 ? 'Bien' : 'Necesita atención'}
          </span>
        </div>
      </div>

      {/* Footer con última actividad */}
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-muted">
          Última actividad: {new Date(student.last_active).toLocaleString('es-ES', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </motion.div>
  );
}
