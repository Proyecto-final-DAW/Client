import type { RoutineRepository } from '../core/application/ports/RoutineRepository';
import { APIRoutineRepository } from '../core/infrastructure/adapters/api-routine-repository/APIRoutineRepository';
import { MockRoutineRepository } from '../core/infrastructure/adapters/mock-routine-repository/MockRoutineRepository';

// TODO: switch to 'api' once routines endpoints are available
export const ACTIVE_ADAPTER: 'api' | 'mock' = 'mock';

export const ADAPTERS = {
  api: new APIRoutineRepository(),
  mock: new MockRoutineRepository(),
};

export const routineRepository: RoutineRepository = ADAPTERS[ACTIVE_ADAPTER];
//f
