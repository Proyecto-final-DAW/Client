import { useAuth } from '@context/hooks/useAuth';
import { useCallback, useEffect, useState } from 'react';

import type { Session } from '../../core/domain/models/Session';
import { sessionRepository } from '../adapter';

/**
 * Custom-event name fired by anything that creates a session (most
 * commonly the post-workout save in `useFinishWorkout`). Every mounted
 * `useSessionHistory` instance listens for it and silently refetches,
 * so views like the dashboard's "trained today" banner and
 * `/historial` reflect the new session without a full page reload.
 * Mirrors the pattern used by `STATS_CHANGED_EVENT` in `useStats`.
 */
export const SESSION_CHANGED_EVENT = 'gymquest:session-changed';

export const useSessionHistory = () => {
  const { token } = useAuth();

  const [sessions, setSessions] = useState<Session[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Same silent/non-silent split as `useStats`: the first mount (and
  // any caller-initiated `refetch()`) flashes the loading state; the
  // event-driven background refetches don't, so the dashboard doesn't
  // jump to a skeleton every time the user finishes a workout.
  const fetchSessions = useCallback(
    async (silent: boolean): Promise<void> => {
      if (!token) return;

      if (!silent) setLoading(true);
      setError(null);

      try {
        const result = await sessionRepository.getUserSessions();
        setSessions(result);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Error al cargar el historial de sesiones';
        setError(message);
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    if (!token) {
      setSessions(null);
      setLoading(false);
      return;
    }

    void fetchSessions(false);
  }, [token, fetchSessions]);

  useEffect(() => {
    const handler = (): void => {
      void fetchSessions(true);
    };
    window.addEventListener(SESSION_CHANGED_EVENT, handler);
    return () => {
      window.removeEventListener(SESSION_CHANGED_EVENT, handler);
    };
  }, [fetchSessions]);

  return {
    sessions,
    loading,
    error,
    refetch: () => fetchSessions(false),
  };
};
