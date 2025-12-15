import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, TrendingUp, Award, Eye } from 'lucide-react';
import type { ValidationStats } from '../types';

interface ExpertStatsProps {
  stats: ValidationStats;
  loading: boolean;
}

export default function ExpertStats({ stats, loading }: ExpertStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card p-6 animate-pulse">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      icon: Clock,
      value: stats.pending_count,
      label: 'Pendientes de Revisión',
      color: 'amber',
      bgColor: 'from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30',
      textColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      icon: CheckCircle,
      value: stats.approved_count,
      label: 'Aprobados',
      color: 'green',
      bgColor: 'from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30',
      textColor: 'text-green-600 dark:text-green-400',
    },
    {
      icon: XCircle,
      value: stats.rejected_count,
      label: 'Rechazados',
      color: 'red',
      bgColor: 'from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30',
      textColor: 'text-red-600 dark:text-red-400',
    },
    {
      icon: TrendingUp,
      value: `${stats.approval_rate}%`,
      label: 'Tasa de Aprobación',
      color: 'blue',
      bgColor: 'from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Cards principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.bgColor} flex items-center justify-center`}
              >
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
              {stat.label === 'Pendientes de Revisión' && stats.pending_count > 20 && (
                <span className="pill pill-amber text-xs">
                  ¡Atención!
                </span>
              )}
            </div>
            <div>
              <div className={`text-3xl font-bold mb-1 ${stat.textColor}`}>
                {stat.value}
              </div>
              <div className="text-sm text-muted">
                {stat.label}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Métricas adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total de revisiones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <Award className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold" style={{ color: 'var(--color-texto)' }}>
              Actividad Total
            </h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Total de revisiones</span>
              <span className="font-bold text-purple-600">{stats.total_reviews}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Esta semana</span>
              <span className="font-semibold" style={{ color: 'var(--color-texto)' }}>
                {stats.reviews_this_week}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Este mes</span>
              <span className="font-semibold" style={{ color: 'var(--color-texto)' }}>
                {stats.reviews_this_month}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Tiempo promedio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <Clock className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold" style={{ color: 'var(--color-texto)' }}>
              Eficiencia
            </h3>
          </div>
          <div className="space-y-2">
            <div>
              <div className="text-sm text-muted mb-1">Tiempo promedio de revisión</div>
              <div className="text-2xl font-bold text-blue-600">
                {stats.avg_review_time} min
              </div>
            </div>
            <div className="text-xs text-muted">
              {stats.avg_review_time === 0 ? 'Sin datos aún' : 'Excelente tiempo de respuesta'}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
