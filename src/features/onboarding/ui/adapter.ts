import type { MacrosPort } from '../core/application/ports/MacrosPort';
import type { OnboardingPort } from '../core/application/ports/OnboardingPort';
import type { StatsInitPort } from '../core/application/ports/StatsInitPort';
import { ApiMacrosRepository } from '../core/infrastructure/adapters/api-macros-repository/ApiMacrosRepository';
import { ApiOnboardingInfoRepository } from '../core/infrastructure/adapters/api-onboarding-info-repository/ApiOnboardingInfoRepository';
import { ApiStatsInitRepository } from '../core/infrastructure/adapters/api-stats-init-repository/ApiStatsInitRepository';
import { MockMacrosRepository } from '../core/infrastructure/adapters/mock-macros-repository/MockMacrosRepository';
import { MockOnboardingAdapter } from '../core/infrastructure/adapters/mock-onboarding-info-repository/MockOnboardingInfoRepository';
import { MockStatsInitRepository } from '../core/infrastructure/adapters/mock-stats-init-repository/MockStatsInitRepository';

export const ACTIVE_ADAPTER: 'api' | 'mock' = 'api';

const ONBOARDING_ADAPTERS = {
  api: new ApiOnboardingInfoRepository(),
  mock: new MockOnboardingAdapter(),
};

const STATS_INIT_ADAPTERS = {
  api: new ApiStatsInitRepository(),
  mock: new MockStatsInitRepository(),
};

const MACROS_ADAPTERS = {
  api: new ApiMacrosRepository(),
  mock: new MockMacrosRepository(),
};

export const onboardingService: OnboardingPort =
  ONBOARDING_ADAPTERS[ACTIVE_ADAPTER];
export const statsInitService: StatsInitPort =
  STATS_INIT_ADAPTERS[ACTIVE_ADAPTER];
export const macrosService: MacrosPort = MACROS_ADAPTERS[ACTIVE_ADAPTER];
