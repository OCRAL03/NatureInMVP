import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Star, CheckCircle, XCircle, AlertCircle, FileText, 
  User, Calendar, MapPin, Book, Image as ImageIcon, Link as LinkIcon,
  Edit, Save
} from 'lucide-react';
import type { FichaReview, FichaValidation, FichaCorrection } from '../types';

interface FichaDetailModalProps {
  ficha: FichaReview;
  isOpen: boolean;
  onClose: () => void;
  onValidate: (validation: FichaValidation) => void;
}

export default function FichaDetailModal({ ficha, isOpen, onClose, onValidate }: FichaDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'validation'>('info');
  const [scientificAccuracy, setScientificAccuracy] = useState(3);
  const [taxonomyVerified, setTaxonomyVerified] = useState(false);
  const [generalComments, setGeneralComments] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [corrections, setCorrections] = useState<FichaCorrection[]>([]);
  const [editingField, setEditingField] = useState<string | null>(null);

  const isPending = ficha.validation_status === 'pending';

  const handleAddCorrection = (field: string, originalValue: string) => {
    setCorrections([
      ...corrections,
      {
        field,
        original_value: originalValue,
        suggested_value: '',
        comment: '',
        severity: 'minor',
      },
    ]);
    setEditingField(field);
  };

  const handleUpdateCorrection = (index: number, updates: Partial<FichaCorrection>) => {
    const newCorrections = [...corrections];
    newCorrections[index] = { ...newCorrections[index], ...updates };
    setCorrections(newCorrections);
  };

  const handleRemoveCorrection = (index: number) => {
    setCorrections(corrections.filter((_, i) => i !== index));
  };

  const handleSubmitValidation = (action: FichaValidation['action']) => {
    onValidate({
      ficha_id: ficha.id,
      action,
      scientific_accuracy: scientificAccuracy,
      taxonomy_verified: taxonomyVerified,
      corrections,
      general_comments: generalComments,
      suggestions,
    });
  };

  const tabs = [
    { key: 'info' as const, label: 'Información', icon: FileText },
    { key: 'validation' as const, label: 'Validación', icon: CheckCircle },
  ];

  const iucnColors: Record<string, string> = {
    LC: 'text-green-600',
    NT: 'text-lime-600',
    VU: 'text-yellow-600',
    EN: 'text-orange-600',
    CR: 'text-red-600',
    EW: 'text-purple-600',
    EX: 'text-gray-600',
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="card max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1 italic" style={{ color: 'var(--color-texto)' }}>
                  {ficha.scientific_name}
                </h2>
                <p className="text-lg text-muted mb-3">{ficha.common_name}</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <User className="w-4 h-4" />
                    {ficha.author.full_name}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <Calendar className="w-4 h-4" />
                    {new Date(ficha.created_at).toLocaleDateString('es-PE')}
                  </div>
                  {ficha.scientific_accuracy && (
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < ficha.scientific_accuracy!
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mt-4">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab.key
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'info' ? (
              <div className="space-y-6">
                {/* Taxonomía */}
                <section>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Book className="w-5 h-5 text-blue-600" />
                    Clasificación Taxonómica
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(ficha.taxonomy).map(([key, value]) => (
                      <div key={key} className="card p-3">
                        <div className="text-xs text-muted uppercase mb-1">{key}</div>
                        <div className="font-medium" style={{ color: 'var(--color-texto)' }}>
                          {value || '-'}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Imágenes */}
                {ficha.images && ficha.images.length > 0 && (
                  <section>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-purple-600" />
                      Imágenes ({ficha.images.length})
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {ficha.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`${ficha.common_name} ${idx + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* Descripción y Morfología */}
                <section>
                  <h3 className="text-lg font-semibold mb-2">Descripción General</h3>
                  <p className="text-muted">{ficha.description || 'Sin descripción'}</p>
                </section>

                {ficha.morphology && (
                  <section>
                    <h3 className="text-lg font-semibold mb-2">Morfología</h3>
                    <p className="text-muted">{ficha.morphology}</p>
                  </section>
                )}

                {/* Hábitat y Distribución */}
                <div className="grid md:grid-cols-2 gap-6">
                  <section>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-green-600" />
                      Hábitat
                    </h3>
                    <p className="text-muted">{ficha.habitat || 'No especificado'}</p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-2">Distribución</h3>
                    <p className="text-muted">{ficha.distribution || 'No especificada'}</p>
                  </section>
                </div>

                {/* Comportamiento */}
                {ficha.behavior && (
                  <section>
                    <h3 className="text-lg font-semibold mb-2">Comportamiento</h3>
                    <p className="text-muted">{ficha.behavior}</p>
                  </section>
                )}

                {/* Estado de Conservación */}
                <section>
                  <h3 className="text-lg font-semibold mb-2">Estado de Conservación</h3>
                  <div className="flex items-center gap-3">
                    <p className="text-muted">{ficha.conservation_status || 'No evaluado'}</p>
                    {ficha.iucn_status && (
                      <span className={`pill ${iucnColors[ficha.iucn_status] || 'text-gray-600'}`}>
                        IUCN: {ficha.iucn_status}
                      </span>
                    )}
                  </div>
                </section>

                {/* Referencias */}
                {ficha.references && ficha.references.length > 0 && (
                  <section>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <LinkIcon className="w-5 h-5 text-indigo-600" />
                      Referencias Bibliográficas
                    </h3>
                    <ul className="space-y-1 text-sm text-muted">
                      {ficha.references.map((ref, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-blue-600">[{idx + 1}]</span>
                          <span>{ref}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Calidad Científica */}
                <section>
                  <h3 className="text-lg font-semibold mb-3">Calificación Científica</h3>
                  <div className="flex items-center gap-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setScientificAccuracy(star)}
                        disabled={!isPending}
                        className="transition-transform hover:scale-110 disabled:opacity-50"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= scientificAccuracy
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-sm text-muted ml-2">
                      {['Muy baja', 'Baja', 'Media', 'Alta', 'Excelente'][scientificAccuracy - 1]}
                    </span>
                  </div>
                </section>

                {/* Taxonomía Verificada */}
                <section>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={taxonomyVerified}
                      onChange={(e) => setTaxonomyVerified(e.target.checked)}
                      disabled={!isPending}
                      className="w-5 h-5 rounded"
                    />
                    <span className="font-medium">Taxonomía verificada y correcta</span>
                  </label>
                </section>

                {/* Correcciones */}
                <section>
                  <h3 className="text-lg font-semibold mb-3">Correcciones Sugeridas</h3>
                  <div className="space-y-3">
                    {corrections.map((correction, idx) => (
                      <div key={idx} className="card p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                        <div className="flex items-start justify-between mb-2">
                          <span className="font-medium text-amber-900 dark:text-amber-200">
                            Campo: {correction.field}
                          </span>
                          <button
                            onClick={() => handleRemoveCorrection(idx)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-muted">Original:</span>
                            <p className="mt-1 text-gray-700 dark:text-gray-300">{correction.original_value}</p>
                          </div>
                          <div>
                            <label className="text-muted block mb-1">Sugerencia:</label>
                            <input
                              type="text"
                              value={correction.suggested_value}
                              onChange={(e) => handleUpdateCorrection(idx, { suggested_value: e.target.value })}
                              className="input-field w-full"
                              placeholder="Valor corregido"
                            />
                          </div>
                          <div>
                            <label className="text-muted block mb-1">Comentario:</label>
                            <textarea
                              value={correction.comment}
                              onChange={(e) => handleUpdateCorrection(idx, { comment: e.target.value })}
                              className="input-field w-full"
                              rows={2}
                              placeholder="Explicación de la corrección"
                            />
                          </div>
                          <div>
                            <label className="text-muted block mb-1">Severidad:</label>
                            <select
                              value={correction.severity}
                              onChange={(e) => handleUpdateCorrection(idx, { severity: e.target.value as FichaCorrection['severity'] })}
                              className="input-field w-full"
                            >
                              <option value="minor">Menor</option>
                              <option value="major">Mayor</option>
                              <option value="critical">Crítica</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Comentarios Generales */}
                <section>
                  <h3 className="text-lg font-semibold mb-2">Comentarios Generales</h3>
                  <textarea
                    value={generalComments}
                    onChange={(e) => setGeneralComments(e.target.value)}
                    disabled={!isPending}
                    className="input-field w-full"
                    rows={4}
                    placeholder="Observaciones generales sobre la ficha..."
                  />
                </section>

                {/* Sugerencias */}
                <section>
                  <h3 className="text-lg font-semibold mb-2">Sugerencias de Mejora</h3>
                  <textarea
                    value={suggestions}
                    onChange={(e) => setSuggestions(e.target.value)}
                    disabled={!isPending}
                    className="input-field w-full"
                    rows={3}
                    placeholder="Recomendaciones para mejorar la ficha..."
                  />
                </section>
              </div>
            )}
          </div>

          {/* Footer con acciones */}
          {isPending && activeTab === 'validation' && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
              <button
                onClick={() => handleSubmitValidation('approve')}
                className="btn-cta bg-green-600 hover:bg-green-700 flex-1 flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Aprobar
              </button>
              <button
                onClick={() => handleSubmitValidation('approve_with_corrections')}
                className="btn-cta bg-blue-600 hover:bg-blue-700 flex-1 flex items-center justify-center gap-2"
              >
                <Edit className="w-5 h-5" />
                Aprobar con correcciones
              </button>
              <button
                onClick={() => handleSubmitValidation('request_changes')}
                className="btn-cta bg-amber-600 hover:bg-amber-700 flex-1 flex items-center justify-center gap-2"
              >
                <AlertCircle className="w-5 h-5" />
                Solicitar cambios
              </button>
              <button
                onClick={() => handleSubmitValidation('reject')}
                className="btn-cta bg-red-600 hover:bg-red-700 flex-1 flex items-center justify-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                Rechazar
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
