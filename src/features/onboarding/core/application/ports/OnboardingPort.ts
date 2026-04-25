import type { OnboardingFormData } from '../../domain/models/OnboardingFormData';
import type { OnboardingResponse } from '../../domain/models/OnboardingResponse';

export interface OnboardingPort {
  submitOnboarding(
    data: OnboardingFormData,
    userId: number,
    token: string
  ): Promise<OnboardingResponse>;
}
