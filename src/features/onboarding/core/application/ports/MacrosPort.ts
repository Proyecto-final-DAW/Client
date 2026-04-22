import type { OnboardingFormData } from '../../domain/models/OnboardingFormData';

export interface MacrosPort {
  calculateMacros(
    data: OnboardingFormData,
    userId: number,
    token: string
  ): Promise<void>;
}
