import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';

import { API_ENDPOINTS } from '@config/api';
import { useAuth } from '@context/hooks/useAuth';

/**
 * Per-session level snapshot in chronological order. Used by the
 * radar's time selector — picking "HACE 7D" finds the latest snapshot
 * whose date is at most 7 days ago and renders the radar with those
 * levels. Tenacidad and vigor live elsewhere (streak/diet rules), so
 * the snapshots only carry the four effort-based pillars.
 */
export interface StatsHistoryPoint {
  date: string;
  strength_level: number;
  endurance_level: number;
  stamina_level: number;
  agility_level: number;
}

export const useStatsHistory = (): {
  history: StatsHistoryPoint[];
  loading: boolean;
  error: string | null;
} => {
  const { token } = useAuth();
  const [history, setHistory] = useState<StatsHistoryPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    axios
      .get<StatsHistoryPoint[]>(API_ENDPOINTS.getStatsHistory)
      .then((response) => {
        if (cancelled) return;
        setHistory(response.data);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        let message = 'Error al cargar el historial de stats';
        if (err instanceof AxiosError) {
          const data = err.response?.data as { message?: string } | undefined;
          if (data?.message) message = data.message;
          else if (err.message) message = err.message;
        } else if (err instanceof Error) {
          message = err.message;
        }
        setError(message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  return { history, loading, error };
};
