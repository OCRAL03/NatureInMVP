/**
 * MetricsCard - Tarjeta de métricas reutilizable
 * Muestra un indicador con icono, valor, cambio porcentual y tendencia
 */

import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string; // Color temático (blue, green, purple, amber, etc.)
  change?: number; // Cambio porcentual (positivo o negativo)
  changeLabel?: string; // Etiqueta del cambio (ej: "vs semana anterior")
  subtitle?: string;
  trend?: 'up' | 'down' | 'stable';
  isLoading?: boolean;
}

export default function MetricsCard({
  title,
  value,
  icon: Icon,
  color = 'blue',
  change,
  changeLabel = 'vs período anterior',
  subtitle,
  trend,
  isLoading = false
}: MetricsCardProps) {
  
  // Mapeo de colores
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      icon: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800'
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      icon: 'text-green-600 dark:text-green-400',
      border: 'border-green-200 dark:border-green-800'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      icon: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-200 dark:border-purple-800'
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      icon: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-800'
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      icon: 'text-red-600 dark:text-red-400',
      border: 'border-red-200 dark:border-red-800'
    },
    gray: {
      bg: 'bg-gray-50 dark:bg-gray-800/50',
      icon: 'text-gray-600 dark:text-gray-400',
      border: 'border-gray-200 dark:border-gray-700'
    }
  };

  const colors = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;

  // Determinar tendencia si no se especifica
  const determinedTrend = trend || (change !== undefined ? (change > 0 ? 'up' : change < 0 ? 'down' : 'stable') : 'stable');

  const TrendIcon = determinedTrend === 'up' ? TrendingUp : determinedTrend === 'down' ? TrendingDown : Minus;
  const trendColor = determinedTrend === 'up' ? 'text-green-600' : determinedTrend === 'down' ? 'text-red-600' : 'text-gray-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card p-6 border ${colors.border} hover:shadow-lg transition-shadow`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted mb-1">{title}</p>
          {isLoading ? (
            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          ) : (
            <p className="text-3xl font-bold" style={{ color: 'var(--color-texto)' }}>
              {value}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colors.bg}`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
      </div>

      {/* Cambio porcentual y tendencia */}
      {change !== undefined && !isLoading && (
        <div className="flex items-center gap-2 text-sm">
          <div className={`flex items-center gap-1 ${trendColor}`}>
            <TrendIcon className="w-4 h-4" />
            <span className="font-semibold">
              {change > 0 && '+'}{change.toFixed(1)}%
            </span>
          </div>
          <span className="text-muted">{changeLabel}</span>
        </div>
      )}

      {/* Subtítulo adicional */}
      {subtitle && !isLoading && (
        <p className="text-xs text-muted mt-2">{subtitle}</p>
      )}
    </motion.div>
  );
}
