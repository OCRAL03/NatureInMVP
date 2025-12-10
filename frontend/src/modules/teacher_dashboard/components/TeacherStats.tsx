import { motion } from 'framer-motion';
import { Users, Activity, TrendingUp, Trophy } from 'lucide-react';
import type { TeacherStats } from '../types';

interface TeacherStatsProps {
  stats: TeacherStats;
  loading?: boolean;
}

export default function TeacherStatsComponent({ stats, loading }: TeacherStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card p-6 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      icon: Users,
      label: 'Total Estudiantes',
      value: stats.total_students,
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/10',
    },
    {
      icon: Activity,
      label: 'Activos Hoy',
      value: stats.active_today,
      color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/10',
    },
    {
      icon: TrendingUp,
      label: 'Promedio Puntos',
      value: Math.round(stats.average_points),
      color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-900/10',
    },
    {
      icon: Trophy,
      label: 'Top Estudiante',
      value: stats.top_student?.full_name || '-',
      subtitle: stats.top_student ? `${stats.top_student.points} pts` : undefined,
      color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="card p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted mb-2">{stat.label}</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-texto)' }}>
                {typeof stat.value === 'number' && stat.value > 999
                  ? `${(stat.value / 1000).toFixed(1)}k`
                  : stat.value}
              </p>
              {stat.subtitle && (
                <p className="text-xs text-muted mt-1">{stat.subtitle}</p>
              )}
            </div>
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
