import { useAuth } from '@context/hooks/useAuth';
import { mapAxiosError } from '@shared/api/error-mapping/mapApiError';
import { useCallback, useEffect, useState } from 'react';

import type { Milestone } from '../../core/domain/models/Milestone';
import { milestonesRepository } from '../adapter';

export const useMilestones = () => {
  const { token } = useAuth();

  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // useCallback so the `fetchMilestones` reference is stable across
  // renders, which lets the effect below depend on it without an
  // exhaustive-deps suppression. Without it, the effect would either
  // refetch every render (expensive) or rely on the eslint disable
  // (silent drift).
  const fetchMilestones = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const result = await milestonesRepository.getAllWithStatus();
      setMilestones(result);
    } catch (err) {
      setError(
        mapAxiosError(
          err,
          'No hemos podido cargar tus logros. Recarga la pagina o intentalo mas tarde.'
        )
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void fetchMilestones();
  }, [fetchMilestones]);

  return { milestones, loading, error, refetch: fetchMilestones };
};
