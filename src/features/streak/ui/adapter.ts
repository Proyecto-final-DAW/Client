import type { StreakRepository } from '../core/application/ports/StreakRepository';
import { APIStreakRepository } from '../core/infrastructure/adapters/api-streak-repository/APIStreakRepository';
import { MockStreakRepository } from '../core/infrastructure/adapters/mock-streak-repository/MockStreakRepository';

export const ACTIVE_ADAPTER: 'api' | 'mock' = 'api';

export const ADAPTERS = {
  api: new APIStreakRepository(),
  mock: new MockStreakRepository(),
};

export const streakRepository: StreakRepository = ADAPTERS[ACTIVE_ADAPTER];
