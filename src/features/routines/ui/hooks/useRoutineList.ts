import { useEffect, useState } from 'react';

import { useAuth } from '../../../../context/hooks/useAuth';
import type { Routine } from '../../core/domain/models/Routine';
import { routineRepository } from '../adapter';

export const useRoutineList = () => {
  const { token } = useAuth();

  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoutines = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const result = await routineRepository.getRoutines(token);
      setRoutines(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al cargar las rutinas';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutines();
  }, [token]);

  return { routines, loading, error, refetch: fetchRoutines };
};
