import type { UserInfoRepository } from '../core/application/ports/UserInfoRepository';
import type { UserRepository } from '../core/application/ports/UserRepository';
import { APIUserInfoRepository } from '../core/infrastructure/adapters/api-user-info-repository/APIUserInfoRepository';
import { APIUserRepository } from '../core/infrastructure/adapters/api-user-repository/APIUserRepository';
import { MockUserInfoRepository } from '../core/infrastructure/adapters/mock-user-info-repository/MockUserInfoRepository';
import { MockUserRepository } from '../core/infrastructure/adapters/mock-user-repository/MockUserRepository';

export const ACTIVE_ADAPTER: 'api' | 'mock' = 'api';

export const REPOSITORIES = {
  api: {
    userRepository: new APIUserRepository(),
    userInfoRepository: new APIUserInfoRepository(),
  },
  mock: {
    userRepository: new MockUserRepository(),
    userInfoRepository: new MockUserInfoRepository(),
  },
};

export const userRepository: UserRepository =
  REPOSITORIES[ACTIVE_ADAPTER].userRepository;

export const userInfoRepository: UserInfoRepository =
  REPOSITORIES[ACTIVE_ADAPTER].userInfoRepository;
