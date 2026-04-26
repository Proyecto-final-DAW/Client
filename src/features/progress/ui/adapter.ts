import type { ProgressRepository } from '../core/application/ports/ProgressRepository';
import { APIProgressRepository } from '../core/infrastructure/adapters/api-progress-repository/APIProgressRepository';
import { MockProgressRepository } from '../core/infrastructure/adapters/mock-progress-repository/MockProgressRepository';

export const ACTIVE_ADAPTER: 'api' | 'mock' = 'api';

export const ADAPTERS = {
  api: new APIProgressRepository(),
  mock: new MockProgressRepository(),
};

export const progressRepository: ProgressRepository = ADAPTERS[ACTIVE_ADAPTER];
