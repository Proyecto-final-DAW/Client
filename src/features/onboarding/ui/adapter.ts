import type { OnboardingPort } from '../core/application/ports/OnboardingPort';
import { OnboardingApiAdapter } from '../core/infrastructure/adapters/api-onboarding-adapter/OnboardingApiAdapter';
import { MockOnboardingAdapter } from '../core/infrastructure/adapters/mock-onboarding-adapter/MockOnboardingAdapter';

// This file acts as the composition root for the onboarding feature.
// It decides which implementation of OnboardingPort to inject depending on the environment.
// Set VITE_USE_MOCK=true in .env.development to use the mock adapter (no backend needed).
// In production, the real API adapter is used automatically.
const useMock = import.meta.env.VITE_USE_MOCK === 'true';

export const onboardingService: OnboardingPort = useMock
  ? new MockOnboardingAdapter()
  : new OnboardingApiAdapter();
