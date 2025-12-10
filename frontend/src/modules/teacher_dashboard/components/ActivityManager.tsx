import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter } from 'lucide-react';
import ActivityCard from './ActivityCard';
import ActivityForm from './ActivityForm';
import AssignActivityModal from './AssignActivityModal';
import { useActivityManager } from '../hooks/useActivityManager';
import { useStudents } from '../hooks/useTeacherData';
import type { Activity } from '../types';

export default function ActivityManager() {
  const { activities, loading, createActivity, updateActivity, deleteActivity, assignActivity, getStats } = useActivityManager();
  const { students } = useStudents();

  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [assigningActivity, setAssigningActivity] = useState<Activity | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<Activity['type'] | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<Activity['status'] | 'all'>('all');

  const stats = getStats();

  // Filtrar actividades
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || activity.type === filterType;
    const matchesStatus = filterStatus === 'all' || activity.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleCreateActivity = async (data: Partial<Activity>) => {
    await createActivity(data);
    setShowForm(false);
  };

  const handleUpdateActivity = async (data: Partial<Activity>) => {
    if (editingActivity) {
      await updateActivity(editingActivity.id, data);
      setEditingActivity(null);
    }
  };

  const handleDeleteActivity = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar esta actividad?')) {
      await deleteActivity(id);
    }
  };

  const handleAssignActivity = async (activityId: number, studentIds: number[]) => {
    await assignActivity(activityId, studentIds);
    setAssigningActivity(null);
  };

  const typeOptions: { value: Activity['type'] | 'all'; label: string; emoji: string }[] = [
    { value: 'all', label: 'Todos los tipos', emoji: '📋' },
    { value: 'quiz', label: 'Cuestionarios', emoji: '📝' },
    { value: 'exploration', label: 'Exploraciones', emoji: '🗺️' },
    { value: 'research', label: 'Investigaciones', emoji: '📚' },
    { value: 'reading', label: 'Lecturas', emoji: '📖' },
  ];

  const statusOptions: { value: Activity['status'] | 'all'; label: string }[] = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'active', label: 'Activas' },
    { value: 'completed', label: 'Completadas' },
    { value: 'expired', label: 'Vencidas' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats rápidas */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="text-2xl font-bold text-green-600">{stats.total}</div>
          <div className="text-sm text-muted">Total de actividades</div>
        </div>
        <div className="card p-4">
          <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
          <div className="text-sm text-muted">Activas</div>
        </div>
        <div className="card p-4">
          <div className="text-2xl font-bold text-purple-600">{stats.completed}</div>
          <div className="text-sm text-muted">Completadas</div>
        </div>
        <div className="card p-4">
          <div className="text-2xl font-bold text-orange-600">{stats.avgCompletion}%</div>
          <div className="text-sm text-muted">Tasa de completitud</div>
        </div>
      </div>

      {/* Barra de acciones y filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Búsqueda */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
          <input
            type="text"
            placeholder="Buscar actividades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            style={{ backgroundColor: 'var(--color-surface)' }}
          />
        </div>

        {/* Filtros */}
        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as Activity['type'] | 'all')}
              className="pl-9 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none cursor-pointer"
              style={{ backgroundColor: 'var(--color-surface)' }}
            >
              {typeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.emoji} {option.label}
                </option>
              ))}
            </select>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as Activity['status'] | 'all')}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none cursor-pointer"
            style={{ backgroundColor: 'var(--color-surface)' }}
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Botón crear */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          Nueva Actividad
        </motion.button>
      </div>

      {/* Contador de resultados */}
      {searchTerm || filterType !== 'all' || filterStatus !== 'all' ? (
        <div className="text-sm text-muted">
          Mostrando {filteredActivities.length} de {activities.length} actividades
        </div>
      ) : null}

      {/* Grid de actividades */}
      {loading ? (
        <div className="text-center py-12 text-muted">
          Cargando actividades...
        </div>
      ) : filteredActivities.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold mb-2">No hay actividades</h3>
          <p className="text-muted mb-6">
            {searchTerm || filterType !== 'all' || filterStatus !== 'all'
              ? 'No se encontraron actividades con los filtros aplicados'
              : 'Comienza creando tu primera actividad para los estudiantes'}
          </p>
          {!searchTerm && filterType === 'all' && filterStatus === 'all' && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Crear Primera Actividad
            </motion.button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
              >
                <ActivityCard
                  activity={activity}
                  onEdit={(activity) => setEditingActivity(activity)}
                  onDelete={handleDeleteActivity}
                  onAssign={(activity) => setAssigningActivity(activity)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal de crear/editar */}
      <ActivityForm
        activity={editingActivity || undefined}
        isOpen={showForm || editingActivity !== null}
        onSubmit={editingActivity ? handleUpdateActivity : handleCreateActivity}
        onCancel={() => {
          setShowForm(false);
          setEditingActivity(null);
        }}
      />

      {/* Modal de asignar */}
      {assigningActivity && (
        <AssignActivityModal
          activity={assigningActivity}
          students={students}
          isOpen={true}
          onClose={() => setAssigningActivity(null)}
          onAssign={handleAssignActivity}
        />
      )}
    </div>
  );
}
