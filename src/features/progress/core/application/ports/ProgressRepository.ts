import type { ExerciseProgressPoint } from '../../domain/models/ExerciseProgressPoint';
import type { PerformedExercise } from '../../domain/models/PerformedExercise';

export interface ProgressRepository {
  getPerformedExercises(
    userId: number,
    token: string
  ): Promise<PerformedExercise[]>;
  getExerciseProgress(
    userId: number,
    exerciseId: string,
    token: string
  ): Promise<ExerciseProgressPoint[]>;
}
