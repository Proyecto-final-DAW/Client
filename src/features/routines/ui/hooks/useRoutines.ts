import { useEffect, useMemo, useState } from 'react';

import { useAuth } from '../../../../context/hooks/useAuth';
import type { Routine } from '../../core/domain/models/Routine';
import { routineRepository } from '../adapter';

export const useRoutines = () => {
  const { token } = useAuth();

  const [fetchedRoutines, setFetchedRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoutineId, setSelectedRoutineId] = useState<string>('');

  const fetchRoutines = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await routineRepository.getRoutines();
      setFetchedRoutines(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al cargar las rutinas';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchRoutines();
  }, [token]);

  useEffect(() => {
    setSelectedRoutineId((currentSelectedId) => {
      const stillExists = fetchedRoutines.some(
        (routine) => routine.id === currentSelectedId
      );

      if (stillExists) return currentSelectedId;

      return fetchedRoutines.length > 0 ? fetchedRoutines[0].id : '';
    });
  }, [fetchedRoutines]);

  const selectedRoutine = useMemo(
    () =>
      fetchedRoutines.find((routine) => routine.id === selectedRoutineId) ??
      null,
    [fetchedRoutines, selectedRoutineId]
  );

  const selectRoutine = (routineId: string) => {
    setSelectedRoutineId(routineId);
  };

  const createRoutine = async (name: string) => {
    const trimmedName = name.trim();

    if (!trimmedName) return;

    setError(null);

    try {
      const createdRoutine = await routineRepository.createRoutine(trimmedName);

      await fetchRoutines();
      setSelectedRoutineId(createdRoutine.id);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al crear la rutina';
      setError(message);
    }
  };

  const deleteRoutine = async (routineId: string) => {
    setError(null);

    try {
      await routineRepository.deleteRoutine(routineId);
      await fetchRoutines();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al eliminar la rutina';
      setError(message);
    }
  };

  return {
    routines: fetchedRoutines,
    selectedRoutine,
    selectedRoutineId,
    loading,
    error,
    refetch: fetchRoutines,
    createRoutine,
    deleteRoutine,
    selectRoutine,
  };
};
