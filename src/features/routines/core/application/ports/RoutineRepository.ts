import type { Routine } from '../../domain/models/Routine';

export interface RoutineRepository {
  getRoutines(): Promise<Routine[]>;
  createRoutine(name: string): Promise<Routine>;
  deleteRoutine(routineId: string): Promise<void>;
  addExercise(routineId: string, exerciseId: string): Promise<Routine>;
  removeExercise(routineId: string, exerciseId: string): Promise<Routine>;
  reorderExercises(routineId: string, order: string[]): Promise<Routine>;
}
