import type { ExerciseProgressPoint } from '../../domain/models/ExerciseProgressPoint';
import type { PerformedExercise } from '../../domain/models/PerformedExercise';
import type {
  Progress,
  RegisterWeightInput,
} from '../../domain/models/Progress';

export interface ProgressRepository {
  getPerformedExercises(userId: number): Promise<PerformedExercise[]>;
  getExerciseProgress(
    userId: number,
    exerciseId: string
  ): Promise<ExerciseProgressPoint[]>;
  getWeightHistory(userId: number): Promise<Progress[]>;
  registerWeight(userId: number, input: RegisterWeightInput): Promise<Progress>;
}
