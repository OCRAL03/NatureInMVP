import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Search, Check } from 'lucide-react';
import type { Activity, StudentSummary } from '../types';

interface AssignActivityModalProps {
  activity: Activity | null;
  students: StudentSummary[];
  isOpen: boolean;
  onClose: () => void;
  onAssign: (activityId: number, studentIds: number[]) => void;
}

export default function AssignActivityModal({ 
  activity, 
  students, 
  isOpen, 
  onClose, 
  onAssign 
}: AssignActivityModalProps) {
  const [selectedStudents, setSelectedStudents] = useState<number[]>(
    activity?.assigned_to || []
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('');

  if (!activity) return null;

  // Filtrar estudiantes por búsqueda y grado
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGrade = !filterGrade || student.grade === filterGrade;
    
    return matchesSearch && matchesGrade;
  });

  // Obtener grados únicos
  const grades = Array.from(new Set(students.map(s => s.grade))).sort();

  const toggleStudent = (studentId: number) => {
    setSelectedStudents(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const toggleAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id));
    }
  };

  const handleSubmit = () => {
    onAssign(activity.id, selectedStudents);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="min-h-full flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="card w-full max-w-3xl max-h-[85vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold" style={{ color: 'var(--color-texto)' }}>
                        Asignar Actividad
                      </h2>
                      <p className="text-sm text-muted">
                        {activity.title}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Filtros */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 space-y-3">
                  <div className="flex gap-3">
                    {/* Búsqueda */}
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                      <input
                        type="text"
                        placeholder="Buscar estudiante..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                        style={{ color: 'var(--color-texto)' }}
                      />
                    </div>

                    {/* Filtro por grado */}
                    <select
                      value={filterGrade}
                      onChange={(e) => setFilterGrade(e.target.value)}
                      className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                      style={{ color: 'var(--color-texto)' }}
                    >
                      <option value="">Todos los grados</option>
                      {grades.map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select>
                  </div>

                  {/* Acciones rápidas */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={toggleAll}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {selectedStudents.length === filteredStudents.length ? 'Deseleccionar' : 'Seleccionar'} todos
                    </button>
                    <span className="text-sm text-muted">
                      {selectedStudents.length} de {filteredStudents.length} seleccionados
                    </span>
                  </div>
                </div>

                {/* Lista de estudiantes */}
                <div className="flex-1 overflow-y-auto p-6">
                  {filteredStudents.length === 0 ? (
                    <div className="text-center py-12 text-muted">
                      <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>No se encontraron estudiantes</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredStudents.map((student) => {
                        const isSelected = selectedStudents.includes(student.id);
                        const isAssigned = activity.assigned_to.includes(student.id);

                        return (
                          <motion.button
                            key={student.id}
                            onClick={() => toggleStudent(student.id)}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                              isSelected
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              {/* Checkbox */}
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                                isSelected
                                  ? 'border-green-500 bg-green-500'
                                  : 'border-gray-300 dark:border-gray-600'
                              }`}>
                                {isSelected && <Check className="w-3 h-3 text-white" />}
                              </div>

                              {/* Avatar */}
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-bold" style={{ color: 'var(--color-verde-principal)' }}>
                                  {student.full_name.charAt(0).toUpperCase()}
                                </span>
                              </div>

                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold" style={{ color: 'var(--color-texto)' }}>
                                  {student.full_name}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-muted">
                                  <span>@{student.username}</span>
                                  <span>•</span>
                                  <span>{student.grade} - {student.section}</span>
                                </div>
                              </div>

                              {/* Badges */}
                              <div className="flex items-center gap-2 flex-shrink-0">
                                {isAssigned && (
                                  <span className="pill pill-blue text-xs">Ya asignado</span>
                                )}
                                <span className="text-sm font-semibold" style={{ color: 'var(--color-verde-principal)' }}>
                                  {student.points} pts
                                </span>
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-semibold" style={{ color: 'var(--color-texto)' }}>
                      {selectedStudents.length}
                    </span>
                    <span className="text-muted"> estudiante(s) seleccionado(s)</span>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={onClose} className="btn btn-secondary">
                      Cancelar
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={selectedStudents.length === 0}
                      className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Asignar Actividad
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
