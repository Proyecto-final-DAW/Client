import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '../../../../context/hooks/useAuth';
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

  const fetchProgress = useCallback(async () => {
    if (!token || !user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const result = await progressRepository.getWeightHistory(user.id, token);
      setWeightHistory(result);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Error al cargar el historial de peso';

      setError(message);
    } finally {
      setLoading(false);
    }
  }, [token, user?.id]);

  const addEntry = async (input: RegisterWeightInput): Promise<boolean> => {
    if (!token || !user?.id) return false;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const created = await progressRepository.registerWeight(
        user.id,
        input,
        token
      );

      setWeightHistory((current) => [...(current ?? []), created]);
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al registrar el peso';

      setSubmitError(message);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!token || !user?.id) {
      setWeightHistory(null);
      setLoading(false);
      return;
    }

    fetchProgress();
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
