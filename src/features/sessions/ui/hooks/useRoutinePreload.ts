import { useEffect, useState } from 'react';

import { useAuth } from '../../../../context/hooks/useAuth';
import type { Exercise } from '../../../exercises/core/domain/models/Exercise';
import type { Routine } from '../../../routines/core/domain/models/Routine';
import { routineRepository } from '../../../routines/ui/adapter';

interface RoutinePreloadResult {
  loading: boolean;
  error: string | null;
  routine: Routine | null;
  exercises: Exercise[];
}

export const useRoutinePreload = (
  routineId: string | null
): RoutinePreloadResult => {
  const { token } = useAuth();

  const [routine, setRoutine] = useState<Routine | null>(null);
  const [loading, setLoading] = useState<boolean>(routineId !== null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!routineId) {
      setRoutine(null);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    routineRepository
      .getRoutines()
      .then((routines) => {
        if (cancelled) return;

        const found = routines.find((item) => item.id === routineId) ?? null;
        if (!found) {
          setError('Rutina no encontrada');
          setRoutine(null);
        } else {
          setRoutine(found);
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : 'Error al cargar la rutina';
        setError(message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [routineId, token]);

  return {
    loading,
    error,
    routine,
    exercises: routine?.exercises ?? [],
  };
};
