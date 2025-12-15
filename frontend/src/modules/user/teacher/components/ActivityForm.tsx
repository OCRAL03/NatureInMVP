import { useState } from 'react';
import { X, Plus, Calendar, Award, FileText } from 'lucide-react';
import type { Activity } from '../types';

interface ActivityFormProps {
  activity?: Activity | null;
  onSubmit: (data: Partial<Activity>) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export default function ActivityForm({ activity, onSubmit, onCancel, isOpen }: ActivityFormProps) {
  const [formData, setFormData] = useState({
    title: activity?.title || '',
    description: activity?.description || '',
    type: activity?.type || ('quiz' as Activity['type']),
    reward_points: activity?.reward_points || 50,
    deadline: activity?.deadline ? activity.deadline.split('T')[0] : '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo al editar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es obligatorio';
    } else if (formData.title.length < 5) {
      newErrors.title = 'El título debe tener al menos 5 caracteres';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    } else if (formData.description.length < 10) {
      newErrors.description = 'La descripción debe tener al menos 10 caracteres';
    }

    if (formData.reward_points < 0) {
      newErrors.reward_points = 'Los puntos deben ser positivos';
    } else if (formData.reward_points > 1000) {
      newErrors.reward_points = 'Los puntos no pueden superar 1000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    onSubmit({
      ...formData,
      deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
    });
  };

  const activityTypes = [
    { value: 'sighting', label: '🔍 Avistamiento', description: 'Registrar especies observadas' },
    { value: 'quiz', label: '📝 Cuestionario', description: 'Preguntas sobre biodiversidad' },
    { value: 'exploration', label: '🗺️ Exploración', description: 'Visitar ubicaciones específicas' },
    { value: 'research', label: '📚 Investigación', description: 'Proyecto de investigación' },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="card w-full max-w-2xl relative">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center">
                <Plus className="w-6 h-6" style={{ color: 'var(--color-verde-principal)' }} />
              </div>
              <div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--color-texto)' }}>
                  {activity ? 'Editar Actividad' : 'Nueva Actividad'}
                </h2>
                <p className="text-sm text-muted">
                  {activity ? 'Modifica los detalles de la actividad' : 'Crea una nueva actividad para tus estudiantes'}
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-texto)' }}>
                <FileText className="w-4 h-4 inline mr-1" />
                Título de la Actividad *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Ej: Identificación de Aves del Bosque"
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-800`}
                style={{ color: 'var(--color-texto)' }}
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">{errors.title}</p>
              )}
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-texto)' }}>
                Descripción *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe los objetivos y requisitos de la actividad..."
                rows={4}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-800 resize-none`}
                style={{ color: 'var(--color-texto)' }}
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">{errors.description}</p>
              )}
              <p className="text-xs text-muted mt-1">
                {formData.description.length} caracteres
              </p>
            </div>

            {/* Tipo de Actividad */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: 'var(--color-texto)' }}>
                Tipo de Actividad *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activityTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleChange('type', type.value)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      formData.type === type.value
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <p className="font-semibold mb-1" style={{ color: 'var(--color-texto)' }}>
                      {type.label}
                    </p>
                    <p className="text-xs text-muted">{type.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Puntos y Fecha Límite */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Puntos de Recompensa */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-texto)' }}>
                  <Award className="w-4 h-4 inline mr-1" />
                  Puntos de Recompensa *
                </label>
                <input
                  type="number"
                  value={formData.reward_points}
                  onChange={(e) => handleChange('reward_points', parseInt(e.target.value) || 0)}
                  min="0"
                  max="1000"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.reward_points ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-800`}
                  style={{ color: 'var(--color-texto)' }}
                />
                {errors.reward_points && (
                  <p className="text-sm text-red-500 mt-1">{errors.reward_points}</p>
                )}
              </div>

              {/* Fecha Límite */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-texto)' }}>
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Fecha Límite (Opcional)
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => handleChange('deadline', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  style={{ color: 'var(--color-texto)' }}
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onCancel}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                {activity ? 'Guardar Cambios' : 'Crear Actividad'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
