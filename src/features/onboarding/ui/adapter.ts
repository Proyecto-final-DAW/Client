import type { OnboardingPort } from '../core/application/ports/OnboardingPort';
import { OnboardingApiAdapter } from '../core/infrastructure/adapters/api-onboarding-info-repository/ApiOnboardingInfoRepository';
import { MockOnboardingAdapter } from '../core/infrastructure/adapters/mock-onboarding-info-repository/MockOnboardingInfoRepository';

export const ACTIVE_ADAPTER: 'api' | 'mock' = 'mock';

export const ADAPTERS = {
  api: new OnboardingApiAdapter(),
  mock: new MockOnboardingAdapter(),
};

export const onboardingService: OnboardingPort = ADAPTERS[ACTIVE_ADAPTER];
