import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '../../../../context/hooks/useAuth';
import type { Diet } from '../../core/domain/models/Diet';
import { dietRepository } from '../adapter';

export const useDiet = () => {
  const { token, user } = useAuth();
  const authToken = token ?? undefined;

  const [diet, setDiet] = useState<Diet | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDiet = useCallback(async () => {
    if (!user?.id) {
      setDiet(null);
      setLoading(false);
      return;
    }

    setError(null);

    try {
      const result = await dietRepository.getDiet(user.id, authToken);
      setDiet(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al cargar la dieta';

      setError(message);
    }
  }, [user?.id, authToken]);

  useEffect(() => {
    setLoading(true);
    void fetchDiet().finally(() => setLoading(false));
  }, [fetchDiet]);

  const refetch = async () => {
    setRefreshing(true);
    await fetchDiet();
    setRefreshing(false);
  };

  return {
    diet,
    loading,
    refreshing,
    error,
    refetch,
  };
};
