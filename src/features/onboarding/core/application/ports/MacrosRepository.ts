import type { OnboardingFormData } from '../../domain/models/OnboardingFormData';

export interface MacrosRepository {
  calculateMacros(data: OnboardingFormData, userId: number): Promise<void>;
}
