import type { RoutineRepository } from '../core/application/ports/RoutineRepository';
import { APIRoutineRepository } from '../core/infrastructure/adapters/api-routine-repository/ApiRoutineRepository';
import { MockRoutineRepository } from '../core/infrastructure/adapters/mock-routine-repository/MockRoutineRepository';

export const ACTIVE_ADAPTER: 'api' | 'mock' = 'mock';

export const REPOSITORIES = {
  api: new APIRoutineRepository(),
  mock: new MockRoutineRepository(),
};

export const routineRepository: RoutineRepository =
  REPOSITORIES[ACTIVE_ADAPTER];
