import type { Routine } from '../../domain/models/Routine';

export interface RoutineRepository {
  getRoutines(token?: string): Promise<Routine[]>;
  createRoutine(name: string, token?: string): Promise<Routine>;
  deleteRoutine(routineId: string, token?: string): Promise<void>;
  addExercise(
    routineId: string,
    exerciseId: string,
    token?: string
  ): Promise<Routine>;
  removeExercise(
    routineId: string,
    exerciseId: string,
    token?: string
  ): Promise<Routine>;
  reorderExercises(
    routineId: string,
    order: string[],
    token?: string
  ): Promise<Routine>;
}
