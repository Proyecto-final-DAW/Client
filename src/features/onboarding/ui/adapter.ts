import type { OnboardingPort } from '../core/application/ports/OnboardingPort';
import { OnboardingApiAdapter } from '../core/infrastructure/adapters/api-onboarding-adapter/OnboardingApiAdapter';
import { MockOnboardingAdapter } from '../core/infrastructure/adapters/mock-onboarding-adapter/MockOnboardingAdapter';

export const ACTIVE_ADAPTER: 'api' | 'mock' = 'mock';

export const ADAPTERS = {
  api: new OnboardingApiAdapter(),
  mock: new MockOnboardingAdapter(),
};

export const onboardingService: OnboardingPort = ADAPTERS[ACTIVE_ADAPTER];
