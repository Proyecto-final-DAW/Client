import { useEffect, useState } from 'react';

import { useAuth } from '@context/hooks/useAuth';
import { STATS_CHANGED_EVENT } from '../../../stats/ui/hooks/useStats';
import type { DietLogGains } from '../../core/domain/models/DietLogGains';
import type { DietStreakState } from '../../core/domain/models/DietStreakState';
import { dietRepository } from '../adapter';

/**
 * Reads the user's diet-log streak and exposes a `logToday` action.
 * `logToday` is idempotent on the server, so a double-click can't
 * double-count — the local state simply syncs to whatever the server
 * returns.
 *
 * `lastGains` carries the vigor XP movement from the most recent
 * non-idempotent log call, so the UI can show the stat-up popup. It
 * stays set until the consumer calls `clearLastGains()` (typically
 * when the modal closes).
 */
export const useDietStreak = (): {
  state: DietStreakState | null;
  loading: boolean;
  logging: boolean;
  error: string | null;
  logToday: () => Promise<void>;
  lastGains: DietLogGains | null;
  clearLastGains: () => void;
} => {
  const { token } = useAuth();
  const [state, setState] = useState<DietStreakState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [logging, setLogging] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastGains, setLastGains] = useState<DietLogGains | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    dietRepository
      .getStreakState()
      .then((next) => {
        if (!cancelled) setState(next);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : 'Error al cargar la dieta';
        setError(message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const logToday = async (): Promise<void> => {
    setLogging(true);
    setError(null);
    try {
      const result = await dietRepository.logToday();
      setState(result.state);
      if (result.gains) setLastGains(result.gains);
      // Vigor (and the diet streak) just changed server-side; broadcast
      // so any mounted `useStats` refetches and the dashboard's vigor
      // bar reflects the +10 immediately on next paint.
      window.dispatchEvent(new Event(STATS_CHANGED_EVENT));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'No se pudo registrar la dieta';
      setError(message);
    } finally {
      setLogging(false);
    }
  };

  const clearLastGains = (): void => setLastGains(null);

  return {
    state,
    loading,
    logging,
    error,
    logToday,
    lastGains,
    clearLastGains,
  };
};
