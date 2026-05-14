import { useEffect, useState } from 'react';

import { useAuth } from '../../../../context/hooks/useAuth';
import type { StreakStatus } from '../../core/domain/models/StreakStatus';
import { streakRepository } from '../adapter';

export const useStreakStatus = () => {
  const { token } = useAuth();
  const authToken = token ?? undefined;

  const [status, setStatus] = useState<StreakStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    streakRepository
      .getStatus(authToken)
      .then((result) => {
        if (!cancelled) setStatus(result);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : 'Error al cargar la racha';
        setError(message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [authToken]);

  return { status, loading, error };
};
