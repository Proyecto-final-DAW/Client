import { useEffect, useState } from 'react';

import { useAuth } from '../../../../context/hooks/useAuth';
import type { ExerciseProgressPoint } from '../../core/domain/models/ExerciseProgressPoint';
import { progressRepository } from '../adapter';

export const useExerciseProgress = (exerciseId: string | null) => {
  const { token, user } = useAuth();

  const [points, setPoints] = useState<ExerciseProgressPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !user || !exerciseId) {
      setPoints([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    progressRepository
      .getExerciseProgress(user.id, exerciseId)
      .then((result) => {
        if (cancelled) return;
        setPoints(result);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : 'Error al cargar la progresion';
        setError(message);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token, user, exerciseId]);

  return { points, loading, error };
};
