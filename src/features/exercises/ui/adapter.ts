import type { ExerciseRepository } from '../core/application/ports/ExerciseRepository';
import { APIExerciseRepository } from '../core/infrastructure/adapters/api-exercise-repository/APIExerciseRepository';
import { MockExerciseRepository } from '../core/infrastructure/adapters/mock-exercise-repository/MockExerciseRepository';

export const ACTIVE_ADAPTER: 'api' | 'mock' = 'api';

export const ADAPTERS = {
  api: new APIExerciseRepository(),
  mock: new MockExerciseRepository(),
};

export const exerciseRepository: ExerciseRepository = ADAPTERS[ACTIVE_ADAPTER];
