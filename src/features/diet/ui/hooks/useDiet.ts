import { useEffect, useState } from 'react';

import { useAuth } from '@context/hooks/useAuth';
import type { Diet } from '../../core/domain/models/Diet';
import { dietRepository } from '../adapter';

export const useDiet = () => {
  const { token, user } = useAuth();

  const [diet, setDiet] = useState<Diet | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Effect-scoped fetch with a `cancelled` flag so a switch of user
  // (logout → login as a different account) doesn't race the in-flight
  // request and apply *user A's* result on top of *user B's* state.
  // Also resets `error` and `diet` on the no-user branch — without
  // this, a stale error from the previous session persisted across
  // logout into the new login screen.
  useEffect(() => {
    if (!user?.id) {
      setDiet(null);
      setError(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    dietRepository
      .getDiet(user.id)
      .then((result) => {
        if (cancelled) return;
        setDiet(result);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : 'Error al cargar la dieta';
        setError(message);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user?.id, token]);

  const refetch = async (): Promise<void> => {
    if (!user?.id) return;
    setRefreshing(true);
    setError(null);
    try {
      const result = await dietRepository.getDiet(user.id);
      setDiet(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al cargar la dieta';
      setError(message);
    } finally {
      setRefreshing(false);
    }
  };

  return {
    diet,
    loading,
    refreshing,
    error,
    refetch,
  };
};
