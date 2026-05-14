import type { MacrosRepository } from '../core/application/ports/MacrosRepository';
import type { OnboardingRepository } from '../core/application/ports/OnboardingRepository';
import type { StatsInitRepository } from '../core/application/ports/StatsInitRepository';
import { ApiMacrosRepository } from '../core/infrastructure/adapters/api-macros-repository/ApiMacrosRepository';
import { ApiOnboardingInfoRepository } from '../core/infrastructure/adapters/api-onboarding-info-repository/ApiOnboardingInfoRepository';
import { ApiStatsInitRepository } from '../core/infrastructure/adapters/api-stats-init-repository/ApiStatsInitRepository';
import { MockMacrosRepository } from '../core/infrastructure/adapters/mock-macros-repository/MockMacrosRepository';
import { MockOnboardingInfoRepository } from '../core/infrastructure/adapters/mock-onboarding-info-repository/MockOnboardingInfoRepository';
import { MockStatsInitRepository } from '../core/infrastructure/adapters/mock-stats-init-repository/MockStatsInitRepository';

export const ACTIVE_ADAPTER: 'api' | 'mock' = 'api';

const ONBOARDING_ADAPTERS = {
  api: new ApiOnboardingInfoRepository(),
  mock: new MockOnboardingInfoRepository(),
};

const STATS_INIT_ADAPTERS = {
  api: new ApiStatsInitRepository(),
  mock: new MockStatsInitRepository(),
};

const MACROS_ADAPTERS = {
  api: new ApiMacrosRepository(),
  mock: new MockMacrosRepository(),
};

export const onboardingService: OnboardingRepository =
  ONBOARDING_ADAPTERS[ACTIVE_ADAPTER];
export const statsInitService: StatsInitRepository =
  STATS_INIT_ADAPTERS[ACTIVE_ADAPTER];
export const macrosService: MacrosRepository = MACROS_ADAPTERS[ACTIVE_ADAPTER];
