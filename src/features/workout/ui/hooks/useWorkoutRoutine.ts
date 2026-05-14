import { useEffect, useState } from 'react';

import { useAuth } from '../../../../context/hooks/useAuth';
import type { Routine } from '../../../routines/core/domain/models/Routine';
import { routineRepository } from '../../../routines/ui/adapter';

export const useWorkoutRoutine = (routineId: string | undefined) => {
  const { token } = useAuth();
  const authToken = token ?? undefined;

  const [routine, setRoutine] = useState<Routine | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!routineId) {
      setError('Falta el identificador de la rutina');
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    routineRepository
      .getRoutines(authToken)
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
      .catch((err) => {
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
  }, [routineId, authToken]);

  return { routine, loading, error };
};
