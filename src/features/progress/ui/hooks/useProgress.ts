import { useEffect, useState } from 'react';

import { useAuth } from '../../../../context/hooks/useAuth';
import type { Progress } from '../../core/domain/models/Progress';
import { progressRepository } from '../adapter';

export const useProgress = () => {
  const { token, user } = useAuth();

  const [weightHistory, setWeightHistory] = useState<Progress[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = async () => {
    if (!token || !user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const result = await progressRepository.getWeightHistory(
        String(user.id),
        token
      );
      setWeightHistory(result);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Error al cargar el historial de peso';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || !user?.id) {
      setWeightHistory(null);
      setLoading(false);
      return;
    }

    fetchProgress();
  }, [token, user?.id]);

  return {
    weightHistory,
    loading,
    error,
    refetch: fetchProgress,
  };
};
