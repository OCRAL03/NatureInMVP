import { useDashboardData } from './hooks/useDashboardData'
import StatsCard from './components/StatsCard'
import LevelIndicator from './components/LevelIndicator'
import BadgesList from './components/BadgesList'
import ActivityFeed from './components/ActivityFeed'
import MissionsList from './components/MissionsList'
import { Trophy, Eye, CheckCircle, Clock, TrendingUp, GraduationCap, Sparkles, Target, Zap, Award, Star } from 'lucide-react'
import { motion } from 'framer-motion'

/**
 * Dashboard principal para estudiantes de secundaria
 * Diseño dinámico y motivador con gamificación visible
 */
export default function StudentDashboard() {
  const { data, loading, error } = useDashboardData()

  // Animaciones para las tarjetas
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-muted">Cargando tu dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card p-6 text-center max-w-md mx-auto mt-8">
        <div className="text-red-500 mb-3">
          <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="font-semibold text-lg mb-2">Error al cargar el dashboard</h3>
        <p className="text-sm text-muted">{error}</p>
      </div>
    )
  }

  if (!data) {
    return null
  }

  const { profile, stats, gamify, missions, recent_activities } = data

  // Calcular progreso hacia siguiente nivel
  const nextLevelPoints = gamify.level.max_points
  const currentPoints = gamify.total_points
  const pointsToNextLevel = nextLevelPoints - currentPoints

  return (
    <div className="min-h-screen pb-8" style={{ backgroundColor: 'var(--color-fondo)' }}>
      {/* Header Hero con degradado suave */}
      <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 border-b-2 border-green-100 dark:border-gray-700 mb-6">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between flex-wrap gap-6"
            style={{ color: 'var(--color-texto)' }}
          >
            <div className="flex items-center gap-6">
              {/* Avatar grande con efecto brillante */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-2xl"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center text-green-700 dark:text-green-100 text-4xl font-bold border-4 border-white dark:border-gray-600 shadow-lg">
                    {profile.full_name?.charAt(0) || profile.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 bg-green-500 dark:bg-green-600 rounded-full p-2 border-2 border-white dark:border-gray-600 shadow-md">
                  <Star className="w-5 h-5 text-white" fill="currentColor" />
                </div>
              </motion.div>

              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                  ¡Hola, {profile.full_name?.split(' ')[0] || profile.username}! 
                  <Sparkles className="w-6 h-6 text-green-400 dark:text-green-500" />
                </h1>
                <div className="flex items-center gap-3 flex-wrap text-sm">
                  <span className="bg-white/80 dark:bg-gray-700/80 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 border border-green-200 dark:border-gray-600">
                    <GraduationCap className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span style={{ color: 'var(--color-texto)' }}>{profile.grade} - Sección {profile.section}</span>
                  </span>
                  {gamify.rank && (
                    <span className="bg-white/80 dark:bg-gray-700/80 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 border border-green-200 dark:border-gray-600">
                      <Trophy className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span style={{ color: 'var(--color-texto)' }}>{gamify.rank}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Ranking en tarjeta destacada */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-gray-800 border-2 border-green-200 dark:border-gray-700 rounded-2xl p-4 text-center min-w-[140px] shadow-sm"
            >
              <div className="text-5xl font-bold text-green-600 dark:text-green-400 mb-1">{gamify.level.tier}</div>
              <div className="text-sm" style={{ color: 'var(--color-muted)' }}>Nivel Actual</div>
            </motion.div>
          </motion.div>

          {/* Banner de motivación para siguiente nivel */}
          {pointsToNextLevel > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4 bg-green-50 dark:bg-gray-800 border border-green-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
                <div>
                  <div className="font-semibold" style={{ color: 'var(--color-texto)' }}>¡Sigue explorando!</div>
                  <div className="text-sm" style={{ color: 'var(--color-muted)' }}>
                    Necesitas {pointsToNextLevel} puntos más para subir de nivel
                  </div>
                </div>
              </div>
              <Target className="w-8 h-8 text-green-500 dark:text-green-400" />
            </motion.div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-6">
        {/* Nivel e indicador de progreso */}
        <LevelIndicator level={gamify.level} currentPoints={gamify.total_points} />

        {/* Métricas principales con animación */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <motion.div variants={itemVariants}>
            <StatsCard
              icon={Trophy}
              title="Puntos Totales"
              value={gamify.total_points}
              subtitle={gamify.rank || 'Sin rango'}
              variant="success"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatsCard
              icon={Eye}
              title="Avistamientos"
              value={stats.total_sightings}
              subtitle={`${stats.verified_sightings} verificados`}
              variant="info"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatsCard
              icon={Award}
              title="Insignias"
              value={gamify.badges.length}
              subtitle="Desbloqueadas"
              variant="warning"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatsCard
              icon={TrendingUp}
              title="Actividades"
              value={stats.total_activities}
              subtitle="Completadas"
              variant="default"
            />
          </motion.div>
        </motion.div>

        {/* Insignias con título más llamativo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-xl border border-amber-200 dark:border-amber-800">
              <Award className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Mis Logros</h2>
              <p className="text-sm text-muted">Insignias que has ganado 🏆</p>
            </div>
          </div>
          <BadgesList badges={gamify.badges} />
        </motion.div>

        {/* Misiones con diseño mejorado */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl border border-blue-200 dark:border-blue-800">
              <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Misiones Activas</h2>
              <p className="text-sm text-muted">Completa desafíos y gana recompensas 🎯</p>
            </div>
          </div>
          <MissionsList missions={missions} />
        </motion.div>

        {/* Grid de dos columnas para actividades y stats adicionales */}
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="md:col-span-2"
          >
            <ActivityFeed activities={recent_activities} maxDisplay={10} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-4"
          >
            {/* Tarjeta de avistamientos pendientes con diseño mejorado */}
            {stats.pending_sightings > 0 && (
              <div className="card p-5 border-2 border-orange-200 dark:border-orange-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg border border-orange-200 dark:border-orange-800">
                    <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="font-semibold">En Revisión</h3>
                </div>
                <p className="text-4xl font-bold text-orange-600 mb-1">{stats.pending_sightings}</p>
                <p className="text-sm text-muted">Avistamientos esperando verificación ⏳</p>
              </div>
            )}

            {/* Tarjeta motivacional con diseño dinámico */}
            <div className="card p-5 border-2 border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                <h3 className="font-semibold" style={{ color: 'var(--color-texto)' }}>¡Consejo del Explorador!</h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                🌿 Sal a explorar nuevas áreas cerca de tu escuela. Cada especie que registres te acerca más a convertirte en un <span className="font-bold text-green-600">Maestro Naturalista</span>. ¡No olvides tomar fotos claras!
              </p>
            </div>

            {/* Tarjeta de racha (si fuera implementada) */}
            <div className="card p-5 border-2 border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg border border-green-200 dark:border-green-800">
                  <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold">Racha Activa</h3>
              </div>
              <p className="text-4xl font-bold text-green-600 mb-1">🔥 0 días</p>
              <p className="text-sm text-muted">¡Empieza tu racha hoy mismo!</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
