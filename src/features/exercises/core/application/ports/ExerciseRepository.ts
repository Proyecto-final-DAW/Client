import type { Exercise } from '../../domain/models/Exercise';

export interface ExerciseSearchResult {
  data: Exercise[];
  total: number;
}

export interface ExerciseRepository {
  searchExercises(
    search?: string,
    muscle?: string,
    token?: string,
    signal?: AbortSignal,
    page?: number,
    limit?: number
  ): Promise<ExerciseSearchResult>;
}
