import { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'

interface StatsCardProps {
  icon: LucideIcon
  title: string
  value: string | number
  subtitle?: string
  variant?: 'default' | 'success' | 'info' | 'warning'
}

/**
 * Tarjeta de estadística reutilizable con diseño mejorado
 * Muestra un icono, título, valor y subtítulo opcional con animaciones
 */
export default function StatsCard({ 
  icon: Icon, 
  title, 
  value, 
  subtitle, 
  variant = 'default' 
}: StatsCardProps) {
  const variantStyles = {
    default: {
      gradient: 'from-gray-500 to-gray-700',
      bg: 'from-gray-50 to-gray-100',
      text: 'text-gray-700',
      icon: 'text-gray-600'
    },
    success: {
      gradient: 'from-green-500 to-emerald-600',
      bg: 'from-green-50 to-emerald-50',
      text: 'text-green-700',
      icon: 'text-green-600'
    },
    info: {
      gradient: 'from-blue-500 to-cyan-600',
      bg: 'from-blue-50 to-cyan-50',
      text: 'text-blue-700',
      icon: 'text-blue-600'
    },
    warning: {
      gradient: 'from-yellow-500 to-orange-500',
      bg: 'from-yellow-50 to-orange-50',
      text: 'text-yellow-700',
      icon: 'text-yellow-600'
    }
  }

  const styles = variantStyles[variant]

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="card p-5 border-2 border-transparent hover:border-opacity-50 transition-all cursor-pointer relative overflow-hidden"
    >
      {/* Efecto de brillo en hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
      
      <div className="relative flex items-start gap-4">
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
          className={`p-3 rounded-xl bg-gradient-to-br ${styles.gradient} shadow-lg`}
        >
          <Icon className="w-6 h-6 text-white" />
        </motion.div>
        
        <div className="flex-1">
          <div className="text-sm font-medium text-muted mb-1">{title}</div>
          <div className={`text-3xl font-bold ${styles.text}`}>
            {value}
          </div>
          {subtitle && (
            <div className="text-xs text-muted mt-1 flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-current opacity-50" />
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
