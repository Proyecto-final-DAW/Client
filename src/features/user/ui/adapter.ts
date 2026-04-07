import type { UserInfoRepository } from '../core/application/ports/UserInfoRepository';
import { APIUserInfoRepository } from '../core/infrastructure/adapters/api-user-info-repository/APIUserInfoRepository';
import { MockUserInfoRepository } from '../core/infrastructure/adapters/mock-user-info-repository/MockUserInfoRepository';

export const ACTIVE_ADAPTER: 'api' | 'mock' = 'api';

export const REPOSITORIES = {
  api: new APIUserInfoRepository(),
  mock: new MockUserInfoRepository(),
};

export const userInfoRepository: UserInfoRepository =
  REPOSITORIES[ACTIVE_ADAPTER];
