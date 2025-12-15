import { UserMissionProgress } from '../types'
import { Target, Trophy, CheckCircle2, Clock, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

interface MissionsListProps {
  missions: UserMissionProgress[]
}

/**
 * Lista de misiones activas del usuario con diseño mejorado
 * Muestra el progreso de cada misión con animaciones y efectos visuales
 */
export default function MissionsList({ missions }: MissionsListProps) {
  if (missions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-12 text-center border-2 border-dashed border-blue-300 dark:border-blue-700"
      >
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Target className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--color-azul-principal)' }} />
        </motion.div>
        <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-texto)' }}>
          ¡Próximamente nuevas aventuras! 🚀
        </h3>
        <p style={{ color: 'var(--color-muted)' }}>
          Nuevas misiones emocionantes estarán disponibles pronto
        </p>
      </motion.div>
    )
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'observacion':
        return Target
      case 'exploracion':
        return Zap
      default:
        return Trophy
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'observacion':
        return {
          gradient: 'from-blue-500 to-cyan-600',
          bg: 'from-blue-50 to-cyan-50',
          text: 'text-blue-700',
          border: 'border-blue-300',
          badge: 'bg-blue-100 text-blue-700'
        }
      case 'exploracion':
        return {
          gradient: 'from-purple-500 to-pink-600',
          bg: 'from-purple-50 to-pink-50',
          text: 'text-purple-700',
          border: 'border-purple-300',
          badge: 'bg-purple-100 text-purple-700'
        }
      default:
        return {
          gradient: 'from-green-500 to-emerald-600',
          bg: 'from-green-50 to-emerald-50',
          text: 'text-green-700',
          border: 'border-green-300',
          badge: 'bg-green-100 text-green-700'
        }
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    show: { 
      x: 0, 
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 100 }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      {missions.map((missionProgress) => {
        const { mission, progress, completed } = missionProgress
        const Icon = getCategoryIcon(mission.category)
        const colors = getCategoryColor(mission.category)
        const progressPercentage = progress
        const isCompleted = completed

        return (
          <motion.div
            key={mission.id}
            variants={itemVariants}
            whileHover={{ scale: 1.02, x: 5 }}
            className="card p-5 border-2 transition-all relative overflow-hidden"
            style={{
              borderColor: isCompleted ? 'var(--color-verde-principal)' : `var(--color-border)`
            }}
          >
            {/* Efecto de fondo */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colors.gradient} opacity-10 rounded-full blur-2xl`} />

            {/* Indicador de completado */}
            {isCompleted && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="absolute top-3 right-3"
              >
                <CheckCircle2 className="w-8 h-8 text-green-500 fill-green-100" />
              </motion.div>
            )}

            <div className="relative flex gap-4">
              {/* Icono de categoría */}
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg`}
              >
                <Icon className="w-7 h-7 text-white" strokeWidth={2.5} />
              </motion.div>

              <div className="flex-1 min-w-0">
                {/* Encabezado */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <h4 className={`text-lg font-bold ${colors.text} mb-1`}>
                      {mission.title}
                    </h4>
                    <p className="text-sm text-muted line-clamp-2">
                      {mission.description}
                    </p>
                  </div>
                </div>

                {/* Etiquetas */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors.badge}`}>
                    {mission.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colors.border} bg-white`}>
                    {mission.difficulty}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-300 flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    {mission.reward_points} pts
                  </span>
                </div>

                {/* Barra de progreso */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium" style={{ color: 'var(--color-muted)' }}>
                      Progreso
                    </span>
                    <span className={`font-bold ${colors.text}`}>
                      {progressPercentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="relative h-3 rounded-full overflow-hidden shadow-inner" style={{ backgroundColor: 'var(--color-border)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={`absolute inset-y-0 left-0 bg-gradient-to-r ${colors.gradient} rounded-full shadow-lg`}
                    >
                      {/* Efecto de brillo */}
                      <motion.div
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      />
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
