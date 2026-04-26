import type { SessionRepository } from '../core/application/ports/SessionRepository';
import { APISessionRepository } from '../core/infrastructure/adapters/api-session-repository/APISessionRepository';
import { MockSessionRepository } from '../core/infrastructure/adapters/mock-session-repository/MockSessionRepository';

export const ACTIVE_ADAPTER: 'api' | 'mock' = 'mock';

export const ADAPTERS = {
  api: new APISessionRepository(),
  mock: new MockSessionRepository(),
};

export const sessionRepository: SessionRepository = ADAPTERS[ACTIVE_ADAPTER];
