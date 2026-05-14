import { useEffect, useState } from 'react';

import { useAuth } from '../../../../context/hooks/useAuth';
import type { UserStats } from '../../core/domain/models/UserStats';
import { statsRepository } from '../adapter';

export const useStats = () => {
  const { token } = useAuth();

  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const result = await statsRepository.getStats();
      setStats(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al cargar los stats';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [token]);

  return { stats, loading, error, refetch: fetchStats };
};
