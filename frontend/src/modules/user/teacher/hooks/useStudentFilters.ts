import { useMemo, useState } from 'react';
import type { StudentSummary } from '../types';
import type { StudentFilters } from '../components/FiltersBar';

/**
 * Hook para gestionar filtrado y ordenamiento de estudiantes
 */
export function useStudentFilters(students: StudentSummary[]) {
  const [filters, setFilters] = useState<StudentFilters>({
    search: '',
    grade: '',
    section: '',
    sortBy: 'points',
    sortOrder: 'desc',
  });

  // Obtener grados únicos
  const grades = useMemo(() => {
    const uniqueGrades = new Set(students.map(s => s.grade));
    return Array.from(uniqueGrades).sort();
  }, [students]);

  // Obtener secciones únicas
  const sections = useMemo(() => {
    const uniqueSections = new Set(students.map(s => s.section));
    return Array.from(uniqueSections).sort();
  }, [students]);

  // Filtrar y ordenar estudiantes
  const filteredStudents = useMemo(() => {
    let result = [...students];

    // Filtro de búsqueda (nombre o username)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(student =>
        student.full_name.toLowerCase().includes(searchLower) ||
        student.username.toLowerCase().includes(searchLower)
      );
    }

    // Filtro por grado
    if (filters.grade) {
      result = result.filter(student => student.grade === filters.grade);
    }

    // Filtro por sección
    if (filters.section) {
      result = result.filter(student => student.section === filters.section);
    }

    // Ordenamiento
    result.sort((a, b) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case 'name':
          comparison = a.full_name.localeCompare(b.full_name);
          break;
        case 'points':
          comparison = a.points - b.points;
          break;
        case 'completion':
          const aCompletion = a.activities_completed / a.activities_total;
          const bCompletion = b.activities_completed / b.activities_total;
          comparison = aCompletion - bCompletion;
          break;
      }

      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [students, filters]);

  return {
    filters,
    setFilters,
    filteredStudents,
    grades,
    sections,
    totalStudents: students.length,
    filteredCount: filteredStudents.length,
  };
}
