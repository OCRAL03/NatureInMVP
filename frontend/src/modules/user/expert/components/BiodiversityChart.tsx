/**
 * BiodiversityChart - Gráficos de distribución de biodiversidad
 * Muestra distribución por reino y familias principales
 */

import { motion } from 'framer-motion';
import type { TaxonomyDistribution, FamilyDistribution } from '../types';

interface BiodiversityChartProps {
  taxonomyData: TaxonomyDistribution[];
  familyData: FamilyDistribution[];
  isLoading?: boolean;
}

export default function BiodiversityChart({ 
  taxonomyData, 
  familyData,
  isLoading = false 
}: BiodiversityChartProps) {
  
  // Calcular altura máxima para escala
  const maxFamilyCount = Math.max(...familyData.map(f => f.count), 1);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Distribución por Reino */}
      <div className="card p-6">
        <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-texto)' }}>
          Distribución por Reino
        </h3>
        
        <div className="space-y-4">
          {taxonomyData.map((item, index) => (
            <motion.div
              key={item.kingdom}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: item.color || '#3b82f6' }}
                  />
                  <span className="font-medium" style={{ color: 'var(--color-texto)' }}>
                    {item.kingdom}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-muted">{item.count} especies</span>
                  <span className="font-semibold" style={{ color: 'var(--color-texto)' }}>
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
              
              {/* Barra de progreso */}
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: item.color || '#3b82f6' }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span style={{ color: 'var(--color-texto)' }}>Total</span>
            <span style={{ color: 'var(--color-texto)' }}>
              {taxonomyData.reduce((sum, item) => sum + item.count, 0)} especies
            </span>
          </div>
        </div>
      </div>

      {/* Distribución por Familia (Top 10) */}
      <div className="card p-6">
        <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-texto)' }}>
          Familias Más Representadas
        </h3>
        
        <div className="space-y-3">
          {familyData.map((family, index) => {
            // Determinar color según el reino
            const kingdomColor = 
              family.kingdom === 'Animalia' ? '#3b82f6' :
              family.kingdom === 'Plantae' ? '#10b981' :
              family.kingdom === 'Fungi' ? '#a855f7' : '#6b7280';

            const barHeight = (family.count / maxFamilyCount) * 100;

            return (
              <motion.div
                key={family.family}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3"
              >
                {/* Número de posición */}
                <div className="w-6 text-center text-sm font-semibold text-muted">
                  {index + 1}
                </div>

                {/* Nombre de familia */}
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-medium italic text-sm" style={{ color: 'var(--color-texto)' }}>
                      {family.family}
                    </span>
                    <span className="text-xs text-muted">
                      ({family.kingdom})
                    </span>
                  </div>
                  
                  {/* Barra horizontal */}
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${barHeight}%` }}
                      transition={{ duration: 0.6, delay: index * 0.05 + 0.2 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: kingdomColor }}
                    />
                  </div>
                </div>

                {/* Estadísticas */}
                <div className="text-right min-w-[80px]">
                  <div className="text-sm font-semibold" style={{ color: 'var(--color-texto)' }}>
                    {family.count}
                  </div>
                  <div className="text-xs text-muted">
                    {family.percentage.toFixed(1)}%
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
