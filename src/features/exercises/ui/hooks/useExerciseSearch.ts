import { useAuth } from '@context/hooks/useAuth';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { Exercise } from '../../core/domain/models/Exercise';
import { exerciseRepository } from '../adapter';

// 6 cards per page so the picker never feels like a wall of text.
// On mobile (2 cols) the page renders 3 rows that fit the viewport
// without scrolling past the search bar. On sm (3 cols) it's 2 rows;
// on lg (4 cols) one full row + a half-row sits comfortably above
// the pagination strip. The user explicitly asked to "no saturar
// tanto ni hacer tanto scroll" when filtering by muscle group.
const PAGE_SIZE = 6;

export const MUSCLE_OPTIONS = [
  { label: 'Todos', value: '' },
  { label: 'Pecho', value: 'pectorals' },
  { label: 'Espalda', value: 'lats' },
  { label: 'Hombros', value: 'delts' },
  { label: 'Biceps', value: 'biceps' },
  { label: 'Triceps', value: 'triceps' },
  { label: 'Abdominales', value: 'abs' },
  { label: 'Cuadriceps', value: 'quads' },
  { label: 'Isquiotibiales', value: 'hamstrings' },
  { label: 'Gluteos', value: 'glutes' },
  { label: 'Gemelos', value: 'calves' },
  { label: 'Trapecios', value: 'traps' },
];

export const useExerciseSearch = () => {
  const { token } = useAuth();

  const [search, setSearch] = useState('');
  const [muscle, setMuscle] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchPage = useCallback(
    async (targetPage: number) => {
      if (!search && !muscle) {
        setExercises([]);
        setTotalPages(0);
        return;
      }

      if (abortRef.current) {
        abortRef.current.abort();
      }
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        const result = await exerciseRepository.searchExercises(
          search || undefined,
          muscle || undefined,
          token ?? undefined,
          controller.signal,
          targetPage,
          PAGE_SIZE
        );
        setExercises(result.data);
        setTotalPages(Math.ceil(result.total / PAGE_SIZE));
        setPage(targetPage);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        if (
          typeof err === 'object' &&
          err !== null &&
          'code' in err &&
          (err as { code: string }).code === 'ERR_CANCELED'
        )
          return;

        const message =
          err instanceof Error ? err.message : 'Error al buscar ejercicios';
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [search, muscle, token]
  );

  // Busqueda con debounce al cambiar filtros
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchPage(1);
    }, 400);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [search, muscle, fetchPage]);

  const goToPage = useCallback(
    (targetPage: number) => {
      if (targetPage >= 1 && targetPage <= totalPages) {
        fetchPage(targetPage);
      }
    },
    [fetchPage, totalPages]
  );

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, []);

  return {
    search,
    setSearch,
    muscle,
    setMuscle,
    exercises,
    loading,
    error,
    page,
    totalPages,
    goToPage,
  };
};
