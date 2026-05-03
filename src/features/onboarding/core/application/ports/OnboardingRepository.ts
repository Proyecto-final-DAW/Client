import type { OnboardingFormData } from '../../domain/models/OnboardingFormData';
import type { OnboardingResponse } from '../../domain/models/OnboardingResponse';

export interface OnboardingRepository {
  submitOnboarding(
    data: OnboardingFormData,
    userId: number
  ): Promise<OnboardingResponse>;
}
