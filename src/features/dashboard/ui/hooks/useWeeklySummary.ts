import { useEffect, useState } from 'react';

import { useAuth } from '../../../../context/hooks/useAuth';
import type { WeeklySummary } from '../../core/domain/models/WeeklySummary';
import { weeklySummaryRepository } from '../adapter';

export const useWeeklySummary = () => {
  const { token } = useAuth();

  const [summary, setSummary] = useState<WeeklySummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const result = await weeklySummaryRepository.getWeeklySummary(token);
      setSummary(result);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Error al cargar el resumen semanal';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return { summary, loading, error, refetch: fetchSummary };
};
