import type { Exercise } from '../../domain/models/Exercise';

export interface ExerciseRepository {
  searchExercises(
    search?: string,
    muscle?: string,
    token?: string
  ): Promise<Exercise[]>;
}
