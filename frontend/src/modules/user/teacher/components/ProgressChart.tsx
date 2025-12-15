import { motion } from 'framer-motion';

interface DataPoint {
  date: string;
  points: number;
}

interface ProgressChartProps {
  data: DataPoint[];
  height?: number;
}

export default function ProgressChart({ data, height = 200 }: ProgressChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted">
        No hay datos de progreso disponibles
      </div>
    );
  }

  const maxPoints = Math.max(...data.map(d => d.points));
  const minPoints = Math.min(...data.map(d => d.points));
  const range = maxPoints - minPoints || 1;
  const padding = 40;
  const width = 100;

  // Calcular puntos del path SVG
  const points = data.map((point, index) => {
    const x = (index / (data.length - 1 || 1)) * width;
    const y = 100 - ((point.points - minPoints) / range) * (100 - 20); // 20% padding superior
    return `${x},${y}`;
  }).join(' ');

  // Crear path para el área bajo la curva
  const areaPoints = `0,100 ${points} ${width},100`;

  return (
    <div className="w-full" style={{ height: `${height}px` }}>
      <svg
        viewBox={`0 0 ${width} 100`}
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        {/* Grid lines */}
        <g opacity="0.1">
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2={width}
              y2={y}
              stroke="currentColor"
              strokeWidth="0.5"
            />
          ))}
        </g>

        {/* Área bajo la curva con gradiente */}
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--color-verde-principal)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--color-verde-principal)" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        
        <motion.polygon
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          points={areaPoints}
          fill="url(#areaGradient)"
        />

        {/* Línea principal */}
        <motion.polyline
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          points={points}
          fill="none"
          stroke="var(--color-verde-principal)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* Puntos de datos */}
        {data.map((point, index) => {
          const x = (index / (data.length - 1 || 1)) * width;
          const y = 100 - ((point.points - minPoints) / range) * (100 - 20);
          
          return (
            <g key={index}>
              <motion.circle
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                cx={x}
                cy={y}
                r="2"
                fill="var(--color-verde-principal)"
                vectorEffect="non-scaling-stroke"
              />
              <title>{`${point.date}: ${point.points} pts`}</title>
            </g>
          );
        })}
      </svg>

      {/* Leyenda de fechas */}
      <div className="flex justify-between mt-2 px-2 text-xs text-muted">
        <span>{new Date(data[0].date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}</span>
        <span>{new Date(data[data.length - 1].date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}</span>
      </div>

      {/* Indicadores de puntos */}
      <div className="flex justify-between mt-1 px-2 text-xs font-semibold" style={{ color: 'var(--color-verde-principal)' }}>
        <span>{data[0].points} pts</span>
        <span>{data[data.length - 1].points} pts</span>
      </div>
    </div>
  );
}
