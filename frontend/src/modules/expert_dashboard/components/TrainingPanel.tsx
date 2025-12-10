/**
 * Panel de Formación para Expertos
 * Recursos educativos y capacitación continua
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  BookOpen, 
  Video, 
  FileText, 
  Download, 
  ExternalLink,
  PlayCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import api from '../../../api/client';

interface Course {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'document' | 'interactive';
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  completed: boolean;
  thumbnail?: string;
}

interface Resource {
  id: string;
  title: string;
  type: 'guide' | 'paper' | 'manual';
  description: string;
  url: string;
  size?: string;
}

export default function TrainingPanel() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [coursesRes, resourcesRes] = await Promise.all([
        api.get('/expert/training/courses/'),
        api.get('/expert/training/resources/')
      ]);
      
      setCourses(coursesRes.data);
      setResources(resourcesRes.data);
    } catch (error) {
      console.error('Error cargando datos de formación:', error);
      // Mantener arrays vacíos si falla
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'text-green-600';
      case 'intermediate': return 'text-amber-600';
      case 'advanced': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getLevelBg = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-50 dark:bg-green-900/20';
      case 'intermediate': return 'bg-amber-50 dark:bg-amber-900/20';
      case 'advanced': return 'bg-red-50 dark:bg-red-900/20';
      default: return 'bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-5 h-5" />;
      case 'document': return <FileText className="w-5 h-5" />;
      case 'interactive': return <PlayCircle className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const completedCount = courses.filter(c => c.completed).length;
  const progressPercentage = courses.length > 0 ? (completedCount / courses.length) * 100 : 0;

  if (loading) {
    return (
      <div className="card p-8 text-center">
        <div className="text-muted">Cargando cursos y recursos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-texto)' }}>
              <GraduationCap className="w-6 h-6 inline mr-2" />
              Formación Continua
            </h2>
            <p className="text-muted">
              Recursos y capacitación para expertos en biodiversidad
            </p>
          </div>

          {/* Progress Overview */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="text-sm text-muted mb-1">Progreso Total</div>
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-blue-600">
                {completedCount}/{courses.length}
              </div>
              <div className="text-sm text-muted">cursos completados</div>
            </div>
            <div className="mt-2 w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cursos Disponibles */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--color-texto)' }}>
            Cursos y Capacitaciones
          </h3>

          {courses.length === 0 ? (
            <div className="card p-8 text-center text-muted">
              No hay cursos disponibles en este momento
            </div>
          ) : (
            courses.map((course) => (
            <motion.div
              key={course.id}
              whileHover={{ scale: 1.01 }}
              className={`card p-5 cursor-pointer transition-all ${
                selectedCourse?.id === course.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedCourse(course)}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${getLevelBg(course.level)}`}>
                  {getTypeIcon(course.type)}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold" style={{ color: 'var(--color-texto)' }}>
                      {course.title}
                    </h4>
                    {course.completed && (
                      <CheckCircle className="w-5 h-5 text-green-600 ml-2" />
                    )}
                  </div>

                  <p className="text-sm text-muted mb-3">{course.description}</p>

                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1 text-muted">
                      <Clock className="w-3 h-3" />
                      {course.duration}
                    </span>
                    <span className={`px-2 py-1 rounded ${getLevelBg(course.level)} ${getLevelColor(course.level)} font-medium`}>
                      {course.level === 'beginner' && 'Básico'}
                      {course.level === 'intermediate' && 'Intermedio'}
                      {course.level === 'advanced' && 'Avanzado'}
                    </span>
                  </div>

                  {selectedCourse?.id === course.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                    >
                      <button
                        className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert('Funcionalidad en desarrollo. Curso: ' + course.title);
                        }}
                      >
                        {course.completed ? (
                          <>
                            <BookOpen className="w-4 h-4" />
                            Revisar Curso
                          </>
                        ) : (
                          <>
                            <PlayCircle className="w-4 h-4" />
                            Iniciar Curso
                          </>
                        )}
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
          )}
        </div>

        {/* Recursos Descargables */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--color-texto)' }}>
            Recursos Descargables
          </h3>

          {resources.length === 0 ? (
            <div className="card p-8 text-center text-muted text-sm">
              No hay recursos disponibles
            </div>
          ) : (
            resources.map((resource) => (
              <motion.div
              key={resource.id}
              whileHover={{ scale: 1.02 }}
              className="card p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1" style={{ color: 'var(--color-texto)' }}>
                    {resource.title}
                  </h4>
                  <p className="text-xs text-muted mb-2">{resource.description}</p>
                  
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                      {resource.type === 'guide' && '📘 Guía'}
                      {resource.type === 'paper' && '📄 Paper'}
                      {resource.type === 'manual' && '📖 Manual'}
                    </span>
                    {resource.size && <span>{resource.size}</span>}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  alert('Descarga iniciada: ' + resource.title);
                }}
                className="w-full mt-3 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                {resource.url.startsWith('http') ? (
                  <>
                    <ExternalLink className="w-4 h-4" />
                    Abrir Enlace
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Descargar
                  </>
                )}
              </button>
            </motion.div>
          ))
          )}

          {/* Stats Card */}
          <div className="card p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <h4 className="font-semibold mb-3" style={{ color: 'var(--color-texto)' }}>
              Tu Progreso
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Cursos completados</span>
                <span className="font-semibold">{completedCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Horas de formación</span>
                <span className="font-semibold">3.5 hrs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Certificados obtenidos</span>
                <span className="font-semibold">2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
