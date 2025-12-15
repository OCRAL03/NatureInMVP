/**
 * ValidationTrendsChart - Gráfico de tendencias de validación
 * Muestra evolución temporal de aprobaciones, rechazos y revisiones
 */

import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import type { TemporalData } from '../types';

interface ValidationTrendsChartProps {
  data: TemporalData[];
  isLoading?: boolean;
}

export default function ValidationTrendsChart({ 
  data,
  isLoading = false 
}: ValidationTrendsChartProps) {
  
  if (isLoading) {
    return (
      <div className="card p-6">
        <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
      </div>
    );
  }

  // Calcular valores máximos para escalado
  const maxValue = Math.max(...data.map(d => d.total), 1);
  const chartHeight = 240; // altura en px del área del gráfico

  // Formatear fecha para etiquetas
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  // Calcular totales
  const totals = data.reduce((acc, d) => ({
    approved: acc.approved + d.approved,
    rejected: acc.rejected + d.rejected,
    needs_revision: acc.needs_revision + d.needs_revision,
    total: acc.total + d.total
  }), { approved: 0, rejected: 0, needs_revision: 0, total: 0 });

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--color-texto)' }}>
            Tendencias de Validación
          </h3>
          <p className="text-sm text-muted">
            Evolución semanal de validaciones
          </p>
        </div>

        {/* Leyenda */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-muted">Aprobadas ({totals.approved})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-muted">Rechazadas ({totals.rejected})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-muted">Revisión ({totals.needs_revision})</span>
          </div>
        </div>
      </div>

      {/* Área del gráfico */}
      <div className="relative" style={{ height: chartHeight + 40 }}>
        {/* Líneas de referencia horizontales */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[0, 25, 50, 75, 100].map(percent => (
            <div key={percent} className="flex items-center gap-2">
              <span className="text-xs text-muted w-8 text-right">
                {Math.round((maxValue * percent) / 100)}
              </span>
              <div className="flex-1 border-t border-gray-200 dark:border-gray-700 border-dashed" />
            </div>
          ))}
        </div>

        {/* Barras apiladas */}
        <div className="absolute inset-0 flex items-end gap-1 pl-10 pb-8">
          {data.map((item, index) => {
            const approvedHeight = (item.approved / maxValue) * chartHeight;
            const rejectedHeight = (item.rejected / maxValue) * chartHeight;
            const revisionHeight = (item.needs_revision / maxValue) * chartHeight;

            return (
              <div 
                key={item.date}
                className="flex-1 flex flex-col-reverse gap-0.5 group relative"
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg px-3 py-2 shadow-lg whitespace-nowrap">
                    <div className="font-semibold mb-1">{formatDate(item.date)}</div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        <span>Aprobadas: {item.approved}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <XCircle className="w-3 h-3 text-red-400" />
                        <span>Rechazadas: {item.rejected}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-3 h-3 text-amber-400" />
                        <span>Revisión: {item.needs_revision}</span>
                      </div>
                      <div className="border-t border-gray-700 dark:border-gray-300 pt-0.5 mt-0.5">
                        <span className="font-semibold">Total: {item.total}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Barra aprobadas */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: approvedHeight }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="bg-green-500 rounded-t cursor-pointer hover:bg-green-600 transition-colors"
                  style={{ minHeight: item.approved > 0 ? '4px' : '0' }}
                />

                {/* Barra rechazadas */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: rejectedHeight }}
                  transition={{ duration: 0.5, delay: index * 0.05 + 0.1 }}
                  className="bg-red-500 cursor-pointer hover:bg-red-600 transition-colors"
                  style={{ minHeight: item.rejected > 0 ? '4px' : '0' }}
                />

                {/* Barra revisión */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: revisionHeight }}
                  transition={{ duration: 0.5, delay: index * 0.05 + 0.2 }}
                  className="bg-amber-500 cursor-pointer hover:bg-amber-600 transition-colors"
                  style={{ minHeight: item.needs_revision > 0 ? '4px' : '0' }}
                />
              </div>
            );
          })}
        </div>

        {/* Etiquetas del eje X */}
        <div className="absolute bottom-0 left-10 right-0 flex gap-1">
          {data.map((item, index) => (
            <div 
              key={item.date}
              className="flex-1 text-center"
            >
              <span className="text-xs text-muted">
                {index % 2 === 0 ? formatDate(item.date) : ''}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Estadísticas resumidas */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-muted">Aprobadas</span>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {totals.approved}
          </p>
          <p className="text-xs text-muted mt-1">
            {((totals.approved / totals.total) * 100 || 0).toFixed(1)}% del total
          </p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <XCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-muted">Rechazadas</span>
          </div>
          <p className="text-2xl font-bold text-red-600">
            {totals.rejected}
          </p>
          <p className="text-xs text-muted mt-1">
            {((totals.rejected / totals.total) * 100 || 0).toFixed(1)}% del total
          </p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-muted">Revisión</span>
          </div>
          <p className="text-2xl font-bold text-amber-600">
            {totals.needs_revision}
          </p>
          <p className="text-xs text-muted mt-1">
            {((totals.needs_revision / totals.total) * 100 || 0).toFixed(1)}% del total
          </p>
        </div>
      </div>
    </div>
  );
}
