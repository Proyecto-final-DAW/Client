import { API_ENDPOINTS } from '@config/api';
import { useAuth } from '@context/hooks/useAuth';
import { mapAxiosError } from '@shared/api/error-mapping/mapApiError';
import axios from 'axios';
import { useEffect, useState } from 'react';

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
    // Reset state on token change so a previous user's history isn't
    // visible while the new user's request is in flight (or after
    // logout when token drops to undefined).
    if (!token) {
      setHistory([]);
      setError(null);
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
        setError(
          mapAxiosError(
            err,
            'No hemos podido cargar tu historial de estadisticas. Recarga la pagina o intentalo mas tarde.'
          )
        );
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
