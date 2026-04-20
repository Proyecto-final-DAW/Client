import type { ProfileRepository } from '../core/application/ports/ProfileRepository';
import { APIProfileRepository } from '../core/infrastructure/adapters/api-profile-repository/APIProfileRepository';
import { MockProfileRepository } from '../core/infrastructure/adapters/mock-profile-repository/MockProfileRepository';

export const ACTIVE_ADAPTER: 'api' | 'mock' = 'api';

export const ADAPTERS = {
  api: new APIProfileRepository(),
  mock: new MockProfileRepository(),
};

export const profileRepository: ProfileRepository = ADAPTERS[ACTIVE_ADAPTER];
