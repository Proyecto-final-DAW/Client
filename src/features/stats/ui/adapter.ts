import type { StatsRepository } from '../core/application/ports/StatsRepository';
import { APIStatsRepository } from '../core/infrastructure/adapters/api-stats-repository/APIStatsRepository';
import { MockStatsRepository } from '../core/infrastructure/adapters/mock-stats-repository/MockStatsRepository';

export const ACTIVE_ADAPTER: 'api' | 'mock' = 'api';

export const REPOSITORIES = {
  api: new APIStatsRepository(),
  mock: new MockStatsRepository(),
};

export const statsRepository: StatsRepository = REPOSITORIES[ACTIVE_ADAPTER];
