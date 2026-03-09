import { useEffect, useRef, useState } from 'react';

import { useAuth } from '../../../../context/hooks/useAuth';
import type { Exercise } from '../../core/domain/models/Exercise';
import { exerciseRepository } from '../adapter';

export const MUSCLE_OPTIONS = [
  { label: 'Todos', value: '' },
  { label: 'Pecho', value: 'pectorals' },
  { label: 'Espalda', value: 'lats' },
  { label: 'Hombros', value: 'delts' },
  { label: 'Bíceps', value: 'biceps' },
  { label: 'Tríceps', value: 'triceps' },
  { label: 'Abdominales', value: 'abs' },
  { label: 'Cuádriceps', value: 'quads' },
  { label: 'Isquiotibiales', value: 'hamstrings' },
  { label: 'Glúteos', value: 'glutes' },
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

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      if (!search && !muscle) {
        setExercises([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await exerciseRepository.searchExercises(
          search || undefined,
          muscle || undefined,
          token ?? undefined
        );
        setExercises(result);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Error al buscar ejercicios';
        setError(message);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [search, muscle, token]);

  return {
    search,
    setSearch,
    muscle,
    setMuscle,
    exercises,
    loading,
    error,
  };
};
