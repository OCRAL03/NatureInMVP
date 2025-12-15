import { motion } from 'framer-motion';
import { Clock, Users, TrendingUp, Edit, Trash2, UserPlus, Calendar, CheckCircle } from 'lucide-react';
import type { Activity } from '../types';

interface ActivityCardProps {
  activity: Activity;
  onEdit: (activity: Activity) => void;
  onDelete: (activityId: number) => void;
  onAssign: (activity: Activity) => void;
}

export default function ActivityCard({ activity, onEdit, onDelete, onAssign }: ActivityCardProps) {
  const completionRate = activity.total_assigned > 0
    ? Math.round((activity.completion_count / activity.total_assigned) * 100)
    : 0;

  const isExpired = activity.deadline && new Date(activity.deadline) < new Date();
  const isDueSoon = activity.deadline && 
    new Date(activity.deadline).getTime() - new Date().getTime() < 86400000 * 3; // 3 días

  const typeConfig = {
    quiz: { icon: '📝', label: 'Cuestionario', color: 'blue' },
    exploration: { icon: '🗺️', label: 'Exploración', color: 'green' },
    research: { icon: '📚', label: 'Investigación', color: 'purple' },
    reading: { icon: '📖', label: 'Lectura', color: 'amber' },
  };

  const config = typeConfig[activity.type];

  const statusConfig = {
    active: { label: 'Activa', color: 'green' },
    completed: { label: 'Completada', color: 'blue' },
    expired: { label: 'Vencida', color: 'red' },
  };

  const statusStyle = statusConfig[activity.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="card p-5 hover:shadow-lg transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{config.icon}</span>
            <span className={`pill pill-${config.color} text-xs`}>
              {config.label}
            </span>
            <span className={`pill pill-${statusStyle.color} text-xs`}>
              {statusStyle.label}
            </span>
            {isDueSoon && !isExpired && (
              <span className="pill pill-amber text-xs flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Por vencer
              </span>
            )}
          </div>
          <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--color-texto)' }}>
            {activity.title}
          </h3>
          <p className="text-sm text-muted line-clamp-2">
            {activity.description}
          </p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-3 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <TrendingUp className="w-4 h-4 mx-auto mb-1 text-green-600 dark:text-green-400" />
          <p className="text-xs text-muted mb-1">Puntos</p>
          <p className="text-lg font-bold" style={{ color: 'var(--color-verde-principal)' }}>
            {activity.reward_points}
          </p>
        </div>

        <div className="text-center p-3 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
          <Users className="w-4 h-4 mx-auto mb-1 text-blue-600 dark:text-blue-400" />
          <p className="text-xs text-muted mb-1">Asignados</p>
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {activity.total_assigned}
          </p>
        </div>

        <div className="text-center p-3 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <CheckCircle className="w-4 h-4 mx-auto mb-1 text-purple-600 dark:text-purple-400" />
          <p className="text-xs text-muted mb-1">Completado</p>
          <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
            {completionRate}%
          </p>
        </div>
      </div>

      {/* Progreso */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted">Progreso de Completitud</span>
          <span className="font-semibold" style={{ color: 'var(--color-texto)' }}>
            {activity.completion_count}/{activity.total_assigned}
          </span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              completionRate >= 80 ? 'bg-green-500' :
              completionRate >= 50 ? 'bg-blue-500' :
              completionRate >= 25 ? 'bg-amber-500' : 'bg-red-500'
            }`}
          />
        </div>
      </div>

      {/* Fecha límite y creación */}
      <div className="flex items-center justify-between text-xs text-muted mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        {activity.deadline ? (
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>
              Vence: {new Date(activity.deadline).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </span>
          </div>
        ) : (
          <span>Sin fecha límite</span>
        )}
        <span>
          Creada: {new Date(activity.created_at).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short'
          })}
        </span>
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onAssign(activity)}
          className="flex-1 btn btn-primary text-sm py-2 flex items-center justify-center gap-1"
        >
          <UserPlus className="w-4 h-4" />
          Asignar
        </button>
        <button
          onClick={() => onEdit(activity)}
          className="btn btn-secondary p-2"
          title="Editar actividad"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            if (confirm('¿Estás seguro de que deseas eliminar esta actividad?')) {
              onDelete(activity.id);
            }
          }}
          className="btn btn-secondary p-2 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
          title="Eliminar actividad"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
