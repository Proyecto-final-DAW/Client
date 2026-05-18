import { API_ENDPOINTS } from '@config/api';
import { useAuth } from '@context/hooks/useAuth';
import { cachedGet } from '@shared/api/cachedGet';
import { mapAxiosError } from '@shared/api/error-mapping/mapApiError';
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
    // 60s TTL — the history replay is expensive on the server (walks
    // every session of the user) and the same snapshots are requested
    // again every time the user toggles AHORA / HACE 7D / etc. on the
    // radar. Stale-by-up-to-a-minute is fine; a session save invalidates.
    cachedGet<StatsHistoryPoint[]>(API_ENDPOINTS.getStatsHistory, {
      ttlMs: 60_000,
    })
      .then((data) => {
        if (cancelled) return;
        setHistory(data);
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
