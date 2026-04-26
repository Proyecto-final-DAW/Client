import { useEffect, useState } from 'react';

import { useAuth } from '../../../../context/hooks/useAuth';
import type { PerformedExercise } from '../../core/domain/models/PerformedExercise';
import { progressRepository } from '../adapter';

export const usePerformedExercises = () => {
  const { token, user } = useAuth();

  const [exercises, setExercises] = useState<PerformedExercise[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !user) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    progressRepository
      .getPerformedExercises(user.id, token)
      .then((result) => {
        if (cancelled) return;
        setExercises(result);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : 'Error al cargar los ejercicios';
        setError(message);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token, user]);

  return { exercises, loading, error };
};
