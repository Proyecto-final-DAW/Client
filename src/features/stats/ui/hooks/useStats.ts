import { useAuth } from '@context/hooks/useAuth';
import { useCallback, useEffect, useState } from 'react';

import type { UserStats } from '../../core/domain/models/UserStats';
import { statsRepository } from '../adapter';

/**
 * Custom-event name fired by anything that writes to the user's stats
 * (workout save, diet log, etc.). Every mounted `useStats` hook
 * listens for it and refetches, so a vigor bump from a diet log is
 * reflected on the dashboard the moment the user navigates back —
 * without having to plumb a global stats context through the whole
 * app or rely on remount-only refresh.
 */
export const STATS_CHANGED_EVENT = 'gymquest:stats-changed';

export const useStats = () => {
  const { token } = useAuth();

  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // `loading` flips true only on the first fetch, so background
  // refetches (triggered by STATS_CHANGED_EVENT after a workout / diet
  // log) don't blank the StatsPanel + replay its staggered cascade
  // every time. The new data swaps in silently and the bars animate
  // their fills only when the underlying numbers actually move.
  const fetchStats = useCallback(
    async (silent: boolean): Promise<void> => {
      if (!token) return;

      if (!silent) setLoading(true);
      setError(null);

      try {
        const result = await statsRepository.getStats();
        setStats(result);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Error al cargar los stats';
        setError(message);
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    void fetchStats(false);
  }, [fetchStats]);

  // Sibling components (diet, workout) signal stat changes via a window
  // event so any mounted `useStats` instance picks them up without
  // needing a shared store. Lightweight pub-sub for a small app. The
  // refetch is silent (no loading flip) because the StatsPanel is
  // already on screen and shouldn't go back to its skeleton.
  useEffect(() => {
    const handler = (): void => {
      void fetchStats(true);
    };
    window.addEventListener(STATS_CHANGED_EVENT, handler);
    return () => {
      window.removeEventListener(STATS_CHANGED_EVENT, handler);
    };
  }, [fetchStats]);

  // Public `refetch` is non-silent (caller-initiated refreshes deserve
  // the spinner). The silent path is reserved for the internal event
  // listener above. Wrapped in useCallback so it's a stable
  // reference — consumers using it as an effect dep don't re-run.
  const refetch = useCallback(() => fetchStats(false), [fetchStats]);
  return { stats, loading, error, refetch };
};
