import { Award, Lock, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

interface BadgesListProps {
  badges: string[]
}

/**
 * Lista de insignias del usuario con diseño mejorado
 * Muestra las insignias ganadas con animaciones y efectos visuales
 */
export default function BadgesList({ badges }: BadgesListProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { scale: 0, rotate: -180 },
    show: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 200,
        damping: 15
      }
    }
  }

  if (badges.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-12 text-center border-2 border-dashed border-yellow-300 dark:border-yellow-600"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Lock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        </motion.div>
        <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-texto)' }}>
          ¡Tus primeros logros te esperan! 🎯
        </h3>
        <p style={{ color: 'var(--color-muted)' }}>
          Completa misiones y realiza avistamientos para desbloquear insignias épicas
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
    >
      {badges.map((badge, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          whileHover={{ 
            scale: 1.1, 
            rotate: [0, -5, 5, -5, 0],
            zIndex: 10
          }}
          whileTap={{ scale: 0.95 }}
          className="card p-4 border-2 border-transparent hover:border-yellow-300 dark:hover:border-yellow-600 transition-all cursor-pointer group relative overflow-hidden"
        >
          {/* Efecto de brillo en hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200/30 to-transparent"
            initial={{ x: '-100%' }}
            whileHover={{ x: '200%' }}
            transition={{ duration: 0.6 }}
          />

          <div className="relative text-center">
            {/* Icono de la insignia */}
            <motion.div
              className="relative inline-block mb-3"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-yellow-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-yellow-500/50 transition-shadow">
                <Award className="w-9 h-9 text-white" strokeWidth={2.5} />
              </div>
              {/* Anillo brillante */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full border-2 border-yellow-400"
              />
            </motion.div>

            {/* Nombre de la insignia */}
            <h4 className="text-sm font-bold group-hover:text-yellow-700 dark:group-hover:text-yellow-400 transition-colors mb-1" style={{ color: 'var(--color-texto)' }}>
              {badge}
            </h4>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
