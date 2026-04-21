import { useState } from 'react';

import { useAuth } from '../../../../context/hooks/useAuth';
import { routineRepository } from '../adapter';

type UseRoutineExercisesParams = {
  routineId: string;
  refetchRoutines: () => Promise<void>;
};

export const useRoutineExercises = ({
  routineId,
  refetchRoutines,
}: UseRoutineExercisesParams) => {
  const { token } = useAuth();
  const authToken = token ?? undefined;

  const [error, setError] = useState<string | null>(null);

  const addExercise = async (exerciseId: string) => {
    if (!routineId) return;

    setError(null);

    try {
      await routineRepository.addExercise(routineId, exerciseId, authToken);
      await refetchRoutines();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al añadir el ejercicio';
      setError(message);
    }
  };

  const removeExercise = async (exerciseId: string) => {
    if (!routineId) return;

    setError(null);

    try {
      await routineRepository.removeExercise(routineId, exerciseId, authToken);
      await refetchRoutines();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al eliminar el ejercicio';
      setError(message);
    }
  };

  return {
    error,
    addExercise,
    removeExercise,
  };
};
