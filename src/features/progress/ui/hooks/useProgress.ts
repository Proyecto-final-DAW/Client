import { useAuth } from '@context/hooks/useAuth';
import { useCallback, useEffect, useRef, useState } from 'react';

import type {
  Progress,
  RegisterWeightInput,
} from '../../core/domain/models/Progress';
import { progressRepository } from '../adapter';

export const useProgress = () => {
  const { token, user } = useAuth();

  const [weightHistory, setWeightHistory] = useState<Progress[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Block stale responses from a previous-user request landing in
  // this hook's state after a token swap (logout + login as B). Same
  // guard the other dashboard hooks use.
  const cancelledRef = useRef(false);

  const fetchProgress = useCallback(async () => {
    if (!token || !user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const result = await progressRepository.getWeightHistory(user.id);
      if (cancelledRef.current) return;
      setWeightHistory(result);
    } catch (err) {
      if (cancelledRef.current) return;
      const message =
        err instanceof Error
          ? err.message
          : 'No hemos podido cargar tu historial de peso. Recarga la pagina o intentalo mas tarde.';

      setError(message);
    } finally {
      if (!cancelledRef.current) setLoading(false);
    }
  }, [token, user?.id]);

  const addEntry = useCallback(
    async (input: RegisterWeightInput): Promise<boolean> => {
      if (!token || !user?.id) return false;

      setSubmitting(true);
      setSubmitError(null);

      try {
        const created = await progressRepository.registerWeight(user.id, input);

        // Server policy: one row per (user, day) — `registerWeight`
        // DELETEs any existing row for the same date before inserting
        // the new one. Mirror that here so the local state can't drift
        // out of sync with the BD: drop any pre-existing entry with
        // the same calendar day before appending. Without this, tapping
        // REGISTRAR three times in the same day grew the chart to three
        // visually distinct points (all "18 may") even though the BD
        // only kept the last one — confusing the user into thinking the
        // dedupe wasn't working.
        const sameDayKey = `${created.date.getFullYear()}-${created.date.getMonth()}-${created.date.getDate()}`;
        setWeightHistory((current) => {
          const list = current ?? [];
          const withoutSameDay = list.filter((entry) => {
            const k = `${entry.date.getFullYear()}-${entry.date.getMonth()}-${entry.date.getDate()}`;
            return k !== sameDayKey;
          });
          return [...withoutSameDay, created].sort(
            (a, b) => a.date.getTime() - b.date.getTime()
          );
        });
        return true;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'No hemos podido guardar tu peso. Vuelve a intentarlo en un momento.';

        setSubmitError(message);
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [token, user?.id]
  );

  useEffect(() => {
    cancelledRef.current = false;
    if (!token || !user?.id) {
      setWeightHistory(null);
      setError(null);
      setLoading(false);
      return () => {
        cancelledRef.current = true;
      };
    }

    void fetchProgress();
    return () => {
      cancelledRef.current = true;
    };
  }, [token, user?.id, fetchProgress]);

  return {
    weightHistory,
    loading,
    error,
    submitting,
    submitError,
    refetch: fetchProgress,
    addEntry,
  };
};
