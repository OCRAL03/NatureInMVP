import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Eye,
  FileCheck,
  BarChart3,
  FileText,
  Award,
  GraduationCap
} from 'lucide-react';
import api from '../../api/client';
import type { ExpertTabKey, ExpertProfile } from './types';
import ExpertStats from './components/ExpertStats';
import SightingReviewPanel from './components/SightingReviewPanel';
import FichaReviewPanel from './components/FichaReviewPanel';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ReportGeneratorPanel from './components/ReportGeneratorPanel';
import CertificationsPanel from './components/CertificationsPanel';
import TrainingPanel from './components/TrainingPanel';
import { useValidationStats, usePendingSightings } from './hooks/useExpertData';

export default function ExpertDashboard() {
  const [activeTab, setActiveTab] = useState<ExpertTabKey>('sightings');
  const [profile, setProfile] = useState<ExpertProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const { stats, loading: loadingStats } = useValidationStats();
  const { sightings: pendingSightings, loading: loadingSightings } = usePendingSightings();

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
        full_name: userData.profile?.full_name || userData.username || 'Experto',
        specialty: userData.profile?.study_area || 'Sin especialidad',
        institution: userData.profile?.institution || 'Sin institución',
        certifications: userData.profile?.certifications || [],
        avatar_url: userData.profile?.avatar_url,
        bio: userData.profile?.bio,
      });
    } catch (error) {
      console.error('Error cargando perfil del experto:', error);
      // Establecer un perfil por defecto en caso de error
      setProfile({
        id: 0,
        username: 'experto',
        email: '',
        full_name: 'Experto',
        specialty: 'Biodiversidad',
        institution: 'Sin institución',
        certifications: [],
      });
    } finally {
      setLoadingProfile(false);
    }
  };

  const currentProfile = profile;

  const tabs = [
    { key: 'overview' as ExpertTabKey, label: 'Vista General', icon: LayoutDashboard },
    { key: 'sightings' as ExpertTabKey, label: 'Avistamientos', icon: Eye },
    { key: 'fichas' as ExpertTabKey, label: 'Fichas', icon: FileCheck },
    { key: 'analytics' as ExpertTabKey, label: 'Análisis', icon: BarChart3 },
    { key: 'reports' as ExpertTabKey, label: 'Reportes', icon: FileText },
    { key: 'certifications' as ExpertTabKey, label: 'Certificaciones', icon: Award },
    { key: 'training' as ExpertTabKey, label: 'Formación', icon: GraduationCap },
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
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center">
              {currentProfile?.avatar_url ? (
                <img 
                  src={currentProfile.avatar_url} 
                  alt={currentProfile.full_name} 
                  className="w-full h-full rounded-full object-cover" 
                />
              ) : (
                <span className="text-2xl font-bold text-blue-600">
                  {loadingProfile ? '...' : (currentProfile?.full_name?.charAt(0)?.toUpperCase() || 'E')}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-texto)' }}>
                {loadingProfile 
                  ? 'Cargando...' 
                  : (currentProfile?.full_name || 'Experto')}
              </h1>
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <span className="pill pill-blue">{currentProfile?.specialty || 'Biodiversidad'}</span>
                <span className="text-sm text-muted">{currentProfile?.institution || 'Sin institución'}</span>
              </div>
              {currentProfile?.bio && (
                <p className="text-sm text-muted max-w-2xl">
                  {currentProfile.bio}
                </p>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-600">Experto Científico</span>
            </div>
            {currentProfile?.certifications && currentProfile.certifications.length > 0 && (
              <div className="text-xs text-muted">
                <GraduationCap className="w-4 h-4 inline mr-1" />
                {currentProfile.certifications.length} certificación{currentProfile.certifications.length !== 1 ? 'es' : ''}
              </div>
            )}
          </div>
        </div>

        {/* Certificaciones expandibles */}
        {currentProfile?.certifications && currentProfile.certifications.length > 0 && (
          <details className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <summary className="text-sm font-medium cursor-pointer hover:text-blue-600 transition-colors">
              Ver certificaciones y credenciales
            </summary>
            <div className="mt-3 space-y-1">
              {currentProfile.certifications.map((cert, index) => (
                <div key={index} className="text-sm text-muted flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          </details>
        )}
      </motion.div>

      {/* Stats */}
      {stats && (
        <div className="mb-6">
          <ExpertStats stats={stats} loading={loadingStats} />
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="card p-2 mb-6">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              style={{
                color: activeTab === tab.key ? 'var(--color-azul-principal)' : 'var(--color-texto)',
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
          <div className="card p-6">
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-texto)' }}>
              Resumen de Actividad
            </h2>
            <p className="text-muted mb-6">
              Bienvenido al panel de experto. Aquí encontrarás un resumen de tu actividad de validación científica.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Actividad reciente */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2" style={{ color: 'var(--color-texto)' }}>
                  <Eye className="w-5 h-5 text-blue-600" />
                  Avistamientos Recientes
                </h3>
                <div className="space-y-2">
                  {pendingSightings.slice(0, 3).map(sighting => (
                    <div 
                      key={sighting.id}
                      className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                      onClick={() => setActiveTab('sightings')}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm" style={{ color: 'var(--color-texto)' }}>
                            {sighting.species}
                          </p>
                          <p className="text-xs text-muted">
                            {sighting.user.full_name} • {new Date(sighting.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="pill pill-amber text-xs">Pendiente</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setActiveTab('sightings')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Ver todos los avistamientos →
                </button>
              </div>

              {/* Acciones rápidas */}
              <div className="space-y-3">
                <h3 className="font-semibold" style={{ color: 'var(--color-texto)' }}>
                  Acciones Rápidas
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveTab('sightings')}
                    className="w-full p-3 text-left rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Eye className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-sm" style={{ color: 'var(--color-texto)' }}>
                          Revisar Avistamientos
                        </p>
                        <p className="text-xs text-muted">{stats?.pending_count || 0} pendientes</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('fichas')}
                    className="w-full p-3 text-left rounded-lg bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileCheck className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-sm" style={{ color: 'var(--color-texto)' }}>
                          Validar Fichas
                        </p>
                        <p className="text-xs text-muted">Próximamente</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('reports')}
                    className="w-full p-3 text-left rounded-lg bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-medium text-sm" style={{ color: 'var(--color-texto)' }}>
                          Generar Reporte
                        </p>
                        <p className="text-xs text-muted">Exportar datos</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sightings' && (
          <SightingReviewPanel initialSightings={pendingSightings} />
        )}

        {activeTab === 'fichas' && (
          <FichaReviewPanel />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard />
        )}

        {activeTab === 'reports' && (
          <ReportGeneratorPanel />
        )}

        {activeTab === 'certifications' && (
          <CertificationsPanel />
        )}

        {activeTab === 'training' && (
          <TrainingPanel />
        )}
      </motion.div>
    </div>
  );
}
