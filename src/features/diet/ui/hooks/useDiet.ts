import { useEffect, useState } from 'react';

import { useAuth } from '../../../../context/hooks/useAuth';
import type { Diet } from '../../core/domain/models/Diet';
import { dietRepository } from '../adapter';

export const useDiet = () => {
  const { token, user } = useAuth();

  const [diet, setDiet] = useState<Diet | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDiet = async () => {
    if (!token || !user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const result = await dietRepository.getDiet(String(user.id), token);
      setDiet(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al cargar la dieta';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || !user?.id) {
      setDiet(null);
      setLoading(false);
      return;
    }

    fetchDiet();
  }, [token, user?.id]);

  return {
    diet,
    loading,
    error,
    refetch: fetchDiet,
  };
};
