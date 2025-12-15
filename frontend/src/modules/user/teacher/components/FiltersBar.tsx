import { Search, Filter, SortAsc, SortDesc, X } from 'lucide-react';
import { useState } from 'react';

export interface StudentFilters {
  search: string;
  grade: string;
  section: string;
  sortBy: 'name' | 'points' | 'completion';
  sortOrder: 'asc' | 'desc';
}

interface FiltersBarProps {
  filters: StudentFilters;
  onFiltersChange: (filters: StudentFilters) => void;
  grades: string[];
  sections: string[];
}

export default function FiltersBar({ filters, onFiltersChange, grades, sections }: FiltersBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (key: keyof StudentFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      grade: '',
      section: '',
      sortBy: 'points',
      sortOrder: 'desc',
    });
  };

  const hasActiveFilters = filters.search || filters.grade || filters.section;

  return (
    <div className="card p-4 space-y-4">
      {/* Búsqueda Principal */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
          <input
            type="text"
            placeholder="Buscar por nombre o usuario..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            style={{ color: 'var(--color-texto)' }}
          />
        </div>

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`btn ${showAdvanced ? 'btn-primary' : 'btn-secondary'} flex items-center gap-2 whitespace-nowrap`}
        >
          <Filter className="w-4 h-4" />
          Filtros Avanzados
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="btn btn-secondary flex items-center gap-2 whitespace-nowrap"
            title="Limpiar filtros"
          >
            <X className="w-4 h-4" />
            Limpiar
          </button>
        )}
      </div>

      {/* Filtros Avanzados */}
      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          {/* Filtro por Grado */}
          <div>
            <label className="block text-sm font-medium mb-1 text-muted">
              Grado
            </label>
            <select
              value={filters.grade}
              onChange={(e) => handleChange('grade', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              style={{ color: 'var(--color-texto)' }}
            >
              <option value="">Todos los grados</option>
              {grades.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Sección */}
          <div>
            <label className="block text-sm font-medium mb-1 text-muted">
              Sección
            </label>
            <select
              value={filters.section}
              onChange={(e) => handleChange('section', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              style={{ color: 'var(--color-texto)' }}
            >
              <option value="">Todas las secciones</option>
              {sections.map((section) => (
                <option key={section} value={section}>
                  Sección {section}
                </option>
              ))}
            </select>
          </div>

          {/* Ordenar por */}
          <div>
            <label className="block text-sm font-medium mb-1 text-muted">
              Ordenar por
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleChange('sortBy', e.target.value as StudentFilters['sortBy'])}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              style={{ color: 'var(--color-texto)' }}
            >
              <option value="points">Puntos</option>
              <option value="name">Nombre</option>
              <option value="completion">% Completitud</option>
            </select>
          </div>

          {/* Orden */}
          <div>
            <label className="block text-sm font-medium mb-1 text-muted">
              Orden
            </label>
            <button
              onClick={() => handleChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {filters.sortOrder === 'asc' ? (
                <>
                  <SortAsc className="w-4 h-4" />
                  <span>Ascendente</span>
                </>
              ) : (
                <>
                  <SortDesc className="w-4 h-4" />
                  <span>Descendente</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Resumen de filtros activos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2">
          {filters.search && (
            <span className="pill pill-blue flex items-center gap-1">
              Búsqueda: "{filters.search}"
              <button
                onClick={() => handleChange('search', '')}
                className="hover:text-blue-800 dark:hover:text-blue-200"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.grade && (
            <span className="pill pill-green flex items-center gap-1">
              Grado: {filters.grade}
              <button
                onClick={() => handleChange('grade', '')}
                className="hover:text-green-800 dark:hover:text-green-200"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.section && (
            <span className="pill pill-amber flex items-center gap-1">
              Sección: {filters.section}
              <button
                onClick={() => handleChange('section', '')}
                className="hover:text-amber-800 dark:hover:text-amber-200"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
