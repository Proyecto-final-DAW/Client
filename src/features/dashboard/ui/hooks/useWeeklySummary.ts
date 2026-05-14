import { useAuth } from '@context/hooks/useAuth';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { WeeklySummary } from '../../core/domain/models/WeeklySummary';
import { weeklySummaryRepository } from '../adapter';

export const useWeeklySummary = () => {
  const { token } = useAuth();

  const [summary, setSummary] = useState<WeeklySummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Mirrors the cancellation pattern used in useCards/useStats: if the
  // user logs out (token flips) while a request is mid-flight, the
  // response from the previous user must NOT land in this hook's state
  // — otherwise the new user briefly sees the previous account's
  // weekly summary.
  const cancelledRef = useRef(false);

  const fetchSummary = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const result = await weeklySummaryRepository.getWeeklySummary();
      if (cancelledRef.current) return;
      setSummary(result);
    } catch (err) {
      if (cancelledRef.current) return;
      const message =
        err instanceof Error
          ? err.message
          : 'No hemos podido cargar tu resumen semanal. Recarga la pagina o intentalo mas tarde.';
      setError(message);
    } finally {
      if (!cancelledRef.current) setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    cancelledRef.current = false;
    void fetchSummary();
    return () => {
      cancelledRef.current = true;
    };
  }, [fetchSummary]);

  return { summary, loading, error, refetch: fetchSummary };
};
