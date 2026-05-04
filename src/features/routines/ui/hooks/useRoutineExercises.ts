import { useState } from 'react';

import { useAuth } from '../../../../context/hooks/useAuth';
import type { Exercise } from '../../../exercises/core/domain/models/Exercise';
import type { Routine } from '../../core/domain/models/Routine';
import { routineRepository } from '../adapter';

type UseRoutineExercisesParams = {
  routine: Routine | null;
  // Replaces a single routine in local state with the updated copy returned
  // by the repository. Used instead of a full refetch so we don't toggle the
  // page-level loading flag (which would unmount RoutineDetail and reset its
  // editing state mid-edit).
  onRoutineUpdated: (routine: Routine) => void;
};

export const useRoutineExercises = ({
  routine,
  onRoutineUpdated,
}: UseRoutineExercisesParams) => {
  const { token } = useAuth();
  const authToken = token ?? undefined;

  const [error, setError] = useState<string | null>(null);

  const addExercise = async (exercise: Exercise) => {
    if (!routine) return;

    setError(null);
    try {
      const updated = await routineRepository.addExercise(
        routine,
        exercise,
        authToken
      );
      onRoutineUpdated(updated);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al añadir el ejercicio'
      );
    }
  };

  const removeExercise = async (exerciseId: string) => {
    if (!routine) return;

    setError(null);
    try {
      const updated = await routineRepository.removeExercise(
        routine,
        exerciseId,
        authToken
      );
      onRoutineUpdated(updated);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al eliminar el ejercicio'
      );
    }
  };

  const moveExercise = async (exerciseId: string, direction: 'up' | 'down') => {
    if (!routine) return;

    const index = routine.exercises.findIndex((e) => e.id === exerciseId);
    if (index === -1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= routine.exercises.length) return;

    const next = [...routine.exercises];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];

    setError(null);
    try {
      const updated = await routineRepository.reorderExercises(
        routine,
        next,
        authToken
      );
      onRoutineUpdated(updated);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al reordenar los ejercicios'
      );
    }
  };

  return {
    addExercise,
    removeExercise,
    moveExercise,
    error,
  };
};
