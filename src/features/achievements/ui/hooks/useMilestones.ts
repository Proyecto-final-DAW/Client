import { useEffect, useState } from 'react';

import { useAuth } from '../../../../context/hooks/useAuth';
import type { Milestone } from '../../core/domain/models/Milestone';
import { milestonesRepository } from '../adapter';

export const useMilestones = () => {
  const { token } = useAuth();

  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMilestones = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const result = await milestonesRepository.getAllWithStatus(token);
      setMilestones(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al cargar los logros';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMilestones();
  }, [token]);

  return { milestones, loading, error, refetch: fetchMilestones };
};
