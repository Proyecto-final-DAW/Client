import type { Exercise } from '../../../../exercises/core/domain/models/Exercise';
import type { Routine } from '../../domain/models/Routine';

export interface RoutineRepository {
  getRoutines(token?: string): Promise<Routine[]>;
  createRoutine(name: string, token?: string): Promise<Routine>;
  addExercise(
    routine: Routine,
    exercise: Exercise,
    token?: string
  ): Promise<Routine>;
  removeExercise(
    routine: Routine,
    exerciseId: string,
    token?: string
  ): Promise<Routine>;
  reorderExercises(
    routine: Routine,
    exercises: Exercise[],
    token?: string
  ): Promise<Routine>;
  deleteRoutine(routineId: string, token?: string): Promise<void>;
}
