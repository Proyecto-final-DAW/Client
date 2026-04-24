import type { MilestonesRepository } from '../core/application/ports/MilestonesRepository';
import { APIMilestonesRepository } from '../core/infrastructure/adapters/api-milestones-repository/APIMilestonesRepository';
import { MockMilestonesRepository } from '../core/infrastructure/adapters/mock-milestones-repository/MockMilestonesRepository';

export const ACTIVE_ADAPTER: 'api' | 'mock' = 'mock';

export const REPOSITORIES = {
  api: new APIMilestonesRepository(),
  mock: new MockMilestonesRepository(),
};

export const milestonesRepository: MilestonesRepository =
  REPOSITORIES[ACTIVE_ADAPTER];
