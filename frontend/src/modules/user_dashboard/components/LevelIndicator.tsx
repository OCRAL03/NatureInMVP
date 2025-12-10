import { UserLevel } from '../types'
import { motion } from 'framer-motion'
import { Sparkles, TrendingUp } from 'lucide-react'

interface LevelIndicatorProps {
  level: UserLevel
  currentPoints: number
}

/**
 * Indicador visual del nivel del usuario con diseño mejorado
 * Muestra nombre del nivel, tier y barra de progreso animada
 */
export default function LevelIndicator({ level, currentPoints }: LevelIndicatorProps) {
  const getTierColor = (tier: number): { gradient: string; shadow: string; glow: string } => {
    if (tier <= 2) return {
      gradient: 'from-gray-400 via-gray-500 to-gray-600',
      shadow: 'shadow-gray-500/50',
      glow: 'bg-gray-400/20'
    }
    if (tier <= 4) return {
      gradient: 'from-green-400 via-emerald-500 to-green-600',
      shadow: 'shadow-green-500/50',
      glow: 'bg-green-400/20'
    }
    if (tier <= 6) return {
      gradient: 'from-blue-400 via-cyan-500 to-blue-600',
      shadow: 'shadow-blue-500/50',
      glow: 'bg-blue-400/20'
    }
    return {
      gradient: 'from-purple-400 via-pink-500 to-purple-600',
      shadow: 'shadow-purple-500/50',
      glow: 'bg-purple-400/20'
    }
  }

  const getTierBadgeColor = (tier: number): string => {
    if (tier <= 2) return 'bg-gray-100 text-gray-800 border-gray-300'
    if (tier <= 4) return 'bg-green-100 text-green-800 border-green-400'
    if (tier <= 6) return 'bg-blue-100 text-blue-800 border-blue-400'
    return 'bg-purple-100 text-purple-800 border-purple-400'
  }

  const getTierEmoji = (tier: number): string => {
    if (tier <= 2) return '🌱'
    if (tier <= 4) return '🌿'
    if (tier <= 6) return '🌳'
    return '⭐'
  }

  const colors = getTierColor(level.tier)
  const badgeClass = getTierBadgeColor(level.tier)
  const emoji = getTierEmoji(level.tier)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6 border-2 border-transparent hover:border-opacity-20 relative overflow-hidden"
    >
      {/* Efecto de fondo brillante */}
      <div className={`absolute top-0 right-0 w-64 h-64 ${colors.glow} rounded-full blur-3xl opacity-30 -z-10`} />
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="text-5xl"
          >
            {emoji}
          </motion.div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`text-2xl font-bold bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
                {level.name}
              </h3>
              <Sparkles className={`w-5 h-5 bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`} />
            </div>
            <p className="text-sm text-muted flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {currentPoints.toLocaleString()} / {level.max_points.toLocaleString()} puntos
            </p>
          </div>
        </div>
        
        <motion.div
          whileHover={{ scale: 1.1 }}
          className={`px-4 py-2 rounded-full border-2 font-bold ${badgeClass} shadow-lg`}
        >
          Nivel {level.tier}
        </motion.div>
      </div>

      {/* Barra de progreso mejorada */}
      <div className="relative">
        <div className="flex justify-between text-xs text-muted mb-2">
          <span>Progreso actual</span>
          <span className="font-semibold">{level.progress_percentage}%</span>
        </div>
        
        <div className="relative h-4 rounded-full overflow-hidden shadow-inner" style={{ backgroundColor: 'var(--color-border)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${level.progress_percentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${colors.gradient} rounded-full ${colors.shadow} shadow-lg`}
          >
            {/* Efecto de brillo animado */}
            <motion.div
              animate={{
                x: ['-100%', '200%']
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
