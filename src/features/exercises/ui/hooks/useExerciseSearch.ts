import { useCallback, useEffect, useRef, useState } from 'react';

import { useAuth } from '../../../../context/hooks/useAuth';
import type { Exercise } from '../../core/domain/models/Exercise';
import { exerciseRepository } from '../adapter';

const PAGE_SIZE = 9;

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
