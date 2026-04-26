import type { ExerciseProgressPoint } from '../../domain/models/ExerciseProgressPoint';
import type { PerformedExercise } from '../../domain/models/PerformedExercise';
import type {
  Progress,
  RegisterWeightInput,
} from '../../domain/models/Progress';

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
  getWeightHistory(userId: number, token?: string): Promise<Progress[]>;
  registerWeight(
    userId: number,
    input: RegisterWeightInput,
    token?: string
  ): Promise<Progress>;
}
