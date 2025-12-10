import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  BookOpen,
  CheckCircle,
  Clock,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import api from '../../api/client';
import type { TabKey, TeacherProfile, StudentSummary } from './types';
import TeacherStats from './components/TeacherStats';
import StudentCard from './components/StudentCard';
import FiltersBar from './components/FiltersBar';
import StudentDetailModal from './components/StudentDetailModal';
import ActivityManager from './components/ActivityManager';
import { useTeacherStats, useStudents, useActivities } from './hooks/useTeacherData';
import { useStudentFilters } from './hooks/useStudentFilters';

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<StudentSummary | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { stats, loading: loadingStats } = useTeacherStats();
  const { students, loading: loadingStudents } = useStudents();
  const { activities, loading: loadingActivities } = useActivities();
  
  const { filters, setFilters, filteredStudents, grades, sections, filteredCount } = useStudentFilters(students);

  const handleViewStudentDetails = (student: StudentSummary) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedStudent(null), 300);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await api.get('/user/me/');
      const userData = response.data;
      
      setProfile({
        id: userData.id,
        username: userData.username,
        email: userData.email,
        full_name: userData.profile?.full_name || userData.full_name || userData.username || 'Usuario',
        subject: userData.profile?.subject || 'Ciencias Naturales',
        institution: userData.profile?.institution || 'Institución Educativa',
        avatar_url: userData.profile?.avatar_url,
      });
    } catch (error) {
      console.error('Error cargando perfil:', error);
      // Setear valores por defecto en caso de error
      setProfile({
        id: 0,
        username: 'docente',
        email: '',
        full_name: 'Docente',
        subject: 'Ciencias Naturales',
        institution: 'Institución Educativa',
      });
    } finally {
      setLoadingProfile(false);
    }
  };

  const tabs = [
    { key: 'overview' as TabKey, label: 'Vista General', icon: LayoutDashboard },
    { key: 'students' as TabKey, label: 'Estudiantes', icon: Users },
    { key: 'activities' as TabKey, label: 'Actividades', icon: ClipboardList },
    { key: 'content' as TabKey, label: 'Contenido', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: 'var(--color-fondo)' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 mb-6"
      >
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.full_name || profile.username} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-2xl font-bold" style={{ color: 'var(--color-verde-principal)' }}>
                  {loadingProfile ? '...' : (profile?.full_name || profile?.username || 'D').charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-texto)' }}>
                {loadingProfile ? 'Cargando...' : `Bienvenido, ${profile?.full_name || profile?.username || 'Docente'}`}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="pill pill-green">{profile?.subject || 'Docente'}</span>
                <span className="text-sm text-muted">{profile?.institution || 'Institución Educativa'}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-sm text-muted">Rol</p>
              <p className="font-semibold" style={{ color: 'var(--color-texto)' }}>Docente</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="mb-6">
        {stats && <TeacherStats stats={stats} loading={loadingStats} />}
      </div>

      {/* Tabs Navigation */}
      <div className="card p-2 mb-6">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              style={{
                color: activeTab === tab.key ? 'var(--color-verde-principal)' : 'var(--color-texto)',
              }}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Actividades Recientes */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <ClipboardList className="w-6 h-6" style={{ color: 'var(--color-verde-principal)' }} />
                  Actividades Recientes
                </h2>
                <span className="pill pill-blue">{activities.length}</span>
              </div>
              {loadingActivities ? (
                <div className="text-center py-8 text-muted">Cargando actividades...</div>
              ) : activities.length === 0 ? (
                <div className="text-center py-8 text-muted">No hay actividades asignadas</div>
              ) : (
                <div className="space-y-3">
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="p-4 rounded-lg border border-green-200 dark:border-gray-700 hover:bg-green-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold" style={{ color: 'var(--color-texto)' }}>
                          {activity.title}
                        </h3>
                        <span className={`pill ${
                          activity.status === 'active' ? 'pill-green' : 'pill-gray'
                        }`}>
                          {activity.status === 'active' ? 'Activa' : 'Finalizada'}
                        </span>
                      </div>
                      <p className="text-sm text-muted mb-3">{activity.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1 text-muted">
                            <Users className="w-4 h-4" />
                            {activity.completion_count}/{activity.total_assigned}
                          </span>
                          <span className="flex items-center gap-1 text-muted">
                            <TrendingUp className="w-4 h-4" />
                            {activity.reward_points} pts
                          </span>
                        </div>
                        {activity.deadline && (
                          <span className="flex items-center gap-1 text-muted">
                            <Clock className="w-4 h-4" />
                            {new Date(activity.deadline).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Resumen de Progreso */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <TrendingUp className="w-6 h-6" style={{ color: 'var(--color-verde-principal)' }} />
                  Progreso General
                </h2>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted">Estudiantes Activos</span>
                    <span className="text-sm font-semibold">{stats?.active_today || 0}/{stats?.total_students || 0}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${stats?.engagement_rate || 0}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted">Tasa de Finalización</span>
                    <span className="text-sm font-semibold">{stats?.completion_rate || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${stats?.completion_rate || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="space-y-6">
            {/* Barra de filtros */}
            <FiltersBar
              filters={filters}
              onFiltersChange={setFilters}
              grades={grades}
              sections={sections}
            />

            {/* Contador de resultados */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Users className="w-6 h-6" style={{ color: 'var(--color-verde-principal)' }} />
                Estudiantes
                <span className="pill pill-blue text-sm">
                  {filteredCount} {filteredCount !== students.length && `de ${students.length}`}
                </span>
              </h2>
              
              {/* Vista de tabla/cards toggle - futuro */}
              <div className="text-sm text-muted">
                Vista de tarjetas
              </div>
            </div>

            {/* Loading state */}
            {loadingStudents ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="card p-6 animate-pulse">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700" />
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4" />
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="card p-12 text-center">
                <Users className="w-16 h-16 mx-auto mb-4 text-muted" />
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-texto)' }}>
                  No se encontraron estudiantes
                </h3>
                <p className="text-muted mb-4">
                  {students.length === 0 
                    ? 'No hay estudiantes registrados en tu institución'
                    : 'Intenta ajustar los filtros de búsqueda'}
                </p>
                {filters.search || filters.grade || filters.section ? (
                  <button
                    onClick={() => setFilters({
                      search: '',
                      grade: '',
                      section: '',
                      sortBy: 'points',
                      sortOrder: 'desc',
                    })}
                    className="btn btn-primary"
                  >
                    Limpiar Filtros
                  </button>
                ) : null}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStudents.map((student) => (
                  <StudentCard
                    key={student.id}
                    student={student}
                    onViewDetails={handleViewStudentDetails}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'activities' && (
          <ActivityManager />
        )}

        {activeTab === 'content' && (
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <BookOpen className="w-6 h-6" style={{ color: 'var(--color-verde-principal)' }} />
                Creación de Contenido
              </h2>
              <button className="btn btn-primary">
                + Nuevo Contenido
              </button>
            </div>
            <p className="text-muted text-center py-8">
              Próximamente: Crear fichas informativas y rutas de exploración
            </p>
          </div>
        )}
      </motion.div>

      {/* Modal de detalles del estudiante */}
      <StudentDetailModal
        student={selectedStudent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
