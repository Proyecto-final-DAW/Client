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
  useAuth();

  const addExercise = async (exerciseId: string) => {
    try {
      await routineRepository.addExercise(routineId, exerciseId);
      await refetchRoutines();
    } catch (err) {
      err instanceof Error ? err.message : 'Error al añadir el ejercicio';
    }
  };

  const removeExercise = async (exerciseId: string) => {
    try {
      await routineRepository.removeExercise(routineId, exerciseId);
      await refetchRoutines();
    } catch (err) {
      err instanceof Error ? err.message : 'Error al eliminar el ejercicio';
    }
  };

  return {
    addExercise,
    removeExercise,
  };
};
