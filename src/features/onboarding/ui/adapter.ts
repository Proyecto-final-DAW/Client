import type { OnboardingRepository } from '../core/application/ports/OnboardingRepository';
import type { StatsInitRepository } from '../core/application/ports/StatsInitRepository';
import { ApiOnboardingInfoRepository } from '../core/infrastructure/adapters/api-onboarding-info-repository/ApiOnboardingInfoRepository';
import { ApiStatsInitRepository } from '../core/infrastructure/adapters/api-stats-init-repository/ApiStatsInitRepository';
import { MockOnboardingInfoRepository } from '../core/infrastructure/adapters/mock-onboarding-info-repository/MockOnboardingInfoRepository';
import { MockStatsInitRepository } from '../core/infrastructure/adapters/mock-stats-init-repository/MockStatsInitRepository';

// Macros repository deleted: `submitOnboarding` already persists daily
// calories + macro grams server-side as part of the same transaction
// (since 2026-05), so the client-side macro calculator was a
// redundant second write that nobody called and that the wizard hook
// already had a comment explaining why it was disabled.

export const ACTIVE_ADAPTER: 'api' | 'mock' = 'api';

const ONBOARDING_ADAPTERS = {
  api: new ApiOnboardingInfoRepository(),
  mock: new MockOnboardingInfoRepository(),
};

const STATS_INIT_ADAPTERS = {
  api: new ApiStatsInitRepository(),
  mock: new MockStatsInitRepository(),
};

export const onboardingService: OnboardingRepository =
  ONBOARDING_ADAPTERS[ACTIVE_ADAPTER];
export const statsInitService: StatsInitRepository =
  STATS_INIT_ADAPTERS[ACTIVE_ADAPTER];
