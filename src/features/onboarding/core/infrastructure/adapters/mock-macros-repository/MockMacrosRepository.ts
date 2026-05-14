import type { MacrosRepository } from '../../../application/ports/MacrosRepository';
import type { OnboardingFormData } from '../../../domain/models/OnboardingFormData';

export class MockMacrosRepository implements MacrosRepository {
  async calculateMacros(
    _data: OnboardingFormData,
    _userId: number
  ): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return;
  }
}
