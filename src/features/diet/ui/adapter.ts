import type { DietRepository } from '../core/application/ports/DietRepository';
import { APIDietRepository } from '../core/infrastructure/adapters/api-diet-repository/APIDietRepository';
import { MockDietRepository } from '../core/infrastructure/adapters/mock-diet-repository/MockDietRepository';

export const ACTIVE_ADAPTER: 'api' | 'mock' = 'api';

export const ADAPTERS = {
  api: new APIDietRepository(),
  mock: new MockDietRepository(),
};

export const dietRepository: DietRepository = ADAPTERS[ACTIVE_ADAPTER];
