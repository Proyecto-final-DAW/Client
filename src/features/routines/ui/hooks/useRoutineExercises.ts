import { useState } from 'react';

import { useAuth } from '../../../../context/hooks/useAuth';
import type { Exercise } from '../../../exercises/core/domain/models/Exercise';
import type { Routine } from '../../core/domain/models/Routine';
import { routineRepository } from '../adapter';

type UseRoutineExercisesParams = {
  routine: Routine | null;
  refetchRoutines: () => Promise<void>;
};

export const useRoutineExercises = ({
  routine,
  refetchRoutines,
}: UseRoutineExercisesParams) => {
  const { token } = useAuth();
  const authToken = token ?? undefined;

  const [error, setError] = useState<string | null>(null);

  const addExercise = async (exercise: Exercise) => {
    if (!routine) return;

    setError(null);
    try {
      await routineRepository.addExercise(routine, exercise, authToken);
      await refetchRoutines();
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
      await routineRepository.removeExercise(routine, exerciseId, authToken);
      await refetchRoutines();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al eliminar el ejercicio'
      );
    }
  };

  return {
    addExercise,
    removeExercise,
    error,
  };
};
